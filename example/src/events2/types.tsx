import type {
  ActionMenuEventType,
  AlertEventType,
  DataEventType,
  PromptEventType,
  SheetEventType,
  ToastEventType,
  UikitBizEventType,
} from 'react-native-chat-uikit';

export type EventType =
  | ToastEventType
  | SheetEventType
  | PromptEventType
  | AlertEventType
  | ActionMenuEventType
  | DataEventType;
export type BizEventType = UikitBizEventType | 'setting';
