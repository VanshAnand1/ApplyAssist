import { Injectable, signal, computed } from '@angular/core';
import { Keyword } from '../keywords/model/keyword.model';
import { WindowSchema, Window } from '../windows/model/window.model';

type WindowMap = Record<string, WindowSchema>;
type Root = { version: 1; windowOrder: string[]; windows: WindowMap };
const DEFAULT_ROOT: Root = { version: 1, windowOrder: [], windows: {} };

@Injectable({ providedIn: 'root' })
export class StorageService {
  readonly rootSignal = signal<Root>(DEFAULT_ROOT);

  constructor() {
    this.init();
    chrome.storage.onChanged.addListener(this.onChanged);
  }

  private async init() {
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
    const { root = DEFAULT_ROOT } = (await chrome.storage.local.get({
      root: DEFAULT_ROOT,
    })) as { root: Root };
    return root;
  }

  async setRoot(root: Root) {
    await chrome.storage.local.set({ root });
  }

  async createNewWindow(windowID: string, color: string, name?: string) {
    if (!name) name = '';
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

  keywordsFor = (windowId: string) =>
    computed(() => {
      const root = this.rootSignal();
      const window = root.windows[windowId];
      if (!window) return [];

      return window.keywordsOrder
        .map((id) => window.keywords[id])
        .filter((keyword): keyword is Keyword => keyword !== undefined);
    });
}
