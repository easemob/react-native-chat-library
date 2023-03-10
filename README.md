_English | [中文](./README.zh.md)_

---

# Quick-Start

Take you to quickly complete the compilation and operation of the project.

## Environmental Preparation

- operating system:
  - MacOS 10.15.7 or above
- Tools collection:
  - Xcode 13.4 or above (if developing iOS platform reference)
  - Android studio 2021.3.1 or above (if developing Android platform applications) (as for short)
  - Visual Studio Code latest (vscode for short)
- Compile and run environment:
  - Java JDK 1.8.0 or above (it is recommended to use Android studio's own)
  - Objective-C 2.0 or above (recommended to use Xcode comes with it)
  - Typescript 4.0 or above
  - Nodejs 16.18.0 or above (brew installation is recommended)
  - yarn 1.22.19 or above (brew installation is recommended)
  - React-Native 0.63.5 or above, 0.69.0 or below (higher versions will exaggerate unknown version compatibility)
  - npm and related tools (**not recommended**, please solve related problems by yourself)
  - expo 6.0.0 or above

## Source Code Download

[download link](https://github.com/easemob/react-native-chat-library/)

```bash
git clone git@github.com:easemob/react-native-chat-library.git
```

## Project Structure

This is a multi-package management project managed by `lerna` and `yarn workspace`.

- `example`: Example project, used to demonstrate and test the developed package.
- `packages/react-native-chat-uikit`: uikit project.
- `packages/react-native-chat-callkit`: callkit project (under development).
- ...

**Note** The commands run by the project are generally in the project root directory, not the corresponding package directory or example directory.

## Compile and Run

#### Project Initialization

1. Use `vscode` to open the project `react-native-chat-library`
2. Use `terminal` to initialize the project `yarn`

**Note** `yarn` is a compound command. For developers who don’t understand the command, more relevant knowledge is needed to replace it with the `npm` command.
**Note** When creating this project, some commands related to `yarn` have been preset, so it is recommended to use `yarn`.

#### Universal Compilation

The operation steps are as follows:

1. Use `terminal` to change directory to `example`
2. Execute the command `yarn run ios` to compile and run the `iOS` application
3. Execute the command `yarn run android` to compile and run the `Android` application

**NOTE** This mode is deprecated for compilation.
**Modify Command** Please refer to `example/package.json` related content.
**Reference** For more information on compiling and running commands, please refer to `expo` related content.

#### Universal Operation

Running an application in development mode requires additional local services, which can dynamically detect file source code modifications and perform dynamic debugging.

1. Using the `terminal` tool, switch to `cd example/ios`
2. Using the `terminal` tool, execute the `yarn run start` command to start the service.

#### iOS Platform

**<span style="color:orange">compile and build the project</span>**

In the compilation phase, the `iOS` platform needs to execute the `pod install` command to generate the Xcode `xcworkspace` project file.

1. Using the `terminal` tool, switch to `cd example/ios`
2. Use the `terminal` tool to execute `pod install` to generate `example/ios/example.xcworkspace`.
3. Use the `Xcode` tool to open the project file `example/ios/example.xcworkspace`
4. If you use the simulator, you need to choose `iOS` 12.4 or below
5. If you use a real device, the developer mode needs to be enabled on the real device, and `singing & capabilities` related content needs to be set in the project
6. Use the `Xcode` tool to execute the compile operation.

**Note** For developers who do not use `Xcode` to compile, they can use the officially recommended method to compile, but it is generally difficult to find the cause of the problem if there is a problem.
**Note** Automatically start additional services. Since services that are not directly started by expo may report errors, don’t worry about it for now, just close the service.

**<span style="color:orange">run the project</span>**

Use the command provided by the `expo` tool to start the local service, refer to the `General Operation` chapter.

**Note** If the running application is not loaded correctly, you need to refresh the page, or close the application and restart it. For error reporting problems, you can generally solve them through corresponding prompts.

#### Android Platform

**<span style="color:orange">compile and build the project</span>**

During the compilation phase, the `Android` platform needs to execute the `sync` initialization project.

1. Start the `as` tool, open the project file `example/android`,
2. Click the `sync project with gradle files` button to execute the `initialization` operation,
3. If using an emulator, please select or create an emulator of version 6.0 or above,
4. If it is a real device, you need to enable the developer mode of the device,
5. When `sync` is successful, click the `run app` button to compile and run the project.

**Note** If you use `as` for the first time, it may take a lot of downloading and the waiting time will be longer.
**Note** If you encounter `timeout`, it may be caused by using the `m1/m2` arm64 version of the MacOS device, you need to use `terminal` to execute the `open -a /Applications/Android\ Studio.app` command to start` as`.

**<span style="color:orange">run the project</span>**

Use the command provided by the `expo` tool to start the local service, refer to the `General Operation` chapter.

**Note** If the running application is not loaded correctly, you need to refresh the page, or close the application and restart it. For error reporting problems, you can generally solve them through corresponding prompts.
**Note** `Android platform devices need data forwarding. The command for data forwarding is `adb reverse tcp:8081 tcp:8081`. But, thanks to the `expo` tool, it does it for you, no manual work required.

## Parameter Settings

After project initialization, a local configuration file of `env.ts` will be generated in the `example` project.

```typescript
export const test = false; // test mode or no
export const appKey = ''; // from register console
export const id = ''; // default user id
export const ps = ''; // default password or token
export const accountType = 'agora'; // 'easemob' or 'agora'
```

- `test`: When it is `true`, the page will switch to the simple component test mode, and the demonstration of the local component can be completed without performing remote operations such as login and logout. Defaults to `false`
- `appKey`: The unique identifier of the application, usually obtained through the background of the website
- `id`: The id of the logged-in user, usually obtained through registration or the background of the website
- `ps`: The secret key of the logged-in user, usually obtained through registration or the background of the website
- `accountType`: You can switch between domestic and foreign logins, the default is `agora`

---

# Integrate UIKIT In Existing Projects

There are several ways to use `uikit`:

1. Create a new project and integrate `uikit`. In this case, you need to pay attention to the development environment. Compile and run errors may be reported due to a very large version span.
2. In the existing project, integrate `uikit`. In this case, you need to pay attention to the compatibility between the existing project version and the `uikit` project version, as well as the dependent version.
3. Modify the `example` project to complete product development. In this case, there are almost no development environment problems, but it is necessary to learn and understand the architectural thinking of `example` in order to better complete application development.

The following is the most common way, the introduction of integrating `uikit` in existing projects.

## Install `uikit` into an existing project

```bash
cd your_project_root
yarn add react-native-chat-uikit
```

For development, compilation, and operation, please refer to relevant chapters. The following uses the integrated chat page as an example to illustrate.

## Quick Integration Chat Page

The chat page consists of several components. It mainly includes: message bubble list component and input component. The input component is composed of emoji component, voice component and extension component.

<img src=https://github.com/easemob/react-native-chat-library/tree/dev/docs/typical/ui_chat_struct_1.jpg width="50%">

<!-- <img src=https://img-blog.csdnimg.cn/20200822014538211.png width=60% /> -->

![img](./docs/typical/ui_chat_struct_1.jpg){: width="100px" height="100px"}

## The Easiest Way To Integrate

1. In the entry method, complete the initialization of `uikit`
2. Use the `ChatFragment` component in the target page

Sample code:

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

## Set Up A Personalized Chat Component

The chat component has many parameters and configurations, which can be set according to the needs to achieve the desired effect. For more advanced customization, please refer to the source code implementation.

#### Chat Component Controller

Controllers can actively make components perform certain actions or commands. For example: Currently, methods for sending picture messages and voice messages are provided.
If you want to use a controller, you need to set the `propsRef` parameter in the chat properties.

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

#### Chat Component Properties

The source code is as follows:

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

#### Chat Properties: Controller

`propsRef` This property is mainly used to actively call related methods of `ChatFragment`.

**Knowledge points** For `React-Native` technical framework, UI components generally provide several ways to determine component behavior.

1. Use attributes to initialize or dynamically update component styles
2. Use attribute callbacks to notify upper-level users of status changes
3. Use controllers (ref) to control the active behavior of subcomponents

Example: After recording a voice message, send the voice message

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

For example: After selecting a picture, send a picture message

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

**Description** The modal window management component needs to be set up during initialization. If this parameter is defaulted, the corresponding event notification may not be received.

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

#### Chat property: chat bubble list component

When the default chat bubble cannot meet the custom requirements, you can design the style of the chat bubble yourself.

Suppose `MessageBubbleList` is your custom chat bubble list component.

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

**Description** Since `MessageBubbleList` implements too many source codes, please refer to it if necessary [here](https://github.com/easemob/react-native-chat-library/tree/dev/example/src/components/CustomMessageBubble.tsx)

#### Chat Properties: Custom Message Components

If you want to customize an order message, you can use the `custom type` component to display, send and receive custom messages (order messages).

The data source of a custom message component needs to be extended with `MessageItemType` as the base type.
The rendering part of the custom message component needs to obey the `FunctionComponent` component rules.

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

**Description** Since `CustomMessageRenderItem` implements too much source code, please refer to it if necessary [here](https://github.com/easemob/react-native-chat-library/tree/dev/example/src/components/CustomMessageBubble.tsx)

#### Chat Properties: Unread Count Notifications

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

#### Chat properties: click on the chat bubble notification

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

#### Chat properties: Long press the message bubble notification

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

#### Chat Properties: Notify on click of extension button

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

#### Chat Properties: Press the voice button notification

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

#### Chat properties: Raise the voice button notification

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

#### Chat property: send message notification

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

#### Chat property: send message completion notification

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

#### Chat property: voice recording end notification

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

---

# system introduction

This multi-package project mainly includes `uikit` and `example`. Among them, `uikit` mainly provides the basic tools for instant messaging, and `example` mainly realizes the demonstration of the corresponding functions.

**Description** `react-native-chat-uikit` is the name of the `npm` package, formerly named `Agora Uikit SDK`, referred to as `uikit` here. `Agora Uikit SDK` depends on `Agora Chat SDK` (package named `react-native-agora-chat`).

## example project

The `example` project mainly includes `routing and navigation (page switching related)`, `initialization settings`, `login and logout`, `contact management`, `group management`, `session management`, `my setting module ` demo.

## uikit project

The `uikit` project mainly includes `UI basic components`, `internationalization tool`, `theme tool`, `data sharing tool`, `media service`, `storage service`, etc.

## Project initialization

Initialization is a prerequisite for using `uikit` and must be done.

The initialization part includes many important parameters, which determine the behavior of subsequent application operations.

The initialization component is `GlobalContainer`, which provides a parameter list `GlobalContainerProps`.

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
  ModalComponent?: React.FunctionComponent;
}>;
```

Parameter Description:

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
- onInitialized: Called after uikit is initialized.
- ModalComponent: A custom modal system component that manages all modal Windows.

Many parameters provide default options, if not set, the system default parameters will be used.

Example of default parameter initialization:

```typescript
export default function App() {
  return <GlobalContainer option={{ appKey: 'test#demo', autoLogin: false }} />;
}
```

[sample code](https://github.com/easemob/react-native-chat-library/tree/dev/example/src/App.tsx)

## Routing and Navigator

The switching of pages is inseparable from the use of navigator or routing.

It is not part of `uikit`. Part of `example`. There are also many options for the navigator, and the common `react-navigation` component library is used here.

For its usage, please refer to the `example` project. You can also refer to the official documentation [skip to official website](https://reactnavigation.org/)

## Modal window management

A modal window is a special type of window. Subsequent operations can only be performed after the transaction of the window is completed and closed. It puts forward higher requirements for the design and maintenance of the code, which is handled in the way of `event` + `unified management` here. Reduce maintenance costs and improve platoon development efficiency.

#### Modal window management system

The modal system provides a unified event number, a unified sending interface, and a unified receiving process. It also provides extensions for custom events, and supports event bubbling sequence processing (subcomponents can intercept time processing, and can decide whether to let the parent component also process).

Send event method:

- `function sendEvent(params: sendEventProps): void`

Send event properties:

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

Receive event processing:

- `DeviceEventEmitter. addListener('DataEvent' as DataEventType, (event) => {})`

#### Event Classification

- `AlertActionEventType`: alert window event
- `ToastActionEventType`: `toast` window event
- `SheetActionEventType`: `bottom sheet` window event
- `PromptActionEventType`: `prompt` window event
- `MenuActionEventType`: `context menu` window event
- `StateActionEventType`: `custom state` window event
- `DataActionEventType`: data event (non-modal window event)

#### Example of event usage process: Delete contact operation process.

1. Send the page to display the confirmation dialog command

```typescript
sendContactInfoEvent({
  eventType: 'AlertEvent',
  action: 'manual_remove_contact',
  params: { userId },
});
```

2. The system receives the command and displays a dialog box. After the user clicks OK, the command to execute the delete operation is sent.

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

3. The page receives the command and starts to delete contacts. After the operation is completed, it sends a prompt indicating that the deletion operation has been completed.

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

4. The system receives the display prompt command and starts to display the prompt content window.

```typescript
// The modal system receives the command to display the toast prompt box.
toast.showToast(content);
```

5. After the processing is completed, close and continue the follow-up operation.

#### Example source code

[sample code](https://github.com/easemob/react-native-chat-library/tree/dev/example/src/screens/ContactInfo.tsx)

## Typical scenario: login

Currently, two methods, active login and automatic login, are supported.

#### Normal login process

1. Initialization: Initialization needs to be processed at the very beginning of the application. See `App.tsx` page for implementation.
2. Notification of initialization completion: initialization is complete, and it will be notified through `GlobalContainer.onInitialized` callback.
3. Login: If automatic login is used, it can be started after the initialization is completed.
4. Notification of login completion: the login notifies the user through `ChatSdkContextType.login.onResult`, and the automatic login notifies the user through `ChatSdkContextType.autologin.onResult`.

#### Active login

Use the login interface `ChatSdkContextType.login` provided by `uikit sdk` instead of `ChatClient.login` provided by `chat sdk`.

Login requires the user to provide the necessary parameters: user id and user password or token.

Examples are as follows:

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

#### auto login

If automatic login is set, subsequent logins will be performed automatically after successful login.

The `splash` page is loaded before automatic login, and the `login` or `home` page is loaded after successful login.

```typescript
autoLogin({
  onResult: ({ result, error }) => {
    if (error === undefined) {
      if (result === true) {
        // TODO: The application home page is displayed.
      } else {
        // TODO: The login page is displayed.
      }
    } else {
      // TODO: Error handling.
    }
  },
});
```

#### page

The login page does not have complex interaction logic, and only includes id or password input components, login button components, etc.
The component style and writing method are common `react-native`, please refer to it for developers who are just getting started, and ignore it for experienced developers.
[sample code](https://github.com/easemob/react-native-chat-library/tree/dev/example/src/screens/SignIn.tsx)

## Typical scenario: Logout

Logout is mainly divided into two situations:

1. The user voluntarily logs out
2. There may be many reasons for the user to disconnect the server passively. For details, refer to the relevant documents on the official website.

#### Actively logout

```typescript
logoutAction({
  onResult: ({ result, error }) => {
    if (result === true) {
      // TODO: Operations performed after a successful logout.
    } else {
      // TODO: Logout operation after failure.
    }
  },
});
```

#### Passive logout

There are many reasons for passive logout: for example, being kicked off by other devices of the user, being prohibited from logging in by the server, the user has changed the password, token expired, etc.

Passive logout is mainly realized by listening to events.

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

The logout button is currently on my settings page.
[sample code](https://github.com/easemob/react-native-chat-library/tree/dev/example/src/screens/MySetting.tsx)

## Typical application: session list

This page displays recent chat records, through which chats can be established quickly.

The conversation page `ConversationListScreen` consists of a navigator `NavigationHeaderRight` and a conversation list component `ConversationListFragment`.

The component `ConversationListFragment` provides the property `ConversationListFragmentProps`.

The component `ConversationListFragment` is mainly composed of the search component `DefaultListSearchHeader` and the list component `ConversationList`.

The search component supports local list searches.

List component displays recent chat sessions.

#### Session Attributes

Session attributes currently include basic event notifications.

```typescript
type ConversationListFragmentProps = {
  onLongPress?: (data?: ItemDataType) => void;
  onPress?: (data?: ItemDataType) => void;
  onData?: (data: ItemDataType[]) => void;
  onUpdateReadCount?: (unreadCount: number) => void;
};
```

#### Session Interface

Page initialization and deinitialization. The lifecycle of a page is a very important concept. In the life cycle to ensure the correct use of the page.

- load: This method will be called when the page loads.
- unload: This method will be called when the page is unloaded.

**<span style="color:orange">The above method is general and is used on almost every page. Since it is not a `class` component, some interfaces cannot be written in the base class and will be optimized later.</span>**

In the initialization phase, `ConversationListFragment` mainly does several things.

- `initList` loads the session list
- `initDirs` creates a session directory to hold message resources
- `addListeners` initializes event listeners to receive required events. For example: message event, page event, etc.

During the unloading phase, `ConversationListFragment` mainly releases resources.

- release event listener resources

The basic functional interface provided by the session:

- `createConversation` creates a conversation
- `removeConversation` removes a conversation
- `updateConversationFromMessage` updates the conversation
- `conversationRead` conversation read

#### Session List Items

Main object: data source `ItemDataType`

```typescript
export type ItemDataType = EqualHeightListItemData & {
  convId: string;
  convType: ChatConversationType;
  lastMsg?: ChatMessage;
  convContent: string;
  timestamp: number;
  timestampS: string;
  count: number;
  actions?: {
    onDelete?: (data: ItemDataType) => void;
  };
};
```

Main object: render component `Item`.

If you want to modify the session list items, please refer to `ItemDataType` and `Item` related component source code.

#### create session

There are several ways to create a session:

1. Receive a message
2. Enter the chat page, if you do not chat, you will create a temporary session, and if you chat, you will create a persistent session

#### Delete session

Delete session: Currently, the delete menu is displayed by sliding the list item, click delete.
**NOTE** Cleans up other traces of the session. Example: Not read.

#### Enter the chat page

Click on the conversation list item to enter the chat page.

#### Session Menu

There is an important entry in the upper right corner of the session, which includes:

1. Create a group
2. Add contacts
3. Search groups

#### Extensions

Users can modify and use `corresponding components` as needed.

[sample code](https://github.com/easemob/react-native-chat-library/tree/dev/example/src/screens/ConversationList.tsx)

## Typical scenario: Chat

Currently, the chat page supports personal chat, group chat, and chat content type supports text (moji expression), picture and voice. See `ChatFragment` and `ChatFragmentProps` for details

#### composition

The chat page consists of chat bubble components and input components. See `ChatMessageBubbleList` and `ChatInput` for details

Important components include:

- `ChatMessageBubbleList` chat bubble component
- `ChatInput` input component
- `ChatFaceList` emoticon component

#### interface

- load loads the component
- unload Unload the component

**<span style="color:orange">The above methods are common and are used in almost every page. Because they do not use `class` style components, some interfaces cannot be written in the base class and will be optimized later. </span>**

- initList initializes historical message records
- initDirs initialize resource directory
- clearRead marks the session as read
- sendTextMessage send text message
- sendImageMessage send image message
- sendVoiceMessage send voice message
- sendCustomMessage send custom message
- loadHistoryMessage load history message
- showFace show face
- hideFace to hide facial expressions
- downloadAttachment download attachment

#### Attributes

`ChatFragmentProps` properties mainly include session ID session type and others.

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

#### Chat Bubble Items

Currently includes: text, voice, picture message bubbles. Currently the source code is encapsulated in the `MessageBubbleList` component.

##### text

- `TextMessageItemType`: data source
- `TextMessageRenderItem`: Rendering component

##### picture

- `ImageMessageItemType`: data source
- `ImageMessageRenderItem`: Rendering component

##### Voice

- `VoiceMessageItemType`: data source
- `VoiceMessageRenderItem`: render component

#### Extensions

For users who need more changes, you can refer to `ChatFragment` design and implementation.
For users who need to change custom messages, please refer to `ChatMessageBubbleList` for design and implementation.
For users who need to change input components, please refer to `ChatInput` for design and implementation.

#### Special Note

In order to solve code reuse and reduce data loading, more sub-components are added. For example: `ChatContent` `ChatInput`.

[sample code](https://github.com/easemob/react-native-chat-library/tree/dev/example/src/fragments/Chat.tsx)

---

# Q & A

If you have more questions, please check here, and if you have more suggestions, please contribute here.

[skip to here](./qa.md)

---

# mind Mapping

The description of this dimension may increase your understanding of the project.

[skip to here](./swdt.md)
