import * as React from 'react';
import {
  DeviceEventEmitter,
  // Image as RNImage,
  ListRenderItem,
  ListRenderItemInfo,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { ChatMessageType } from 'react-native-chat-sdk';

import { type ChatEventType, ChatEvent } from '../fragments';
import { getScaleFactor } from '../styles/createScaleFactor';
import createStyleSheet from '../styles/createStyleSheet';
import { wait } from '../utils/function';
import { DefaultAvatar } from './DefaultAvatars';
import DynamicHeightList, {
  type DynamicHeightListRef,
} from './DynamicHeightList';
import { type LocalIconName, LocalIcon } from './Icon';
import Image from './Image';
import Loading from './Loading';

export type MessageItemStateType =
  | 'unread'
  | 'read'
  | 'arrived'
  | 'played'
  | 'sending'
  | 'failed'
  | 'receiving';

export interface MessageItemType {
  sender: string;
  timestamp: number;
  isSender?: boolean;
  key: string;
  msgId: string;
  type: ChatMessageType;
  state?: MessageItemStateType;
  onPress?: (data: MessageItemType) => void;
  onLongPress?: (data: MessageItemType) => void;
}

export interface TextMessageItemType extends MessageItemType {
  text: string;
}

export interface ImageMessageItemType extends MessageItemType {
  displayName: string;
  localPath?: string;
  localThumbPath?: string;
  remoteUrl?: string;
  memoSize?: number;
  width?: number;
  height?: number;
}
export interface VoiceMessageItemType extends MessageItemType {
  duration: number;
  localPath?: string;
  remoteUrl?: string;
}
export interface CustomMessageItemType extends MessageItemType {
  // SubComponent: (props: React.PropsWithChildren<any>) => React.ReactElement;
  SubComponent: React.FunctionComponent<
    MessageItemType & { eventType: string; data: any }
  >;
  SubComponentProps: MessageItemType & { eventType: string; data: any };
}
// const text1: TextMessageItemType = {
//   sender: 'zs',
//   timestamp: timestamp(),
//   isSender: false,
//   key: seqId('ml').toString(),
//   text: 'Uffa, ho tanto da raccontare alla mia famiglia, ma quando chiamano loro dagli Stati Uniti io ho lezione e quando posso telefonare io loro dormono!',
//   type: ChatMessageType.TXT,
//   state: 'sending',
// };
// const text2: TextMessageItemType = {
//   sender: 'zs',
//   timestamp: timestamp(),
//   isSender: true,
//   key: seqId('ml').toString(),
//   text: 'Uffa, ho tanto da raccontare alla mia famiglia, ma quando chiamano loro dagli Stati Uniti io ho lezione e quando posso telefonare io loro dormono!',
//   type: ChatMessageType.TXT,
//   state: 'arrived',
// };
// const image1: ImageMessageItemType = {
//   sender: 'self',
//   timestamp: timestamp(),
//   isSender: false,
//   key: seqId('ml').toString(),
//   remoteUrl:
//     'https://t4.focus-img.cn/sh740wsh/zx/duplication/9aec104f-1380-4425-a5c6-bc03000c4332.JPEG',
//   type: ChatMessageType.IMAGE,
// };
// const image2: ImageMessageItemType = {
//   sender: 'self',
//   timestamp: timestamp(),
//   isSender: true,
//   key: seqId('ml').toString(),
//   remoteUrl:
//     'https://t4.focus-img.cn/sh740wsh/zx/duplication/9aec104f-1380-4425-a5c6-bc03000c4332.JPEG',
//   type: ChatMessageType.IMAGE,
// };
// const voice1: VoiceMessageItemType = {
//   sender: 'zs',
//   timestamp: timestamp(),
//   isSender: false,
//   key: seqId('ml').toString(),
//   duration: 60,
//   type: ChatMessageType.VOICE,
// };
// const voice2: VoiceMessageItemType = {
//   sender: 'zs',
//   timestamp: timestamp(),
//   isSender: true,
//   key: seqId('ml').toString(),
//   duration: 3,
//   type: ChatMessageType.VOICE,
// };

const convertState = (state?: MessageItemStateType): LocalIconName => {
  let r = 'sent' as LocalIconName;
  switch (state) {
    case 'arrived':
      r = 'read';
      break;
    case 'failed':
      r = 'ex_mark';
      break;
    case 'sending':
      r = 'loading2';
      break;
    default:
      break;
  }
  return r;
};

const StateLabel = React.memo(({ state }: { state?: MessageItemStateType }) => {
  const sf = getScaleFactor();
  if (state === 'sending') {
    return <Loading name={convertState(state)} size={sf(12)} />;
  } else {
    return <LocalIcon name={convertState(state)} size={sf(12)} />;
  }
});

const TextMessageRenderItem: ListRenderItem<MessageItemType> = React.memo(
  (info: ListRenderItemInfo<MessageItemType>): React.ReactElement | null => {
    const sf = getScaleFactor();
    const { width: screenWidth } = useWindowDimensions();
    const { item } = info;
    const msg = item as TextMessageItemType;
    return (
      <View
        style={[
          styles.container,
          {
            flexDirection: msg.isSender ? 'row-reverse' : 'row',
            width: screenWidth * 0.9,
          },
        ]}
      >
        <View
          style={[
            {
              marginRight: msg.isSender ? undefined : sf(10),
              marginLeft: msg.isSender ? sf(10) : undefined,
            },
          ]}
        >
          <DefaultAvatar size={sf(24)} radius={sf(12)} />
        </View>
        <View
          style={[
            styles.innerContainer,
            {
              borderBottomRightRadius: msg.isSender ? undefined : sf(12),
              borderBottomLeftRadius: msg.isSender ? sf(12) : undefined,
              maxWidth: screenWidth * 0.7,
            },
          ]}
        >
          <Text
            style={[
              styles.text,
              {
                backgroundColor: msg.isSender ? '#0041FF' : '#F2F2F2',
                color: msg.isSender ? 'white' : '#333333',
              },
            ]}
          >
            {msg.text}
          </Text>
        </View>
        <View
          style={[
            {
              marginRight: msg.isSender ? sf(10) : undefined,
              marginLeft: msg.isSender ? undefined : sf(10),
              opacity: 1,
            },
          ]}
        >
          <StateLabel state={msg.state} />
        </View>
      </View>
    );
  }
);
// height < 50%, width < 200px,
const ImageMessageRenderItem: ListRenderItem<MessageItemType> = React.memo(
  (info: ListRenderItemInfo<MessageItemType>): React.ReactElement | null => {
    const sf = getScaleFactor();
    const { item } = info;
    const msg = item as ImageMessageItemType;
    const url = (msg: ImageMessageItemType): string => {
      let r: string;
      if (msg.localThumbPath && msg.localThumbPath.length > 0) {
        r = msg.localThumbPath;
      } else if (msg.localPath && msg.localPath.length > 0) {
        r = msg.localPath;
      } else {
        r = msg.remoteUrl ?? '';
      }
      r = encodeURI(r);
      r = r.replace('#', '%23');
      // return '/var/mobile/Containers/Data/Application/10335732-F30F-46F6-93C1-2C89FC7C3B4E/Library/Application%20Support/HyphenateSDK/appdata/asterisk001/asterisk003/thumb_128dc850-b4b7-11ed-9711-5313982e6d8a';
      return r;
    };
    const [_url] = React.useState(url(msg));

    return (
      <View
        style={[
          styles.container,
          {
            flexDirection: msg.isSender ? 'row-reverse' : 'row',
            width: '80%',
          },
        ]}
      >
        <View
          style={[
            {
              marginRight: msg.isSender ? undefined : sf(10),
              marginLeft: msg.isSender ? sf(10) : undefined,
            },
          ]}
        >
          <DefaultAvatar size={sf(24)} radius={sf(12)} />
        </View>
        <View
          style={{
            height: sf(200),
            // flex: 1,
            flexGrow: 1,
          }}
        >
          <Image
            source={{
              uri: _url.includes('file://') ? _url : `file://${_url}`,
            }}
            resizeMode="cover"
            style={{ height: sf(200), borderRadius: sf(10) }}
            onLoad={(_) => {}}
            onError={(_) => {}}
          />
        </View>
        <View
          style={[
            {
              marginRight: msg.isSender ? sf(10) : undefined,
              marginLeft: msg.isSender ? undefined : sf(10),
              opacity: 1,
            },
          ]}
        >
          <StateLabel state={msg.state} />
        </View>
      </View>
    );
  }
);

const VoiceMessageRenderItem: ListRenderItem<MessageItemType> = React.memo(
  (info: ListRenderItemInfo<MessageItemType>): React.ReactElement | null => {
    const sf = getScaleFactor();
    const { item } = info;
    const { width } = useWindowDimensions();
    const msg = item as VoiceMessageItemType;
    const _width = (duration: number) => {
      if (duration < 0) {
        throw new Error('The voice length cannot be less than 0.');
      }
      let r = width * 0.7 * (1 / 60) * (duration > 60 ? 60 : duration);
      r = r < 150 ? 150 : r;
      return r;
    };
    return (
      <View
        style={[
          styles.container,
          {
            flexDirection: msg.isSender ? 'row-reverse' : 'row',
            width: _width(msg.duration ?? 1),
          },
        ]}
      >
        <View
          style={[
            {
              marginRight: msg.isSender ? undefined : sf(10),
              marginLeft: msg.isSender ? sf(10) : undefined,
            },
          ]}
        >
          <DefaultAvatar size={sf(24)} radius={sf(12)} />
        </View>
        <View
          style={[
            styles.innerContainer,
            {
              flexDirection: msg.isSender ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              borderBottomRightRadius: msg.isSender ? undefined : sf(12),
              borderBottomLeftRadius: msg.isSender ? sf(12) : undefined,
              backgroundColor: msg.isSender ? '#0041FF' : '#F2F2F2',
            },
          ]}
        >
          <LocalIcon
            name={msg.isSender ? 'wave3_left' : 'wave3_right'}
            size={sf(22)}
            color={msg.isSender ? 'white' : '#A9A9A9'}
            style={{ marginHorizontal: sf(8) }}
          />
          <Text
            style={[
              styles.text,
              {
                color: msg.isSender ? 'white' : 'black',
                backgroundColor: msg.isSender ? '#0041FF' : '#F2F2F2',
              },
            ]}
          >
            {Math.round(msg.duration).toString() + "'"}
          </Text>
        </View>
        <View
          style={[
            {
              marginRight: msg.isSender ? sf(10) : undefined,
              marginLeft: msg.isSender ? undefined : sf(10),
              opacity: 1,
            },
          ]}
        >
          <StateLabel state={msg.state} />
        </View>
      </View>
    );
  }
);
const CustomMessageRenderItem: ListRenderItem<MessageItemType> = React.memo(
  (info: ListRenderItemInfo<MessageItemType>): React.ReactElement | null => {
    const { item } = info;
    const { SubComponent, SubComponentProps } = item as CustomMessageItemType;
    return <SubComponent {...SubComponentProps} />;
  }
);

const MessageRenderItem: ListRenderItem<MessageItemType> = (
  info: ListRenderItemInfo<MessageItemType>
): React.ReactElement | null => {
  // console.log('test:MessageRenderItem:', info);
  const { item } = info;
  let MessageItem: ListRenderItem<MessageItemType>;
  if (item.type === ChatMessageType.TXT) {
    MessageItem = TextMessageRenderItem;
  } else if (item.type === ChatMessageType.IMAGE) {
    MessageItem = ImageMessageRenderItem;
  } else if (item.type === ChatMessageType.VOICE) {
    MessageItem = VoiceMessageRenderItem;
  } else if (item.type === ChatMessageType.CUSTOM) {
    MessageItem = CustomMessageRenderItem;
  } else {
    throw new Error('error');
  }
  return (
    <Pressable
      onPress={() => {
        item.onPress?.(item);
      }}
      onLongPress={() => {
        item.onLongPress?.(item);
      }}
      style={{
        width: '100%',
        alignItems:
          item.isSender === undefined
            ? 'center'
            : item.isSender === true
            ? 'flex-end'
            : 'flex-start',
      }}
    >
      <MessageItem {...info} />
    </Pressable>
  );
};
export type InsertDirectionType = 'before' | 'after';
export type MessageBubbleListRef = {
  scrollToEnd: () => void;
  scrollToTop: () => void;
  addMessage: (params: {
    msgs: MessageItemType[];
    direction: InsertDirectionType;
  }) => void;
};
export type MessageBubbleListProps = {
  onPressed?: () => void;
  CustomMessageRenderItem?: React.FunctionComponent<
    React.PropsWithChildren<MessageItemType & { eventType: string; data: any }>
  >;
};
const MessageBubbleList = (
  props: MessageBubbleListProps,
  ref?: React.Ref<MessageBubbleListRef>
): JSX.Element => {
  const { onPressed, CustomMessageRenderItem } = props;
  console.log('test:', CustomMessageRenderItem);
  const enableRefresh = true;
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const data1 = React.useMemo(() => [] as MessageItemType[], []);
  const data2 = React.useMemo(() => [] as MessageItemType[], []);
  const currentData = React.useRef(data1);
  const [items, setItems] = React.useState<MessageItemType[]>(data1);
  // const items = React.useMemo(() => [] as MessageItemType[], []);
  const listRef = React.useRef<DynamicHeightListRef>(null);
  // const items = React.useMemo(() => {
  //   return _items;
  // }, [_items]);
  // for (let index = 0; index < 100; index++) {
  //   const element: MessageItemType = { key: index.toString() };
  //   items.push(element);
  // }
  if (loading) {
    // items.length = 0;
    // items.push(text1);
    // items.push(text2);
    // items.push(image1);
    // items.push(image2);
    // items.push(voice1);
    // items.push(voice2);
    setLoading(false);
  }

  const getEarliestItem = React.useCallback(() => {
    console.log('test:data1:', data1, data2);
    if (currentData.current === data1) {
      if (data1.length > 0) {
        return data1[0];
      }
    } else if (currentData.current === data2) {
      if (data2.length > 0) {
        return data2[0];
      }
    }
    return undefined;
  }, [data1, data2]);

  const updateDataInternal = React.useCallback(
    (data: MessageItemType[]) => {
      if (data === data1) {
        for (let index = 0; index < data1.length; index++) {
          const element = data1[index] as MessageItemType;
          data2[index] = element;
        }
        data2.splice(data1.length, data2.length);
        setItems(data2);
        currentData.current = data2;
      } else if (data === data2) {
        for (let index = 0; index < data2.length; index++) {
          const element = data2[index] as MessageItemType;
          data1[index] = element;
        }
        data1.splice(data2.length, data1.length);
        setItems(data1);
        currentData.current = data1;
      } else {
        throw new Error('This is impossible.');
      }
    },
    [data1, data2]
  );

  const updateData = React.useCallback(
    ({
      type,
      list,
      direction,
    }: {
      type: 'add' | 'update-all' | 'update-part';
      list: MessageItemType[];
      direction: InsertDirectionType;
    }) => {
      switch (type) {
        case 'add':
          if (direction === 'after') {
            items.push(...list);
          } else {
            const tmp = list.concat(items);
            items.length = 0;
            items.push(...tmp);
          }
          break;
        case 'update-all':
          for (let index = 0; index < items.length; index++) {
            const item = items[index];
            if (item) {
              for (const i of list) {
                if (item.key === i.key) {
                  items[index] = i;
                }
              }
            }
          }
          break;
        case 'update-part':
          for (let index = 0; index < items.length; index++) {
            const item = items[index];
            if (item) {
              for (const i of list) {
                if (item.key === i.key) {
                  if (i.isSender) item.isSender = i.isSender;
                  if (i.sender) item.sender = i.sender;
                  if (i.state) item.state = i.state;
                  if (i.timestamp) item.timestamp = i.timestamp;
                  if (i.type) item.type = i.type;
                  items[index] = { ...item }; // !!! only check array element, not element internal.
                }
              }
            }
          }
          break;
        default:
          return;
      }
      updateDataInternal(items);
    },
    [items, updateDataInternal]
  );

  React.useImperativeHandle(
    ref,
    () => ({
      scrollToEnd: () => {
        listRef.current?.scrollToEnd();
      },
      scrollToTop: () => {},
      addMessage: (params: {
        msgs: MessageItemType[];
        direction: InsertDirectionType;
      }) => {
        updateData({
          type: 'add',
          list: params.msgs,
          direction: params.direction,
        });
      },
    }),
    [updateData]
  );

  const requestHistory = React.useCallback(() => {
    const item = getEarliestItem();
    DeviceEventEmitter.emit(ChatEvent, {
      type: 'request_history_message' as ChatEventType,
      params: { earliestId: item?.msgId },
    });
  }, [getEarliestItem]);

  const initList = React.useCallback(() => {}, []);

  const addListeners = React.useCallback(() => {
    const sub1 = DeviceEventEmitter.addListener(ChatEvent, (event) => {
      // console.log('test:addListeners:msg_state:', event);
      const eventType = event.type as ChatEventType;
      switch (eventType) {
        case 'msg_state':
          {
            const eventParams = event.params as {
              localMsgId: string;
              result: boolean;
              reason?: any;
              item: MessageItemType;
            };
            if (eventParams.result === true) {
              updateData({
                type: 'update-all',
                list: [eventParams.item],
                direction: 'after',
              });
            } else {
              updateData({
                type: 'update-part',
                list: [
                  {
                    key: eventParams.localMsgId,
                    state: 'failed',
                  } as MessageItemType,
                ],
                direction: 'after',
              });
            }
          }
          break;
        case 'msg_progress':
          break;
        default:
          break;
      }
    });
    return () => {
      sub1.remove();
    };
  }, [updateData]);

  React.useEffect(() => {
    const load = () => {
      console.log('test:load:', MessageBubbleList.name);
      const unsubscribe = addListeners();
      initList();
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', MessageBubbleList.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners, initList]);

  return (
    <DynamicHeightList
      ref={listRef}
      items={items}
      extraData={items}
      RenderItemFC={MessageRenderItem}
      enableRefresh={enableRefresh}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        requestHistory();
        wait(1500)
          .then(() => {
            setRefreshing(false);
          })
          .catch();
      }}
      keyExtractor={(_: any, index: number) => {
        return index.toString();
      }}
      onTouchEnd={onPressed}
    />
  );
};

const styles = createStyleSheet({
  container: {
    justifyContent: 'flex-start',
    // backgroundColor: 'yellow',
    alignItems: 'flex-end',
    flexDirection: 'row',
    padding: 10,
  },
  innerContainer: {
    // flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    // backgroundColor: 'red',
    overflow: 'hidden',
  },
  text: {
    backgroundColor: 'rgba(242, 242, 242, 1)',
    padding: 10,
    flexWrap: 'wrap',
  },
});

export default React.forwardRef<MessageBubbleListRef, MessageBubbleListProps>(
  MessageBubbleList
);
