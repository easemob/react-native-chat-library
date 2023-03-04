[返回父文档](./index.md)

---

## 退出

退出登录主要分为两种情况：

1. 用户主动退出登录
2. 用户被服务器踢掉，原因可能有很多种。

## 主动退出

```typescript
logoutAction({
  onResult: ({ result, error }) => {
    if (result === true) {
      // TODO: Operations performed after a successful exit.
    } else {
      // TODO: Exit operation after failure.
    }
  },
});
```

## 被动退出

被动退出的原因有很多：例如：被用户其它设备踢掉、被服务器禁止登录、用户修改了密码、token 过期等。

被动退出主要通过监听事件来实现。

```typescript
DeviceEventEmitter.addListener(ConnectStateChatSdkEvent, (event) => {
  console.log('test:SplashScreen:addListener:', event);
  const eventType = event.type as ConnectStateChatSdkEventType;
  switch (eventType) {
    case 'onConnected':
      break;
    case 'onDisconnected':
      break;
    case 'onTokenDidExpire':
      break;
    case 'onTokenWillExpire':
      break;

    default:
      break;
  }
});
```

退出按钮目前在我的设置页面。
[sample code](https://github.com/easemob/react-native-chat-library/tree/dev/example/src/screens/MySetting.tsx)
