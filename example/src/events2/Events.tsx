import type {
  UikitAlertActionEventType,
  UikitDataActionEventType,
  UikitMenuActionEventType,
  UikitPromptActionEventType,
  UikitSheetActionEventType,
  UikitStateActionEventType,
  UikitToastActionEventType,
} from 'react-native-chat-uikit';

////////////////////////////////////////////////////////////////////////////////
//// ToastActionEventType //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type ToastActionEventType = UikitToastActionEventType | 'toast_';

////////////////////////////////////////////////////////////////////////////////
//// SheetActionEventType //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type SheetActionEventType =
  | UikitSheetActionEventType
  | 'sheet_contact_list'
  | 'sheet_conversation_list'
  | 'sheet_group_member'
  | 'sheet_create_group_settings'
  | 'sheet_navigation_menu'
  | 'open_input_extension'
  | 'send_image_message'
  | 'open_group_info_setting'
  | 'open_my_setting_setting';

////////////////////////////////////////////////////////////////////////////////
//// PromptActionEventType /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type PromptActionEventType =
  | UikitPromptActionEventType
  | 'modify_group_name'
  | 'modify_group_description'
  | 'modify_my_name';

////////////////////////////////////////////////////////////////////////////////
//// AlertActionEventType //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type AlertActionEventType =
  | UikitAlertActionEventType
  | 'alert_group_member_modify'
  | 'alert_block_contact'
  | 'alert_remove_group_member'
  | 'create_group_result_fail'
  | 'manual_block_contact'
  | 'manual_remove_contact'
  | 'manual_leave_group'
  | 'manual_destroy_group'
  | 'remove_all_conversation_and_messages'
  | 'manual_logout';

////////////////////////////////////////////////////////////////////////////////
//// MenuActionEventType ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type MenuActionEventType =
  | UikitMenuActionEventType
  | 'long_press_message_bubble';

////////////////////////////////////////////////////////////////////////////////
//// StateActionEventType //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type StateActionEventType =
  | UikitStateActionEventType
  | 'enable_voice'
  | 'disable_voice';

////////////////////////////////////////////////////////////////////////////////
//// StateActionEventType //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type DataActionEventType =
  | UikitDataActionEventType
  | 'data_'
  | 'alert_group_member_modify_result'
  | 'create_group_result_fail_result'
  | 'create_group_result_success'
  | 'create_conversation_item'
  | 'create_new_group'
  | 'add_new_contact'
  | 'search_public_group_info'
  | 'join_public_group'
  | 'exec_block_contact'
  | 'exec_remove_contact'
  | 'exec_leave_group'
  | 'exec_destroy_group'
  | 'copy_group_id'
  | 'exec_modify_group_name'
  | 'exec_modify_group_description'
  | 'exec_remove_all_conversation_and_messages'
  | 'exec_manual_logout'
  | 'open_media_library'
  | 'copy_my_id'
  | 'exec_modify_my_name'
  | 'on_initialized'
  | 'start_create_new_group'
  | 'send_voice_message'
  | 'send_image_message'
  | 'press_message_bubble'
  | 'update_message_state'
  | 'on_send_before'
  | 'on_send_result'
  | 'on_message_progress'
  | 'create_conversation'
  | 'update_conversation_read_state'
  | 'preview_image'
  | 'request_history_message'
  | 'update_all_count'
  | 'exec_destroy_group'
  | 'exec_forward_notify_message'
  | 'update_request_notification_flag'
  | 'on_logined'
  | 'create_group_result';

////////////////////////////////////////////////////////////////////////////////
//// ActionEventType ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type ActionEventType =
  | AlertActionEventType
  | ToastActionEventType
  | SheetActionEventType
  | PromptActionEventType
  | MenuActionEventType
  | StateActionEventType
  | DataActionEventType;
