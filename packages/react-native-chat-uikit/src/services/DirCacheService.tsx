import type { DirCacheService, DirCacheServiceOption } from './types';

export class DirCacheServiceImplement implements DirCacheService {
  option: DirCacheServiceOption;
  useId?: string;
  constructor(option: DirCacheServiceOption) {
    this.option = option;
  }
  init(useId: string): void {
    this.useId = useId;
  }
  unInit(): void {
    this.useId = undefined;
  }

  getRootDir(): string {
    return this.option.media.getRootDir();
  }
  getUserDir(): string {
    // if (this.useId === undefined)
    //   throw new Error('Initialize the object first.');
    return `${this.getRootDir()}/${this.useId}`;
  }
  getMessageDir(): string {
    // if (this.useId === undefined)
    //   throw new Error('Initialize the object first.');
    return `${this.getRootDir()}/${this.useId}/msg`;
  }
  getConversationDir(convId: string): string {
    // if (this.useId === undefined)
    //   throw new Error('Initialize the object first.');
    return `${this.getRootDir()}/${this.useId}/msg/${convId}`;
  }
  getFileDir(convId: string, file: string): string {
    // if (this.useId === undefined)
    //   throw new Error('Initialize the object first.');
    return `${this.getRootDir()}/${this.useId}/msg/${convId}/${file}`;
  }
  _getUserDir(): string {
    // if (this.useId === undefined)
    //   throw new Error('Initialize the object first.');
    return `${this.useId}`;
  }
  _getMessageDir(): string {
    // if (this.useId === undefined)
    //   throw new Error('Initialize the object first.');
    return `${this.useId}/msg`;
  }
  _getConversationDir(convId: string): string {
    // if (this.useId === undefined)
    //   throw new Error('Initialize the object first.');
    return `${this.useId}/msg/${convId}`;
  }
  _getFileDir(convId: string, file: string): string {
    // if (this.useId === undefined)
    //   throw new Error('Initialize the object first.');
    return `${this.useId}/msg/${convId}/${file}`;
  }

  isExistedUserDir(): Promise<boolean> {
    return this.option.media.isExistedDir(this._getUserDir());
  }
  isExistedMessageDir(): Promise<boolean> {
    return this.option.media.isExistedDir(this._getMessageDir());
  }
  isExistedConversationDir(convId: string): Promise<boolean> {
    return this.option.media.isExistedDir(this._getConversationDir(convId));
  }
  isExistedFile(file: string): Promise<boolean> {
    return this.option.media.isExistedFile(file);
  }

  createUserDir(): Promise<string> {
    return this.option.media.createDir(this._getUserDir());
  }
  createMessageDir(): Promise<string> {
    return this.option.media.createDir(this._getMessageDir());
  }
  createConversationDir(convId: string): Promise<string> {
    return this.option.media.createDir(this._getConversationDir(convId));
  }
}
