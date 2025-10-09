type Keyword = { text: string; done: boolean; id: string };
type StorageSchema = {
  windows: {
    [windowID: string]: {
      keywords: {
        [keywordID: string]: Keyword;
      };
    };
  };
};

export class StorageService {
  async getWindows() {
    let defaults = { windows: {} };
    let windows = await chrome.storage.local.get(defaults);
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
}
