[返回父文档](./index.md)

---

## 会话列表

该页面显示最近聊天的记录，通过聊天记录可以快速建立聊天。

组件 `ConversationListFragment` 提供属性 `ConversationListFragmentProps`。

组件 `ConversationListFragment` 主要由搜索组件 `DefaultListSearchHeader` 和列表组件 `ConversationList` 组成。

搜索组件支持本地列表搜索。

列表组件显示最近聊天的会话。

## 会话属性

会话属性目前包括了基本的事件通知。

```typescript
type ConversationListFragmentProps = {
  onLongPress?: (data?: ItemDataType) => void;
  onPress?: (data?: ItemDataType) => void;
  onData?: (data: ItemDataType[]) => void;
  onUpdateReadCount?: (unreadCount: number) => void;
};
```

## 会话接口

页面初始化和反初始化。页面的生命周期是非常重要的概念。在生命周期内要保证页面的正确使用。

- load: 页面加载会调用该方法。
- unload: 页面卸载会调用该方法。

**<span style="color:orange">以上方法是通用的，几乎每个页面都使用了，由于不是 `class` 组件，所以，部分接口无法写在基类，后续优化。</span>**

在初始化阶段，`ConversationListFragment` 主要做了几件事情。

- `initList` 加载会话列表
- `initDirs` 创建会话目录，用来保存消息资源
- `addListeners` 初始化事件监听器，接收需要的事件。例如：消息事件、页面事件等。

在卸载阶段， `ConversationListFragment` 主要是释放资源。

- 释放事件监听器资源

会话提供的基本功能接口:

- `removeConversation` 会话删除
- `createConversation` 创建会话
- `removeConversation` 删除会话
- `updateConversationFromMessage` 更新会话
- `conversationRead` 会话已读

## 会话列表项

如果想要修改会话列表项可以参考 `ItemDataType` 和 `Item` 相关组件源码。

## 典型应用场景

### 创建会话

创建会话有几种方式:

1. 收到消息
2. 进入聊天页面，不聊天会创建临时会话，聊天创建持久会话

### 删除会话

删除会话：目前通过列表项的侧滑显示删除菜单，点击删除。
**注意** 清理该会话的其他痕迹。例如：未读数。

### 进入聊天页面

点击会话列表项，进入聊天页面。

## 会话菜单

会话右上角有一个重要入口，它包括：

1. 创建群组入口
2. 添加联系人入口
3. 搜索群组入口

## 扩展

用户可以根据需要进行 `和` 修改使用。

[sample code](https://github.com/easemob/react-native-chat-library/tree/dev/example/src/fragments/ConversationList.tsx)
