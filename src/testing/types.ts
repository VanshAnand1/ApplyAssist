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

export type StorageServiceMock = {
  createNewWindow: ReturnType<typeof vi.fn>;
  getBackgroundColor: ReturnType<typeof vi.fn>;
  getWindowName: ReturnType<typeof vi.fn>;
  deleteWindow: ReturnType<typeof vi.fn>;
  updateWindowNameColor: ReturnType<typeof vi.fn>;
  windows: ReturnType<typeof vi.fn>;
  getLastActiveWindowID: ReturnType<typeof vi.fn>;
  getRoot: ReturnType<typeof vi.fn>;
  setLastActiveWindowID: ReturnType<typeof vi.fn>;
  keywordsFor: ReturnType<typeof vi.fn>;
  insertKeyword: ReturnType<typeof vi.fn>;
  deleteKeyword: ReturnType<typeof vi.fn>;
  clearAllKeywords: ReturnType<typeof vi.fn>;
  toggleKeywordStatus: ReturnType<typeof vi.fn>;
};

export type KeywordServiceMock = {
  getActiveWindowID: ReturnType<typeof vi.fn>;
  setActiveWindowID: ReturnType<typeof vi.fn>;
};
