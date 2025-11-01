import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createRoot,
  createWindow,
  flushPromises,
  installChromeMock,
} from '../../../testing/helpers';
import { StorageService } from './storage.service';
import { Keyword } from '../keywords/model/keyword.model';

describe('StorageService without chrome.storage', () => {
  beforeEach(() => {
    delete (globalThis as { chrome?: unknown }).chrome;
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  const createService = () => new StorageService();

  it('initializes the root signal with the default root', async () => {
    const service = createService();

    expect(service.rootSignal()).toEqual(createRoot());
    await expect(service.getRoot()).resolves.toEqual(createRoot());
  });

  it('setRoot updates the current root when storage is unavailable', async () => {
    const service = createService();
    const nextRoot = createRoot({ windowOrder: ['first'] });

    await service.setRoot(nextRoot);

    expect(service.rootSignal()).toEqual(nextRoot);
    await expect(service.getRoot()).resolves.toEqual(nextRoot);
  });

  it('createNewWindow adds a new window with defaults and avoids duplicates', async () => {
    const service = createService();

    await service.createNewWindow('W1', 'red');
    await service.createNewWindow('W1', 'blue', 'overwritten');

    const root = await service.getRoot();
    expect(root.windowOrder).toEqual(['W1']);
    expect(root.windows['W1']).toEqual(
      createWindow({ id: 'W1', color: 'red', name: 'new window' })
    );
  });

  it('setLastActiveWindowID stores the last active id', async () => {
    const service = createService();
    await service.createNewWindow('W1', 'red', 'Window 1');

    await service.setLastActiveWindowID('W1');

    const root = await service.getRoot();
    expect(root.lastActiveWindowID).toBe('W1');
  });

  it('insertKeyword and deleteKeyword update keywords and ordering', async () => {
    const service = createService();
    await service.createNewWindow('W1', 'red', 'Window 1');
    const keyword: Keyword = { id: 'k1', text: 'Keyword 1', done: false };

    await service.insertKeyword('W1', keyword);
    await service.deleteKeyword('W1', keyword);

    const root = await service.getRoot();
    expect(root.windows['W1'].keywords).toEqual({});
    expect(root.windows['W1'].keywordsOrder).toEqual([]);
  });

  it('clearAllKeywords removes every keyword from a window', async () => {
    const service = createService();
    const keyword1: Keyword = { id: 'k1', text: 'Keyword 1', done: false };
    const keyword2: Keyword = { id: 'k2', text: 'Keyword 2', done: true };
    await service.createNewWindow('W1', 'red', 'Window 1');
    await service.insertKeyword('W1', keyword1);
    await service.insertKeyword('W1', keyword2);

    await service.clearAllKeywords('W1');

    const root = await service.getRoot();
    expect(root.windows['W1'].keywords).toEqual({});
    expect(root.windows['W1'].keywordsOrder).toEqual([]);
  });

  it('toggleKeywordStatus flips the done flag', async () => {
    const service = createService();
    const keyword: Keyword = { id: 'k1', text: 'Keyword 1', done: false };
    await service.createNewWindow('W1', 'red', 'Window 1');
    await service.insertKeyword('W1', keyword);

    await service.toggleKeywordStatus('W1', 'k1');

    const root = await service.getRoot();
    expect(root.windows['W1'].keywords['k1'].done).toBe(true);
  });

  it('deleteWindow removes a window and clears the lastActiveWindowID', async () => {
    const service = createService();
    const window1 = createWindow({ id: 'W1', name: 'Window 1' });
    const window2 = createWindow({ id: 'W2', name: 'Window 2' });

    await service.setRoot(
      createRoot({
        windowOrder: ['W1', 'W2'],
        windows: {
          window1,
          window2,
        },
        lastActiveWindowID: 'W2',
      })
    );

    await service.deleteWindow('W2');

    const root = await service.getRoot();
    expect(root.windowOrder).toEqual(['W1']);
    expect(root.windows['W2']).toBeUndefined();
    expect(root.lastActiveWindowID).toBeNull();
  });

  it('updateWindowNameColor applies changes and enforces default name', async () => {
    const service = createService();
    await service.createNewWindow('W1', 'red', 'Window 1');

    await service.updateWindowNameColor('W1', '', 'green');

    const root = await service.getRoot();
    expect(root.windows['W1']).toMatchObject({
      name: 'new window',
      color: 'green',
    });
  });

  it('getBackgroundColor and getWindowName read from the signal cache', async () => {
    const service = createService();
    await service.createNewWindow('W1', 'red', 'Window 1');

    expect(service.getBackgroundColor('W1')).toBe('red');
    expect(service.getWindowName('W1')).toBe('Window 1');
    expect(service.getBackgroundColor('missing')).toBeUndefined();
  });

  it('keywordsFor returns an ordered list and reacts to updates', async () => {
    const service = createService();
    const keywords: Record<string, Keyword> = {
      k1: { id: 'k1', text: 'Keyword 1', done: false },
      k2: { id: 'k2', text: 'Keyword 2', done: true },
    };

    service.rootSignal.set(
      createRoot({
        windowOrder: ['W1'],
        windows: {
          W1: {
            id: 'W1',
            color: 'blue',
            name: 'Window 1',
            keywords,
            keywordsOrder: ['k1', 'k2'],
          },
        },
      })
    );

    const computedKeywords = service.keywordsFor('W1');
    expect(computedKeywords()).toEqual([keywords['k1'], keywords['k2']]);

    service.rootSignal.set(createRoot());
    expect(computedKeywords()).toEqual([]);
  });

  it('windows computed emits the ordered windows list', async () => {
    const service = createService();
    const window1 = createWindow({ id: 'W1', name: 'A' });
    const window2 = createWindow({ id: 'W2', name: 'B' });

    service.rootSignal.set(
      createRoot({
        windowOrder: ['W2', 'W1', 'missing'],
        windows: {
          W1: window1,
          W2: window2,
        },
      })
    );
    expect(service.windows()).toEqual([window2, window1]);
  });
});

describe('StorageService with chrome storage', () => {
  afterEach(() => {
    delete (globalThis as { chrome?: unknown }).chrome;
    vi.restoreAllMocks();
  });

  it('initializes from chrome storage and registers listeners', async () => {
    const storedRoot = createRoot({
      windowOrder: ['W1'],
      windows: {
        alpha: createWindow({ id: 'W1', color: 'red' }),
      },
    });
    const chromeMock = installChromeMock({ storedRoot });

    const service = new StorageService();
    await flushPromises();

    expect(chromeMock.storage.local.get).toHaveBeenCalled();
    expect(chromeMock.storage.onChanged.addListener).toHaveBeenCalledWith(
      expect.any(Function)
    );
    expect(service.rootSignal()).toEqual(storedRoot);
  });
});
