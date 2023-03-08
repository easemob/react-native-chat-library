import * as React from 'react';
import {
  Animated,
  // Button as RNButton,
  DeviceEventEmitter,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  TouchableOpacity,
  // TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  type AudioSet,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
} from 'react-native-audio-recorder-player';
import {
  ChatConversationType,
  ChatCustomMessageBody,
  ChatError,
  ChatImageMessageBody,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageDirection,
  ChatMessageStatus,
  ChatMessageStatusCallback,
  ChatMessageType,
  ChatSearchDirection,
  ChatTextMessageBody,
  ChatVoiceMessageBody,
} from 'react-native-chat-sdk';
import {
  type LocalIconName,
  type MessageChatSdkEventType,
  Button,
  createStyleSheet,
  DataEventType,
  FaceList as ChatFaceList,
  getFileExtension,
  getScaleFactor,
  LocalIcon,
  localUrl,
  MessageChatSdkEvent,
  playUrl,
  removeFileHeader,
  seqId,
  Services,
  TextInput,
  timeoutTask,
  timestamp,
  useI18nContext,
  uuid,
} from 'react-native-chat-uikit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moji from 'twemoji';

import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import type { BizEventType, DataActionEventType } from '../events';
import { sendEvent, sendEventProps } from '../events/sendEvent';
import MessageBubbleList, {
  type CustomMessageItemType,
  type ImageMessageItemType,
  type MessageBubbleListProps,
  type MessageBubbleListRef,
  type MessageItemStateType,
  type MessageItemType,
  type TextMessageItemType,
  type VoiceMessageItemType,
} from './MessageBubbleList';

type BaseProps = {
  chatId: string;
  chatType: ChatMessageChatType;
  onFace?: (value?: 'face' | 'key') => void;
  inputRef?: React.RefObject<RNTextInput>;
};

type ChatInputProps = BaseProps & {
  onSendTextMessage?: ({ content }: { content: string }) => void;
  onInit?: ({
    setIsInput,
    exeTest,
    getContent,
    setContent,
  }: {
    setIsInput: React.Dispatch<React.SetStateAction<boolean>>;
    exeTest: () => void;
    getContent: () => string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
  }) => void;
};

type ChatContentProps = BaseProps & {
  messageBubbleList?: {
    MessageBubbleListP: React.ForwardRefExoticComponent<
      MessageBubbleListProps & React.RefAttributes<MessageBubbleListRef>
    >;
    MessageBubbleListPropsP: MessageBubbleListProps;
    MessageBubbleListRefP: React.RefObject<MessageBubbleListRef>;
  };
  customMessageBubble?: {
    CustomMessageRenderItemP: React.FunctionComponent<
      MessageItemType & { eventType: string; data: any }
    >;
  };
  onUpdateReadCount?: (unreadCount: number) => void;
  onItemPress?: (data: MessageItemType) => void;
  onItemLongPress?: (data: MessageItemType) => void;
};

const sendEventFromChat = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp' | 'eventBizType'>
) => {
  sendEvent({
    ...params,
    senderId: 'Chat',
    eventBizType: 'chat',
  } as sendEventProps);
};

