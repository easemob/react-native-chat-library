[返回父文档](./index.md)

---

## 模态系统 + 事件

模态窗口是一类特殊的窗口，和非模态窗口相比，必须处理完当前事务和关闭之后，才能进行后续处理。并且模态窗口相对独立的，悬浮在其他窗口至上，布局和显示都有些不同，所以，封装单独的管理。

通过事件解耦模态窗口代码，管理和维护都方便。

## 模态系统

主要对象：

```typescript
export type sendEventProps = {
  eventType: EventType;
  eventBizType: BizEventType;
  action: ActionEventType;
  senderId: string;
  params: any;
  timestamp?: number;
};
```

主要接口：

- `function sendEvent(params: sendEventProps): void`: 发送事件
- `DeviceEventEmitter.addListener('DataEvent' as DataEventType, (event) => {})`: 接收事件

## 事件

- `AlertActionEventType`: 警告窗口事件
- `ToastActionEventType`: toast 窗口事件
- `SheetActionEventType`: bottomsheet 窗口事件
- `PromptActionEventType`: 提示窗口事件
- `MenuActionEventType`: 上下文菜单窗口事件
- `StateActionEventType`: 自定义状态窗口事件
- `DataActionEventType`: 数据事件（非模态窗口事件）

## 示例: 删除联系人操作流程。

1. 页面发送显示确认对话框命令

```typescript
sendContactInfoEvent({
  eventType: 'AlertEvent',
  action: 'manual_remove_contact',
  params: { userId },
});
```

2. 模态系统收到命令显示对话框，当用户点击确认之后，发送可以执行删除操作命令

```typescript
// The modal system receives the event processing and displays a confirmation dialog.
alert.openAlert({
  title: `Block ${s.userId}`,
  message: contactInfo.deleteAlert.message,
  buttons: [
    {
      text: contactInfo.deleteAlert.cancelButton,
    },
    {
      text: contactInfo.deleteAlert.confirmButton,
      onPress: () => {
        // If the user confirms that the contact is to be deleted, an event is sent
        sendEventFromAlert({
          eventType: 'DataEvent',
          action: 'exec_remove_contact',
          params: alertEvent.params,
          eventBizType: 'contact',
        });
      },
    },
  ],
});
```

3. 页面收到命令，开始执行删除联系人操作，操作完成之后，发送显示删除操作已完成提示

```typescript
// The contact page receives the command to delete contacts.
removeContact(userId, (result) => {
  if (result === true) {
    // After deleting the contact, the toast prompt box is displayed.
    sendContactInfoEvent({
      eventType: 'ToastEvent',
      action: 'toast_',
      params: contactInfo.toast[1]!,
    });
    navigation.goBack();
  }
});
```

4. 模态系统收到显示提示命令，开始显示提示内容

```typescript
// The modal system receives the command to display the toast prompt box.
toast.showToast(content);
```

5. 处理完成关闭，继续后续处理

## 示例源码

[sample code](https://github.com/easemob/react-native-chat-library/tree/dev/example/src/screens/ContactInfo.tsx)
