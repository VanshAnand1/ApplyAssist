import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  createKeywordServiceMock,
  createStorageServiceMock,
  createWindow,
} from '../../../../testing/helpers';
import type {
  KeywordServiceMock,
  StorageServiceMock,
} from '../../../../testing/types';
import { WindowService } from './window.service';
import { StorageService } from '../../storage/storage.service';
import { KeywordService } from '../../keywords/state/keyword.service';

describe('WindowService', () => {
  let service: WindowService;
  let storage: StorageServiceMock;
  let keywordService: KeywordServiceMock;

  beforeEach(() => {
    storage = createStorageServiceMock();
    keywordService = createKeywordServiceMock();
  });
});
