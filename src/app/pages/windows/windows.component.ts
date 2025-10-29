import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { WindowService } from '../../features/windows/state/window.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../features/storage/storage.service';

@Component({
  selector: 'windows-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './windows.component.html',
})
export default class WindowsComponent {
  windowName: string = '';
  pillColor: string = 'blue';
  windowService = inject(WindowService);
  storageService = inject(StorageService);

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

  async getActiveTabID() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tab?.id;
  }

  async pinWindow(windowID: string) {
    const tabId = await this.getActiveTabID();
    if (!tabId) return;
    this.storageService.setLastActiveWindowID(windowID);
    const windowName = this.windowService.getWindowName(windowID) ?? 'Unknown';

    chrome.scripting.executeScript({
      target: { tabId },
      func: (name: string) => {
        const overlayWindowID = 'APPLYASSIST-OVERLAY-WINDOW-ID';
        let overlayWindow = document.getElementById(
          overlayWindowID
        ) as HTMLElement | null;
        if (!overlayWindow) {
          overlayWindow = document.createElement('div');
          overlayWindow.id = overlayWindowID;
          overlayWindow.style.position = 'absolute';
          overlayWindow.style.right = '10px';
          overlayWindow.style.top = '10px';
          overlayWindow.style.width = '400px';
          overlayWindow.style.height = '100vh';
          overlayWindow.style.backgroundColor = 'black';
          document.documentElement.appendChild(overlayWindow);
        }

        const overlayTitleID = 'APPLYASSIST-OVERLAY-TITLE-ID';
        let overlayTitle = document.getElementById(
          overlayTitleID
        ) as HTMLElement | null;
        if (!overlayTitle) {
          overlayTitle = document.createElement('p');
          overlayTitle.id = overlayTitleID;
          overlayTitle.style.padding = '4px';
          overlayWindow.appendChild(overlayTitle);
        }

        overlayTitle.textContent = name;
      },
      args: [windowName],
    });
  }
}
