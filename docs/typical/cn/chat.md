[返回父文档](./index.md)

---

## 聊天

目前聊天页面支持个人聊天、群组聊天、聊天内容类型支持 文本（moji 表情）、图片和语音。 详见 `ChatFragment` 和 `ChatFragmentProps`

## 组成

聊天页面由 聊天气泡组件 和 输入组件 组成。 详见 `ChatMessageBubbleList` 和 `ChatInput`

重要组件包括：

- `ChatMessageBubbleList` 聊天气泡组件
- `ChatInput` 输入组件
- `ChatFaceList` 表情组件

## 接口

- load 加载组件
- unload 卸载组件

**<span style="color:orange">以上方法是通用的，几乎每个页面都使用了，由于不是 `class` 组件，所以，部分接口无法写在基类，后续优化。</span>**

- initList 初始化历史消息记录
- initDirs 初始化资源目录
- clearRead 标记会话已读
- sendTextMessage 发送文本消息
- sendImageMessage 发送图片消息
- sendVoiceMessage 发送语音消息
- sendCustomMessage 发送自定义消息
- loadHistoryMessage 加载历史消息
- showFace 显示表情
- hideFace 隐藏表情
- downloadAttachment 下载附件

## 属性

`ChatFragmentProps` 属性主要包括 会话 ID 会话类型 和 其它。

```typescript
type ChatFragmentProps = {
  screenParams: {
    params: {
      chatId: string;
      chatType: number;
    };
  };
  onUpdateReadCount?: (unreadCount: number) => void;
  onItemPress?: (data: MessageItemType) => void;
  onItemLongPress?: (data: MessageItemType) => void;
};
```

## 聊天气泡项

目前包括：文本、语音、图片消息气泡。 目前源码封装在 `MessageBubbleList` 组件中。

### 文本

- `TextMessageItemType`: 数据源
- `TextMessageRenderItem`: 渲染组件

### 图片

- `ImageMessageItemType`:数据源
- `ImageMessageRenderItem`:渲染组件

### 语音

- `VoiceMessageItemType`:数据源
- `VoiceMessageRenderItem`:渲染组件

## 扩展

对于有更多更改需求的用户，可以参考 `ChatFragment` 设计和实现。
对于自定义消息有更改需求的用户，可以参考 `ChatMessageBubbleList` 设计和实现。
对于输入组件有更改需求的用户，可以参考 `ChatInput` 设计和实现。

## 特别说明

为了解决代码重用和减少数据加载，添加多了个子组件。例如： `ChatContent` `ChatInput`。

[sample code](https://github.com/easemob/react-native-chat-library/tree/dev/example/src/fragments/Chat.tsx)
