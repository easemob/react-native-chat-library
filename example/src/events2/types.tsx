import type {
  ActionMenuEventType,
  AlertEventType,
  DataEventType,
  PromptEventType,
  SheetEventType,
  ToastEventType,
  UikitBizEventType,
  VoiceStateEventType,
} from 'react-native-chat-uikit';

export type EventType =
  | ToastEventType
  | SheetEventType
  | PromptEventType
  | AlertEventType
  | ActionMenuEventType
  | VoiceStateEventType
  | DataEventType;
export type BizEventType = UikitBizEventType | 'chat' | 'setting' | 'search';
