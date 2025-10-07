import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class KeywordService {
  readonly keywords = signal<string[]>([]);
  readonly count = computed(() => this.keywords().length);

  addKeyword(keyword: string) {
    this.keywords.update((prev) => [...prev, keyword]);
  }

  getIndex(keyword: string) {
    for (let i = 0; i < this.keywords().length; i++) {
      if (this.keywords()[i] === keyword) {
        return i;
      }
    }
    return -1;
  }

  removeKeyword(indexToRemove: number): void;
  removeKeyword(keyword: string): void;
  removeKeyword(keyword: number | string) {
    let indexToRemove: number;
    if (typeof keyword == 'string') {
      indexToRemove = this.getIndex(keyword);
    } else {
      indexToRemove = keyword;
    }
    this.keywords.update((prev) => prev.filter((_, i) => i !== indexToRemove));
  }

  removeAllInstances(keyword: string) {
    this.keywords.update((prev) =>
      prev.filter((str: string) => str !== keyword)
    );
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
}
