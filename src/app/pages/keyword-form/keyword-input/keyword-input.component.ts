import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { KeywordService } from '../../../features/keywords/state/keyword.service';

@Component({
  selector: 'keyword-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './keyword-input.component.html',
  styleUrls: ['./keyword-input.component.css'],
})
export default class KeywordInputComponent {
  keywordText: string = '';
  store = inject(KeywordService);

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.keywordText = inputElement.value;
  }

  onAddKeyword() {
    this.store.addKeyword({ text: this.keywordText, done: false });
    this.keywordText = '';
  }
}
