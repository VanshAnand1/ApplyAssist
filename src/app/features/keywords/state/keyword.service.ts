import { Injectable, inject, signal, computed } from '@angular/core';
import { Keyword } from '../model/keyword.model';
import { StorageService } from '../../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class KeywordService {
  private activeWindowID = signal<string>('0');
  storage = inject(StorageService);

  keywords = computed(() => this.storage.keywordsFor(this.activeWindowID())());
  constructor() {
    this.storage.createNewWindow('0', 'gray');
  }

  getActiveWindowID() {
    return this.activeWindowID();
  }

  setActiveWindowID(windowID: string) {
    this.activeWindowID.set(windowID);
  }

  getKeywords() {
    return this.keywords;
  }

  printKeywords() {
    console.log(this.keywords());
  }

  addKeyword(keyword: Keyword) {
    this.storage.insertKeyword(this.getActiveWindowID(), keyword);
  }

  removeKeyword(keyword: Keyword) {
    this.storage.deleteKeyword(this.getActiveWindowID(), keyword);
  }

  clearKeywords() {
    this.storage.clearAllKeywords(this.getActiveWindowID());
  }

  getKeywordsCount() {
    return this.keywords.length;
  }

  toggleKeywordStatus(keyword: Keyword) {
    this.storage.toggleKeywordStatus(this.getActiveWindowID(), keyword.id);
  }

  count = computed(() => this.keywords().length);
  percentDone = computed(() => {
    const arr = this.keywords();
    const done = arr.filter((k) => k.done).length;
    return arr.length ? Math.round((done / arr.length) * 100) : 0;
  });
}
