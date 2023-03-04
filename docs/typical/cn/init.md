[返回父文档](./index.md)

---

## 初始化

初始化是使用 `uikit` 必不可少的部分。

初始化部分包括了很多用户自定义的参数，决定后续运行的表现。

`uikit` 初始化组件是 `GlobalContainer`, 它提供了参数列表 `GlobalContainerProps`。

```typescript
export type GlobalContainerProps = React.PropsWithChildren<{
  option: {
    appKey: string;
    autoLogin: boolean;
  };
  localization?: StringSetContextType | undefined;
  theme?: ThemeContextType | undefined;
  sdk?: ChatSdkContextType | undefined;
  header?: HeaderContextType | undefined;
  services?: {
    clipboard?: ClipboardService | undefined;
    media?: MediaService | undefined;
    notification?: NotificationService | undefined;
    permission?: PermissionService | undefined;
    storage?: LocalStorageService | undefined;
    dir?: DirCacheService | undefined;
  };
  onInitialized?: () => void;
}>;
```

参数说明:

- option:
  - appKey: The application id from the console.
  - autoLogin: Whether to use automatic login.
- localization: Application language internationalization. English is supported by default.
- theme: Apply the theme. The system provides the 'light' version by default.
- sdk: Chat SDK.
- header: Status bar Settings for mobile devices.
- services:
  - clipboard: Paste board service. 'uikit' provides the default version.
  - media: Media services. 'uikit' provides the default version.
  - notification: Notification service. 'uikit' provides the default version.
  - permission: Apply permission service. 'uikit' provides the default version.
  - storage: Storage service. Currently support 'key-value' persistent storage. 'uikit' provides the default version.
  - dir: Directory service. 'uikit' provides the default version.

很多参数提供了默认值。

最简化版本:

```typescript
export default function App() {
  return <GlobalContainer option={{ appKey: 'test#demo', autoLogin: false }} />;
}
```

### 本地环境

在 `初始化` 项目的时候，会自动创建 `env.ts` , 里面的参数可选。

```typescript
export const test = false; // test mode or no
export const appKey = ''; // from register console
export const id = ''; // default user id
export const ps = ''; // default password or token
export const accountType = 'agora'; // 'easemob' or 'agora'
```

[sample code](https://github.com/easemob/react-native-chat-library/tree/dev/example/src/App.tsx)
