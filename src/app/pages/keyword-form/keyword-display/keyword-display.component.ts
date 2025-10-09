import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { KeywordService } from '../../../features/keywords/state/keyword.service';
import { Keyword } from 'src/app/features/keywords/model/keyword.model';

@Component({
  selector: 'keyword-display',
  standalone: true,
  templateUrl: './keyword-display.component.html',
  imports: [CommonModule],
  styleUrls: ['./keyword-display.component.css'],
})
export default class KeywordDisplayComponent {
  keywordService = inject(KeywordService);

  toggleKeyword(keyword: Keyword) {
    this.keywordService.toggleKeywordStatus(keyword);
  }

  removeKeyword(keyword: Keyword) {
    this.keywordService.removeKeyword(keyword);
  }

  clearAllKeywords() {
    this.keywordService.clearKeywords();
  }
}
