import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StorageService } from './storage.service';
import { WindowSchema } from '../windows/model/window.model';
import { Keyword } from '../keywords/model/keyword.model';
import { WindowMap, Root } from './storage.service';

const createRoot = (overrides: Partial<Root> = {}): Root => ({
  version: 1,
  windowOrder: [],
  windows: {},
  lastActiveWindowID: null,
  ...overrides,
});

const createWindow = (overrides: Partial<WindowSchema>): WindowSchema => ({
  id: 'window-id',
  color: 'blue',
  name: 'new window',
  keywords: {},
  keywordsOrder: [],
  ...overrides,
});
