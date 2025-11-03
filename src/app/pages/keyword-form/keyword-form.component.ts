import { Component, inject } from '@angular/core';
import PercentageComponent from './percentage/percentage.component';
import KeywordDisplayComponent from './keyword-display/keyword-display.component';
import KeywordInputComponent from './keyword-input/keyword-input.component';
import { StorageService } from '../../features/storage/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'keyword-form-component',
  standalone: true,
  imports: [
    PercentageComponent,
    KeywordDisplayComponent,
    KeywordInputComponent,
    CommonModule,
  ],
  templateUrl: './keyword-form.component.html',
})
export default class KeywordFormComponent {
  storageService = inject(StorageService);

  lastWindowExists(): boolean {
    const root = this.storageService.rootSignal();
    return !!(root && root.lastActiveWindowID);
  }

  activeWindowName(): string {
    const root = this.storageService.rootSignal();
    const id = root.lastActiveWindowID ?? null;
    if (id !== null) {
      const window = root.windows[id];
      return window?.name || 'No Window Selected';
    }
    return 'No Window Selected';
  }
}
