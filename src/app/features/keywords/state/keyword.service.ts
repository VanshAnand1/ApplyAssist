import { Injectable, signal, computed } from '@angular/core';
import { Keyword } from '../model/keyword.model';

@Injectable({ providedIn: 'root' })
export class KeywordService {
  readonly keywords = signal<Keyword[]>([]);
  readonly count = computed(() => this.keywords().length);

  printKeywords() {
    console.log(this.keywords());
  }

  addKeyword(keyword: Keyword) {
    this.keywords.update((prev) => [...prev, keyword]);
  }

  getIndex(keyword: Keyword) {
    for (let i = 0; i < this.keywords().length; i++) {
      if (this.keywords()[i] === keyword) {
        return i;
      }
    }
    return -1;
  }

  removeKeyword(keyword: Keyword) {
    this.keywords.update((prev) => prev.filter((k) => k !== keyword));
  }

  removeAllInstances(keyword: Keyword) {
    this.keywords.update((prev) => prev.filter((k) => k !== keyword));
  }

  clearKeywords() {
    this.keywords.update(() => []);
  }

  getKeywords() {
    return this.keywords;
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
}
