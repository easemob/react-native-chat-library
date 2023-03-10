[返回父文档](./index.md)

---

## 快速集成聊天页面

聊天页面由多个组件组成。主要包括：消息气泡列表组件、输入组件。 输入组件由表情组件、语音组件、扩展组件组成。

![img](docs/typical/ui_chat_struct_1.jpg)

## 最简单的集成方式

1. 完成 `uikit` 部分初始化 （前面章节有说明）
2. 在页面级中使用 `ChatFragment` 组件

示例代码：

```typescript
import * as React from 'react';
import ChatFragment from '../fragments/Chat';
import { ScreenContainer } from 'react-native-chat-uikit';
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment screenParams={{ chatId, chatType }} />
    </ScreenContainer>
  );
}
```

## 自定义配置的集成方式

除了简单集成方式的说明之外，还提供了可以自定义的配置选项。

#### 聊天组件控制器

控制器可以主动的让组件执行某些行为或者命令。例如：目前提供了发送图片消息、发送语音消息的接口。
如果想要使用控制器，需要在属性里面设置 `propsRef` 属性。

```typescript
export type ChatFragmentRef = {
  sendImageMessage: (params: {
    name: string;
    localPath: string;
    memoSize: string;
    imageType: string;
    width: number;
    height: number;
  }) => void;
  sendVoiceMessage: (params: {
    localPath: string;
    memoSize?: number;
    duration?: number;
  }) => void;
};
```

#### 聊天组件可配置选项

聊天组件的配置项如下：

```typescript
type ChatFragmentProps = {
  propsRef?: React.RefObject<ChatFragmentRef>;
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
  customMessageBubble?: {
    CustomMessageRenderItemP: React.FunctionComponent<
      MessageItemType & { eventType: string; data: any }
    >;
  };
  onUpdateReadCount?: (unreadCount: number) => void;
  onClickMessageBubble?: (data: MessageItemType) => void;
  onLongPressMessageBubble?: (data: MessageItemType) => void;
  onClickInputMoreButton?: () => void;
  onPressInInputVoiceButton?: () => void;
  onPressOutInputVoiceButton?: () => void;
  onSendMessage?: (message: ChatMessage) => void;
  onSendMessageEnd?: (message: ChatMessage) => void;
  onVoiceRecordEnd?: (params: { localPath: string; duration: number }) => void;
};
```

#### 聊天属性：控制器

`propsRef` 该属性主要可以主动调用 `ChatFragment` 的相关方法。

例如：在录制语音消息之后，发送语音消息

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onVoiceRecordEnd={(params) => {
          chatRef.current.sendVoiceMessage(params);
        }}
      />
    </ScreenContainer>
  );
}
```

例如：在选择好图片之后，发送图片消息

```typescript
import type { BizEventType, DataActionEventType } from '../events';
import { DataEventType } from 'react-native-chat-uikit';
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  React.useEffect(() => {
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
  }, [addListeners]);
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onVoiceRecordEnd={(params) => {
          chatRef.current.sendVoiceMessage(params);
        }}
      />
    </ScreenContainer>
  );
}
```

**说明** 需要在初始化的时候设置好模态组件

```typescript
import { ModalPlaceholder } from './events';
export default function App() {
  return (
    <React.StrictMode>
      <GlobalContainer
        option={{
          appKey: appKey,
          autoLogin: autoLogin.current,
          debugModel: true,
        }}
        ModalComponent={() => <ModalPlaceholder />}
      />
    </React.StrictMode>
  );
}
```

#### 聊天属性：聊天气泡列表组件

当默认聊天气泡不能满足自定义需求的时候，可以自行实现聊天气泡。

假设 `MessageBubbleList` 是你自定义的组件。

```typescript
import type { MessageBubbleListProps } from '../fragments/MessageBubbleList';
import MessageBubbleList from '../fragments/MessageBubbleList';
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        messageBubbleList={{
          MessageBubbleListP: MessageBubbleList,
          MessageBubbleListPropsP: {
            onPressed: () => {},
          } as MessageBubbleListProps,
          MessageBubbleListRefP: messageBubbleListRefP as any,
        }}
      />
    </ScreenContainer>
  );
}
```

**说明** 由于 `MessageBubbleList` 实现源码太多，如有需要请参考 [here](https://github.com/easemob/react-native-chat-library/blob/ac7d4cdda36afae34a314e3e5d636be7bcf4b06e/example/src/components/CustomMessageBubble.tsx)

#### 聊天属性：自定义消息组件

假如，你想要自定义一个订单消息，可以使用 `自定义类型` 组件 实现 `自定义消息` 的显示、发送和接收。

自定义消息组件的数据源需要以 `MessageItemType` 为基础类型扩展。
自定义消息组件的渲染部分需要遵守 `FunctionComponent` 组件规则。

```typescript
import { CustomMessageRenderItem } from '../components/CustomMessageBubble';
import type { MessageBubbleListProps } from '../fragments/MessageBubbleList';
import MessageBubbleList from '../fragments/MessageBubbleList';
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        customMessageBubble={{
          CustomMessageRenderItemP: CustomMessageRenderItem,
        }}
      />
    </ScreenContainer>
  );
}
```

**说明** 由于 `CustomMessageRenderItem` 实现源码太多，如有需要请参考 [here](https://github.com/easemob/react-native-chat-library/blob/ac7d4cdda36afae34a314e3e5d636be7bcf4b06e/example/src/components/CustomMessageBubble.tsx)

#### 聊天属性：未读数通知

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onUpdateReadCount={(unreadCount: number) => {
          // TODO: Broadcast no reading notification.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 聊天属性：点击聊天气泡

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onClickMessageBubble={(data: MessageItemType) => {
          // TODO: If it is a voice message, it plays it, if it is a picture message, it previews it.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 聊天属性：长按消息气泡

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onLongPressMessageBubble={() => {
          // TODO: Displays the context menu. For example, message forwarding, message deletion, message resending, etc.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 聊天属性：点击扩展按钮

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onClickInputMoreButton={() => {
          // TODO: Open drawer menu, pop up list, for example: open media library, open document library, etc.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 聊天属性：按下语音按钮

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onPressInInputVoiceButton={() => {
          // TODO: The voice recording starts.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 聊天属性：抬起语音按钮

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onPressOutInputVoiceButton={() => {
          // TODO: The voice recording stops.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 聊天属性：发送消息通知

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onSendMessage={(message: ChatMessage) => {
          // TODO: Update the message.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 聊天属性：发送消息结束通知

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onSendMessageEnd={(message: ChatMessage) => {
          // TODO: Update message status, success or failure.
        }}
      />
    </ScreenContainer>
  );
}
```

#### 聊天属性：语音录制结束通知

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = 'xxx';
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{ chatId, chatType }}
        onVoiceRecordEnd={(params: any) => {
          // TODO: Voice files are processed and voice messages are sent.
        }}
      />
    </ScreenContainer>
  );
}
```
