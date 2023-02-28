export type ToastEvent = 'toast_';
export type AlertEvent = 'alert_';
export type SheetEvent = 'sheet_';
export type PressEvent = 'press' | 'long_press';
export type MessageEvent = 'message';
export type ConversationEvent = 'conversion';

export const CreateGroupSettingsEvent = 'CreateGroupSettingsEvent';
export type CreateGroupSettingsEventType =
  | 'set_public'
  | 'set_invite'
  | 'create_new_group';

export const ContactListEvent = 'ContactListEvent';
export type ContactListEventType =
  | ToastEvent
  | AlertEvent
  | SheetEvent
  | 'create_group_result'
  | 'create_group_result_fail';

export const GroupInfoEvent = 'GroupInfoEvent';
export type GroupInfoEventType = 'destroy_group';

export const ConversationListEvent = 'ConversationListEvent';
export type ConversationListEventType =
  | ToastEvent
  | AlertEvent
  | SheetEvent
  | PressEvent
  | MessageEvent
  | ConversationEvent
  | 'create_conversation';

export const ChatEvent = 'ChatEvent';
export type ChatEventType =
  | 'enable_voice'
  | 'disable_voice'
  | 'msg_state'
  | 'msg_progress'
  | 'open_input_extension'
  | 'send_image_message';

export const HomeEvent = 'HomeEvent';
export type HomeEventType = 'update_state' | 'update_all_count';
export type HomeEventBarType = 'conv' | 'contact' | 'setting';

export const ContactEvent = 'ContactEvent';
export type ContactEventType = 'update_state';
export type ContactEventBarType = 'contact' | 'group' | 'request';

export const AppEvent = 'AppEvent';
export type AppEventType = 'on_initialized' | 'on_logined';
