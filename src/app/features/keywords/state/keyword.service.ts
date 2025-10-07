import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class KeywordService {
  private keywords: string[] = [];

  private constructor() {
    this.keywords = [];
  }

  getInstance() {
    if (this.keywords == null) {
      KeywordService.constructor();
    }
    return this.keywords;
  }

  addKeyword(keyword: string) {
    this.keywords.push(keyword);
  }

  getIndex(keyword: string) {
    for (let i = 0; i < this.keywords.length; i++) {
      if (this.keywords[i] === keyword) {
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
    this.keywords.splice(indexToRemove, 1);
  }

  removeAllInstances(keyword: string) {
    this.keywords = this.keywords.filter((str: string) => str !== keyword);
  }

  clearKeywords() {
    this.keywords = [];
  }

  getKeywords() {
    return this.keywords;
  }

  getKeywordsCount() {
    return this.keywords.length;
  }
}
