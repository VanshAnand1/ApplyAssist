import { Keyword } from '../../keywords/model/keyword.model';
import { KeywordService } from '../../keywords/state/keyword.service';
import { inject } from '@angular/core';

export interface WindowSchema {
  name?: string;
  color: string;
  id: string;
  keywords: { [key: string]: Keyword };
  keywordsOrder: Array<string>;
}

export class Window implements WindowSchema {
  name?: string;
  color: string = 'blue';
  id: string = Date.now().toString();
  allowedColors: Array<string> = ['blue', 'red', 'yellow'];

  keywords: { [key: string]: Keyword } = {};
  keywordsOrder: Array<string> = [];
  KeywordService = inject(KeywordService);

  changeWindowColor(color: string) {
    if (this.allowedColors.includes(color)) {
      this.color = color;
    }
  }

  changeWindowName(name: string) {
    this.name = name;
  }

  addKeyword(keyword: Keyword) {
    this.KeywordService.addKeyword(keyword);
  }
}
