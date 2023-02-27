# uikit sdk && demo

介绍 uikit 和 demo 的安装和使用。

## 环境需求

系统:

- mac 10.15.7 或以上

软件：

- nodejs 16 或以上
- yarn 1 (不建议使用 `npm` )
- react-native 0.63.5 或以上
- typescript 4.0.0 或以上

**注意** 不建议使用 `0.69.0` 或以上版本，问题多，需要动手能强的人自行解决。
**注意** `react-native` 0.63.5 修复了 `android` 平台的重大问题，其它版本也建议使用 .5 以上版本。

## 开发工具建议

- typescript: visual studio code latest && typescript plugin v5.0.202301100 或以下 (**注意**最新版本遇到问题)
- ios: Xcode 13.4 (**注意** 如果升级到 14 将不能使用虚拟机 12.4)
- android: Android studio 2021.3.1 或以上

## demo 项目

在 `example` 目录下。

使用 `uikit sdk` 完成聊天应用示例。

目前支持，登录退出，好友添加删除、群组创建解散、系统通知处理、个人、群组聊天等功能。

## uikit sdk 项目

在 `packages/react-native-chat-uikit` 目录下。

`uikit sdk` 提供了基础的组件、基础工具以及服务。 大体分为 国际化(默认英文),主题(默认 light), 粘贴板、文件目录、本地存储、媒体服务等。

### uikit sdk 功能介绍

