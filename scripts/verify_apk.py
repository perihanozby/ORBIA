"""Read-only Android APK checks; no device connection or installation."""
import json
import struct
import sys
import zipfile

def verify(path):
    failures = []
    libraries = []
    with zipfile.ZipFile(path) as apk:
        names = apk.namelist()
        bundled = 'assets/index.android.bundle' in names
        if not bundled:
            failures.append('Missing embedded JavaScript bundle')
        for name in names:
            if not name.startswith('lib/') or not name.endswith('.so'):
                continue
            data = apk.read(name)
            if data[:5] != b'\x7fELF\x02':
                failures.append(f'Unsupported ELF class: {name}')
                continue
            endian = '<' if data[5] == 1 else '>'
            phoff = struct.unpack_from(endian + 'Q', data, 32)[0]
            size, count = struct.unpack_from(endian + 'HH', data, 54)
            alignments = []
            relro_ends = []
            loads = []
            relros = []
            for index in range(count):
                fields = struct.unpack_from(endian + 'IIQQQQQQ', data, phoff + index * size)
                kind, _, _, address, _, _, memory_size, alignment = fields
                if kind == 1:
                    loads.append((address, address + memory_size, fields[1]))
                    alignments.append(alignment)
                    if alignment < 16384:
                        failures.append(f'LOAD alignment below 16 KB: {name}')
                if kind == 0x6474E552:
                    relro_ends.append(address + memory_size)
                    relros.append((address, address + memory_size))
            for start, end in relros:
                # Android also accepts a nonaligned RELRO that occupies the
                # entire remainder of its containing writable LOAD segment.
                # https://developer.android.com/guide/practices/page-sizes
                containing = [load for load in loads if load[2] & 2 and load[0] <= start < load[1] and end <= load[1]]
                if end % 16384 and not any(load[1] == end for load in containing):
                    failures.append(f'RELRO shares a trailing 16 KB page with writable data: {name}')
            libraries.append({'name': name, 'loadAlignments': alignments, 'relroEnds': relro_ends})
        if not libraries:
            failures.append('No native libraries found')
    result = {'embeddedJavaScript': bundled, 'nativeLibraries': libraries, 'failures': failures}
    print(json.dumps(result, indent=2))
    return 1 if failures else 0

if __name__ == '__main__':
    sys.exit(verify(sys.argv[1]))
