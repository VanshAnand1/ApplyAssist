import { Injectable, inject, signal, computed } from '@angular/core';
import { WindowSchema, Window } from '../model/window.model';
import { StorageService } from '../../storage/storage.service';
import { KeywordService } from '../../keywords/state/keyword.service';
import { Keyword } from '../../keywords/model/keyword.model';

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
    if (color === 'blue') return '#80f0ff';
    if (color === 'red') return '#ff8c80';
    if (color === 'yellow') return '#fff780';
    if (color === 'orange') return '#ffc380';
    if (color === 'purple') return '#df80ff';
    if (color === 'pink') return '#ff80ec';
    if (color === 'green') return '#bbff80';
    return '#9ea3a3';
  }

  removeWindow(windowID: string) {
    this.storage.deleteWindow(windowID);
  }

  updateWindowNameColor(windowID: string, name: string, color: string) {
    this.storage.updateWindowNameColor(windowID, name, color);
  }
}
