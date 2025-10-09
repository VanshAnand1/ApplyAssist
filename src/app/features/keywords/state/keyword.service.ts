import { Injectable, inject, signal, computed } from '@angular/core';
import { Keyword } from '../model/keyword.model';
import { StorageService } from '../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class KeywordService {
  readonly keywords = signal<Keyword[]>([]);
  readonly count = computed(() => this.keywords().length).toString();
  id: number = 0;
  storage = inject(StorageService);

  getKeywords() {
    return this.keywords;
  }

  printKeywords() {
    console.log(this.keywords());
  }

  addKeyword(keyword: Keyword) {
    this.keywords.update((prev) => [...prev, keyword]);
    this.storage.insertKeyword('0', keyword);
  }

  getId(keyword: Keyword) {
    return keyword.id;
  }

  removeKeyword(keyword: Keyword) {
    this.keywords.update((prev) => prev.filter((k) => k !== keyword));
    this.storage.deleteKeyword('0', keyword);
  }

  removeAllInstances(keyword: Keyword) {
    this.keywords.update((prev) => prev.filter((k) => k !== keyword));
  }

  clearKeywords() {
    this.keywords.update(() => []);
    this.storage.clearKeywords('0');
  }

  getKeywordsCount() {
    return this.keywords.length;
  }

  computePercentage() {
    const total = this.getKeywordsCount();
    if (total === 0) return 0;
    const completed = this.keywords().filter((k) => k.done).length;
    return Math.round((completed / total) * 100);
  }

  toggleKeywordStatus(index: number) {
    this.keywords()[index].done = !this.keywords()[index].done;
  }
}
