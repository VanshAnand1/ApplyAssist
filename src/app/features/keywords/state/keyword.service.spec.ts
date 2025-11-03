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

  it('removes a keyword', async () => {
    const keyword1: Keyword = { id: 'k1', text: 'Keyword 1', done: false };
    const keyword2: Keyword = { id: 'k2', text: 'Keyword 2', done: true };

    await service.setActiveWindowID('W1');
    service.addKeyword(keyword1);
    service.addKeyword(keyword2);

    service.removeKeyword(keyword1);

    expect(storage.deleteKeyword).toHaveBeenCalledWith('W1', keyword1);
  });

  it('toggles keyword status', async () => {
    const keyword: Keyword = { id: 'k1', text: 'Keyword 1', done: false };

    await service.setActiveWindowID('W1');
    service.addKeyword(keyword);

    service.toggleKeywordStatus(keyword);

    expect(storage.toggleKeywordStatus).toHaveBeenCalledWith('W1', keyword.id);
  });

  it('gets active window id', async () => {
    const keyword: Keyword = { id: 'k1', text: 'Keyword 1', done: false };

    await service.setActiveWindowID('W1');
    service.addKeyword(keyword);

    service.getActiveWindowID();

    expect(storage.getLastActiveWindowID).toHaveBeenCalled();
  });

  it('clears all keywords', async () => {
    const keyword1: Keyword = { id: 'k1', text: 'Keyword 1', done: false };
    const keyword2: Keyword = { id: 'k2', text: 'Keyword 2', done: false };
    const keyword3: Keyword = { id: 'k3', text: 'Keyword 3', done: false };

    await service.setActiveWindowID('W1');
    service.addKeyword(keyword1);
    service.addKeyword(keyword2);
    service.addKeyword(keyword3);

    service.clearKeywords();

    expect(storage.clearAllKeywords).toHaveBeenCalled();
  });

  it('gets keywords count', async () => {
    const keyword1: Keyword = { id: 'k1', text: 'Keyword 1', done: false };
    const keyword2: Keyword = { id: 'k2', text: 'Keyword 2', done: false };
    const keyword3: Keyword = { id: 'k3', text: 'Keyword 3', done: false };

    storage.keywordsFor.mockReturnValue(() => [keyword1, keyword2, keyword3]);

    await service.setActiveWindowID('W1');
    service.addKeyword(keyword1);
    service.addKeyword(keyword2);
    service.addKeyword(keyword3);

    expect(service.getKeywordsCount()).toBe(3);
  });

  it('counts completed keywords', async () => {
    const keyword1: Keyword = { id: 'k1', text: 'Keyword 1', done: false };
    const keyword2: Keyword = { id: 'k2', text: 'Keyword 2', done: true };
    const keyword3: Keyword = { id: 'k3', text: 'Keyword 3', done: true };

    storage.keywordsFor.mockReturnValue(() => [keyword1, keyword2, keyword3]);

    await service.setActiveWindowID('W1');
    service.addKeyword(keyword1);
    service.addKeyword(keyword2);
    service.addKeyword(keyword3);

    expect(service.countDone()).toBe(2);
  });

  it('counts percent of completed keywords', async () => {
    const keyword1: Keyword = { id: 'k1', text: 'Keyword 1', done: false };
    const keyword2: Keyword = { id: 'k2', text: 'Keyword 2', done: true };

    storage.keywordsFor.mockReturnValue(() => [keyword1, keyword2]);

    await service.setActiveWindowID('W1');
    service.addKeyword(keyword1);
    service.addKeyword(keyword2);

    expect(service.percentDone()).toBe(50);
  });
});
