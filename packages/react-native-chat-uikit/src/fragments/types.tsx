export type NotificationMessageDescriptionType =
  | 'ContactInvitation'
  | 'ContactInvitationAccepted'
  | 'ContactInvitationDeclined'
  | 'GroupInvitation'
  | 'GroupInvitationAccepted'
  | 'GroupInvitationDeclined'
  | 'GroupRequestJoin'
  | 'GroupRequestJoinAccepted'
  | 'GroupRequestJoinDeclined';

export type ToastEvent = 'toast_';
export type AlertEvent = 'alert_';
export type SheetEvent = 'sheet_';
export type PressEvent = 'press' | 'long_press';

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
  | 'press'
  | 'long_press'
  | 'conversion'
  | 'create_conversation'
  | 'conversation_read';

export const ChatEvent = 'ChatEvent';
export type ChatEventType =
  | 'enable_voice'
  | 'disable_voice'
  | 'msg_state'
  | 'msg_progress'
  | 'open_input_extension'
  | 'send_image_message'
  | 'send_voice_message'
  | 'send_custom_message';

export const MessageBubbleEvent = 'MessageBubbleEvent';
export type MessageBubbleEventType = 'on_press' | 'on_long_press';

export const LoginEvent = 'LoginEvent';
export type LoginEventType = 'on_login_end' | 'on_logout_end';

export const MessageEvent = 'MessageEvent';
export type MessageEventType = 'on_send_before' | 'on_send_result';

export type ToastEventType =
  | 'add_content_success'
  | 'add_content_fail'
  | 'request_join_public_group_success'
  | 'request_join_public_group_fail';
