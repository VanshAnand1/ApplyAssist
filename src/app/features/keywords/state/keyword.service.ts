import { Injectable, inject, signal, computed } from '@angular/core';
import { Keyword } from '../model/keyword.model';
import { StorageService } from '../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class KeywordService {
  windowID: string = '0';

  constructor(private storage: StorageService) {}
  keywords = this.storage.keywordsFor(this.windowID);

  getKeywords() {
    return this.keywords;
  }

  updateWindowID(newWindowID: string) {
    this.windowID = newWindowID;
  }

  printKeywords() {
    console.log(this.keywords());
  }

  addKeyword(keyword: Keyword) {
    this.storage.insertKeyword(this.windowID, keyword);
  }

  removeKeyword(keyword: Keyword) {
    this.storage.deleteKeyword(this.windowID, keyword);
  }

  clearKeywords() {
    this.storage.clearKeywords(this.windowID);
  }

  getKeywordsCount() {
    return this.keywords.length;
  }

  toggleKeywordStatus(keyword: Keyword) {
    this.storage.toggleKeywordStatus(this.windowID, keyword);
  }

  count = computed(() => this.keywords().length);
  percentDone = computed(() => {
    const arr = this.keywords();
    const done = arr.filter((k) => k.done).length;
    return arr.length ? Math.round((done / arr.length) * 100) : 0;
  });
}
