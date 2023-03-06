import type { DialogContextType, ExtraDataType } from 'react-native-chat-uikit';

export function handlePromptEvent(params: {
  prompt: Pick<DialogContextType, 'openPrompt'>;
  event: any;
  extra: ExtraDataType;
}): void {
  console.log('test:', params.event);
}