UI 组件是 uikit sdk 里面非常重要的组成部分。 主要包括 `模态窗口系列` `按钮系列` `列表系列` `搜索系列`。
[详见](https://github.com/AsteriskZuo/react-native-chat-library/tree/master/packages/react-native-chat-uikit/src/components)

`Provider` 提供数据共享服务，目前主要包括 `模态窗口管理` `国际化` `主题` 等。
[详见](https://github.com/AsteriskZuo/react-native-chat-library/tree/master/packages/react-native-chat-uikit/src/contexts)

`uikit sdk` 提供了各种基础功能服务。例如：存储服务、媒体服务、权限服务、目录服务、粘贴板服务等。目前通过单实例的方式提供。
[详见](https://github.com/AsteriskZuo/react-native-chat-library/tree/master/packages/react-native-chat-uikit/src/services)

`uikit sdk` 提供了 `theme` 服务。目前默认为 `light` 模板，后续将推出更多模板。用户也可以根据自己的需要继续自定义。
[详见](https://github.com/AsteriskZuo/react-native-chat-library/tree/master/packages/react-native-chat-uikit/src/theme)

`uikit sdk` 提供了 `internationalization` 服务。目前默认为英文，可以根据需要创建不用语言的模板。
[详见](https://github.com/AsteriskZuo/react-native-chat-library/tree/master/packages/react-native-chat-uikit/src/I18n2)

`Container` 是 uikit sdk 的复合组件，将各类服务、数据、工具都集合在一起管理和使用。
[详见](https://github.com/AsteriskZuo/react-native-chat-library/tree/master/packages/react-native-chat-uikit/src/containers)

对于不同尺寸的设备，可以使用工具进行适配。
[详见](https://github.com/AsteriskZuo/react-native-chat-library/tree/master/packages/react-native-chat-uikit/src/styles)

## uikit sdk 项目使用方式

主要有以下几种：

1. 默认使用，只需要添加少量代码就可以实现页面级开发。例如： `ChatFragment`，`ConversationListFragment`。
2. 拷贝使用，只需要将对应的组件复制到自己的项目，修改后使用。例如：`SignInScreen`。

### 使用示例：页面

以聊天页面为例：

`ChatFragment` 封装了默认的 聊天页面，包括消息气泡显示和消息输入发送等操作。
[源码](https://github.com/AsteriskZuo/react-native-chat-library/tree/master/example/src/screens/Chat.tsx)

```typescript
// ScreenContainer Primary purpose: Improve code reuse and reduce data refresh for modal creation
// ChatFragment The default chat page is implemented
export default function ChatScreen({ route, navigation }: Props): JSX.Element {
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment screenParams={route.params} />
    </ScreenContainer>
  );
}
```

对于想要添加自定义消息或者样式的需求，可以将 `ChatFragment` 整体复制到自己的目录进行修改和使用。

以会话列表为例：

`ConversationListFragment` 封装了默认的会话列表页面，可以对列表进行搜索和基本的添加删除等操作。
[源码](https://github.com/AsteriskZuo/react-native-chat-library/tree/master/example/src/screens/ConversationList.tsx)

```typescript
export default function ConversationListScreen({
  navigation,
}: Props): JSX.Element {
  return (
    <SafeAreaView
      mode="padding"
      style={useStyleSheet().safe}
      edges={['right', 'left']}
    >
      {isEmpty ? <Blank /> : <ConversationListFragment />}
    </SafeAreaView>
  );
}
```

对于想要添加自定义消息或者样式的需求，可以将 `ConversationListFragment` 整体复制到自己的目录进行修改和使用。

`SignInScreen` 页面没有进行代码抽离，页面代码在 `example` 中暴露所有实现细节，用户可以通过需求进行相应更改。
[源码](https://github.com/AsteriskZuo/react-native-chat-library/tree/master/example/src/screens/SignIn.tsx)

### 使用示例：UI 组件

UI 组件的使用一般比较简单。对应示例也非常丰富。
例如：`Checkbox` `RadioButton` 可以参考 [源码](https://github.com/AsteriskZuo/react-native-chat-library/tree/master/example/src/__dev__/test_check_button.tsx)
其它 UI 组件基本都有对应的示例，甚至是正式使用方法。请在 repo 中搜索。

### 使用示例：粘贴板

典型场景：点击 id 复制到 指定的地方进行使用。

```typescript
// copy to clipboard
Services.cbs.setString(id);
// copy from clipboard
const content = Services.cbs..getString();
```

### 使用示例：国际化

国际化使用 `Provider` 实现，所以，需要在自己的项目中自定义。
[参考 1](https://github.com/AsteriskZuo/react-native-chat-library/tree/master/example/src/contexts/AppI18nContext.tsx)
[参考 2](https://github.com/AsteriskZuo/react-native-chat-library/tree/master/example/src/I18n/AppCStringSet.en.ts)

```typescript
export function useAppI18nContext(): AppStringSet {
  return uikit.useI18nContext() as AppStringSet;
}
```

```typescript
export class AppStringSet extends UIKitStringSet2 {
  // TODO: add custom content
}
```

### 使用示例：主题

获取预置的样式、颜色、字体来使用，而不需要重复性的创建。
主题可以在项目初始化的时候进行设置。

```typescript
const theme = useThemeContext();
```

```typescript
// LightTheme it can be built in or customized.
export default function App() {
  const isLightTheme = LightTheme.scheme === 'light';
  return <GlobalContainer theme={isLightTheme ? LightTheme : DarkTheme} />;
}
```

### 使用示例：uikit sdk 初始化

初始化是 uikit sdk 必不可少的一个环节。

```typescript
export default function App() {
  updateScaleFactor(createAppScaleFactor());

  const isLightTheme = LightTheme.scheme === 'light';

  // create permission service
  const permission = Services.createPermissionService({
    permissions: Permissions,
    firebaseMessage: FirebaseMessage,
  });

  // create media service
  const media = Services.createMediaService({
    videoModule: VideoComponent,
    videoThumbnail: CreateThumbnail,
    imagePickerModule: ImagePicker,
    documentPickerModule: DocumentPicker,
    mediaLibraryModule: MediaLibrary,
    fsModule: FileAccess,
    audioModule: Audio,
    permission: permission,
  });

  // create local storage service
  const storage = Services.createLocalStorageService();

  const [isReady, setIsReady] = React.useState(__DEV__ ? false : true);
  const [initialState, setInitialState] = React.useState();
  const sf = getScaleFactor();

  return (
    <React.StrictMode>
      <GlobalContainer
        option={{ appKey: appKey, autoLogin: false }}
        theme={isLightTheme ? LightTheme : DarkTheme}
        localization={createStringSetEn2(new AppStringSet())}
        sdk={
          new AppChatSdkContext({
            client: ChatClient.getInstance(),
            autoLogin: false,
          })
        }
        header={{
          defaultTitleAlign: 'center',
          defaultStatusBarTranslucent: true,
          defaultHeight: sf(44),
          defaultTopInset: sf(44),
        }}
        services={{
          clipboard: Services.createClipboardService({
            clipboard: Clipboard,
          }),
          notification: Services.createNotificationService({
            firebaseMessage: FirebaseMessage,
            permission: permission,
          }),
          media: media,
          permission: permission,
          storage: storage,
          dir: Services.createDirCacheService({
            media: media,
          }),
        }}
      / >);
}
```
