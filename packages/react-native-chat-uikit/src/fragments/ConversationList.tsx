import * as React from 'react';
import {
  DeviceEventEmitter,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  ChatConversationType,
  ChatMessage,
  ChatMessageDirection,
  ChatMessageType,
  ChatTextMessageBody,
} from 'react-native-chat-sdk';

import Badge from '../components/Badge';
import { DefaultAvatar } from '../components/DefaultAvatars';
import {
  default as EqualHeightList,
  EqualHeightListRef,
  ItemComponent,
  ItemData,
} from '../components/EqualHeightList';
import { LocalIcon } from '../components/Icon';
import { ListItemSeparator } from '../components/ListItemSeparator';
import { ListSearchHeader } from '../components/ListSearchHeader';
import { useChatSdkContext } from '../contexts';
import { MessageChatSdkEvent, MessageChatSdkEventType } from '../events';
import { Services } from '../services';
import { getScaleFactor } from '../styles/createScaleFactor';
import createStyleSheet from '../styles/createStyleSheet';
import { messageTimestamp } from '../utils/format';
import { queueTask } from '../utils/function';
import { timestamp } from '../utils/generator';
import { autoFocus } from '../utils/platform';
import {
  ConversationListEvent,
  ConversationListEventType,
  MessageEvent,
  MessageEventType,
} from './types';

export type ItemDataType = ItemData & {
  convId: string;
  convType: ChatConversationType;
  lastMsg?: ChatMessage;
  convContent: string;
  timestamp: number;
  timestampS: string;
  count: number;
  actions?: {
    onMute?: (data: ItemDataType) => void;
    onDelete?: (data: ItemDataType) => void;
  };
};

