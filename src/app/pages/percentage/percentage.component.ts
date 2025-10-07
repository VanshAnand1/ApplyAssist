import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { KeywordService } from '../../features/keywords/state/keyword.service';

@Component({
  selector: 'percentage-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './percentage.component.html',
  styleUrls: ['./percentage.component.css'],
})
export default class PercentageComponent {
  value: number;
  complete: number;
  store = inject(KeywordService);

  constructor() {
    this.value = 0;
    this.complete = 0;
  }

  getKeywords() {
    return this.store.getKeywords();
  }

  updateUI() {
    this.value = this.store.computePercentage();
  }
}
