import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { WindowService } from '../../features/windows/state/window.service';

@Component({
  selector: 'window-settings-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './window-settings.component.html',
})
export default class WindowSettingsComponent {
  windowService = inject(WindowService);
  windowName: string = '';
  pillColor: string = 'blue';
  showSettings: boolean = false;

  constructor() {
    effect(() => {
      const activeWindowID = this.windowService.activeWindowID();
      if (!activeWindowID) {
        this.windowName = '';
        this.pillColor = 'blue';
        return;
      }

      this.windowName =
        this.windowService.getWindowName(activeWindowID) ?? 'new window';
      this.pillColor =
        this.windowService.getWindowColor(activeWindowID) ?? 'blue';
    });
  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.windowName = inputElement.value;
  }

  updateWindow(newName: string, newColor: string) {
    const windowID = this.windowService.activeWindowID();
    if (!windowID) return;

    this.windowService.updateWindowNameColor(windowID, newName, newColor);
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }
}