const ChatInput = React.memo((props: ChatInputProps) => {
  const { onFace, onSendTextMessage, onInit, inputRef, chatId, ...others } =
    props;
  const sf = getScaleFactor();
  const { chat } = useI18nContext();
  // const TextInputRef = React.useRef<RNTextInput>(null);
  const faces = ['face', 'key'] as ('face' | 'key')[];
  const waves = ['wave_in_circle', 'key'] as ('wave_in_circle' | 'key')[];
  const [face, setFace] = React.useState(faces[0]);
  const [wave, setWave] = React.useState(waves[0]);
  const [content, setContent] = React.useState('');
  // const content = React.useRef('');
  const [isInput, setIsInput] = React.useState(false);
  const { width } = useWindowDimensions();
  if (others === undefined) console.log('test:', others);

  const onContent = (text: string) => {
    setContent(text);
  };

  const calculateInputWidth = React.useCallback(
    (width: number, isInput: boolean) => {
      return sf(width - 15 * 2 - 28 - 12 * 2 - 18 - 14 - (isInput ? 66 : 28));
    },
    [sf]
  );

  const _onFace = (value?: 'face' | 'key') => {
    setFace(value);
    onFace?.(value);
  };

  React.useEffect(() => {
    onInit?.({
      setIsInput,
      exeTest: () => {},
      getContent: () => {
        return content;
      },
      setContent,
    }); // Give the setting permission to the other party.
    return () => {};
  }, [content, onInit]);

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity
        style={{ justifyContent: 'center' }}
        onPress={() => {
          setWave(wave === 'wave_in_circle' ? waves[1] : waves[0]);
          Keyboard.dismiss();
          _onFace('face');
        }}
      >
        <LocalIcon name={wave as LocalIconName} color="#A5A7A6" size={28} />
      </TouchableOpacity>

      {wave === 'wave_in_circle' ? (
        <React.Fragment>
          <View style={styles.inputContainer2}>
            <View style={styles.inputContainer3}>
              <TextInput
                ref={inputRef}
                style={{
                  flexGrow: 1,
                  backgroundColor: 'white',
                  paddingLeft: sf(12),
                  width: calculateInputWidth(width, isInput),
                }}
                onChangeText={(text) => {
                  onContent(text);
                }}
                value={content}
                returnKeyType="send"
                onKeyPress={(_) => {}}
                onSubmitEditing={(event) => {
                  const c = event.nativeEvent.text;
                  event.preventDefault();
                  onSendTextMessage?.({ content: c });
                }}
                onFocus={() => {
                  _onFace('face');
                }}
              />

              <TouchableOpacity
                style={{ justifyContent: 'center' }}
                onPress={() => {
                  _onFace(face === 'face' ? faces[1] : faces[0]);
                  Keyboard.dismiss();
                }}
              >
                <LocalIcon
                  name={face as 'face' | 'key'}
                  color="#A5A7A6"
                  size={sf(28)}
                />
              </TouchableOpacity>

              <View style={{ width: sf(4) }} />
            </View>
          </View>

          {isInput ? (
            <View style={{ justifyContent: 'center' }}>
              <Button
                style={{
                  height: sf(36),
                  width: sf(66),
                  borderRadius: sf(18),
                }}
                onPress={() => {
                  onSendTextMessage?.({ content });
                }}
              >
                Send
              </Button>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                sendEventFromChat({
                  eventType: 'SheetEvent',
                  action: 'open_input_extension',
                  params: {},
                });
              }}
            >
              <LocalIcon name="plus_in_circle" color="#A5A7A6" size={sf(28)} />
            </TouchableOpacity>
          )}
        </React.Fragment>
      ) : (
        <View style={{ flexDirection: 'row' }}>
          <Button
            color={{
              enabled: {
                content: 'black',
                background: 'rgba(242, 242, 242, 1)',
              },
              pressed: {
                content: 'black',
                background: '#E6E6E6',
              },
            }}
            style={[styles.talk, { width: sf(width - 24 - 28 - 20) }]}
            onPressIn={() => {
              sendEventFromChat({
                eventType: 'VoiceStateEvent',
                action: 'enable_voice',
                params: {},
              });
              Services.ms
                .startRecordAudio({
                  audio: {
                    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
                    AudioSourceAndroid: AudioSourceAndroidType.MIC,
                    AVModeIOS: AVModeIOSOption.measurement,
                    AVEncoderAudioQualityKeyIOS:
                      AVEncoderAudioQualityIOSType.high,
                    AVNumberOfChannelsKeyIOS: 2,
                    AVFormatIDKeyIOS: AVEncodingOption.aac,
                  } as AudioSet,
                  // url: localPath,
                  onPosition: (pos) => {
                    console.log('test:startRecordAudio:pos:', pos);
                  },
                  onFailed: (error) => {
                    console.warn('test:startRecordAudio:onFailed:', error);
                  },
                  onFinished: ({ result, path, error }) => {
                    console.log(
                      'test:startRecordAudio:onFinished:',
                      result,
                      path,
                      error
                    );
                  },
                })
                .then((result) => {
                  console.log('test:startRecordAudio:result:', result);
                })
                .catch((error) => {
                  console.warn('test:startRecordAudio:error:', error);
                });
            }}
            onPressOut={() => {
              let localPath = localUrl(Services.dcs.getFileDir(chatId, uuid()));
              sendEventFromChat({
                eventType: 'VoiceStateEvent',
                action: 'disable_voice',
                params: {},
              });
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
                        sendEventFromChat({
                          eventType: 'DataEvent',
                          action: 'send_voice_message',
                          params: { localPath, duration: result.pos / 1000 },
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
            }}
          >
            {chat.voiceButton}
          </Button>
        </View>
      )}
    </View>
  );
});

