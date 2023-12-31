import type {
  StyleProp,
  TextInput as RNTextInput,
  ViewStyle,
} from 'react-native';
import type { ChatConversationType, ChatMessage } from 'react-native-chat-sdk';

import type { IconNameType } from '../../assets';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import type {
  BottomSheetMessageReportRef,
  ReportItemModel,
} from '../MessageReport';
import type { TopNavigationBarElementType } from '../TopNavigationBar';
import type {
  PropsWithBack,
  PropsWithError,
  PropsWithInit,
  PropsWithSearch,
  PropsWithTest,
} from '../types';
import type { BottomVoiceBarRef, VoiceBarState } from '../VoiceBar';
import type { MessageInputEditMessageRef } from './MessageInputEditMessage';

export type MessageInputRef = {
  close: () => void;
  quoteMessage: (model: MessageModel) => void;
  editMessage: (model: MessageModel) => void;
  mentionSelected: (list: { id: string; name: string }[]) => void;
};
export type MessageInputProps = PropsWithError &
  PropsWithTest & {
    convId: string;
    convType: ChatConversationType;
    top?: number | undefined;
    bottom?: number | undefined;
    numberOfLines?: number | undefined;
    onClickedSend?: (
      value:
        | SendTextProps
        | SendFileProps
        | SendImageProps
        | SendVideoProps
        | SendVoiceProps
        | SendCardProps
    ) => void;
    closeAfterSend?: boolean;
    onHeightChange?: (height: number) => void;
    onEditMessageFinished?: (model: MessageModel) => void;
    /**
     * Only groups are available.
     */
    onInputMention?: (groupId: string) => void;
    onClickedCardMenu?: () => void;
  };
export type MessageInputState = 'normal' | 'emoji' | 'voice' | 'keyboard';

export type ConversationDetailProps = PropsWithError &
  PropsWithTest &
  PropsWithInit &
  PropsWithBack &
  PropsWithSearch & {
    convId: string;
    convType: ChatConversationType;
    convName?: string;
    input?: {
      props?: Omit<MessageInputProps, 'convId' | 'convType'> & {
        convId?: string;
        convType?: ChatConversationType;
      };
      render?: React.ForwardRefExoticComponent<
        MessageInputProps & React.RefAttributes<MessageInputRef>
      >;
      ref?: React.RefObject<MessageInputRef>;
    };
    list?: {
      props?: Omit<MessageListProps, 'convId' | 'convType'> & {
        convId?: string;
        convType?: ChatConversationType;
      };
      render?: React.ForwardRefExoticComponent<
        MessageListProps & React.RefAttributes<MessageListRef>
      >;
      ref?: React.RefObject<MessageListRef>;
    };
    containerStyle?: StyleProp<ViewStyle>;
    onClickedAvatar?: (params: {
      convId: string;
      convType: ChatConversationType;
      ownerId?: string;
    }) => void;
    ConversationDetailNavigationBar?: TopNavigationBarElementType<any, any>;
    enableNavigationBar?: boolean;
  };

export type SendType =
  | 'text'
  | 'file'
  | 'image'
  | 'voice'
  | 'video'
  | 'time'
  | 'system'
  | 'card';
export type SendBasicProps = {
  type: SendType;
  quote?: MessageModel;
};
export type SendTextProps = SendBasicProps & {
  content: string;
};
export type SendFileProps = SendBasicProps & {
  localPath: string;
  fileSize?: number;
  displayName?: string;
  fileExtension?: string;
};
export type SendImageProps = SendBasicProps &
  SendFileProps & {
    imageWidth: number;
    imageHeight: number;
  };
export type SendVoiceProps = SendBasicProps &
  SendFileProps & {
    duration: number;
  };
export type SendVideoProps = SendBasicProps &
  SendFileProps & {
    thumbLocalPath: string;
    videoWidth: number;
    videoHeight: number;
    duration?: number;
  };
export type SendTimeProps = SendBasicProps & {
  timestamp: number;
};

export type SendSystemProps = SendBasicProps & {
  msg: ChatMessage;
};

export type SendCardProps = SendBasicProps & {
  userId: string;
  userName?: string;
  userAvatar?: string;
};

export type MessageBubbleType = 'system' | 'time' | 'message';
export type MessageLayoutType = 'left' | 'right';
export type MessageRecvStateType = 'no-play' | 'loading-attachment';
export type MessageSendStateType =
  | 'sending'
  | 'send-success'
  | 'send-fail'
  | 'send-to-peer'
  | 'peer-read';
export type MessageStateType =
  | MessageRecvStateType
  | MessageSendStateType
  | 'none';
