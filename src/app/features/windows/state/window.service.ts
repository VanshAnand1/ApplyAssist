import { Injectable, inject, signal, computed } from '@angular/core';
import { WindowSchema, Window } from '../model/window.model';
import { StorageService } from '../../storage/storage.service';
import { KeywordService } from '../../keywords/state/keyword.service';
import { Keyword } from '../../keywords/model/keyword.model';

@Injectable({ providedIn: 'root' })
export class WindowService {
  windowLimit: number = 5;
  storage = inject(StorageService);
  keywordService = inject(KeywordService);

  windows = computed(() => this.storage.windows());
  activeWindowID = computed(() => this.keywordService.getActiveWindowID());

  createNewWindow(color: string, name?: string) {
    if (this.reachedWindowLimit()) {
      console.log('window limit reached');
      return;
    }
    this.storage.createNewWindow(Date.now().toString(), color, name);
  }

  selectWindow(windowID: string) {
    this.keywordService.setActiveWindowID(windowID);
  }

  getBackgroundColor(windowID: string) {
    return this.colorMap(this.storage.getBackgroundColor(windowID));
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

  changeWindowColor(windowID: string, color: string) {
    this.storage.updateWindowColor(windowID, color);
  }

  changeWindowName(windowID: string, name: string) {
    this.storage.updateWindowName(windowID, name);
  }

  reachedWindowLimit() {
    return this.windows.length >= this.windowLimit;
  }
}
