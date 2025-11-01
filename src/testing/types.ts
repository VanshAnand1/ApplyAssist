import { vi } from 'vitest';
import { Root } from '../app/features/storage/storage.service';

export type OnChangedListener = (
  changes: Record<
    string,
    {
      oldValue?: unknown;
      newValue?: unknown;
    }
  >,
  areaName: string
) => void;

export type ChromeMock = {
  storage: {
    local: {
      get: ReturnType<typeof vi.fn>;
      set: ReturnType<typeof vi.fn>;
    };
    onChanged: {
      addListener: ReturnType<typeof vi.fn>;
      removeListener: ReturnType<typeof vi.fn>;
    };
  };
  __emitChange: (newValue: Root | null | undefined) => void;
  __getStoredRoot: () => Root | null | undefined;
};
