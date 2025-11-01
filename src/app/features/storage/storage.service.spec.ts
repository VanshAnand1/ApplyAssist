import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createRoot,
  createWindow,
  flushPromises,
  installChromeMock,
} from 'src/testing/helpers';
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
});
