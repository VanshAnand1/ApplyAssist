import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { KeywordService } from '../../../features/keywords/state/keyword.service';

@Component({
  selector: 'percentage-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './percentage.component.html',
})
export default class PercentageComponent {
  store = inject(KeywordService);

  percentDoneToColor() {
    if (this.store.percentDone() >= 85) {
      return '#bbff80';
    }
    if (this.store.percentDone() >= 50) {
      return '#ffc380';
    }
    return '#ff8c80';
  }
}
