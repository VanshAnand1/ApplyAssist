import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { WindowService } from '../../features/windows/state/window.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import KeywordFormComponent from '../keyword-form/keyword-form.component';

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

    chrome.scripting.executeScript({
      target: { tabId },
      func: (id) => {
        console.log('hello');
        // const overlayWindowID = 'APPLYASSIST-OVERLAY-WINDOW-ID';
        // let overlayWindow = document.getElementById(overlayWindowID);
        // overlayWindow = document.createElement('keyword-form-component');
        // document.documentElement.appendChild(overlayWindow);
      },
      args: [windowID],
    });
  }
}
