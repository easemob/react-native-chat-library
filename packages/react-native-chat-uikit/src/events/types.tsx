import type {
  DialogContextType,
  ToastContextType,
  VoiceStateContextType,
} from '../contexts';

export type ExtraDataType = {
  getData?: (() => any) | undefined;
  getForbidEvent?: (() => string[]) | undefined;
};
export type HandleDataType = {
  /**
   * Event handler.
   * If false is returned, it is not processed and is handed over to the parent class.
   *
   * @param params Event object.
   * @returns Boolean value.
   */
  handleAlertEvent?: (params: {
    alert: Pick<DialogContextType, 'openAlert'>;
    event: any;
    extra: ExtraDataType;
  }) => boolean;
  handleDataEvent?: (params: { event: any; extra: ExtraDataType }) => boolean;
  handleMenuEvent?: (params: {
    menu: Pick<DialogContextType, 'openMenu'>;
    event: any;
    extra: ExtraDataType;
  }) => boolean;
  handlePromptEvent?: (params: {
    prompt: Pick<DialogContextType, 'openPrompt'>;
    event: any;
    extra: ExtraDataType;
  }) => boolean;
  handleSheetEvent?: (params: {
    sheet: Pick<DialogContextType, 'openSheet'>;
    event: any;
    extra: ExtraDataType;
  }) => boolean;
  handleToastEvent?: (params: {
    toast: ToastContextType;
    event: any;
    extra: ExtraDataType;
  }) => boolean;
  handleVoiceStateEvent?: (params: {
    voiceState: VoiceStateContextType;
    event: any;
    extra: ExtraDataType;
  }) => boolean;
};

export type ToastEventType = 'ToastEvent';
export type SheetEventType = 'SheetEvent';
export type PromptEventType = 'PromptEvent';
export type AlertEventType = 'AlertEvent';
export type ActionMenuEventType = 'ActionMenuEvent';
export type VoiceStateEventType = 'VoiceStateEvent';
export type DataEventType = 'DataEvent';
export type UikitEventType =
  | ToastEventType
  | SheetEventType
  | PromptEventType
  | AlertEventType
  | ActionMenuEventType
  | VoiceStateEventType
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
