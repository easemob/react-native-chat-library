import type { VoiceStateContextType } from '../contexts';
import type { ExtraDataType } from './types';

export function handleVoiceStateEvent(params: {
  voiceState: VoiceStateContextType;
  event: any;
  extra: ExtraDataType;
}): void {
  console.log('test:', params.event);
}
