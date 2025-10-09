import { Injectable, inject, signal, computed } from '@angular/core';
import { Keyword } from '../model/keyword.model';
import { StorageService } from '../../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class KeywordService {
  private activeWindowID = signal<string>('0');
  storage = inject(StorageService);

  constructor() {
    this.storage.createNewWindow('0', 'blue');
  }

  getActiveWindowID() {
    return this.activeWindowID();
  }

  keywords = computed(() =>
    this.storage.keywordsFor(this.getActiveWindowID())
  )();

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
    // this.storage.toggleKeywordStatus(this.windowID, keyword);
  }

  count = computed(() => this.keywords().length);
  percentDone = computed(() => {
    const arr = this.keywords();
    const done = arr.filter((k) => k.done).length;
    return arr.length ? Math.round((done / arr.length) * 100) : 0;
  });
}
