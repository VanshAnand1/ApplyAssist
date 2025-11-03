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

  percentFillColor = () => {
    if (this.store.percentDone() >= 85)
      return 'linear-gradient(120deg,#4ade80,#22c55e)';
    if (this.store.percentDone() >= 50)
      return 'linear-gradient(120deg,#facc15,#fb923c)';
    return 'linear-gradient(120deg,#f97316,#ef4444)';
  };
}
