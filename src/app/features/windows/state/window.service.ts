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
    if (color === 'gray') return '#949194';
    if (color === 'red') return '#eb5234';
    if (color === 'purple') return '#de34eb';
    return '#34d8eb';
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
