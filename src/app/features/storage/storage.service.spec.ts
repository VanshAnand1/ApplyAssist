import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
});
