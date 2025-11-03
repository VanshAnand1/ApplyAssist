import { Injectable, inject, signal, computed } from '@angular/core';
import { Keyword } from '../model/keyword.model';
import { StorageService } from '../../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class KeywordService {
  private activeWindowID = signal<string | null>(null);
  storage = inject(StorageService);

  keywords = computed(() => this.storage.keywordsFor(this.activeWindowID())());

  constructor() {
    this.initActiveWindow();
  }

  private async initActiveWindow() {
    try {
      const id = await this.storage.getLastActiveWindowID();
      if (id) {
        const root = await this.storage.getRoot();
        if (root.windows[id]) this.activeWindowID.set(id);
      }
    } catch (e) {
      console.warn('Failed to initialize active window id', e);
    }
  }

  getActiveWindowID() {
    return this.activeWindowID();
  }

  async setActiveWindowID(windowID: string | null) {
    this.activeWindowID.set(windowID);
    try {
      await this.storage.setLastActiveWindowID(windowID);
    } catch (e) {
      console.warn('Failed to persist active window id', e);
    }
  }

  getKeywords() {
    return this.keywords;
  }

  printKeywords() {
    console.log(this.keywords());
  }

  addKeyword(keyword: Keyword) {
    const id = this.getActiveWindowID();
    if (!id) return;
    this.storage.insertKeyword(id, keyword);
  }

  removeKeyword(keyword: Keyword) {
    const id = this.getActiveWindowID();
    if (!id) return;
    this.storage.deleteKeyword(id, keyword);
  }

  clearKeywords() {
    const id = this.getActiveWindowID();
    if (!id) return;
    this.storage.clearAllKeywords(id);
  }

  getKeywordsCount() {
    return this.keywords().length;
  }

  toggleKeywordStatus(keyword: Keyword) {
    const id = this.getActiveWindowID();
    if (!id) return;
    this.storage.toggleKeywordStatus(id, keyword.id);
  }

  countDone = computed(() => {
    const arr = this.keywords();
    const done = arr.filter((k) => k.done).length;
    return done;
  });
  percentDone = computed(() => {
    const arr = this.keywords();
    const done = arr.filter((k) => k.done).length;
    return arr.length ? Math.round((done / arr.length) * 100) : 0;
  });
}
