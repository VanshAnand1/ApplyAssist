import { vi } from 'vitest';
import { WindowSchema } from '../app/features/windows/model/window.model';
import { Root } from '../app/features/storage/storage.service';
import {
  OnChangedListener,
  ChromeMock,
  StorageServiceMock,
  KeywordServiceMock,
  WindowServiceMock,
} from './types';

export const createRoot = (overrides: Partial<Root> = {}): Root => ({
  version: 1,
  windowOrder: [],
  windows: {},
  lastActiveWindowID: null,
  ...overrides,
});

export const createWindow = (
  overrides: Partial<WindowSchema>
): WindowSchema => ({
  id: 'window-id',
  color: 'blue',
  name: 'new window',
  keywords: {},
  keywordsOrder: [],
  ...overrides,
});

export const flushPromises = async (count = 2) => {
  for (let index = 0; index < count; index++) {
    await Promise.resolve();
  }
};

export const createStorageServiceMock = (): StorageServiceMock => ({
  createNewWindow: vi.fn(() => Promise.resolve()),
  getBackgroundColor: vi.fn(),
  getWindowName: vi.fn(),
  deleteWindow: vi.fn(),
  updateWindowNameColor: vi.fn(),
  windows: vi.fn(() => []),
});

export const createKeywordServiceMock = (): KeywordServiceMock => ({
  getActiveWindowID: vi.fn(() => null),
  setActiveWindowID: vi.fn(() => Promise.resolve()),
});

export const createWindowServiceMock = (): WindowServiceMock => ({
  createNewWindow: vi.fn(() => null),
  selectWindow: vi.fn(() => null),
  getBackgroundColor: vi.fn(() => Promise.resolve()),
  getWindowName: vi.fn(() => Promise.resolve()),
  getWindowColor: vi.fn(() => Promise.resolve()),
  removeWindow: vi.fn(() => null),
  updateWindowNameColor: vi.fn(() => null),
});

export const installChromeMock = (
  options: {
    storedRoot?: Root | null;
    getImplementation?: (items: unknown) => Promise<unknown> | unknown;
  } = {}
): ChromeMock => {
  const listeners = new Set<OnChangedListener>();
  let storedRoot = options.storedRoot ?? createRoot();

  const get = vi.fn(async (items?: unknown) => {
    if (options.getImplementation) {
      return await options.getImplementation(items);
    }
    return { root: storedRoot };
  });

  const set = vi.fn(async (value: { root: Root }) => {
    storedRoot = value.root;
  });

  const addListener = vi.fn((listener: OnChangedListener) => {
    listeners.add(listener);
  });
  const removeListener = vi.fn((listener: OnChangedListener) => {
    listeners.delete(listener);
  });

  const chromeMock: ChromeMock = {
    storage: {
      local: {
        get,
        set,
      },
      onChanged: {
        addListener,
        removeListener,
      },
    },
    __emitChange: (newValue) => {
      listeners.forEach((listener) => {
        listener(
          {
            root: {
              oldValue: storedRoot,
              newValue,
            },
          },
          'local'
        );
      });
      storedRoot = (newValue as Root) ?? storedRoot;
    },
    __getStoredRoot: () => storedRoot,
  };

  (globalThis as unknown as { chrome?: ChromeMock }).chrome = chromeMock;
  return chromeMock;
};
