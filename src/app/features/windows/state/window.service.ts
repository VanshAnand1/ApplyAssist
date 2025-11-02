import { Injectable, inject, computed } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { KeywordService } from '../../keywords/state/keyword.service';
import { windowColors, defaultColor } from '../model/window-colors';

@Injectable({ providedIn: 'root' })
export class WindowService {
  storage = inject(StorageService);
  keywordService = inject(KeywordService);

  windows = computed(() => this.storage.windows());
  activeWindowID = computed(() => this.keywordService.getActiveWindowID());

  async createNewWindow(color: string, name?: string) {
    const windowID = Date.now().toString();
    await this.storage.createNewWindow(windowID, color, name);
    await this.selectWindow(windowID);
  }

  async selectWindow(windowID: string | null) {
    await this.keywordService.setActiveWindowID(windowID);
  }

  getBackgroundColor(windowID: string) {
    return this.colorMap(this.storage.getBackgroundColor(windowID));
  }

  getWindowName(windowID: string) {
    return this.storage.getWindowName(windowID);
  }

  getWindowColor(windowID: string) {
    return this.storage.getBackgroundColor(windowID);
  }

  colorMap(color: string | undefined) {
    return windowColors(color);
  }

  removeWindow(windowID: string) {
    this.storage.deleteWindow(windowID);
  }

  updateWindowNameColor(windowID: string, name: string, color: string) {
    this.storage.updateWindowNameColor(windowID, name, color);
  }
}
