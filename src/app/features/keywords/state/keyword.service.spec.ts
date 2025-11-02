import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { KeywordService } from './keyword.service';
import { StorageServiceMock } from '../../../../testing/types';
import { createStorageServiceMock } from '../../../../testing/helpers';
import { StorageService } from '../../storage/storage.service';
import { Keyword } from '../model/keyword.model';

describe('KeywordService', () => {
  let service: KeywordService;
  let storage: StorageServiceMock;

  beforeEach(() => {
    storage = createStorageServiceMock();

    TestBed.configureTestingModule({
      providers: [
        KeywordService,
        {
          provide: StorageService,
          useValue: storage,
        },
      ],
    });

    service = TestBed.inject(KeywordService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('creates a new keyword', async () => {
    const keyword: Keyword = { id: 'k1', text: 'Keyword 1', done: false };

    await service.setActiveWindowID('W1');
    service.addKeyword(keyword);

    expect(storage.insertKeyword).toHaveBeenCalledWith('W1', keyword);
  });
});
