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
          elementType: string,
          styles: Partial<CSSStyleDeclaration>
        ) => {
          const section = document.createElement(elementType);
          Object.assign(section.style, styles);
          parent.appendChild(section);
          return section;
        };

        const header = createSection(overlayWindow, 'div', {
          padding: '20px 24px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        });

        const titleWrapper = createSection(header, 'div', {
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        });

        const title = createSection(titleWrapper, 'h2', {
          margin: '0',
          fontSize: '18px',
          fontWeight: '600',
          letterSpacing: '0.01em',
        });
        title.textContent = initialName;

        const subtitle = createSection(titleWrapper, 'span', {
          fontSize: '13px',
          color: 'rgba(241,245,249,0.6)',
        });
        subtitle.textContent = 'Application checklist';

        const closeButton = createSection(header, 'button', {
          border: 'none',
          background: 'rgba(15,23,42,0.3)',
          color: '#e2e8f0',
          fontSize: '20px',
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'background 0.2s ease',
        });
        closeButton.textContent = '×';
        closeButton.addEventListener('mouseenter', () => {
          closeButton.style.background = 'rgba(100,116,139,0.4)';
        });
        closeButton.addEventListener('mouseleave', () => {
          closeButton.style.background = 'rgba(15,23,42,0.3)';
        });
        closeButton.addEventListener('click', () => {
          if (overlayWindow) overlayWindow.remove();
          detachExistingListener();
          delete globalState[stateKey];
        });

        const progressSection = createSection(overlayWindow, 'div', {
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        });

        const progressLabel = createSection(progressSection, 'div', {
          fontSize: '13px',
          color: 'rgba(148,163,184,0.9)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        });
        progressLabel.textContent = 'Completion';

        const progressValue = createSection(progressSection, 'div', {
          fontSize: '28px',
          fontWeight: '600',
          letterSpacing: '-0.02em',
        });
        progressValue.textContent = '0% complete';

        const progressBar = createSection(progressSection, 'div', {
          width: '100%',
          height: '10px',
          background: 'rgba(148, 163, 184, 0.2)',
          borderRadius: '999px',
          overflow: 'hidden',
          position: 'relative',
        });

        const progressFill = createSection(progressBar, 'div', {
          height: '100%',
          width: '0%',
          background: 'linear-gradient(120deg,#22d3ee,#22c55e)',
          borderRadius: '999px',
          transition: 'width 0.25s ease',
        });

        const body = createSection(overlayWindow, 'div', {
          padding: '0 24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        });

        const form = createSection(body, 'form', {
          display: 'flex',
          gap: '8px',
        });

        const input = createSection(form, 'input', {
          flex: '1 1 auto',
          background: 'rgba(15,23,42,0.35)',
          border: '1px solid rgba(148,163,184,0.2)',
          borderRadius: '12px',
          padding: '10px 12px',
          color: '#e2e8f0',
          fontSize: '14px',
          outline: 'none',
          transition: 'border 0.2s ease, background 0.2s ease',
        }) as HTMLInputElement;
        input.type = 'text';
        input.placeholder = 'Add a keyword...';
        input.addEventListener('focus', () => {
          input.style.border = '1px solid rgba(56,189,248,0.6)';
          input.style.background = 'rgba(15,23,42,0.55)';
        });
        input.addEventListener('blur', () => {
          input.style.border = '1px solid rgba(148,163,184,0.2)';
          input.style.background = 'rgba(15,23,42,0.35)';
        });

        const submitButton = createSection(form, 'button', {
          border: 'none',
          padding: '10px 18px',
          borderRadius: '12px',
          background: 'linear-gradient(120deg,#0ea5e9,#22c55e)',
          color: '#f8fafc',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'transform 0.15s ease',
        }) as HTMLButtonElement;
        submitButton.type = 'submit';
        submitButton.textContent = 'Add';
        submitButton.addEventListener('mouseenter', () => {
          submitButton.style.transform = 'translateY(-1px)';
        });
        submitButton.addEventListener('mouseleave', () => {
          submitButton.style.transform = 'translateY(0)';
        });

        const listContainer = createSection(body, 'div', {
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxHeight: '55vh',
          overflowY: 'auto',
          paddingRight: '6px',
        });

        const keywordList = createSection(listContainer, 'ul', {
          listStyle: 'none',
          margin: '0',
          padding: '0',
        });

        const footer = createSection(overlayWindow, 'div', {
          padding: '16px 24px 24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        });

        const summary = createSection(footer, 'span', {
          fontSize: '13px',
          color: 'rgba(148,163,184,0.9)',
        });
        summary.textContent = 'Keywords ready to track.';

        const clearButton = createSection(footer, 'button', {
          border: 'none',
          background: 'rgba(239,68,68,0.16)',
          color: '#fca5a5',
          padding: '8px 14px',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: '600',
          transition: 'background 0.15s ease, color 0.15s ease',
        });
        clearButton.textContent = 'Clear All';
        clearButton.addEventListener('mouseenter', () => {
          clearButton.style.background = 'rgba(239,68,68,0.28)';
          clearButton.style.color = '#fecaca';
        });
        clearButton.addEventListener('mouseleave', () => {
          clearButton.style.background = 'rgba(239,68,68,0.16)';
          clearButton.style.color = '#fca5a5';
        });
      },
      args: [windowID, windowName],
    });
  }
}
2;
