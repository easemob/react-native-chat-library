import * as React from 'react';
import {
  Animated,
  DeviceEventEmitter,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  TextInput,
  TouchableOpacity,
  // TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  ChatConversationType,
  ChatError,
  ChatGroupMessageAck,
  ChatImageMessageBody,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageDirection,
  ChatMessageEventListener,
  ChatMessageReactionEvent,
  ChatMessageStatus,
  ChatMessageStatusCallback,
  ChatMessageThreadEvent,
  ChatMessageType,
  ChatSearchDirection,
  ChatTextMessageBody,
} from 'react-native-chat-sdk';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moji from 'twemoji';

import Button from '../components/Button';
import { FaceList } from '../components/FaceList';
import { type LocalIconName, LocalIcon } from '../components/Icon';
import type {
  ImageMessageItemType,
  MessageBubbleListProps,
  MessageBubbleListRef,
  MessageItemStateType,
  MessageItemType,
  TextMessageItemType,
  VoiceMessageItemType,
} from '../components/MessageBubbleList';
import MessageBubbleList from '../components/MessageBubbleList';
import { useChatSdkContext, useI18nContext } from '../contexts';
import { getScaleFactor } from '../styles/createScaleFactor';
import createStyleSheet from '../styles/createStyleSheet';
import { timeoutTask } from '../utils/function';
import { seqId, timestamp } from '../utils/generator';
import { type ChatEventType, ChatEvent } from './types';

