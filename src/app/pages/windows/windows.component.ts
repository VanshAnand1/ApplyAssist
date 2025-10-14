import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { WindowService } from '../../features/windows/state/window.service';
import { StorageService } from 'src/app/features/storage/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'windows-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './windows.component.html',
  styleUrls: ['./windows.component.css'],
})
export default class WindowsComponent {
  windowService = inject(WindowService);

  createNewWindow() {
    this.windowService.createNewWindow('blue', 'nameofwindow');
  }

  onWindowClick(windowID: string) {
    this.windowService.selectWindow(windowID);
  }

  deleteWindow(windowID: string) {
    this.windowService.removeWindow(windowID);
  }
}
