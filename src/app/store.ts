import { create } from 'zustand';
import type { Repository } from '../data/repository';
import { emptySnapshot, type Snapshot } from '../domain/models';
interface AppState {
  data: Snapshot;
  ready: boolean;
  busy: boolean;
  error: string | null;
  repository: Repository | null;
  initialize: (repository: Repository) => Promise<void>;
  run: (
    operation: (repository: Repository) => Promise<unknown>,
  ) => Promise<boolean>;
}
export const useApp = create<AppState>((set, get) => ({
  data: emptySnapshot(),
  ready: false,
  busy: false,
  error: null,
  repository: null,
  async initialize(repository) {
    set({ error: null, busy: true, ready: false });
    try {
      await repository.initialize();
      set({ repository, data: await repository.snapshot(), ready: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'storageError' });
    } finally {
      set({ busy: false });
    }
  },
  async run(operation) {
    const { repository, busy } = get();
    if (!repository || busy) {
      return false;
    }
    set({ busy: true, error: null });
    try {
      await operation(repository);
      set({ data: await repository.snapshot() });
      return true;
    } catch (error) {
      const key = error instanceof Error ? error.message : 'storageError';
      set({ error: key });
      return false;
    } finally {
      set({ busy: false });
    }
  },
}));
