// export type CustomEvents = {
//   closeEditable: {};
//   closeDialog: {};
// };

export const CustomEvents = {
  closeEditable: {
    key: 'closeEditable',
    params: undefined,
  },
  closeDialog: {
    key: 'closeDialog',
    params: undefined,
  },
};

export * from './ConnectStateEventDispatch';
export * from './ContactEventDispatch';
export * from './ConversationEventDispatch';
export * from './MessageEventDispatch';
export * from './MultiDevicesEventDispatch';
