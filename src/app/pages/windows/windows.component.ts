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
  store = inject(WindowService);

  createNewWindow() {
    this.store.createNewWindow('blue', 'nameofwindow');
  }
}