const Content = React.memo(
  ({
    chatId,
    chatType,
    messageBubbleList,
    onFace,
  }: {
    chatId: string;
    chatType: ChatMessageChatType;
    messageBubbleList?: {
      MessageBubbleListP: React.ForwardRefExoticComponent<
        MessageBubbleListProps & React.RefAttributes<MessageBubbleListRef>
      >;
      MessageBubbleListPropsP: MessageBubbleListProps;
      MessageBubbleListRefP: React.RefObject<MessageBubbleListRef>;
    };
    onFace?: (value?: 'face' | 'key') => void;
  }) => {
    const sf = getScaleFactor();
    const { chat } = useI18nContext();
    const TextInputRef = React.useRef<RNTextInput>(null);
    const msgListRef = React.useRef<MessageBubbleListRef>(null);
    const faces = ['face', 'key'] as ('face' | 'key')[];
    const waves = ['wave_in_circle', 'key'] as ('wave_in_circle' | 'key')[];
    const [face, setFace] = React.useState(faces[0]);
    const [wave, setWave] = React.useState(waves[0]);
    // const [content, setContent] = React.useState('');
    const content = React.useRef('');
    const [isInput, setIsInput] = React.useState(false);
    const { width } = useWindowDimensions();
    const faceHeight = sf(300);
    const faceHeightRef = React.useRef(new Animated.Value(0)).current;
    const { client } = useChatSdkContext();
    console.log('test:Content:', chatId, chatType);

    const getMsgListRef = React.useCallback(() => {
      if (messageBubbleList) {
        return messageBubbleList.MessageBubbleListRefP;
      } else {
        return msgListRef;
      }
    }, [messageBubbleList]);

    const onContent = (text: string) => {
      content.current = text;
    };

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

    const calculateInputWidth = React.useCallback(
      (width: number, isInput: boolean) => {
        return sf(width - 15 * 2 - 28 - 12 * 2 - 18 - 14 - (isInput ? 66 : 28));
      },
      [sf]
    );

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
                chatType
              );
            }
            break;
          case ChatMessageType.VOICE:
            {
              const voice = item as VoiceMessageItemType;
              r = ChatMessage.createVoiceMessage(
                chatId,
                voice.localPath!,
                chatType
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
            case ChatMessageType.IMAGE:
              {
                const body = msg.body as ChatImageMessageBody;
                const r = item as ImageMessageItemType;
                r.localPath = body.localPath;
                r.remoteUrl = body.remotePath;
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
        return r;
      },
      []
    );

    const sendToServer = React.useCallback(
      (msg: ChatMessage) => {
        client.chatManager
          .sendMessage(msg, {
            onProgress: (localMsgId: string, progress: number): void => {
              console.log('test:message:onProgress:', localMsgId, progress);
              DeviceEventEmitter.emit(ChatEvent, {
                type: 'msg_progress' as ChatEventType,
                params: {
                  localMsgId,
                  progress,
                },
              });
            },
            onError: (localMsgId: string, error: ChatError): void => {
              console.log('test:message:onError:', localMsgId, error);
              DeviceEventEmitter.emit(ChatEvent, {
                type: 'msg_state' as ChatEventType,
                params: {
                  localMsgId,
                  result: false,
                  reason: error,
                },
              });
            },
            onSuccess: (message: ChatMessage): void => {
              console.log('test:message:onSuccess:', message.localMsgId);
              DeviceEventEmitter.emit(ChatEvent, {
                type: 'msg_state' as ChatEventType,
                params: {
                  localMsgId: message.localMsgId,
                  result: true,
                  msg: message,
                },
              });
            },
          } as ChatMessageStatusCallback)
          .then((result) => {
            console.log('test:result:', result);
          })
          .catch((error) => {
            console.warn('test:error:', error);
          });
      },
      [client]
    );

    const sendTextMessage = React.useCallback(
      (text: string) => {
        if (text.length === 0) {
          return;
        }
        TextInputRef.current?.clear();
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
        item.key = msg.localMsgId;
        item.timestamp = msg.serverTime;

        getMsgListRef().current?.addMessage([item]);
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg);
      },
      [chatId, convertToMessage, getMsgListRef, sendToServer]
    );

    const loadMessage = React.useCallback(
      (msgs: ChatMessage[]) => {
        const items = [] as MessageItemType[];
        for (const msg of msgs) {
          const item = convertFromMessage(msg);
          items.push(item);
        }
        getMsgListRef().current?.addMessage(items);
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
      },
      [convertFromMessage, getMsgListRef]
    );

    const _onFace = (value?: 'face' | 'key') => {
      setFace(value);
      if (value === 'key') {
        showFace();
      } else if (value === 'face') {
        hideFace();
      } else {
        hideFace();
      }
      onFace?.(value);
    };

    React.useEffect(() => {
      console.log('test:Chat:listener:111:');
      const subscription1 = Keyboard.addListener('keyboardWillHide', (_) => {
        setIsInput(false);
      });
      const subscription2 = Keyboard.addListener('keyboardWillShow', (_) => {
        setIsInput(true);
      });
      const subscription3 = DeviceEventEmitter.addListener('onFace', (face) => {
        const s = content + moji.convert.fromCodePoint(face);
        onContent(s);
        setIsInput(true);
      });
      return () => {
        console.log('test:Chat:listener:222:');
        subscription1.remove();
        subscription2.remove();
        subscription3.remove();
      };
    }, [content]);

    const addListeners = React.useCallback(() => {
      const msgListener: ChatMessageEventListener = {
        onMessagesReceived: async (messages: ChatMessage[]): Promise<void> => {
          /// todo: !!! 10000 message count ???
          loadMessage(messages);
        },

        onCmdMessagesReceived: (_: ChatMessage[]): void => {},

        onMessagesRead: async (_: ChatMessage[]): Promise<void> => {
          /// todo: !!! 10000 message count ???
        },

        onGroupMessageRead: (_: ChatGroupMessageAck[]): void => {},

        onMessagesDelivered: (_: ChatMessage[]): void => {},

        onMessagesRecalled: (_: ChatMessage[]): void => {},

        onConversationsUpdate: (): void => {},

        onConversationRead: (): void => {},

        onMessageReactionDidChange: (_: ChatMessageReactionEvent[]): void => {},

        onChatMessageThreadCreated: (_: ChatMessageThreadEvent): void => {},

        onChatMessageThreadUpdated: (_: ChatMessageThreadEvent): void => {},

        onChatMessageThreadDestroyed: (_: ChatMessageThreadEvent): void => {},

        onChatMessageThreadUserRemoved: (_: ChatMessageThreadEvent): void => {},
      };
      client.chatManager.addMessageListener(msgListener);
      return () => {
        client.chatManager.removeMessageListener(msgListener);
      };
    }, [client.chatManager, loadMessage]);

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
          console.log('test:result:', result);
          if (result) {
            loadMessage(result);
          }
        })
        .catch((error) => {
          console.warn('test:error:', error);
        });
    }, [chatId, chatType, client.chatManager, loadMessage]);

    React.useEffect(() => {
      console.log('test:useEffect:', addListeners, initList);
      const load = () => {
        console.log('test:load:', Content.name);
        const unsubscribe = addListeners();
        initList();
        return {
          unsubscribe: unsubscribe,
        };
      };
      const unload = (params: { unsubscribe: () => void }) => {
        console.log('test:unload:', Content.name);
        params.unsubscribe();
      };

      const res = load();
      return () => unload(res);
    }, [addListeners, initList]);

    const MessageBubbleListM = React.memo(() =>
      messageBubbleList ? (
        <messageBubbleList.MessageBubbleListP
          ref={messageBubbleList.MessageBubbleListRefP}
          {...messageBubbleList.MessageBubbleListPropsP}
        />
      ) : null
    );

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexGrow: 1,
            // backgroundColor: '#fff8dc',
          }}
        >
          {messageBubbleList === undefined ? (
            <MessageBubbleList
              ref={msgListRef}
              onPressed={() => {
                // keyboardVerticalOffset = sf(0);
                Keyboard.dismiss();
                _onFace('face');
              }}
            />
          ) : (
            <MessageBubbleListM />
          )}
        </View>

        <View
          style={styles.inputContainer}
          onLayout={(_) => {
            // console.log('test:event:', event.nativeEvent.layout);
          }}
        >
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
                    ref={TextInputRef}
                    style={{
                      flexGrow: 1,
                      backgroundColor: 'white',
                      width: calculateInputWidth(width, isInput),
                    }}
                    onChangeText={(text) => {
                      onContent(text);
                    }}
                    // value={content}
                    returnKeyType="send"
                    onKeyPress={(_) => {
                      // console.log(
                      //   'test:event:event.nativeEvent.key:',
                      //   event.nativeEvent.key
                      // );
                    }}
                    onSubmitEditing={(event) => {
                      const c = event.nativeEvent.text;
                      // Keyboard.dismiss();
                      event.preventDefault();
                      sendTextMessage(c);
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
                      sendTextMessage(content.current);
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
                  <LocalIcon
                    name="plus_in_circle"
                    color="#A5A7A6"
                    size={sf(28)}
                  />
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
                }}
                onPressOut={() => {
                  DeviceEventEmitter.emit(ChatEvent, {
                    type: 'disable_voice' as ChatEventType,
                    params: {},
                  });
                }}
              >
                {chat.voiceButton}
              </Button>
            </View>
          )}
        </View>

        <FaceList height={faceHeightRef} />
      </View>
    );
  }
);

type Props = {
  screenParams: any;
  messageBubbleList?: {
    MessageBubbleListP: React.ForwardRefExoticComponent<
      MessageBubbleListProps & React.RefAttributes<MessageBubbleListRef>
    >;
    MessageBubbleListPropsP: MessageBubbleListProps;
    MessageBubbleListRefP: React.RefObject<MessageBubbleListRef>;
  };
  onFace?: (value?: 'face' | 'key') => void;
};
export default function ChatFragment(props: Props): JSX.Element {
  const { screenParams, messageBubbleList, onFace } = props;
  console.log('test:ChatFragment:', screenParams);
  const params = screenParams.params as {
    chatId: string;
    chatType: number;
  };
  const sf = getScaleFactor();
  const { bottom } = useSafeAreaInsets();
  const chatId = params.chatId;
  const chatType = params.chatType;
  let keyboardVerticalOffset = sf(bottom + 50);
  return (
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
      />
      {/* </TouchableWithoutFeedback> */}
    </KeyboardAvoidingView>
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
