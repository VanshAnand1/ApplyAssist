import { Injectable, inject, signal, computed } from '@angular/core';
import { WindowSchema, Window } from '../model/window.model';
import { StorageService } from '../../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class WindowService {
  windows: Array<Window> = [];
  windowLimit: number = 5;
  storage = inject(StorageService);

  createNewWindow(color: string, name?: string) {
    if (this.reachedWindowLimit()) {
      console.log('window limit reached');
      return;
    }
    this.storage.createNewWindow(Date.now().toString(), color, name);
  }

  removeWindow(windowID: string) {
    // this.windows.filter((window: WindowSchema) => windowID === window.id);
  }

  changeWindowColor(windowID: string, color: string) {
    for (let window of this.windows) {
      if (window.id == windowID) {
        window.changeWindowColor(color);
        return;
      }
    }
    console.log('no window found with that id');
  }

  changeWindowName(windowID: string, name: string) {
    for (let window of this.windows) {
      if (window.id == windowID) {
        window.changeWindowName(name);
        // this.storage.updateWindowName(windowID, name);
        return;
      }
    }
    console.log('no window found with that id');
  }

  reachedWindowLimit() {
    if (this.windows.length >= this.windowLimit) {
      return true;
    }
    return false;
  }
}
