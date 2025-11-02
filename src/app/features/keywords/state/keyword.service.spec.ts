import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { KeywordService } from './keyword.service';
import { StorageServiceMock, WindowServiceMock } from 'src/testing/types';
import {
  createStorageServiceMock,
  createWindowServiceMock,
} from 'src/testing/helpers';
import { TestBed } from '@angular/core/testing';
import { StorageService } from '../../storage/storage.service';
import { WindowService } from '../../windows/state/window.service';

describe('KeywordService', () => {
  let service: KeywordService;
  let storage: StorageServiceMock;
  let windowService: WindowServiceMock;

  beforeEach(() => {
    storage = createStorageServiceMock();
    windowService = createWindowServiceMock();

    TestBed.configureTestingModule({
      providers: [
        KeywordService,
        {
          provide: StorageService,
          useValue: storage,
        },
        {
          provide: WindowService,
          useValue: windowService,
        },
      ],
    });

    service = TestBed.inject(KeywordService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });
});
