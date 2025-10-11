import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { KeywordService } from '../../../features/keywords/state/keyword.service';

@Component({
  selector: 'percentage-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './percentage.component.html',
  styleUrls: ['./percentage.component.css'],
})
export default class PercentageComponent {
  store = inject(KeywordService);
}
