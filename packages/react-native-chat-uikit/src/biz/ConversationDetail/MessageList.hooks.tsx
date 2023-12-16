import * as React from 'react';
import {
  ChatMessage,
  ChatMessageChatType,
  ChatMessageType,
  ChatVoiceMessageBody,
} from 'react-native-chat-sdk';

import { ChatServiceListener, useChatListener } from '../../chat';
import { Services } from '../../services';
import type { AlertRef } from '../../ui/Alert';
import { getCurTs, localUrlEscape, playUrl, timeoutTask } from '../../utils';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useFlatList } from '../List';
import type { UseFlatListReturn } from '../types';
import type {
  MessageAddPosition,
  MessageListItemProps,
  MessageListProps,
  MessageListRef,
  MessageModel,
  SendFileProps,
  SendImageProps,
  SendSystemProps,
  SendTextProps,
  SendTimeProps,
  SendVideoProps,
  SendVoiceProps,
  SystemMessageModel,
  TimeMessageModel,
} from './types';

export function useMessageList(
  props: MessageListProps,
  ref?: React.ForwardedRef<MessageListRef>
): UseFlatListReturn<MessageListItemProps> & {
  onRequestModalClose: () => void;
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
  onClickedItem: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
} {
  const { convId, convType, testMode } = props;
  const flatListProps = useFlatList<MessageListItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'loading',
    onInit: () => init(),
  });
  const {
    data,
    dataRef,
    setData,
    isAutoLoad,
    listState,
    listType,
    ref: listRef,
  } = flatListProps;

  const isNeedScrollToEndRef = React.useRef(false);
  const currentVoicePlayingRef = React.useRef<MessageModel | undefined>();

  const init = async () => {
    if (testMode === 'only-ui') {
      dataRef.current = [
        {
          id: '1',
          model: {
            userId: 'xxx',
            modelType: 'message',
            layoutType: 'right',
            msg: ChatMessage.createTextMessage('xxx', 'you are welcome.', 0),
          },
        } as MessageListItemProps,
        {
          id: '2',
          model: {
            userId: 'xxx',
            modelType: 'system',
            contents: [
              'this is a system message.this is a system message.this is a system message.this is a system message.',
            ],
          },
        } as MessageListItemProps,
        {
          id: '3',
          model: {
            userId: 'xxx',
            modelType: 'time',
            timestamp: getCurTs(),
          },
        } as MessageListItemProps,
        {
          id: '4',
          model: {
            userId: 'xxx',
            modelType: 'message',
            layoutType: 'left',
            msg: ChatMessage.createCmdMessage('xxx', 'test', 0),
          },
        } as MessageListItemProps,
        {
          id: '5',
          model: {
            userId: 'xxx',
            modelType: 'message',
            layoutType: 'left',
            msg: ChatMessage.createVoiceMessage('xxx', 'sdf', 0, {
              duration: 16000,
            }),
            isVoicePlaying: false,
          },
        } as MessageListItemProps,
        {
          id: '6',
          model: {
            userId: 'xxx',
            modelType: 'message',
            layoutType: 'right',
            msg: ChatMessage.createVoiceMessage('xxx', 'sdf', 0, {
              duration: 1000,
            }),
            isVoicePlaying: false,
          },
        } as MessageListItemProps,
      ];
      setData(dataRef.current);
      return;
    }
    if (isAutoLoad === true) {
    }
  };

  const menuRef = React.useRef<BottomSheetNameMenuRef>(null);
  const onRequestModalClose = () => {
    menuRef.current?.startHide?.();
  };
  const alertRef = React.useRef<AlertRef>(null);

  const listenerRef = React.useRef<ChatServiceListener>({
    onMessagesReceived: () => {},
    onMessagesRecalled: async () => {},
    onMessageContentChanged: () => {
      // todo:
    },
  });
  useChatListener(listenerRef.current);

  const updateMessageVoiceUIState = React.useCallback(
    (model: MessageModel) => {
      const msgId = model.msg.msgId;
      // const msgs = dataRef.current
      //   .filter((d) => d.model.modelType === 'message')
      //   .filter((d) => {
      //     return (
      //       (d.model as MessageModel).msg.body.type === ChatMessageType.VOICE
      //     );
      //   });
      // msgs.forEach((d) => {
      //   const msgModel = d.model as MessageModel;
      //   if (msgId === msgModel.msg.msgId) {
      //     msgModel.isVoicePlaying = !msgModel.isVoicePlaying;
      //   } else {
      //     msgModel.isVoicePlaying = false;
      //   }
      // });
      dataRef.current.map((d) => {
        if (d.model.modelType === 'message') {
          const msgModel = d.model as MessageModel;
          if (msgModel.msg.body.type === ChatMessageType.VOICE) {
            if (msgModel.msg.msgId === msgId) {
              msgModel.isVoicePlaying = !msgModel.isVoicePlaying;
            } else {
              msgModel.isVoicePlaying = false;
            }
            d.model = { ...msgModel };
          }
        }
      });
      console.log(dataRef.current);
      setData([...dataRef.current]);
    },
    [dataRef, setData]
  );

  const startVoicePlay = React.useCallback(
    async (msgModel: MessageModel) => {
      const isSame =
        msgModel.msg.msgId === currentVoicePlayingRef.current?.msg.msgId;
      if (currentVoicePlayingRef.current) {
        const tmp = currentVoicePlayingRef.current;
        try {
          await Services.ms.stopAudio();
          tmp.isVoicePlaying = true;
          currentVoicePlayingRef.current = undefined;
          updateMessageVoiceUIState(tmp);
        } catch (error) {
          tmp.isVoicePlaying = true;
          currentVoicePlayingRef.current = undefined;
          updateMessageVoiceUIState(tmp);
        }
      }

      if (isSame === true) {
        return;
      }

      currentVoicePlayingRef.current = msgModel;
      const tmp = currentVoicePlayingRef.current;
      updateMessageVoiceUIState(msgModel);
      const localPath = (msgModel.msg.body as ChatVoiceMessageBody).localPath;
      try {
        const isExisted = await Services.dcs.isExistedFile(localPath);
        if (isExisted !== true) {
          currentVoicePlayingRef.current = undefined;
          updateMessageVoiceUIState(msgModel);
          return;
        }
        await Services.ms.playAudio({
          url: localUrlEscape(playUrl(localPath)),
          onPlay({ currentPosition, duration }) {
            if (currentPosition === duration) {
              tmp.isVoicePlaying = true;
              currentVoicePlayingRef.current = undefined;
              updateMessageVoiceUIState(msgModel);
            }
          },
        });
      } catch (error) {
        tmp.isVoicePlaying = true;
        currentVoicePlayingRef.current = undefined;
        updateMessageVoiceUIState(msgModel);
      }
    },
    [updateMessageVoiceUIState]
  );

  const onClickedItem = React.useCallback(
    (
      _id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      if (model.modelType === 'message') {
        const msgModel = model as MessageModel;
        if (msgModel.msg.body.type === 'voice') {
          startVoicePlay(msgModel);
        }
      }
    },
    [startVoicePlay]
  );

  const getStyle = () => {
    return undefined;
  };

  const onScrollToEnd = React.useCallback(() => {
    if (isNeedScrollToEndRef.current === true) {
      timeoutTask(0, () => {
        listRef?.current?.scrollToEnd?.();
      });
    }
  }, [listRef]);

  const onAddData = React.useCallback(
    (d: MessageListItemProps, pos: MessageAddPosition) => {
      if (pos === 'bottom') {
        dataRef.current = [...dataRef.current, d];
      } else {
        dataRef.current = [d, ...dataRef.current];
      }

      setData(dataRef.current);
    },
    [dataRef, setData]
  );

  React.useImperativeHandle(
    ref,
    () => {
      return {
        addSendMessage: (
          value:
            | SendFileProps
            | SendImageProps
            | SendTextProps
            | SendVideoProps
            | SendVoiceProps
            | SendTimeProps
            | SendSystemProps
        ) => {
          if (value.type === 'text') {
            const v = value as SendTextProps;
            const msg = ChatMessage.createTextMessage(
              convId,
              v.content,
              convType as number as ChatMessageChatType
            );
            onAddData(
              {
                id: msg.msgId.toString(),
                model: {
                  userId: msg.from,
                  modelType: 'message',
                  layoutType: 'right',
                  msg: msg,
                },
                containerStyle: getStyle(),
              },
              'bottom'
            );
          } else if (value.type === 'image') {
            const v = value as SendImageProps;
            const msg = ChatMessage.createImageMessage(
              convId,
              v.localPath,
              convType as number as ChatMessageChatType,
              {
                width: v.imageWidth,
                height: v.imageHeight,
                fileSize: v.fileSize,
                displayName: v.displayName ?? '',
              }
            );
            console.log('test:zuoyu:image:', msg);
            onAddData(
              {
                id: msg.msgId.toString(),
                model: {
                  userId: msg.from,
                  modelType: 'message',
                  layoutType: 'right',
                  msg: msg,
                },
                containerStyle: getStyle(),
              },
              'bottom'
            );
          } else if (value.type === 'voice') {
            const v = value as SendVoiceProps;
            const msg = ChatMessage.createVoiceMessage(
              convId,
              v.localPath,
              convType as number as ChatMessageChatType,
              {
                duration: v.duration,
                fileSize: v.fileSize,
                displayName: v.displayName ?? '',
              }
            );
            console.log('test:zuoyu:voice:', msg);
            onAddData(
              {
                id: msg.msgId.toString(),
                model: {
                  userId: msg.from,
                  modelType: 'message',
                  layoutType: 'right',
                  msg: msg,
                },
                containerStyle: getStyle(),
              },
              'bottom'
            );
          }
          isNeedScrollToEndRef.current = true;
          onScrollToEnd();
        },
        removeMessage: (_msg: ChatMessage) => {},
        recallMessage: (_msg: ChatMessage) => {},
        updateMessage: (_updatedMsg: ChatMessage) => {},
        loadHistoryMessage: (
          _msgs: ChatMessage[],
          _pos: MessageAddPosition
        ) => {},
        onInputHeightChange: (height: number) => {
          if (height > 0) {
            listRef?.current?.scrollToEnd?.();
          }
        },
      };
    },
    [convId, convType, listRef, onAddData, onScrollToEnd]
  );

  return {
    ...flatListProps,
    listType,
    listState,
    data,
    onRequestModalClose,
    menuRef,
    alertRef,
    onClickedItem,
  };
}
