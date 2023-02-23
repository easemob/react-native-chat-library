import React from 'react';
import { Platform } from 'react-native';
import type AudioRecorderPlayer from 'react-native-audio-recorder-player';
import type {
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';

import type { Nullable, PartialNullable } from '../types';
import { generateFileName, getFileExtension, getFileType } from '../utils/file';
import type {
  FileType,
  MediaService,
  MediaServiceOptions,
  OpenCameraOptions,
  OpenMediaLibraryOptions,
  OpenResult,
  PlayAudioOptions,
  RecordAudioOptions,
  SaveFileOptions,
  VideoProps,
  VideoThumbnailOptions,
} from './types';

export class MediaServiceImplement implements MediaService {
  option: MediaServiceOptions;
  audioPlayer: AudioRecorderPlayer;
  rootDir: string;
  constructor(option: MediaServiceOptions) {
    this.option = option;
    this.rootDir = '';
    this.audioPlayer = new this.option.audioModule.default();
    const rootDirName = this.option.rootDirName ?? 'chatuikit';
    this.createRootDir(rootDirName);
  }

  protected createRootDir(rootDirName: string): void {
    const create = () => {
      const docDir = this.option.fsModule.Dirs.DocumentDir;
      this.rootDir = `${docDir}/${rootDirName}`;
      console.log('test:rootDir:', this.rootDir);
      this.option.fsModule.FileSystem.exists(this.rootDir)
        .then((result) => {
          if (result === false) {
            this.option.fsModule.FileSystem.mkdir(this.rootDir);
          }
        })
        .catch((error) => {
          console.warn(error);
        });
    };
    this.option.permission
      .hasMediaLibraryPermission()
      .then((result) => {
        console.log(result);
        if (result === false) {
          this.option.permission
            .requestMediaLibraryPermission()
            .then((_) => {
              create();
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          create();
        }
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  public getRootDir(): string {
    return this.rootDir;
  }

  public async createDir(subDir: string): Promise<string> {
    let dir = this.rootDir;
    if (subDir.startsWith('/')) {
      dir += subDir;
    } else {
      dir += '/' + subDir;
    }
    return this.option.fsModule.FileSystem.mkdir(dir);
  }

  public async isDir(subDir: string): Promise<boolean> {
    let dir = this.rootDir;
    if (subDir.startsWith('/')) {
      dir += subDir;
    } else {
      dir += '/' + subDir;
    }
    return this.option.fsModule.FileSystem.isDir(dir);
  }

  public async isExistedDir(subDir: string): Promise<boolean> {
    let dir = this.rootDir;
    if (subDir.startsWith('/')) {
      dir += subDir;
    } else {
      dir += '/' + subDir;
    }
    return this.option.fsModule.FileSystem.exists(dir);
  }

  public async isExistedFile(file: string): Promise<boolean> {
    return this.option.fsModule.FileSystem.exists(file);
  }

  async startRecordAudio(options: RecordAudioOptions): Promise<boolean> {
    const hasPermission =
      await this.option.permission.hasCameraAndMicPermission();
    if (!hasPermission) {
      const granted =
        await this.option.permission.requestCameraAndMicPermission();
      if (!granted) {
        options?.onFailed?.(new Error('Failed to obtain permission.'));
        return false;
      }
    }
    try {
      const recorder = this.audioPlayer;
      recorder.addRecordBackListener((e: RecordBackType) => {
        options.onPosition?.(e.currentPosition);
      });
      const uri = await recorder.startRecorder(options.url, options.audio);
      options.onSaved?.(uri.replace(/file:\/\//, ''));
      return true;
    } catch (error) {
      console.warn('startRecordAudio:', error);
      return false;
    }
  }
  async stopRecordAudio(): Promise<void> {
    const recorder = this.audioPlayer;
    await recorder.stopRecorder();
    recorder.removeRecordBackListener();
  }
  async playAudio(options: PlayAudioOptions): Promise<boolean> {
    const hasPermission =
      await this.option.permission.hasMediaLibraryPermission();
    if (!hasPermission) {
      const granted =
        await this.option.permission.requestMediaLibraryPermission();
      if (!granted) {
        options?.onFailed?.(new Error('Failed to obtain permission.'));
        return false;
      }
    }
    try {
      const recorder = this.audioPlayer;
      recorder.addPlayBackListener((value: PlayBackType) => {
        options.onPlay?.({ ...value });
      });
      const url = await recorder.startPlayer(options.url, options.opt);
      options.onFile?.(url.replace(/file:\/\//, ''));
      return true;
    } catch (error) {
      console.warn('playAudio:', error);
      return false;
    }
  }
  async stopAudio(): Promise<void> {
    const recorder = this.audioPlayer;
    await recorder.stopPlayer();
    recorder.removePlayBackListener();
  }
  private resultReduction({
    uri,
    size,
    name,
    type,
    width,
    height,
  }: PartialNullable<FileType>): Nullable<FileType> {
    if (!uri) return null;
    return {
      uri,
      size: size ?? 0,
      name: name ?? '',
      type: type ?? '',
      width: width === null ? undefined : width,
      height: height === null ? undefined : height,
    };
  }

  async openMediaLibrary(
    options?: OpenMediaLibraryOptions | undefined
  ): Promise<Nullable<FileType>[]> {
    /**
     * NOTE: options.selectionLimit {@link https://github.com/react-native-image-picker/react-native-image-picker#options}
     * We do not support 0 (any number of files)
     **/
    const hasPermission =
      await this.option.permission.hasMediaLibraryPermission();
    if (!hasPermission) {
      const granted =
        await this.option.permission.requestMediaLibraryPermission();
      if (!granted) {
        options?.onFailed?.(new Error('Failed to obtain permission.'));
        return [];
      }
    }

    let selectionLimit = 1;
    if (options !== undefined) {
      selectionLimit = options.selectionLimit ? options.selectionLimit : 1;
    }
    const imagePicker = this.option.imagePickerModule;
    const response = await imagePicker.launchImageLibrary({
      presentationStyle: 'fullScreen',
      selectionLimit: selectionLimit,
      mediaType: (() => {
        switch (options?.mediaType) {
          case 'photo':
            return 'photo';
          case 'video':
            return 'video';
          case 'all':
            return 'mixed';
          default:
            return 'photo';
        }
      })(),
    });
    if (response.didCancel) return [];
    if (response.errorCode === 'camera_unavailable') {
      options?.onFailed?.(new Error(response.errorMessage));
      return [];
    }

    const r: Nullable<FileType>[] = (response.assets || [])
      .slice(0, selectionLimit)
      .map(({ fileName: name, fileSize: size, type, uri, width, height }) =>
        this.resultReduction({ uri, size, name, type, width, height })
      );
    return r;
  }
  async openCamera(
    options?: OpenCameraOptions | undefined
  ): Promise<Nullable<FileType>> {
    const hasPermission =
      await this.option.permission.hasCameraAndMicPermission();
    if (!hasPermission) {
      const granted =
        await this.option.permission.requestCameraAndMicPermission();
      if (!granted) {
        options?.onFailed?.(new Error('Failed to obtain permission.'));
        return null;
      }
    }

    const imagePicker = this.option.imagePickerModule;
    const response = await imagePicker.launchCamera({
      presentationStyle: 'fullScreen',
      cameraType: options?.cameraType ?? 'back',
      mediaType: (() => {
        switch (options?.mediaType) {
          case 'photo':
            return 'photo';
          case 'video':
            return 'video';
          case 'all':
            return 'mixed';
          default:
            return 'photo';
        }
      })(),
    });
    if (response.didCancel) return null;
    if (response.errorCode === 'camera_unavailable') {
      options?.onFailed?.(new Error('Failed to obtain permission.'));
      return null;
    }

    const {
      fileName: name,
      fileSize: size,
      type,
      uri,
    } = response.assets?.[0] ?? {};
    return this.resultReduction({ uri, size, name, type });
  }
  async openDocument(
    options?: OpenResult | undefined
  ): Promise<Nullable<FileType>> {
    const hasPermission =
      await this.option.permission.hasMediaLibraryPermission();
    if (!hasPermission) {
      const granted =
        await this.option.permission.requestMediaLibraryPermission();
      if (!granted) throw new Error('Permission not granted');
    }
    try {
      const { uri, size, name, type } =
        await this.option.documentPickerModule.pickSingle();
      return this.resultReduction({ uri, size, name, type });
    } catch (e) {
      if (
        !this.option.documentPickerModule.isCancel(e) &&
        this.option.documentPickerModule.isInProgress(e)
      ) {
        options?.onFailed?.(new Error('Failed to obtain permission.'));
      }
      return null;
    }
  }
  async saveFromUrl({
    remoteUrl,
    localPath,
  }: {
    remoteUrl: string;
    localPath: string;
  }): Promise<string> {
    await this.option.fsModule.FileSystem.fetch(remoteUrl, {
      path: localPath,
    });
    return localPath;
  }
  async saveFromLocal({
    targetPath,
    localPath,
  }: {
    targetPath: string;
    localPath: string;
  }): Promise<string> {
    await this.option.fsModule.FileSystem.cp(localPath, targetPath);
    return targetPath;
  }
  async save(options: SaveFileOptions): Promise<Nullable<string>> {
    const basePath =
      options.basePath ??
      Platform.select({
        android: this.option.fsModule.Dirs.CacheDir,
        default: this.option.fsModule.Dirs.DocumentDir,
      });
    let downloadPath = `${basePath}/${options.fileName}`;
    if (!getFileExtension(options.fileName)) {
      const extensionFromUrl = getFileExtension(options.fileUrl);
      if (getFileType(extensionFromUrl).match(/image|video/)) {
        downloadPath += extensionFromUrl;
      }
    }

    await this.option.fsModule.FileSystem.fetch(options.fileUrl, {
      path: downloadPath,
    });
    const fileType = getFileType(getFileExtension(options.fileUrl));

    if (
      Platform.OS === 'ios' &&
      (fileType === 'image' || fileType === 'video')
    ) {
      const type = ({ image: 'photo', video: 'video' } as const)[fileType];
      await this.option.mediaLibraryModule.save(downloadPath, { type });
    } else if (Platform.OS === 'android') {
      const dirType = {
        file: 'downloads',
        audio: 'audio',
        image: 'images',
        video: 'video',
      } as const;
      await this.option.fsModule.FileSystem.cpExternal(
        downloadPath,
        generateFileName(options.fileName, getFileExtension(options.fileUrl)),
        dirType[fileType]
      );
    } else {
      throw new Error('This platform is not supported.');
    }
    return downloadPath;
  }
  private static _hash(str: string) {
    return String(
      Math.abs(
        str.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)
      )
    );
  }
  getVideoComponent<Props = {}>({
    source,
    resizeMode,
    onLoad,
    ...props
  }: VideoProps & Props): JSX.Element {
    const VideoComponent = this.option.videoModule;
    return (
      <VideoComponent
        {...props}
        source={source}
        resizeMode={resizeMode}
        onLoad={onLoad}
        controls
      />
    );
  }
  async getVideoThumbnail(
    options: VideoThumbnailOptions
  ): Promise<Nullable<{ path: string }>> {
    try {
      const CreateThumbnail = this.option.videoThumbnail;
      const { path } = await CreateThumbnail.createThumbnail({
        url: options.url,
        format: 'jpeg',
        timeStamp: options.timeMills,
        cacheName: MediaServiceImplement._hash(options.url),
      });
      return { path };
    } catch (e) {
      console.warn(e);
      return null;
    }
  }
}
