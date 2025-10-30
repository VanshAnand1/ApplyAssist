import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { WindowService } from '../../features/windows/state/window.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../features/storage/storage.service';

import { Keyword } from 'src/app/features/keywords/model/keyword.model';

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
      world: 'ISOLATED',
      func: async (windowId: string, initialName: string) => {
        type Keyword = { text: string; done: boolean; id: string };

        type WindowSchema = {
          name?: string;
          color: string;
          id: string;
          keywords: { [key: string]: Keyword };
          keywordsOrder: Array<string>;
        };

        type Root = {
          version: number;
          windowOrder: string[];
          windows: Record<string, WindowSchema>;
          lastActiveWindowID: string | null;
        };

        const DEFAULT_ROOT: Root = {
          version: 1,
          windowOrder: [],
          windows: {},
          lastActiveWindowID: null,
        };

        const getRoot = async (): Promise<Root> => {
          if (!chrome?.storage?.local?.get) return DEFAULT_ROOT;
          const result = await chrome.storage.local.get({ root: DEFAULT_ROOT });
          const root = (result['root'] ?? DEFAULT_ROOT) as Root;
          return root.version ? root : DEFAULT_ROOT;
        };

        const setRoot = async (root: Root) => {
          if (!chrome?.storage?.local?.set) return;
          await chrome.storage.local.set({ root });
        };

        const updateWindow = async (
          targetId: string,
          updater: (window: WindowSchema) => WindowSchema
        ) => {
          const root = await getRoot();
          const window = root.windows[targetId];
          if (!window) return null;
          const updatedWindow = updater(window);
          const updatedRoot: Root = {
            ...root,
            windows: { ...root.windows, [targetId]: updatedWindow },
          };
          await setRoot(updatedRoot);
          return updatedWindow;
        };

        const stateKey = '__APPLYASSIST_OVERLAY_STATE__';
        const globalState = window as unknown as Record<string, unknown>;
        const detachExistingListener = () => {
          const existingListener = globalState[stateKey] as
            | {
                listener?: (
                  changes: Record<string, chrome.storage.StorageChange>,
                  area: string
                ) => void;
              }
            | undefined;
          if (existingListener?.listener) {
            chrome.storage.onChanged.removeListener(existingListener.listener);
          }
        };
        detachExistingListener();

        const ensureStateContainer = () => {
          if (
            !globalState[stateKey] ||
            typeof globalState[stateKey] !== 'object'
          ) {
            globalState[stateKey] = {};
          }
          return globalState[stateKey] as {
            listener?: (
              changes: Record<string, chrome.storage.StorageChange>,
              area: string
            ) => void;
          };
        };

        const overlayWindowID = 'APPLYASSIST-OVERLAY-WINDOW-ID';
        let overlayWindow = document.getElementById(
          overlayWindowID
        ) as HTMLDivElement | null;
        if (!overlayWindow) {
          overlayWindow = document.createElement('div');
          overlayWindow.id = overlayWindowID;
          overlayWindow.style.position = 'fixed';
          overlayWindow.style.top = '12px';
          overlayWindow.style.right = '12px';
          overlayWindow.style.width = '360px';
          overlayWindow.style.maxHeight = '95vh';
          overlayWindow.style.background =
            'linear-gradient(160deg, rgba(8,27,41,0.95), rgba(11,46,73,0.95))';
          overlayWindow.style.color = '#f8fafc';
          overlayWindow.style.borderRadius = '16px';
          overlayWindow.style.boxShadow = '0 20px 40px rgba(8, 12, 23, 0.45)';
          overlayWindow.style.backdropFilter = 'blur(10px)';
          overlayWindow.style.overflow = 'hidden';
          overlayWindow.style.fontFamily =
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
          overlayWindow.style.zIndex = '2147483647';
          document.documentElement.appendChild(overlayWindow);
        } else {
          overlayWindow.innerHTML = '';
        }

        const createSection = (
          parent: HTMLElement,
          styles: Partial<CSSStyleDeclaration>
        ) => {
          const section = document.createElement('div');
          Object.assign(section.style, styles);
          parent.appendChild(section);
          return section;
        };
      },
      args: [windowID, windowName],
    });
  }
}
