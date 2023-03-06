import type { DialogContextType } from '../contexts';
import type { ExtraDataType } from './types';

export function handlePromptEvent(params: {
  prompt: Pick<DialogContextType, 'openPrompt'>;
  event: any;
  extra: ExtraDataType;
}): void {
  console.log('test:', params.event);
}
