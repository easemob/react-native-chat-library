[返回父文档](./index.md)

---

## 登录

目前，支持 主动登录 和 自动登录 两种方式。

## 正常登录流程

1. 初始化: 初始化需要在应用最开始阶段处理。参考 `App.tsx` 页面的实现。
2. 初始化完成通知: 初始化完成，通过 `GlobalContainer.onInitialized` 回调通知。
3. 登录: 如果采用自动登录，可以在初始化完成之后开始。
4. 登录完成通知: 登录通过 `ChatSdkContextType.login.onResult` 通知用户, 自动登录通过 `ChatSdkContextType.autologin.onResult` 通知用户。

## 主动登录

使用 `uikit sdk` 提供的 登录接口 `ChatSdkContextType.login`，而不是 `chat sdk` 接口 `ChatClient.login`。

登录需要用户提供必要的参数：用户 id 和 用户密码或者 token。

最简化版本的示例：

```typescript
login({
  id: 'userId',
  pass: 'userPassword',
  onResult: (result) => {
    if (result.result === true) {
      // TODO: Operations performed after successful login.
    } else {
      // TOTO: Operations after a login failure.
    }
  },
});
```

## 自动登录

如果设置了自动登录，那么在登录成功之后，后续的登录就会自动进行。

在自动登录前加载的是 `splash` 页面，当登录成功之后，加载 `login` 或者 `home` 页面。

```typescript
autoLogin({
  onResult: ({ result, error }) => {
    if (error === undefined) {
      if (result === true) {
        // TODO:  The application home page is displayed.
      } else {
        // TODO: The login page is displayed.
      }
    } else {
      // TODO: Error handling.
    }
  },
});
```

## 页面

登录页面没有复杂交互逻辑，仅包括 id 或者 password 输入组件，登录按钮组件等。
组件样式和写法都是通用 `react-native`, 对于刚入门的开发者请多参考，对于有经验的开发者可以忽略不计。
[sample code](https://github.com/easemob/react-native-chat-library/tree/dev/example/src/screens/SignIn.tsx)
