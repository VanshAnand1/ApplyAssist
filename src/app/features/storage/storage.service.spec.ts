import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StorageService } from './storage.service';
import { WindowSchema } from '../windows/model/window.model';
import { Keyword } from '../keywords/model/keyword.model';
import { WindowMap, Root } from './storage.service';

const createRoot = (overrides: Partial<Root> = {}): Root => ({
  version: 1,
  windowOrder: [],
  windows: {},
  lastActiveWindowID: null,
  ...overrides,
});

const createWindow = (overrides: Partial<WindowSchema>): WindowSchema => ({
  id: 'window-id',
  color: 'blue',
  name: 'new window',
  keywords: {},
  keywordsOrder: [],
  ...overrides,
});

const flushPromises = async (count = 2) => {
  for (let index = 0; index < count; index++) {
    await Promise.resolve();
  }
};

type OnChangedListener = (
  changes: Record<
    string,
    {
      oldValue?: unknown;
      newValue?: unknown;
    }
  >,
  areaName: string
) => void;

type ChromeMock = {
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
