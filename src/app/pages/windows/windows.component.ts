import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { WindowService } from '../../features/windows/state/window.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'windows-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './windows.component.html',
  styleUrls: ['./windows.component.css'],
})
export default class WindowsComponent {
  windowName: string = '';
  pillColor: string = 'blue';
  windowService = inject(WindowService);

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.windowName = inputElement.value;
  }

  createNewWindow(pillColor: string) {
    this.windowService.createNewWindow(pillColor, this.windowName);
    this.windowName = '';
  }

  onWindowClick(windowID: string) {
    this.windowService.selectWindow(windowID);
  }

  deleteWindow(windowID: string) {
    this.windowService.removeWindow(windowID);
  }

  pinWindow(windowID: string) {
    console.log('pin', windowID);
  }
}
