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

export type SheetActionEventType = UikitSheetActionEventType | 'sheet_';

////////////////////////////////////////////////////////////////////////////////
//// PromptActionEventType /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type PromptActionEventType = UikitPromptActionEventType | 'prompt_';

////////////////////////////////////////////////////////////////////////////////
//// AlertActionEventType //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type AlertActionEventType = UikitAlertActionEventType | 'alert_';

////////////////////////////////////////////////////////////////////////////////
//// MenuActionEventType ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type MenuActionEventType = UikitMenuActionEventType | 'menu_';

////////////////////////////////////////////////////////////////////////////////
//// StateActionEventType //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type StateActionEventType = UikitStateActionEventType | 'state_';

////////////////////////////////////////////////////////////////////////////////
//// StateActionEventType //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type DataActionEventType =
  | UikitDataActionEventType
  | 'data_'
  | 'on_initialized'
  | 'on_logined';

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