const ChatContent = React.memo(
  ({
    chatId,
    chatType,
    messageBubbleList,
    onFace,
    inputRef,
    customMessageBubble,
    onUpdateReadCount,
    onItemPress,
    onItemLongPress,
  }: ChatContentProps) => {
    const sf = getScaleFactor();
    const TextInputRef = React.useRef<RNTextInput>(null);
    const msgListRef = React.useRef<MessageBubbleListRef>(null);
    const [, setContent] = React.useState('');
    const getContentRef = React.useRef<() => string>(() => '');
    const setContentRef = React.useRef(setContent);
    const [, setIsInput] = React.useState(false);
    const setIsInputRef = React.useRef(setIsInput);
    const setTestRef = React.useRef(() => {});
    const faceHeight = sf(300);
    const faceHeightRef = React.useRef(new Animated.Value(0)).current;
    const { client } = useAppChatSdkContext();
    console.log('test:', onItemLongPress);

    const getMsgListRef = React.useCallback(() => {
      if (messageBubbleList) {
        return messageBubbleList.MessageBubbleListRefP;
      } else {
        return msgListRef;
      }
    }, [messageBubbleList]);

    const getInputRef = React.useCallback(() => {
      if (inputRef) {
        return inputRef;
      } else {
        return TextInputRef;
      }
    }, [inputRef]);

    const createFaceTableAnimated = React.useMemo(() => {
      return {
        showFace: () => {
          Animated.timing(faceHeightRef, {
            toValue: faceHeight,
            duration: 250,
            useNativeDriver: false,
          }).start();
        },
        hideFace: () => {
          Animated.timing(faceHeightRef, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
          }).start();
        },
      };
    }, [faceHeight, faceHeightRef]);

    const { showFace, hideFace } = createFaceTableAnimated;

    const convertToMessage = React.useCallback(
      (item: MessageItemType): ChatMessage | undefined => {
        let r;
        switch (item.type) {
          case ChatMessageType.TXT:
            {
              const txt = item as TextMessageItemType;
              r = ChatMessage.createTextMessage(chatId, txt.text, chatType);
            }
            break;
          case ChatMessageType.IMAGE:
            {
              const img = item as ImageMessageItemType;
              r = ChatMessage.createImageMessage(
                chatId,
                img.localPath!,
                chatType,
                {
                  displayName: img.displayName,
                  width: img.width ?? 0,
                  height: img.height ?? 0,
                  fileSize: img.memoSize ?? 0,
                } as any
              );
            }
            break;
          case ChatMessageType.VOICE:
            {
              const voice = item as VoiceMessageItemType;
              r = ChatMessage.createVoiceMessage(
                chatId,
                voice.localPath!,
                chatType,
                {
                  duration: voice.duration,
                  displayName: '',
                }
              );
            }
            break;
          case ChatMessageType.CUSTOM:
            {
              const custom = item as CustomMessageItemType;
              r = ChatMessage.createCustomMessage(
                chatId,
                custom.SubComponentProps.eventType,
                chatType,
                {
                  params: custom.SubComponentProps.data,
                }
              );
            }
            break;
          default:
            break;
        }
        return r;
      },
      [chatId, chatType]
    );

    const standardizedData = React.useCallback(
      (
        item: Omit<MessageItemType, 'onPress' | 'onLongPress'>
      ): MessageItemType => {
        const r = {
          ...item,
          onLongPress: (data: MessageItemType) => {
            sendEventFromChat({
              eventType: 'ActionMenuEvent',
              action: 'long_press_message_bubble',
              params: data,
            });
          },
          onPress: (data: MessageItemType) => {
            sendEventFromChat({
              eventType: 'DataEvent',
              action: 'press_message_bubble',
              params: data,
            });
          },
        } as MessageItemType;
        return r;
      },
      []
    );

    const convertFromMessage = React.useCallback(
      (msg: ChatMessage): MessageItemType => {
        const convertFromMessageState = (msg: ChatMessage) => {
          if (msg.status === ChatMessageStatus.SUCCESS) {
            return 'arrived' as MessageItemStateType;
          } else if (msg.status === ChatMessageStatus.FAIL) {
            return 'failed' as MessageItemStateType;
          } else if (msg.status === ChatMessageStatus.PROGRESS) {
            if (msg.direction === ChatMessageDirection.RECEIVE)
              return 'receiving' as MessageItemStateType;
            else return 'sending' as MessageItemStateType;
          } else {
            return 'failed' as MessageItemStateType;
          }
        };
        const convertFromMessageBody = (
          msg: ChatMessage,
          item: MessageItemType
        ) => {
          const type = msg.body.type;
          switch (type) {
            case ChatMessageType.VOICE:
              {
                const body = msg.body as ChatVoiceMessageBody;
                const r = item as VoiceMessageItemType;
                r.localPath = body.localPath;
                r.remoteUrl = body.remotePath;
                r.duration = body.duration;
                r.type = ChatMessageType.VOICE;
              }
              break;
            case ChatMessageType.IMAGE:
              {
                const body = msg.body as ChatImageMessageBody;
                const r = item as ImageMessageItemType;
                r.localPath = body.localPath;
                r.remoteUrl = body.remotePath;
                r.localThumbPath = body.thumbnailLocalPath;
                r.type = ChatMessageType.IMAGE;
              }
              break;
            case ChatMessageType.TXT:
              {
                const body = msg.body as ChatTextMessageBody;
                const r = item as TextMessageItemType;
                r.text = body.content;
                r.type = ChatMessageType.TXT;
              }
              break;
            case ChatMessageType.CUSTOM:
              {
                const body = msg.body as ChatCustomMessageBody;
                const r = item as CustomMessageItemType;
                r.SubComponentProps = {
                  eventType: body.event,
                  data: body.params,
                  ...item,
                } as MessageItemType & { eventType: string; data: any };
                r.SubComponent = customMessageBubble?.CustomMessageRenderItemP!; // !!! must
                r.type = ChatMessageType.CUSTOM;
              }
              break;
            default:
              throw new Error('This is impossible.');
          }
        };
        const r = {
          sender: msg.from,
          timestamp: msg.serverTime,
          isSender:
            msg.direction === ChatMessageDirection.RECEIVE ? false : true,
          key: msg.localMsgId,
          msgId: msg.msgId,
          state: convertFromMessageState(msg),
        } as MessageItemType;
        convertFromMessageBody(msg, r);
        return standardizedData(r);
      },
      [customMessageBubble?.CustomMessageRenderItemP, standardizedData]
    );

    const downloadAttachment = React.useCallback(
      (msg: ChatMessage) => {
        if (
          msg.body.type === ChatMessageType.IMAGE ||
          msg.body.type === ChatMessageType.VOICE
        ) {
          client.chatManager.downloadAttachment(msg, {
            onProgress: (localMsgId: string, progress: number): void => {
              console.log(
                'test:downloadAttachment:onProgress:',
                localMsgId,
                progress
              );
            },
            onError: (localMsgId: string, error: ChatError): void => {
              console.log(
                'test:downloadAttachment:onError:',
                localMsgId,
                error
              );
            },
            onSuccess: (message: ChatMessage): void => {
              sendEventFromChat({
                eventType: 'DataEvent',
                action: 'update_message_state',
                params: {
                  localMsgId: message.localMsgId,
                  result: true,
                  item: convertFromMessage(message),
                },
              });
            },
          } as ChatMessageStatusCallback);
        }
      },
      [client.chatManager, convertFromMessage]
    );

    const checkAttachment = React.useCallback(
      (msg: ChatMessage) => {
        const isExisted = async (msg: ChatMessage) => {
          if (msg.body.type === ChatMessageType.IMAGE) {
            const body = msg.body as ChatImageMessageBody;
            const thumb = await Services.dcs.isExistedFile(
              body.thumbnailLocalPath
            );
            const org = await Services.dcs.isExistedFile(body.localPath);
            if (thumb === false || org === false) {
              return false;
            } else {
              return true;
            }
          } else if (msg.body.type === ChatMessageType.VOICE) {
            const body = msg.body as ChatVoiceMessageBody;
            const org = await Services.dcs.isExistedFile(body.localPath);
            return org;
          } else {
            return true;
          }
        };
        isExisted(msg)
          .then((result) => {
            if (result === false) {
              downloadAttachment(msg);
            }
          })
          .catch((error) => {
            console.warn('test:checkAttachment:error:', error);
          });
      },
      [downloadAttachment]
    );

    const onSendBefore = React.useCallback((msg: ChatMessage) => {
      sendEventFromChat({
        eventType: 'DataEvent',
        action: 'on_send_before',
        params: { message: msg },
      });
    }, []);
    const onSendResult = React.useCallback((msg: ChatMessage) => {
      sendEventFromChat({
        eventType: 'DataEvent',
        action: 'on_send_result',
        params: { message: msg },
      });
    }, []);

    const sendToServer = React.useCallback(
      (msg: ChatMessage) => {
        onSendBefore(msg);
        client.chatManager
          .sendMessage(msg, {
            onProgress: (localMsgId: string, progress: number): void => {
              console.log('test:sendToServer:onProgress', localMsgId);
              sendEventFromChat({
                eventType: 'DataEvent',
                action: 'on_message_progress',
                params: {
                  localMsgId,
                  progress,
                },
              });
            },
            onError: (localMsgId: string, error: ChatError): void => {
              console.log('test:sendToServer:onError', localMsgId);
              sendEventFromChat({
                eventType: 'DataEvent',
                action: 'update_message_state',
                params: {
                  localMsgId,
                  result: false,
                  reason: error,
                },
              });
              // msg.status = ChatMessageStatus.FAIL; // !!! Error: You attempted to set the key `status` with the value `3` on an object that is meant to be immutable and has been frozen.
              onSendResult({
                ...msg,
                status: ChatMessageStatus.FAIL,
              } as ChatMessage);
            },
            onSuccess: (message: ChatMessage): void => {
              console.log('test:sendToServer:onSuccess', message.localMsgId);
              sendEventFromChat({
                eventType: 'DataEvent',
                action: 'update_message_state',
                params: {
                  localMsgId: message.localMsgId,
                  result: true,
                  item: convertFromMessage(message),
                },
              });
              onSendResult(message);
            },
          } as ChatMessageStatusCallback)
          .then(() => {})
          .catch((error) => {
            console.warn('test:sendToServer:error:', error);
          });
      },
      [client.chatManager, convertFromMessage, onSendBefore, onSendResult]
    );

    const sendTextMessage = React.useCallback(
      (text: string) => {
        if (text.length === 0) {
          return;
        }
        getInputRef().current?.clear();
        setContentRef.current?.('');
        const item = {
          sender: chatId,
          timestamp: timestamp(),
          isSender: true,
          key: seqId('ml').toString(),
          text: text,
          type: ChatMessageType.TXT,
          state: 'sending',
        } as TextMessageItemType;

        const msg = convertToMessage(item);
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [convertFromMessage(msg)],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg);
      },
      [
        chatId,
        convertFromMessage,
        convertToMessage,
        getInputRef,
        getMsgListRef,
        sendToServer,
      ]
    );

    const sendImageMessage = React.useCallback(
      async ({
        name,
        localPath,
        memoSize,
        width,
        height,
      }: {
        name: string;
        localPath: string;
        memoSize?: number;
        imageType?: string;
        width?: number;
        height?: number;
      }) => {
        if (localPath.length === 0) {
          return;
        }
        const targetPath = localUrl(Services.dcs.getFileDir(chatId, uuid()));
        await Services.ms.saveFromLocal({
          localPath,
          targetPath: targetPath,
        });
        if (__DEV__) {
          const test_existed = await Services.dcs.isExistedFile(targetPath);
          console.log(
            'test:test_existed:',
            test_existed,
            'target:',
            targetPath,
            'org:',
            localPath
          );
        }

        const modifiedTargetPath = removeFileHeader(targetPath);
        const item = {
          displayName: name,
          sender: chatId,
          isSender: true,
          type: ChatMessageType.IMAGE,
          state: 'sending',
          localPath: modifiedTargetPath,
          memoSize: memoSize,
          width: width,
          height: height,
        } as ImageMessageItemType;

        const msg = convertToMessage(item);
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [convertFromMessage(msg)],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg);
      },
      [
        chatId,
        convertFromMessage,
        convertToMessage,
        getMsgListRef,
        sendToServer,
      ]
    );

    const sendCustomMessage = React.useCallback(
      async ({ data }: { data: CustomMessageItemType }) => {
        const msg = convertToMessage(data);
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [convertFromMessage(msg)],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg);
      },
      [convertFromMessage, convertToMessage, getMsgListRef, sendToServer]
    );

    const sendVoiceMessage = React.useCallback(
      async ({
        localPath,
        duration,
      }: {
        localPath: string;
        memoSize?: number;
        duration?: number;
      }) => {
        if (localPath.length === 0) {
          return;
        }
        if (__DEV__) {
          const test_existed = await Services.dcs.isExistedFile(localPath);
          console.log('test:test_existed:', test_existed);
        }

        const modifiedTargetPath = removeFileHeader(localPath);
        const item = {
          sender: chatId,
          isSender: true,
          type: ChatMessageType.VOICE,
          state: 'sending',
          localPath: modifiedTargetPath,
          duration: duration,
        } as VoiceMessageItemType;

        const msg = convertToMessage(item);
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [convertFromMessage(msg)],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg);
      },
      [
        chatId,
        convertFromMessage,
        convertToMessage,
        getMsgListRef,
        sendToServer,
      ]
    );

    const loadHistoryMessage = React.useCallback(
      (msgs: ChatMessage[]) => {
        const items = [] as MessageItemType[];
        for (const msg of msgs) {
          const item = convertFromMessage(msg);
          items.push(item);
          checkAttachment(msg);
        }
        getMsgListRef().current?.addMessage({
          direction: 'before',
          msgs: items,
        });
      },
      [checkAttachment, convertFromMessage, getMsgListRef]
    );

    const requestHistoryMessage = React.useCallback(
      (earliestId?: string) => {
        client.chatManager
          .getMessages(
            chatId,
            chatType as number as ChatConversationType,
            earliestId ?? '',
            ChatSearchDirection.UP,
            2
          )
          .then((result) => {
            if (result) {
              loadHistoryMessage(result);
            }
          })
          .catch((error) => {
            console.warn('test:error:', error);
          });
      },
      [chatId, chatType, client.chatManager, loadHistoryMessage]
    );

    const loadMessage = React.useCallback(
      (msgs: ChatMessage[]) => {
        const items = [] as MessageItemType[];
        for (const msg of msgs) {
          const item = convertFromMessage(msg);
          items.push(item);
          checkAttachment(msg);
        }
        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: items,
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
      },
      [checkAttachment, convertFromMessage, getMsgListRef]
    );

    const _onFace = (value?: 'face' | 'key') => {
      if (value === 'key') {
        showFace();
      } else if (value === 'face') {
        hideFace();
      } else {
        hideFace();
      }
      onFace?.(value);
    };

    const createConversationIfNotExisted = React.useCallback(() => {
      sendEventFromChat({
        eventType: 'DataEvent',
        action: 'create_conversation',
        params: {
          convId: chatId,
          convType: chatType as number as ChatConversationType,
        },
      });
    }, [chatId, chatType]);

    const updateAllUnreadCount = React.useCallback(() => {
      client.chatManager
        .getUnreadCount()
        .then((result) => {
          if (result !== undefined) {
            onUpdateReadCount?.(result);
          }
        })
        .catch((error) => {
          console.warn('test:error:', error);
        });
    }, [client.chatManager, onUpdateReadCount]);

    const clearRead = React.useCallback(() => {
      client.chatManager
        .markAllMessagesAsRead(
          chatId,
          chatType as number as ChatConversationType
        )
        .then(() => {
          sendEventFromChat({
            eventType: 'DataEvent',
            action: 'update_conversation_read_state',
            params: {
              convId: chatId,
              convType: chatType as number as ChatConversationType,
            },
          });

          updateAllUnreadCount();
        })
        .catch((error) => {
          console.warn('test:error', error);
        });
    }, [chatId, chatType, client.chatManager, updateAllUnreadCount]);

    const onFaceInternal = React.useCallback((face: string) => {
      const content = getContentRef.current();
      const s = content + moji.convert.fromCodePoint(face);
      setContentRef.current(s);
      setIsInputRef.current(true);
    }, []);

    React.useEffect(() => {
      const subscription1 = Keyboard.addListener('keyboardWillHide', (_) => {
        setIsInputRef.current(false);
      });
      const subscription2 = Keyboard.addListener('keyboardWillShow', (_) => {
        setIsInputRef.current(true);
      });
      const subscription3 = DeviceEventEmitter.addListener('onFace', (face) => {
        const content = getContentRef.current();
        const s = content + moji.convert.fromCodePoint(face);
        setContentRef.current(s);
        setIsInputRef.current(true);
      });
      return () => {
        subscription1.remove();
        subscription2.remove();
        subscription3.remove();
      };
    }, []);

    const addListeners = React.useCallback(() => {
      const sub2 = DeviceEventEmitter.addListener(
        MessageChatSdkEvent,
        (event) => {
          const eventType = event.type as MessageChatSdkEventType;
          const eventParams = event.params as { messages: ChatMessage[] };
          switch (eventType) {
            case 'onMessagesReceived':
              {
                /// todo: !!! 10000 message count ???
                const messages = eventParams.messages;
                const r = [] as ChatMessage[];
                for (const msg of messages) {
                  if (msg.conversationId === chatId) {
                    r.push(msg);
                  }
                }
                if (r.length > 0) loadMessage(r);
              }
              break;
            default:
              break;
          }
        }
      );

      const sub4 = DeviceEventEmitter.addListener(
        'DataEvent' as DataEventType,
        (event) => {
          const { action, params } = event as {
            eventBizType: BizEventType;
            action: DataActionEventType;
            senderId: string;
            params: any;
            timestamp?: number;
          };
          switch (action) {
            case 'send_image_message':
              {
                const eventParams = params as any[];
                for (const item of eventParams) {
                  sendImageMessage({
                    name: item.name,
                    localPath: item.uri,
                    memoSize: item.size,
                    imageType: item.type,
                    width: item.width,
                    height: item.height,
                  })
                    .then()
                    .catch((error) => {
                      console.warn('test:error', error);
                    });
                }
              }
              break;
            case 'send_voice_message':
              {
                const eventParams = params as {
                  localPath: string;
                  duration: number;
                };
                sendVoiceMessage({
                  localPath: eventParams.localPath,
                  duration: eventParams.duration,
                })
                  .then()
                  .catch((error) => {
                    console.warn('test:sendVoiceMessage:error', error);
                  });
              }
              break;
            case 'press_message_bubble':
              {
                const eventParams = params as MessageItemType;
                if (eventParams.type === ChatMessageType.VOICE) {
                  const voice = eventParams as VoiceMessageItemType;
                  if (voice.localPath) {
                    Services.ms
                      .playAudio({
                        url: playUrl(voice.localPath),
                        onPlay({ isMuted, currentPosition, duration }) {
                          console.log(
                            'test:onPlay',
                            isMuted,
                            currentPosition,
                            duration
                          );
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
                  sendEventFromChat({
                    eventType: 'DataEvent',
                    action: 'preview_image',
                    params: eventParams,
                  });
                }
              }
              break;
            case 'preview_image':
              onItemPress?.(params);
              break;

            case 'request_history_message':
              {
                const eventParams = params as {
                  earliestId: string | undefined;
                };
                requestHistoryMessage(eventParams.earliestId);
              }
              break;

            default:
              break;
          }
        }
      );
      return () => {
        sub2.remove();
        sub4.remove();
      };
    }, [
      chatId,
      loadMessage,
      onItemPress,
      requestHistoryMessage,
      sendImageMessage,
      sendVoiceMessage,
    ]);

    const initDirs = React.useCallback((convIds: string[]) => {
      for (const convId of convIds) {
        Services.dcs
          .isExistedConversationDir(convId)
          .then((result) => {
            if (result === false) {
              Services.dcs
                .createConversationDir(convId)
                .then(() => {})
                .catch((error) => {
                  console.warn('test:create:dir:error:', error);
                });
            }
          })
          .catch((error) => {
            console.warn('test:isExisted:dir:error:', error);
          });
      }
    }, []);

    const initList = React.useCallback(() => {
      client.chatManager
        .getMessages(
          chatId,
          chatType as number as ChatConversationType,
          '',
          ChatSearchDirection.UP,
          2
        )
        .then((result) => {
          if (result) {
            loadMessage(result);
          }
        })
        .catch((error) => {
          console.warn('test:error:', error);
        });
    }, [chatId, chatType, client.chatManager, loadMessage]);

    React.useEffect(() => {
      const load = () => {
        const unsubscribe = addListeners();
        initList();
        initDirs([chatId]);
        createConversationIfNotExisted();
        clearRead();
        return {
          unsubscribe: unsubscribe,
        };
      };
      const unload = (params: { unsubscribe: () => void }) => {
        params.unsubscribe();
      };

      const res = load();
      return () => unload(res);
    }, [
      createConversationIfNotExisted,
      addListeners,
      initList,
      clearRead,
      initDirs,
      chatId,
    ]);

    const ChatMessageBubbleList = React.memo(() =>
      messageBubbleList ? (
        <messageBubbleList.MessageBubbleListP
          ref={messageBubbleList.MessageBubbleListRefP}
          {...messageBubbleList.MessageBubbleListPropsP}
          onPressed={() => {
            Keyboard.dismiss();
            _onFace('face');
            messageBubbleList.MessageBubbleListPropsP?.onPressed?.();
          }}
        />
      ) : (
        <MessageBubbleList
          ref={msgListRef}
          onPressed={() => {
            Keyboard.dismiss();
            _onFace('face');
          }}
          CustomMessageRenderItem={
            customMessageBubble?.CustomMessageRenderItemP
          }
        />
      )
    );

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexGrow: 1,
            // backgroundColor: '#fff8dc',
          }}
        >
          <ChatMessageBubbleList />
        </View>

        <ChatInput
          inputRef={inputRef ? inputRef : TextInputRef}
          chatId={chatId}
          chatType={chatType}
          onFace={_onFace}
          onSendTextMessage={({ content }) => {
            const test = true;
            if (test) sendTextMessage(content);
            else
              sendCustomMessage({
                data: {
                  sender: chatId,
                  timestamp: timestamp(),
                  isSender: true,
                  key: seqId('ml').toString(),
                  type: ChatMessageType.CUSTOM,
                  state: 'sending',
                  SubComponentProps: {
                    data: content,
                    eventType: 'test',
                  },
                } as CustomMessageItemType,
              });
            setTestRef.current();
          }}
          onInit={({ setIsInput, exeTest, getContent, setContent }) => {
            setIsInputRef.current = setIsInput;
            setTestRef.current = exeTest;
            setContentRef.current = setContent;
            getContentRef.current = getContent;
          }}
        />

        <ChatFaceList height={faceHeightRef} onFace={onFaceInternal} />
      </View>
    );
  }
);

