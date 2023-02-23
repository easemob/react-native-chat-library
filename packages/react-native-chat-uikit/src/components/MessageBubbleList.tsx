import * as React from 'react';
import {
  DeviceEventEmitter,
  Image,
  ListRenderItem,
  ListRenderItemInfo,
  Platform,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { ChatMessageType } from 'react-native-chat-sdk';

import { type ChatEventType, ChatEvent } from '../fragments';
import { getScaleFactor } from '../styles/createScaleFactor';
import createStyleSheet from '../styles/createStyleSheet';
import { wait } from '../utils/function';
import { seqId, timestamp } from '../utils/generator';
import { DefaultAvatar } from './DefaultAvatars';
import DynamicHeightList, {
  type DynamicHeightListRef,
} from './DynamicHeightList';
import { type LocalIconName, LocalIcon } from './Icon';
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
  type: ChatMessageType;
  state?: MessageItemStateType;
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
  length: number;
  localPath?: string;
  remoteUrl?: string;
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
//   length: 45,
//   type: ChatMessageType.VOICE,
// };
// const voice2: VoiceMessageItemType = {
//   sender: 'zs',
//   timestamp: timestamp(),
//   isSender: true,
//   key: seqId('ml').toString(),
//   length: 45,
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
    const { item } = info;
    const msg = item as TextMessageItemType;
    return (
      <View
        style={[
          styles.container,
          {
            flexDirection: msg.isSender ? 'row-reverse' : 'row',
            width: '90%',
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
    const encode = (url: string) => {
      return Platform.select({
        ios: encodeURI(url),
        android: `file://${encodeURI(url).replace('#', '%23')}`, // !!! try fix android bug
      })!;
    };
    const url = (msg: ImageMessageItemType): string => {
      let r: string;
      if (msg.localThumbPath && msg.localThumbPath.length > 0) {
        console.log('test:localThumbPath:', encode(msg.localThumbPath));
        r = Platform.select({
          ios: msg.localThumbPath,
          android: `file://${encode(msg.localThumbPath)}`,
        })!;
      } else if (msg.localPath && msg.localPath.length > 0) {
        console.log('test:localPath:', msg.localPath);
        r = Platform.select({
          ios: msg.localPath,
          android: `file://${encode(msg.localPath)}`,
        })!;
      } else {
        r = Platform.select({
          ios: msg.remoteUrl,
          android: encode(msg.remoteUrl!),
        })!;
      }
      console.log('test:url:', r);
      return r;
    };
    console.log('test:msg:', msg);

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
              uri: url(msg),
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
    const _width = (length: number) => {
      if (length < 0) {
        throw new Error('The voice length cannot be less than 0.');
      }
      return width * 0.7 * (1 / 60) * (length > 60 ? 60 : length);
    };
    return (
      <View
        style={[
          styles.container,
          {
            flexDirection: msg.isSender ? 'row-reverse' : 'row',
            width: _width(msg.length ?? 1),
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
            {msg.length.toString() + "'"}
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
const MessageRenderItem: ListRenderItem<MessageItemType> = (
  info: ListRenderItemInfo<MessageItemType>
): React.ReactElement | null => {
  const { item } = info;
  let MessageItem: ListRenderItem<MessageItemType>;
  if (item.type === ChatMessageType.TXT) {
    MessageItem = TextMessageRenderItem;
  } else if (item.type === ChatMessageType.IMAGE) {
    MessageItem = ImageMessageRenderItem;
  } else if (item.type === ChatMessageType.VOICE) {
    MessageItem = VoiceMessageRenderItem;
  } else {
    throw new Error('error');
  }
  return (
    <View
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
    </View>
  );
};
export type MessageBubbleListRef = {
  scrollToEnd: () => void;
  scrollToTop: () => void;
  addMessage: (msg: MessageItemType[]) => void;
};
export type MessageBubbleListProps = {
  onPressed?: () => void;
};
const MessageBubbleList = (
  props: MessageBubbleListProps,
  ref?: React.Ref<MessageBubbleListRef>
): JSX.Element => {
  const { onPressed } = props;
  const enableRefresh = true;
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const data1 = React.useMemo(() => [] as MessageItemType[], []);
  const data2 = React.useMemo(() => [] as MessageItemType[], []);
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

  const updateDataInternal = React.useCallback(
    (data: MessageItemType[]) => {
      if (data === data1) {
        for (let index = 0; index < data1.length; index++) {
          const element = data1[index] as MessageItemType;
          data2[index] = element;
        }
        data2.splice(data1.length, data2.length);
        setItems(data2);
      } else if (data === data2) {
        for (let index = 0; index < data2.length; index++) {
          const element = data2[index] as MessageItemType;
          data1[index] = element;
        }
        data1.splice(data2.length, data1.length);
        setItems(data1);
      } else {
        throw new Error('This is impossible.');
      }
    },
    [data1, data2]
  );

  const updateData = React.useCallback(
    ({
      type,
      items: list,
    }: {
      type: 'add' | 'update-all' | 'update-part';
      items: MessageItemType[];
    }) => {
      switch (type) {
        case 'add':
          items.push(...list);
          // setItems([...items]);
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
          // setItems([...items]);
          break;
        case 'update-part':
          // for (const item of items) {
          //   for (const i of list) {
          //     if (item.key === i.key) {
          //       if (i.isSender) item.isSender = i.isSender;
          //       if (i.sender) item.sender = i.sender;
          //       if (i.state) item.state = i.state;
          //       if (i.timestamp) item.timestamp = i.timestamp;
          //       if (i.type) item.type = i.type;
          //     }
          //   }
          // }
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
          // setItems([...items]);
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
      addMessage: (msgs: MessageItemType[]) => {
        updateData({ type: 'add', items: msgs });
      },
    }),
    [updateData]
  );

  const initList = React.useCallback(() => {}, []);

  const addListeners = React.useCallback(() => {
    const sub1 = DeviceEventEmitter.addListener(ChatEvent, (event) => {
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
                items: [eventParams.item],
              });
            } else {
              updateData({
                type: 'update-part',
                items: [eventParams.item],
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
        updateData({
          type: 'add',
          items: [
            {
              sender: 'zs',
              timestamp: timestamp(),
              isSender: false,
              key: seqId('ml').toString(),
              style: {
                // backgroundColor: 'yellow',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '66%',
                // height: 80,
                flexDirection: 'row',
                flexWrap: 'wrap',
              },
              text: 'test',
              type: ChatMessageType.TXT,
            } as TextMessageItemType,
          ],
        });
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
    flex: 1,
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
