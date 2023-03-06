export type ExtraDataType = {
  getData?: (() => any) | undefined;
  getForbidEvent?: (() => string[]) | undefined;
};

export type ToastEventType = 'ToastEvent';
export type SheetEventType = 'SheetEvent';
export type PromptEventType = 'PromptEvent';
export type AlertEventType = 'AlertEvent';
export type ActionMenuEventType = 'ActionMenuEvent';
export type DataEventType = 'DataEvent';
export type UikitEventType =
  | ToastEventType
  | SheetEventType
  | PromptEventType
  | AlertEventType
  | ActionMenuEventType
  | DataEventType;
export type UikitBizEventType =
  | 'contact'
  | 'group'
  | 'room'
  | 'message'
  | 'conversation';
export type UikitEventSenderType = string;
export type UikitEventReceiverType = string;
export type UikitEventParams = any;
