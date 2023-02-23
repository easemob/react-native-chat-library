import { ClipboardServiceImplement } from './ClipboardService';
import { DirCacheServiceImplement } from './DirCacheService';
import { LocalStorageServiceImplement } from './LocalStorageService';
import { MediaServiceImplement } from './MediaService';
import { NotificationServiceImplement } from './NotificationService';
import { PermissionServiceImplement } from './PermissionService';
import type {
  ClipboardService,
  ClipboardServiceOption,
  DirCacheService,
  DirCacheServiceOption,
  LocalStorageService,
  MediaService,
  MediaServiceOptions,
  NotificationService,
  NotificationServiceOption,
  PermissionService,
  PermissionServiceOption,
} from './types';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Services {
  static cbs: ClipboardService;
  static ms: MediaService;
  static ns: NotificationService;
  static ps: PermissionService;
  static ls: LocalStorageService;
  static dcs: DirCacheService;

  public static createPermissionService(
    option: PermissionServiceOption
  ): PermissionService {
    if (Services.ps === undefined) {
      Services.ps = new PermissionServiceImplement(option);
    }
    return Services.ps;
  }

  public static createClipboardService(
    option: ClipboardServiceOption
  ): ClipboardService {
    if (Services.cbs === undefined) {
      Services.cbs = new ClipboardServiceImplement(option);
    }
    return Services.cbs;
  }

  public static createMediaService(option: MediaServiceOptions): MediaService {
    if (Services.ms === undefined) {
      Services.ms = new MediaServiceImplement(option);
    }
    return Services.ms;
  }

  public static createNotificationService(
    option: NotificationServiceOption
  ): NotificationService {
    if (Services.ns === undefined) {
      Services.ns = new NotificationServiceImplement(option);
    }
    return Services.ns;
  }

  public static createLocalStorageService(
    service?: LocalStorageService
  ): LocalStorageService {
    if (Services.ns === undefined) {
      if (service) {
        Services.ls = service;
      }
      Services.ls = new LocalStorageServiceImplement();
    }
    return Services.ls;
  }

  public static createDirCacheService(
    option: DirCacheServiceOption
  ): DirCacheService {
    if (Services.dcs === undefined) {
      Services.dcs = new DirCacheServiceImplement(option);
    }
    return Services.dcs;
  }
}

export * from './types';
