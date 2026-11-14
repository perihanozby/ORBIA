export class FocusClock {
  private segmentStart: number | null = null;
  private elapsed = 0;
  state: 'running' | 'paused' | 'finished' = 'paused';
  constructor(
    readonly durationSeconds: number,
    private now: () => number = () => performance.now(),
    verifiedSeconds = 0,
  ) {
    if (
      !Number.isFinite(durationSeconds) ||
      durationSeconds < 60 ||
      durationSeconds > 14400
    ) {
      throw new Error('invalidDuration');
    }
    this.elapsed = Math.max(0, Math.min(durationSeconds, verifiedSeconds));
  }
  get seconds() {
    return Math.min(
      this.durationSeconds,
      this.elapsed +
        (this.segmentStart === null
          ? 0
          : Math.max(0, this.now() - this.segmentStart) / 1000),
    );
  }
  start() {
    if (this.state !== 'running' && this.state !== 'finished') {
      this.segmentStart = this.now();
      this.state = 'running';
    }
  }
  pause() {
    if (this.state === 'running') {
      this.elapsed = this.seconds;
      this.segmentStart = null;
      this.state = 'paused';
    }
  }
  finish() {
    this.pause();
    this.state = 'finished';
    return Math.floor(this.seconds);
  }
}
