import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';
import {
  type AudioSet,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
} from 'react-native-audio-recorder-player';
import { ChatMessage, ChatMessageType } from 'react-native-chat-sdk';
import {
  DataEventType,
  getFileExtension,
  localUrl,
  playUrl,
  ScreenContainer,
  Services,
  uuid,
} from 'react-native-chat-uikit';

import { CustomMessageRenderItem } from '../components/CustomMessageBubble';
import type { BizEventType, DataActionEventType } from '../events';
import { sendEvent, sendEventProps } from '../events/sendEvent';
import ChatFragment, { ChatFragmentRef } from '../fragments/Chat';
import type {
  ImageMessageItemType,
  MessageBubbleListProps,
  MessageItemType,
  VoiceMessageItemType,
} from '../fragments/MessageBubbleList';
import MessageBubbleList from '../fragments/MessageBubbleList';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

// type NavigationProp = NativeStackNavigationProp<
//   RootScreenParamsList<RootParamsList, 'option'>,
//   'Chat',
//   undefined
// >;

const sendEventFromChat = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp' | 'eventBizType'>
) => {
  sendEvent({
    ...params,
    senderId: 'Chat',
    eventBizType: 'chat',
  } as sendEventProps);
};

export default function ChatScreen({ route, navigation }: Props): JSX.Element {
  console.log('test:ChatScreen:');
  const rp = route.params as any;
  const params = rp?.params as { chatId: string; chatType: number };
  const chatId = params.chatId;
  const messageBubbleListRefP = React.useRef<typeof MessageBubbleList>(null);
  const chatRef = React.useRef<ChatFragmentRef>({} as any);
  console.log('test:ChatScreen:123');

  const onClickMessageBubble = React.useCallback(
    (data: MessageItemType) => {
      const eventParams = data;
      if (eventParams.type === ChatMessageType.VOICE) {
        const voice = eventParams as VoiceMessageItemType;
        if (voice.localPath) {
          Services.ms
            .playAudio({
              url: playUrl(voice.localPath),
              onPlay({ isMuted, currentPosition, duration }) {
                console.log('test:onPlay', isMuted, currentPosition, duration);
              },
            })
            .then(() => {
              console.log('test:playAudio:finish:');
            })
            .catch((error) => {
              console.warn('test:error:', error);
            });
        }
      } else if (eventParams.type === ChatMessageType.IMAGE) {
        const imageData = data as ImageMessageItemType;
        const url = imageData.remoteUrl;
        const localPath = imageData.localPath;
        navigation.push('ImagePreview', {
          params: { url: url ?? '', localPath: localPath ?? '' },
        });
      }
    },
    [navigation]
  );

  const onClickInputMoreButton = React.useCallback(() => {
    console.log('test:234:');
    sendEventFromChat({
      eventType: 'SheetEvent',
      action: 'open_input_extension',
      params: {},
    });
  }, []);

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: chatId,
    });
  }, [chatId, navigation]);

  const addListeners = React.useCallback(() => {
    const sub = DeviceEventEmitter.addListener(
      'DataEvent' as DataEventType,
      (event) => {
        const { action } = event as {
          eventBizType: BizEventType;
          action: DataActionEventType;
          senderId: string;
          params: any;
          timestamp?: number;
        };
        switch (action) {
          case 'chat_open_camera':
            Services.ms
              .openCamera({})
              .then(() => {})
              .catch((error) => {
                console.warn('error:', error);
              });
            break;
          case 'chat_open_document':
            Services.ms
              .openDocument({})
              .then(() => {})
              .catch((error) => {
                console.warn('error:', error);
              });
            break;
          case 'chat_open_media_library':
            Services.ms
              .openMediaLibrary({ selectionLimit: 1 })
              .then((result) => {
                chatRef.current?.sendImageMessage(result as any);
              })
              .catch((error) => {
                console.warn('error:', error);
              });
            break;

          default:
            break;
        }
      }
    );
    return () => {
      sub.remove();
    };
  }, []);

  const onPressInInputVoiceButton = React.useCallback(() => {
    sendEventFromChat({
      eventType: 'VoiceStateEvent',
      action: 'enable_voice',
      params: {},
    });
    // !!! The simulator will crash.
    Services.ms
      .startRecordAudio({
        audio: {
          AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
          AudioSourceAndroid: AudioSourceAndroidType.MIC,
          AVModeIOS: AVModeIOSOption.measurement,
          AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
          AVNumberOfChannelsKeyIOS: 2,
          AVFormatIDKeyIOS: AVEncodingOption.aac,
        } as AudioSet,
        onPosition: (pos) => {
          console.log('test:startRecordAudio:pos:', pos);
        },
        onFailed: (error) => {
          console.warn('test:startRecordAudio:onFailed:', error);
        },
        onFinished: ({ result, path, error }) => {
          console.log('test:startRecordAudio:onFinished:', result, path, error);
        },
      })
      .then((result) => {
        console.log('test:startRecordAudio:result:', result);
      })
      .catch((error) => {
        console.warn('test:startRecordAudio:error:', error);
      });
  }, []);
  const onVoiceRecordEnd = React.useCallback((params: any) => {
    chatRef.current.sendVoiceMessage(params);
  }, []);
  const onPressOutInputVoiceButton = React.useCallback(() => {
    sendEventFromChat({
      eventType: 'VoiceStateEvent',
      action: 'disable_voice',
      params: {},
    });
    let localPath = localUrl(Services.dcs.getFileDir(chatId, uuid()));
    Services.ms
      .stopRecordAudio()
      .then((result?: { pos: number; path: string }) => {
        if (result?.path) {
          const extension = getFileExtension(result.path);
          console.log('test:extension:', extension);
          localPath = localPath + extension;
          Services.ms
            .saveFromLocal({
              targetPath: localPath,
              localPath: result.path,
            })
            .then(() => {
              onVoiceRecordEnd?.({
                localPath,
                duration: result.pos / 1000,
              });
            })
            .catch((error) => {
              console.warn('test:startRecordAudio:save:error', error);
            });
        }
      })
      .catch((error) => {
        console.warn('test:stopRecordAudio:error:', error);
      });
  }, [chatId, onVoiceRecordEnd]);
  const onLongPressMessageBubble = React.useCallback((data) => {
    sendEventFromChat({
      eventType: 'ActionMenuEvent',
      action: 'long_press_message_bubble',
      params: data,
    });
  }, []);
  const onSendMessage = React.useCallback((message: ChatMessage) => {
    sendEventFromChat({
      eventType: 'DataEvent',
      action: 'on_send_before',
      params: { message },
    });
  }, []);
  const onSendMessageEnd = React.useCallback((message: ChatMessage) => {
    sendEventFromChat({
      eventType: 'DataEvent',
      action: 'on_send_result',
      params: { message },
    });
  }, []);
  const onUpdateReadCount = React.useCallback((unreadCount: number) => {
    sendEvent({
      eventType: 'DataEvent',
      action: 'update_all_count',
      params: { count: unreadCount },
      eventBizType: 'conversation',
      senderId: 'Chat',
    });
  }, []);

  const init = React.useCallback(() => {}, []);

  React.useEffect(() => {
    const load = () => {
      console.log('test:load:', ChatScreen.name);
      const unsubscribe = addListeners();
      init();
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', ChatScreen.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners, init]);

  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        propsRef={chatRef}
        screenParams={route.params as any}
        messageBubbleList={{
          MessageBubbleListP: MessageBubbleList,
          MessageBubbleListPropsP: {
            onPressed: () => {},
          } as MessageBubbleListProps,
          MessageBubbleListRefP: messageBubbleListRefP as any,
        }}
        customMessageBubble={{
          CustomMessageRenderItemP: CustomMessageRenderItem,
        }}
        onUpdateReadCount={onUpdateReadCount}
        onClickMessageBubble={onClickMessageBubble}
        onClickInputMoreButton={onClickInputMoreButton}
        onPressInInputVoiceButton={onPressInInputVoiceButton}
        onPressOutInputVoiceButton={onPressOutInputVoiceButton}
        onLongPressMessageBubble={onLongPressMessageBubble}
        onSendMessage={onSendMessage}
        onSendMessageEnd={onSendMessageEnd}
        onVoiceRecordEnd={onVoiceRecordEnd}
      />
    </ScreenContainer>
  );
}