const Item: ItemComponent = (props) => {
  const sf = getScaleFactor();
  const item = props.data as ItemDataType;
  const { width: screenWidth } = useWindowDimensions();
  const extraWidth = item.sideslip?.width ?? sf(100);
  return (
    <View style={[styles.item, { width: screenWidth + extraWidth }]}>
      <View
        style={{
          // width: screenWidth,
          flexGrow: 1,
          flexShrink: 1,
          flexDirection: 'row',
        }}
      >
        <DefaultAvatar size={sf(50)} radius={sf(25)} />
        <View style={[styles.itemText, { justifyContent: 'space-between' }]}>
          <Text style={{ maxWidth: screenWidth * 0.5 }} numberOfLines={1}>
            {item.convId}
          </Text>
          <Text style={{ maxWidth: screenWidth * 0.6 }} numberOfLines={1}>
            {item.convContent}
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexGrow: 1,
          }}
        >
          <Text>{messageTimestamp(item.timestamp)}</Text>
          {item.count > 0 ? (
            <Badge
              count={item.count}
              badgeColor="rgba(255, 20, 204, 1)"
              size="default"
            />
          ) : null}
        </View>
      </View>
      <View
        style={{
          // flexGrow: 1,
          width: extraWidth, // ??? why
          height: sf(60),
          flexDirection: 'row',
          // backgroundColor: 'green',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <View style={{ width: sf(20) }} />
        <Pressable
          style={{
            height: sf(30),
            width: sf(30),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F2F2F2',
            overflow: 'hidden',
            borderRadius: sf(30),
          }}
          onPress={() => {
            item.actions?.onMute?.(item);
          }}
        >
          <LocalIcon name="bell_slash" size={20} color="#666666" />
        </Pressable>
        <View style={{ width: sf(15) }} />
        <Pressable
          style={{
            height: sf(30),
            width: sf(30),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 20, 204, 1)',
            overflow: 'hidden',
            borderRadius: sf(30),
          }}
          onPress={() => {
            item.actions?.onDelete?.(item);
          }}
          onStartShouldSetResponder={(_) => {
            return true;
          }}
          onStartShouldSetResponderCapture={(_) => {
            return true;
          }}
          onMoveShouldSetResponder={(_) => {
            return true;
          }}
          onResponderEnd={(_) => {
            return true;
          }}
          onResponderGrant={(_) => {
            return true;
          }}
        >
          <LocalIcon name="trash" size={sf(20)} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

export type Props = {
  onLongPress?: (data?: ItemDataType) => void;
  onPress?: (data?: ItemDataType) => void;
  onData?: (data: ItemDataType[]) => void;
  onUpdateReadCount?: (unreadCount: number) => void;
};
export default function ConversationListFragment(props: Props): JSX.Element {
  console.log('test:ConversationListFragment:', props);
  const { onLongPress, onPress, onData, onUpdateReadCount } = props;

  const sf = getScaleFactor();
  const { client, getCurrentId } = useChatSdkContext();

  const listRef = React.useRef<EqualHeightListRef>(null);
  const enableRefresh = true;
  const enableAlphabet = false;
  const enableHeader = true;
  // const autoFocus = false;
  const data: ItemDataType[] = React.useMemo(() => [], []); // for search
  // const width = sf(100);
  // const isEmpty = false;
  const currentChatId = React.useRef('');

  const getConvId = React.useCallback((msg: ChatMessage) => {
    if (msg.direction === ChatMessageDirection.SEND) {
      return msg.to;
    } else {
      return msg.from;
    }
  }, []);

  const getContent = React.useCallback((msg?: ChatMessage) => {
    if (msg) {
      let content = '';
      switch (msg.body.type) {
        case ChatMessageType.TXT:
          content = (msg.body as ChatTextMessageBody).content;
          break;
        case ChatMessageType.CMD:
          content = '[cmd]';
          break;
        case ChatMessageType.CUSTOM:
          content = '[custom]';
          break;
        case ChatMessageType.FILE:
          content = '[file]';
          break;
        case ChatMessageType.IMAGE:
          content = '[image]';
          break;
        case ChatMessageType.LOCATION:
          content = '[location]';
          break;
        case ChatMessageType.VIDEO:
          content = '[video]';
          break;
        case ChatMessageType.VOICE:
          content = '[voice]';
          break;
        default:
          break;
      }
      return content;
    }
    return '';
  }, []);

  const getExisted = React.useCallback(
    (convId: string) => {
      for (const item of data) {
        if (item.convId === convId) {
          return item;
        }
      }
      return undefined;
    },
    [data]
  );

  const getConvCount = React.useCallback(
    (convId: string, newMsg?: ChatMessage) => {
      let conv;
      for (const item of data) {
        if (item.convId === convId) {
          conv = item;
        }
      }
      if (conv) {
        if (conv.convId === currentChatId.current) {
          return 0;
        } else {
          if (newMsg === undefined) {
            return conv.count;
          }
          if (newMsg.direction === ChatMessageDirection.SEND) {
            return conv.count;
          } else {
            return conv.count + 1;
          }
        }
      } else {
        return 0;
      }
    },
    [data]
  );

  const removeConversation = React.useCallback(
    (convId: string) => {
      client.chatManager
        .deleteConversation(convId, true)
        .then((result) => {
          console.log('test:result:', result);
        })
        .catch((error) => {
          console.warn('test:error:', error);
        });
    },
    [client.chatManager]
  );

  const manualRefresh = React.useCallback(
    (params: {
      type: 'init' | 'add' | 'search' | 'del-one' | 'update-one';
      items: ItemDataType[];
    }) => {
      console.log('test:manualRefresh:', params.type, params.items.length);
      for (let index = 0; index < params.items.length; index++) {
        const element = params.items[index];
        if (element?.convId === getCurrentId()) {
          params.items.splice(index, 1);
          break;
        }
      }
      if (params.type === 'init') {
        data.length = 0;
        listRef.current?.manualRefresh([
          {
            type: 'clear',
          },
          {
            type: 'add',
            data: params.items as ItemData[],
            enableSort: true,
            sortDirection: 'asc',
          },
        ]);
        data.push(...params.items);
      } else if (params.type === 'search') {
        listRef.current?.manualRefresh([
          {
            type: 'clear',
          },
          {
            type: 'add',
            data: params.items as ItemData[],
            enableSort: true,
            sortDirection: 'asc',
          },
        ]);
      } else if (params.type === 'add') {
        listRef.current?.manualRefresh([
          {
            type: 'add',
            data: params.items as ItemData[],
            enableSort: true,
            sortDirection: 'asc',
          },
        ]);
        data.push(...params.items);
      } else if (params.type === 'del-one') {
        listRef.current?.manualRefresh([
          {
            type: 'del',
            data: params.items as ItemData[],
            enableSort: false,
          },
        ]);
        let hadDeleted = false;
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          for (const item of params.items) {
            if (element && item.key === element.key) {
              data.splice(index, 1);
              hadDeleted = true;
              break;
            }
          }
          if (hadDeleted === true) {
            break;
          }
        }
      } else if (params.type === 'update-one') {
        listRef.current?.manualRefresh([
          {
            type: 'update',
            data: params.items as ItemData[],
            enableSort: true,
            sortDirection: 'asc',
          },
        ]);
        let hadUpdated = false;
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          for (const item of params.items) {
            if (element && item.key === element.key) {
              data[index] = item;
              hadUpdated = true;
              break;
            }
          }
          if (hadUpdated === true) {
            break;
          }
        }
      } else {
        console.warn('test:');
        return;
      }
      onData?.(data);
    },
    [data, getCurrentId, onData]
  );

  const standardizedData = React.useCallback(
    (item: Omit<ItemDataType, 'onLongPress' | 'onPress'>): ItemDataType => {
      const time = item.lastMsg ? item.lastMsg.serverTime : timestamp();
      const r = {
        ...item,
        convContent: getContent(item.lastMsg),
        timestamp: time,
        timestampS: messageTimestamp(time),
        type: 'sideslip',
        sideslip: {
          width: sf(100),
        },
        onLongPress: (data: ItemDataType) => {
          onLongPress?.(data);
        },
        onPress: (data: ItemDataType) => {
          onPress?.(data);
        },
        actions: {
          onMute: (_) => {},
          onDelete: (data) => {
            manualRefresh({
              type: 'del-one',
              items: [{ ...data } as ItemDataType],
            });
            removeConversation(data.convId);
          },
        },
      } as ItemDataType;
      return r;
    },
    [getContent, manualRefresh, onLongPress, onPress, removeConversation, sf]
  );

  const getConv = React.useCallback(
    (convId: string) => {
      for (const item of data) {
        if (item.convId === convId) {
          return item;
        }
      }
      return undefined;
    },
    [data]
  );

  const getConvIfNot = React.useCallback(
    async (convId: string, convType: ChatConversationType) => {
      const conv = getConv(convId);
      if (conv) return conv;
      try {
        const conv = await client.chatManager.getConversation(
          convId,
          convType,
          true
        );
        await Services.dcs.createConversationDir(convId);
        if (conv) {
          const msg = await conv.getLatestMessage();
          if (msg) {
            return standardizedData({
              key: conv.convId,
              convId: conv.convId,
              convType: conv.convType,
              lastMsg: msg,
              count: getConvCount(conv.convId),
            } as ItemDataType);
          } else {
            return standardizedData({
              key: conv.convId,
              convId: conv.convId,
              convType: conv.convType,
              lastMsg: undefined,
              count: 0,
            } as ItemDataType);
          }
        } else {
          return undefined;
        }
      } catch (error) {
        return undefined;
      }
    },
    [client.chatManager, getConv, getConvCount, standardizedData]
  );

  const duplicateCheck = React.useCallback(
    (id: string) => {
      for (const item of data) {
        if (item.convId === id) {
          return true;
        }
      }
      return false;
    },
    [data]
  );

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

  const addListeners = React.useCallback(() => {
    const sub = DeviceEventEmitter.addListener(
      ConversationListEvent,
      (event) => {
        const eventType = event.type as ConversationListEventType;
        switch (eventType) {
          case 'create_conversation':
            {
              const eventParams = event.params;
              if (duplicateCheck(eventParams.convId)) {
                return;
              }
              manualRefresh({
                type: 'add',
                items: [
                  standardizedData({
                    key: eventParams.convId,
                    convId: eventParams.convId,
                    convType: eventParams.convType,
                    lastMsg: undefined,
                    count: 0,
                  } as ItemDataType),
                ],
              });
            }
            break;
          case 'conversation_read':
            {
              const eventParams = event.params;
              const conv = getConv(eventParams.convId);
              if (conv === undefined) {
                return;
              }
              manualRefresh({
                type: 'update-one',
                items: [
                  standardizedData({
                    ...conv,
                    count: 0,
                  } as ItemDataType),
                ],
              });
            }
            break;
          default:
            break;
        }
      }
    );

    const sub2 = DeviceEventEmitter.addListener(
      MessageChatSdkEvent,
      async (event) => {
        const eventType = event.type as MessageChatSdkEventType;
        const eventParams = event.params as { messages: ChatMessage[] };
        switch (eventType) {
          case 'onMessagesReceived':
            {
              const messages = eventParams.messages;
              console.log('test:onMessagesReceived:', messages.length);
              for (const msg of messages) {
                const convId = getConvId(msg);
                const convType = msg.chatType as number as ChatConversationType;
                const conv = getExisted(convId);
                if (conv === undefined) {
                  await getConvIfNot(convId, convType);
                }
                const count = getConvCount(convId, msg);
                manualRefresh({
                  type: 'update-one',
                  items: [
                    standardizedData({
                      key: convId,
                      convId: convId,
                      convType: convType,
                      lastMsg: msg,
                      count: count,
                    } as ItemDataType),
                  ],
                });
              }
              updateAllUnreadCount();
            }
            break;
          case 'onMessagesRead':
            {
              /// todo: !!! 10000 message count ???
              const messages = eventParams.messages;
              console.log('test:onMessagesRead:', messages.length);
              for (const msg of messages) {
                const convId = getConvId(msg);
                const convType = msg.chatType as number as ChatConversationType;
                const conv = getExisted(convId);
                if (conv === undefined) {
                  return;
                }
                const count =
                  await client.chatManager.getConversationUnreadCount(
                    convId,
                    convType
                  );
                manualRefresh({
                  type: 'update-one',
                  items: [
                    standardizedData({
                      key: convId,
                      convId: convId,
                      convType: convType,
                      lastMsg: msg,
                      count: count,
                    } as ItemDataType),
                  ],
                });
              }
            }
            break;
          default:
            break;
        }
      }
    );

    const sub3 = DeviceEventEmitter.addListener(MessageEvent, (event) => {
      console.log('test:sub3:', ConversationListFragment.name, event);
      const eventType = event.type as MessageEventType;
      switch (eventType) {
        case 'on_send_before':
          {
            const eventParams = event.params as { message: ChatMessage };
            const conv = getConv(eventParams.message.conversationId);
            if (conv === undefined) {
              return;
            }
            manualRefresh({
              type: 'update-one',
              items: [
                standardizedData({
                  ...conv,
                  count: 0,
                  lastMsg: eventParams.message,
                } as ItemDataType),
              ],
            });
          }
          break;
        case 'on_send_result':
          {
            const eventParams = event.params as { message: ChatMessage };
            const conv = getConv(eventParams.message.conversationId);
            if (conv === undefined) {
              return;
            }
            manualRefresh({
              type: 'update-one',
              items: [
                standardizedData({
                  ...conv,
                  count: 0,
                  lastMsg: eventParams.message,
                } as ItemDataType),
              ],
            });
          }
          break;
        default:
          break;
      }
    });

    return () => {
      sub.remove();
      sub2.remove();
      sub3.remove();
    };
  }, [
    client.chatManager,
    duplicateCheck,
    getConv,
    getConvCount,
    getConvId,
    getConvIfNot,
    getExisted,
    manualRefresh,
    standardizedData,
    updateAllUnreadCount,
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
      .getAllConversations()
      .then(async (result) => {
        if (result) {
          const r = result.map(async (value) => {
            const msg = await client.chatManager.getLatestMessage(
              value.convId,
              value.convType
            );
            const count = await client.chatManager.getConversationUnreadCount(
              value.convId,
              value.convType
            );
            return standardizedData({
              key: value.convId,
              convId: value.convId,
              convType: value.convType,
              lastMsg: msg,
              convContent: '',
              count: count,
            } as ItemDataType);
          });
          const rr = [] as ItemDataType[];
          const convIds = [] as string[];
          for (const item of r) {
            const rrr = await item;
            rr.push(rrr);
            convIds.push(rrr.convId);
          }
          manualRefresh({ type: 'init', items: rr });
          initDirs(convIds);
        }
      })
      .catch((error) => {
        console.warn('test:error:', error);
      });
  }, [client.chatManager, initDirs, manualRefresh, standardizedData]);

  React.useEffect(() => {
    const load = () => {
      console.log('test:load:', ConversationListFragment.name);
      const unsubscribe = addListeners();
      initList();
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', ConversationListFragment.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners, initList]);

  return (
    <React.Fragment>
      <ListSearchHeader
        autoFocus={autoFocus()}
        onChangeText={(text) => {
          queueTask(() => {
            const r: ItemDataType[] = [];
            for (const item of data) {
              if (item.key.includes(text)) {
                r.push(item);
              }
            }
            listRef.current?.manualRefresh([
              {
                type: 'clear',
              },
              {
                type: 'add',
                data: r,
                enableSort: true,
              },
            ]);
          });
        }}
      />
      <EqualHeightList
        parentName="ConversationList"
        ref={listRef}
        items={data}
        ItemFC={Item}
        enableAlphabet={enableAlphabet}
        enableRefresh={enableRefresh}
        enableHeader={enableHeader}
        alphabet={{
          alphabetCurrent: {
            backgroundColor: 'orange',
            color: 'white',
          },
          alphabetItemContainer: {
            width: sf(15),
            borderRadius: sf(8),
          },
        }}
        ItemSeparatorComponent={ListItemSeparator}
        onRefresh={(type) => {
          if (type === 'started') {
            initList();
          }
        }}
      />
    </React.Fragment>
  );
}

const styles = createStyleSheet({
  item: {
    // flex: 1,
    // backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 0,
    marginHorizontal: 0,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    marginLeft: 10,
  },
});