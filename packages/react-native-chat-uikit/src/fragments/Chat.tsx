import * as React from 'react';
import {
  Animated,
  DeviceEventEmitter,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput as RNTextInput,
  TextInput,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moji from 'twemoji';

import Button from '../components/Button';
import { FaceList } from '../components/FaceList';
import { type LocalIconName, LocalIcon } from '../components/Icon';
import type {
  CustomMessageItemType,
  ImageMessageItemType,
  MessageBubbleListProps,
  MessageBubbleListRef,
  MessageItemStateType,
  MessageItemType,
  TextMessageItemType,
  VoiceMessageItemType,
} from '../components/MessageBubbleList';
import MessageBubbleList from '../components/MessageBubbleList';
import { FragmentContainer } from '../containers';
import {
  useActionMenu,
  useAlert,
  useBottomSheet,
  useChatSdkContext,
  useContentStateContext,
  useI18nContext,
  useThemeContext,
  useToastContext,
} from '../contexts';
import { MessageChatSdkEvent, MessageChatSdkEventType } from '../events';
import { Services } from '../services';
import { getScaleFactor } from '../styles/createScaleFactor';
import createStyleSheet from '../styles/createStyleSheet';
import { getFileExtension } from '../utils/file';
import { timeoutTask } from '../utils/function';
import { seqId, timestamp, uuid } from '../utils/generator';
import { localUrl, playUrl, removeFileHeader } from '../utils/platform';
import {
  type ChatEventType,
  ChatEvent,
  ConversationListEvent,
  ConversationListEventType,
  MessageBubbleEvent,
  MessageBubbleEventType,
  MessageEvent,
  MessageEventType,
} from './types';

const InvisiblePlaceholder = React.memo(() => {
  const sheet = useBottomSheet();
  const toast = useToastContext();
  const alert = useAlert();
  const menu = useActionMenu();
  const { groupInfo, chat } = useI18nContext();
  const theme = useThemeContext();
  const sf = getScaleFactor();
  const state = useContentStateContext();
  const ms = Services.ms;

  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener(ChatEvent, (event) => {
      // console.log('test:ChatEvent:Chat:', event);
      switch (event.type as ChatEventType) {
        case 'enable_voice':
          state.showState({
            children: (
              <View
                style={{
                  height: sf(100),
                  width: sf(161),
                  borderRadius: sf(16),
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <LocalIcon name="mic" size={sf(40)} />
                  <LocalIcon name="volume8" size={sf(40)} />
                </View>
                <Text style={{ color: 'white' }}>{chat.voiceState}</Text>
              </View>
            ),
          });
          break;
        case 'disable_voice':
          state.hideState();
          break;
        case 'open_input_extension':
          sheet.openSheet({
            sheetItems: [
              {
                iconColor: theme.colors.primary,
                title: 'Camera',
                titleColor: 'black',
                onPress: () => {
                  ms.openCamera({})
                    .then(() => {})
                    .catch((error) => {
                      console.warn('error:', error);
                    });
                },
              },
              {
                iconColor: theme.colors.primary,
                title: 'Album',
                titleColor: 'black',
                onPress: () => {
                  ms.openMediaLibrary({ selectionLimit: 1 })
                    .then((result) => {
                      DeviceEventEmitter.emit(ChatEvent, {
                        type: 'send_image_message' as ChatEventType,
                        params: result,
                      });
                    })
                    .catch((error) => {
                      console.warn('error:', error);
                    });
                },
              },
              {
                iconColor: theme.colors.primary,
                title: 'Files',
                titleColor: 'black',
                onPress: () => {
                  ms.openDocument({})
                    .then(() => {})
                    .catch((error) => {
                      console.warn('error:', error);
                    });
                },
              },
            ],
          });
          break;
        default:
          break;
      }
    });

    const sub2 = DeviceEventEmitter.addListener(MessageBubbleEvent, (event) => {
      // console.log('test:ChatEvent:Chat:', event);
      switch (event.type as MessageBubbleEventType) {
        case 'on_press':
          {
            const eventParams = event.params as MessageItemType;
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
            }
          }
          break;
        case 'on_long_press':
          menu.openMenu({
            menuItems: [
              {
                title: 'delete message',
                onPress: () => {
                  console.log('test:111:');
                },
              },
              {
                title: 'resend message',
                onPress: () => {
                  console.log('test:222:');
                },
              },
              {
                title: 'recall message',
                onPress: () => {
                  console.log('test:333:');
                },
              },
            ],
          });
          break;
        default:
          break;
      }
    });
    return () => {
      sub.remove();
      sub2.remove();
    };
  }, [
    toast,
    sheet,
    alert,
    groupInfo.inviteAlert.title,
    groupInfo.inviteAlert.message,
    groupInfo.inviteAlert.cancelButton,
    groupInfo.inviteAlert.confirmButton,
    groupInfo.toast,
    groupInfo.memberSheet.add,
    groupInfo.memberSheet.remove,
    groupInfo.memberSheet.chat,
    theme.colors.primary,
    sf,
    state,
    chat.voiceState,
    ms,
    menu,
  ]);

  return <></>;
});

type BaseType = {
  chatId: string;
  chatType: ChatMessageChatType;
  onFace?: (value?: 'face' | 'key') => void;
  inputRef?: React.RefObject<RNTextInput>;
};

