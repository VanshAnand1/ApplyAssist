import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { KeywordService } from '../../../features/keywords/state/keyword.service';

@Component({
  selector: 'keyword-display',
  standalone: true,
  templateUrl: './keyword-display.component.html',
  imports: [CommonModule],
  styleUrls: ['./keyword-display.component.css'],
})
export default class KeywordDisplayComponent {
  store = inject(KeywordService);
}
