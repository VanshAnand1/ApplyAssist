import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'percentage-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './percentage.component.html',
  styleUrls: ['./percentage.component.css'],
})
export default class PercentageComponent {
  value = 0;

  onSubmit() {
    this.value *= 2;
  }
}