export type MessageEditableStateType = 'no-editable' | 'editable' | 'edited';

type BasicModel = {
  modelType: MessageBubbleType;
  layoutType: MessageLayoutType;
  userId: string;
  userName?: string;
  userAvatar?: string;
};
type VoiceModel = {
  isVoicePlaying?: boolean;
};
export type SystemMessageModel = BasicModel & {
  msg: ChatMessage;
};
export type TimeMessageModel = BasicModel & {
  timestamp: number;
};
export type MessageModel = BasicModel &
  VoiceModel & {
    msg: ChatMessage;
    quoteMsg?: ChatMessage;
  };

export type MessageListItemActionsProps = {
  onClicked?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  onLongPress?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  onAvatarClicked?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  onQuoteClicked?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  onStateClicked?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
};
export type MessageListItemProps = MessageListItemActionsProps & {
  /**
   * @description: message id. If it is a message, use the message msgId, otherwise use the millisecond message timestamp.
   */
  id: string;
  model: SystemMessageModel | TimeMessageModel | MessageModel;
  containerStyle?: StyleProp<ViewStyle>;
};
export type MessageAddPosition = 'top' | 'bottom';
export type MessageListRef = {
  addSendMessage: (
    value:
      | SendFileProps
      | SendImageProps
      | SendTextProps
      | SendVideoProps
      | SendVoiceProps
      | SendTimeProps
      | SendSystemProps
      | SendCardProps
  ) => void; // todo:
  removeMessage: (msg: ChatMessage) => void;
  recallMessage: (msg: ChatMessage) => void;
  updateMessage: (updatedMsg: ChatMessage, fromType: 'send' | 'recv') => void;
  loadHistoryMessage: (msgs: ChatMessage[], pos: MessageAddPosition) => void;
  onInputHeightChange: (height: number) => void;
  editMessageFinished: (model: MessageModel) => void;
};
export type MessageListProps = PropsWithError &
  PropsWithTest & {
    convId: string;
    convType: ChatConversationType;
    onClicked?: () => void;
    onClickedItem?: (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => void;
    onLongPressItem?: (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => void;
    onClickedItemAvatar?: (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => void;
    onClickedItemQuote?: (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => void;
    onQuoteMessageForInput?: (model: MessageModel) => void;
    onEditMessageForInput?: (model: MessageModel) => void;
    containerStyle?: StyleProp<ViewStyle>;
    reportMessageCustomList?: { key: string; value: string }[];
  };
export type UseMessageListReturn = {
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
  onRequestModalClose: () => void;
  onClickedItem: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  onLongPressItem?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  onClickedItemAvatar?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  onClickedItemQuote?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  onClickedItemState?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  inverted: boolean;
  maxListHeight: number;
  setMaxListHeight: React.Dispatch<React.SetStateAction<number>>;
  reachedThreshold: number;
  onShowReportMessage: (model: MessageModel) => void;
  onReportMessage: (result?: ReportItemModel) => void;
  reportData: ReportItemModel[];
  reportRef: React.RefObject<BottomSheetMessageReportRef>;
};
export type UseMessageInputReturn = {
  inputRef: React.MutableRefObject<RNTextInput>;
  voiceBarRef: React.MutableRefObject<BottomVoiceBarRef>;
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  editRef: React.MutableRefObject<MessageInputEditMessageRef>;
  value: string;
  emojiHeight: number;
  emojiIconName: IconNameType;
  inputBarState: MessageInputState;
  sendIconName: IconNameType;
  showQuote: boolean;
  quoteMsg?: ChatMessage | undefined;
  setValue: (
    text: string,
    op?: 'add_face' | 'del_face' | 'del_c',
    face?: string
  ) => void;
  onClickedFaceListItem: (face: string) => void;
  onClickedDelButton: () => void;
  onClickedClearButton: () => void;
  onClickedEmojiButton: () => void;
  onClickedVoiceButton: () => void;
  onCloseVoiceBar: () => void;
  onVoiceStateChange: (state: VoiceBarState) => void;
  changeInputBarState: (nextState: MessageInputState) => void;
  onSelectSendVoice: (props: SendVoiceProps) => void;
  onFocus: () => void;
  onBlur: () => void;
  onRequestModalCloseMenu: () => void;
  onClickedSend: () => void;
  onVoiceFailed: (error: { reason: string; error: any }) => void;
  onHideQuoteMessage: () => void;
  onRequestModalCloseEdit: () => void;
  onEditMessageFinished: (msgId: string, text: string) => void;
  onClickedEmojiSend: () => void;
};
