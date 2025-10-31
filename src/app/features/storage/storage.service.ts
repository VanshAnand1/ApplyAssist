import { Injectable, signal, computed } from '@angular/core';
import { Keyword } from '../keywords/model/keyword.model';
import { WindowSchema, Window } from '../windows/model/window.model';

type WindowMap = Record<string, WindowSchema>;
type Root = {
  version: 1;
  windowOrder: string[];
  windows: WindowMap;
  lastActiveWindowID?: string | null;
};
const DEFAULT_ROOT: Root = {
  version: 1,
  windowOrder: [],
  windows: {},
  lastActiveWindowID: null,
};

@Injectable({ providedIn: 'root' })
export class StorageService {
  readonly rootSignal = signal<Root>(DEFAULT_ROOT);

  constructor() {
    if (
      typeof chrome !== 'undefined' &&
      chrome?.storage &&
      chrome.storage.onChanged
    ) {
      this.init();
      chrome.storage.onChanged.addListener(this.onChanged);
    } else {
      this.rootSignal.set(DEFAULT_ROOT);
    }
  }

  private async init() {
    if (typeof chrome === 'undefined' || !chrome?.storage?.local?.get) {
      this.rootSignal.set(DEFAULT_ROOT);
      return;
    }

    const { root = DEFAULT_ROOT } = (await chrome.storage.local.get({
      root: DEFAULT_ROOT,
    })) as { root: Root };
    if (!root.version) {
      await this.setRoot(DEFAULT_ROOT);
      this.rootSignal.set(DEFAULT_ROOT);
    } else {
      this.rootSignal.set(root);
    }
  }

  private onChanged = (
    changes: Record<string, chrome.storage.StorageChange>,
    area: string
  ) => {
    if (area !== 'local' || !changes['root']) return;
    this.rootSignal.set(changes['root'].newValue ?? DEFAULT_ROOT);
  };

  async getRoot() {
    if (typeof chrome === 'undefined' || !chrome?.storage?.local?.get) {
      return this.rootSignal();
    }

    const { root = DEFAULT_ROOT } = (await chrome.storage.local.get({
      root: DEFAULT_ROOT,
    })) as { root: Root };
    return root;
  }

  async setRoot(root: Root) {
    if (typeof chrome === 'undefined' || !chrome?.storage?.local?.set) {
      this.rootSignal.set(root);
      return;
    }

    await chrome.storage.local.set({ root });
  }

  async createNewWindow(windowID: string, color: string, name?: string) {
    if (!name) name = 'new window';
    const root = await this.getRoot();
    if (root.windows[windowID]) return;

    const newWindow: WindowSchema = {
      id: windowID,
      color: color,
      name: name,
      keywords: {},
      keywordsOrder: [],
    };

    const updatedRoot: Root = {
      ...root,
      windowOrder: [...root.windowOrder, windowID],
      windows: { ...root.windows, [windowID]: newWindow },
    };

    await this.setRoot(updatedRoot);
  }

  async getLastActiveWindowID() {
    const root = await this.getRoot();
    return root.lastActiveWindowID ?? null;
  }

  async setLastActiveWindowID(windowID: string | null) {
    const root = await this.getRoot();
    const updatedRoot: Root = { ...root, lastActiveWindowID: windowID };
    await this.setRoot(updatedRoot);
  }

  async insertKeyword(windowID: string, keyword: Keyword) {
    const root = await this.getRoot();
    const window = root.windows[windowID];
    if (!window) return;

    const newKeywords = { ...window.keywords, [keyword.id]: keyword };
    const newKeywordsOrder = [...window.keywordsOrder, keyword.id];

    const updatedWindow: WindowSchema = {
      ...window,
      keywords: newKeywords,
      keywordsOrder: newKeywordsOrder,
    };
    const updatedWindows: WindowMap = {
      ...root.windows,
      [windowID]: updatedWindow,
    };
    const updatedRoot: Root = { ...root, windows: updatedWindows };

    await this.setRoot(updatedRoot);
  }