type ChatFragmentProps = {
  screenParams: {
    params: {
      chatId: string;
      chatType: number;
    };
  };
  messageBubbleList?: {
    MessageBubbleListP: React.ForwardRefExoticComponent<
      MessageBubbleListProps & React.RefAttributes<MessageBubbleListRef>
    >;
    MessageBubbleListPropsP: MessageBubbleListProps;
    MessageBubbleListRefP: React.RefObject<MessageBubbleListRef>;
  };
  onFace?: (value?: 'face' | 'key') => void;
  customMessageBubble?: {
    CustomMessageRenderItemP: React.FunctionComponent<
      MessageItemType & { eventType: string; data: any }
    >;
  };
  onUpdateReadCount?: (unreadCount: number) => void;
  onItemPress?: (data: MessageItemType) => void;
  onItemLongPress?: (data: MessageItemType) => void;
};

export default function ChatFragment(props: ChatFragmentProps): JSX.Element {
  const {
    screenParams,
    messageBubbleList,
    onFace,
    customMessageBubble,
    onUpdateReadCount,
    onItemPress,
    onItemLongPress,
  } = props;
  const params = screenParams.params as {
    chatId: string;
    chatType: number;
  };
  const sf = getScaleFactor();
  const { bottom } = useSafeAreaInsets();
  const chatId = params.chatId;
  const chatType = params.chatType;
  let keyboardVerticalOffset = sf(
    bottom + Platform.select({ ios: 50, android: 70 })!
  );
  return (
    <React.Fragment>
      <KeyboardAvoidingView
        pointerEvents="box-none"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{
          flex: 1,
        }}
      >
        {/* <TouchableWithoutFeedback
    onPress={() => {
      keyboardVerticalOffset = sf(0);
      Keyboard.dismiss();
      _onFace('face');
    }}
  > */}
        <ChatContent
          chatId={chatId}
          chatType={chatType}
          messageBubbleList={messageBubbleList}
          onFace={onFace}
          customMessageBubble={customMessageBubble}
          onUpdateReadCount={onUpdateReadCount}
          onItemPress={onItemPress}
          onItemLongPress={onItemLongPress}
          // customMessageBubble={{
          //   CustomMessageRenderItemP: CustomMessageRenderItem,
          // }}
        />
        {/* </TouchableWithoutFeedback> */}
      </KeyboardAvoidingView>
    </React.Fragment>
  );
}

const styles = createStyleSheet({
  inputContainer: {
    height: 60,
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  inputContainer2: {
    flexGrow: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  inputContainer3: {
    flexDirection: 'row',
    flexGrow: 1,
    borderRadius: 24,
    overflow: 'hidden',
    borderColor: '#A5A7A6',
    borderWidth: 1,
  },
  talk: {
    height: 36,
    marginHorizontal: 12,
    borderRadius: 18,
    // flexGrow: 1,
  },
});
