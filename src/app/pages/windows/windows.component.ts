import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { WindowService } from '../../features/windows/state/window.service';

@Component({
  selector: 'windows-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './windows.component.html',
  styleUrls: ['./windows.component.css'],
})
export default class WindowsComponent {
  WindowService = inject(WindowService);

  createNewWindow() {
    this.WindowService.createNewWindow('blue', 'nameofwindow');
  }
}