  async deleteKeyword(windowID: string, keyword: Keyword) {
    const root = await this.getRoot();
    const window = root.windows[windowID];
    if (!window) return;

    const { [keyword.id]: _omitted, ...newKeywords } = window.keywords;
    const newKeywordsOrder = window.keywordsOrder.filter((kid) =>
      kid === keyword.id ? false : true
    );

    const updatedWindow: WindowSchema = {
      ...window,
      keywords: newKeywords,
      keywordsOrder: newKeywordsOrder,
    };
    const updatedRoot: Root = {
      ...root,
      windows: { ...root.windows, [windowID]: updatedWindow },
    };

    await this.setRoot(updatedRoot);
  }

  async clearAllKeywords(windowID: string) {
    const root = await this.getRoot();
    const window = root.windows[windowID];
    if (!window) return;

    const newKeywords = {};
    const newKeywordsOrder: string[] = [];

    const updatedWindow: WindowSchema = {
      ...window,
      keywords: newKeywords,
      keywordsOrder: newKeywordsOrder,
    };

    const updatedRoot: Root = {
      ...root,
      windows: { ...root.windows, [windowID]: updatedWindow },
    };

    await this.setRoot(updatedRoot);
  }

  async toggleKeywordStatus(windowID: string, keywordID: string) {
    const root = this.rootSignal();
    const window = root.windows[windowID];
    if (!window) return;

    const keyword = window.keywords[keywordID];
    if (!keyword) return;

    const updatedKeyword: Keyword = { ...keyword, done: !keyword.done };
    const updatedKeywords = { ...window.keywords, [keywordID]: updatedKeyword };

    const updatedWindow: WindowSchema = {
      ...window,
      keywords: updatedKeywords,
    };

    const updatedRoot: Root = {
      ...root,
      windows: { ...root.windows, [windowID]: updatedWindow },
    };

    await this.setRoot(updatedRoot);
  }

  async deleteWindow(windowID: string) {
    const root = await this.getRoot();
    const { [windowID]: _omitted, ...remainingWindows } = root.windows;
    const newWindowOrder = root.windowOrder.filter((id) => id !== windowID);

    const updatedRoot: Root = {
      ...root,
      windows: remainingWindows,
      windowOrder: newWindowOrder,
      lastActiveWindowID:
        root.lastActiveWindowID && root.lastActiveWindowID === windowID
          ? null
          : root.lastActiveWindowID,
    };

    await this.setRoot(updatedRoot);
  }

  async updateWindowColor(windowID: string, color: string) {
    const root = await this.getRoot();
    const window = root.windows[windowID];
    if (!window) return;

    const updatedWindow: WindowSchema = { ...window, color };
    const updatedRoot: Root = {
      ...root,
      windows: { ...root.windows, [windowID]: updatedWindow },
    };

    await this.setRoot(updatedRoot);
  }

  async updateWindowName(windowID: string, name: string) {
    if (name === '') name = 'new window';
    const root = await this.getRoot();
    const window = root.windows[windowID];
    if (!window) return;

    const updatedWindow: WindowSchema = { ...window, name };
    const updatedRoot: Root = {
      ...root,
      windows: { ...root.windows, [windowID]: updatedWindow },
    };

    await this.setRoot(updatedRoot);
  }

  getBackgroundColor(windowID: string): string | undefined {
    const root = this.rootSignal();
    const window = root.windows[windowID];
    if (!window) return undefined;
    return window.color;
  }

  getWindowName(windowID: string): string | undefined {
    const root = this.rootSignal();
    const window = root.windows[windowID];
    if (!window) return undefined;
    return window.name;
  }

  keywordsFor = (windowId: string | null | undefined) =>
    computed(() => {
      if (!windowId) return [];
      const root = this.rootSignal();
      const window = root.windows[windowId];
      if (!window) return [];

      return window.keywordsOrder
        .map((id) => window.keywords[id])
        .filter((keyword): keyword is Keyword => keyword !== undefined);
    });
  windows = computed(() => {
    const root = this.rootSignal();
    const order = root.windowOrder ?? [];
    return order
      .map((id) => root.windows[id])
      .filter((w): w is WindowSchema => w !== undefined);
  });
}
