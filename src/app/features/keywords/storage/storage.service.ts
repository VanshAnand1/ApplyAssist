import { Injectable, signal, computed } from '@angular/core';

import { Keyword } from '../model/keyword.model';
type Windows = Record<string, { keywords: Record<string, Keyword> }>;
type StorageSchema = {
  windows: {
    [windowID: string]: {
      keywords: {
        [keywordID: string]: Keyword;
      };
    };
  };
};

@Injectable({ providedIn: 'root' })
export class StorageService {
  readonly windowsSig = signal<Windows>({});

  constructor() {
    this.init();
    chrome.storage.onChanged.addListener(this.onChanged);
  }

  private async init() {
    const { windows = {} } = await chrome.storage.local.get({ windows: {} });
    this.windowsSig.set(windows);
  }

  private onChanged = (
    changes: Record<string, chrome.storage.StorageChange>,
    area: string
  ) => {
    if (area !== 'local' || !changes['windows']) return;
    this.windowsSig.set(changes['windows'].newValue ?? {});
  };

  async getWindows() {
    const { windows = {} } = await chrome.storage.local.get({ windows: {} });
    return windows;
  }

  async getKeywords(windowID: string) {
    const { windows = {} } = await chrome.storage.local.get(['windows']);
    return Object.values(windows[windowID]?.keywords ?? {});
  }

  async insertKeyword(windowID: string, keyword: Keyword) {
    const windows = await this.getWindows();
    const window = windows[windowID] ?? { keywords: {} };
    window.keywords[keyword.id] = keyword;

    await chrome.storage.local.set({
      windows: { ...windows, [windowID]: window },
    });
  }

  async deleteKeyword(windowID: string, keyword: Keyword) {
    const windows = await this.getWindows();
    const window = windows[windowID] ?? { keywords: {} };
    if (!window?.keywords?.[keyword.id]) return;

    const { [keyword.id]: _gone, ...rest } = window.keywords;
    await chrome.storage.local.set({
      windows: { ...windows, [windowID]: { ...window, keywords: rest } },
    });
  }

  async clearKeywords(windowID: string) {
    const windows = await this.getWindows();
    await chrome.storage.local.set({
      windows: { ...windows, [windowID]: { keywords: {} } },
    });
  }

  async toggleKeywordStatus(windowID: string, keyword: Keyword) {
    const windows = await this.getWindows();
    const window = windows[windowID] ?? { keywords: {} };
    const curr = window.keywords[keyword.id];
    if (!curr) return;

    const updatedKeyword = { ...curr, done: !curr.done };
    const updatedWindow = {
      ...window,
      keywords: { ...window.keywords, [keyword.id]: updatedKeyword },
    };
    await chrome.storage.local.set({
      windows: { ...windows, [windowID]: updatedWindow },
    });
  }

  keywordsFor = (windowId: string) =>
    computed(() => Object.values(this.windowsSig()[windowId]?.keywords ?? {}));
}
