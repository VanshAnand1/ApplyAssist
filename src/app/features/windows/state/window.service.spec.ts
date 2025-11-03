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

    TestBed.configureTestingModule({
      providers: [
        WindowService,
        { provide: StorageService, useValue: storage },
        { provide: KeywordService, useValue: keywordService },
      ],
    });

    service = TestBed.inject(WindowService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('creates a new window and activates it', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(111);
    storage.createNewWindow.mockResolvedValue(undefined);
    keywordService.setActiveWindowID.mockResolvedValue(undefined);

    await service.createNewWindow('purple', 'My window');

    expect(storage.createNewWindow).toHaveBeenCalledWith(
      '111',
      'purple',
      'My window'
    );
    expect(keywordService.setActiveWindowID).toHaveBeenCalledWith('111');
  });

  it('selectWindow forwards the id to keyword service', async () => {
    keywordService.setActiveWindowID.mockResolvedValue(undefined);

    await service.selectWindow('window-id');

    expect(keywordService.setActiveWindowID).toHaveBeenCalledWith('window-id');
  });

  it('windows exposes the list from storage service', () => {
    const windowList = [createWindow({ id: 'W1' })];
    storage.windows.mockReturnValue(windowList);

    expect(service.windows()).toBe(windowList);
    expect(storage.windows).toHaveBeenCalledTimes(1);
  });

  it('activeWindowID returns the current id from keyword service', () => {
    keywordService.getActiveWindowID.mockReturnValue('active-id');

    expect(service.activeWindowID()).toBe('active-id');
    expect(keywordService.getActiveWindowID).toHaveBeenCalledTimes(1);
  });

  it('getBackgroundColor maps palette colors', () => {
    storage.getBackgroundColor.mockReturnValueOnce('blue');

    const result = service.getBackgroundColor('W1');

    expect(storage.getBackgroundColor).toHaveBeenCalledWith('W1');
    expect(result).toBe('#80f0ff');
  });

  it('getBackgroundColor returns a fallback when color is missing', () => {
    storage.getBackgroundColor.mockReturnValueOnce(undefined);

    expect(service.getBackgroundColor('missing')).toBe('#9ea3a3');
  });

  it('getWindowColor returns the raw color from storage', () => {
    storage.getBackgroundColor.mockReturnValueOnce('green');

    expect(service.getWindowColor('W1')).toBe('green');
  });

  it('getWindowName returns the name from storage', () => {
    storage.getWindowName.mockReturnValue('Window 1');

    expect(service.getWindowName('W1')).toBe('Window 1');
    expect(storage.getWindowName).toHaveBeenCalledWith('W1');
  });

  it('removeWindow delegates to storage service', () => {
    service.removeWindow('W2');

    expect(storage.deleteWindow).toHaveBeenCalledWith('W2');
  });

  it('updateWindowNameColor delegates to storage service', () => {
    service.updateWindowNameColor('W1', 'Renamed', 'orange');

    expect(storage.updateWindowNameColor).toHaveBeenCalledWith(
      'W1',
      'Renamed',
      'orange'
    );
  });
});