type InputType = BaseType & {
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

type ContentType = BaseType & {
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
};

const Input = React.memo((props: InputType) => {
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
                DeviceEventEmitter.emit(ChatEvent, {
                  type: 'open_input_extension' as ChatEventType,
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
              DeviceEventEmitter.emit(ChatEvent, {
                type: 'enable_voice' as ChatEventType,
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
              DeviceEventEmitter.emit(ChatEvent, {
                type: 'disable_voice' as ChatEventType,
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
                        DeviceEventEmitter.emit(ChatEvent, {
                          type: 'send_voice_message' as ChatEventType,
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

const Content = React.memo(
  ({
    chatId,
    chatType,
    messageBubbleList,
    onFace,
    inputRef,
    customMessageBubble,
    onUpdateReadCount,
  }: ContentType) => {
    const sf = getScaleFactor();
    const TextInputRef = React.useRef<RNTextInput>(null);
    const msgListRef = React.useRef<MessageBubbleListRef>(null);
    const [, setContent] = React.useState('');
    const getContentRef = React.useRef<() => string>(() => '');
    const setContentRef = React.useRef(setContent);
    // const content = React.useRef('');
    const [, setIsInput] = React.useState(false);
    const setIsInputRef = React.useRef(setIsInput);
    const setTestRef = React.useRef(() => {});
    const faceHeight = sf(300);
    const faceHeightRef = React.useRef(new Animated.Value(0)).current;
    const { client } = useChatSdkContext();

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
            DeviceEventEmitter.emit(MessageBubbleEvent, {
              type: 'on_long_press' as MessageBubbleEventType,
              params: data,
            });
          },
          onPress: (data: MessageItemType) => {
            DeviceEventEmitter.emit(MessageBubbleEvent, {
              type: 'on_press' as MessageBubbleEventType,
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
              DeviceEventEmitter.emit(ChatEvent, {
                type: 'msg_state' as ChatEventType,
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
      DeviceEventEmitter.emit(MessageEvent, {
        type: 'on_send_before' as MessageEventType,
        params: { message: msg },
      });
    }, []);
    const onSendResult = React.useCallback((msg: ChatMessage) => {
      DeviceEventEmitter.emit(MessageEvent, {
        type: 'on_send_result' as MessageEventType,
        params: { message: msg },
      });
    }, []);

    const sendToServer = React.useCallback(
      (msg: ChatMessage) => {
        onSendBefore(msg);
        client.chatManager
          .sendMessage(msg, {
            onProgress: (localMsgId: string, progress: number): void => {
              DeviceEventEmitter.emit(ChatEvent, {
                type: 'msg_progress' as ChatEventType,
                params: {
                  localMsgId,
                  progress,
                },
              });
            },
            onError: (localMsgId: string, error: ChatError): void => {
              DeviceEventEmitter.emit(ChatEvent, {
                type: 'msg_state' as ChatEventType,
                params: {
                  localMsgId,
                  result: false,
                  reason: error,
                },
              });
              msg.status = ChatMessageStatus.FAIL;
              onSendResult(msg);
            },
            onSuccess: (message: ChatMessage): void => {
              DeviceEventEmitter.emit(ChatEvent, {
                type: 'msg_state' as ChatEventType,
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

        getMsgListRef().current?.addMessage([convertFromMessage(msg)]);
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

        getMsgListRef().current?.addMessage([convertFromMessage(msg)]);
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

        getMsgListRef().current?.addMessage([convertFromMessage(msg)]);
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

        getMsgListRef().current?.addMessage([convertFromMessage(msg)]);
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

    const loadMessage = React.useCallback(
      (msgs: ChatMessage[]) => {
        const items = [] as MessageItemType[];
        for (const msg of msgs) {
          const item = convertFromMessage(msg);
          items.push(item);
          checkAttachment(msg);
        }
        getMsgListRef().current?.addMessage(items);
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
      DeviceEventEmitter.emit(ConversationListEvent, {
        type: 'create_conversation' as ConversationListEventType,
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
          DeviceEventEmitter.emit(ConversationListEvent, {
            type: 'conversation_read' as ConversationListEventType,
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
      const sub = DeviceEventEmitter.addListener(ChatEvent, (event) => {
        const eventType = event.type as ChatEventType;
        if (eventType === 'send_image_message') {
          const eventParams = event.params as any[];
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
        } else if (eventType === 'send_voice_message') {
          const eventParams = event.params as {
            localPath: string;
            duration: number;
          };
          sendVoiceMessage({
            localPath: eventParams.localPath,
            duration: eventParams.duration,
          })
            .then()
            .catch((error) => {
              console.warn('test:error', error);
            });
        }
      });
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
      return () => {
        sub.remove();
        sub2.remove();
      };
    }, [chatId, loadMessage, sendImageMessage, sendVoiceMessage]);

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
          5
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

    const MessageBubbleListM = React.memo(() =>
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
          <MessageBubbleListM />
        </View>

        <Input
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

        <FaceList height={faceHeightRef} />
      </View>
    );
  }
);

type ChatFragmentProps = {
  screenParams: any;
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
};

export default function ChatFragment(props: ChatFragmentProps): JSX.Element {
  const {
    screenParams,
    messageBubbleList,
    onFace,
    customMessageBubble,
    onUpdateReadCount,
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
        <Content
          chatId={chatId}
          chatType={chatType}
          messageBubbleList={messageBubbleList}
          onFace={onFace}
          customMessageBubble={customMessageBubble}
          onUpdateReadCount={onUpdateReadCount}
          // customMessageBubble={{
          //   CustomMessageRenderItemP: CustomMessageRenderItem,
          // }}
        />
        {/* </TouchableWithoutFeedback> */}
      </KeyboardAvoidingView>
      <FragmentContainer>
        <InvisiblePlaceholder />
      </FragmentContainer>
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
