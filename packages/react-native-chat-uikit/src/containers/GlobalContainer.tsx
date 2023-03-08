import { CameraRoll as MediaLibrary } from '@react-native-camera-roll/camera-roll';
import Clipboard from '@react-native-clipboard/clipboard';
import FirebaseMessage from '@react-native-firebase/messaging';
import en from 'date-fns/locale/en-US';
import * as React from 'react';
import { Text } from 'react-native';
import * as Audio from 'react-native-audio-recorder-player';
import { ChatClient, ChatOptions } from 'react-native-chat-sdk';
import CreateThumbnail from 'react-native-create-thumbnail';
import * as DocumentPicker from 'react-native-document-picker';
import * as FileAccess from 'react-native-file-access';
import * as ImagePicker from 'react-native-image-picker';
import * as Permissions from 'react-native-permissions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import VideoComponent from 'react-native-video';

import {
  ChatSdkContextType,
  ContentStateContextProvider,
  DialogContextProvider,
  HeaderContextType,
  StringSetContextType,
  ThemeContextType,
  ToastContextProvider,
} from '../contexts';
import { HeaderStyleProvider } from '../contexts/HeaderContext';
import { I18nContextProvider } from '../contexts/I18nContext';
import {
  ChatSdkContextProvider,
  UIKitChatSdkContext,
} from '../contexts/ImSdkContext';
import { ThemeContextProvider } from '../contexts/ThemeContext';
import { createStringSetEn, UIKitStringSet } from '../I18n2/CStringSet.en';
import {
  ClipboardService,
  DirCacheService,
  LocalStorageService,
  MediaService,
  NotificationService,
  PermissionService,
  Services,
} from '../services';
import { getScaleFactor } from '../styles/createScaleFactor';
import LightTheme from '../theme/LightTheme';
import { once } from '../utils/function';

const TIMEOUT = 3000;

/**
 * Initializes the property list of 'uikit'.
 */
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
  ModalComponent: React.FunctionComponent;
}>;

/**
 * Initializes the entry to 'uikit'.
 *
 * @param param0 -
 * - option:
 *   - appKey: The application id from the console.
 *   - autoLogin: Whether to use automatic login.
 * - localization: Application language internationalization. English is supported by default.
 * - theme: Apply the theme. The system provides the 'light' version by default.
 * - sdk: Chat SDK.
 * - header: Status bar Settings for mobile devices.
 * - services:
 *   - clipboard: Paste board service. 'uikit' provides the default version.
 *   - media: Media services. 'uikit' provides the default version.
 *   - notification: Notification service. 'uikit' provides the default version.
 *   - permission: Apply permission service. 'uikit' provides the default version.
 *   - storage: Storage service. Currently support 'key-value' persistent storage. 'uikit' provides the default version.
 *   - dir: Directory service. 'uikit' provides the default version.
 *
 * @returns
 */
export function GlobalContainer({
  option,
  localization,
  theme,
  sdk,
  header,
  services,
  children,
  onInitialized,
  ModalComponent,
}: GlobalContainerProps): JSX.Element {
  console.log('test:GlobalContainer:', option);
  const sf = getScaleFactor();

  if (theme === undefined) {
    theme = LightTheme;
    if (theme === undefined) {
      throw new Error('theme is undefined.');
    }
  }

  if (localization === undefined) {
    localization = createStringSetEn(new UIKitStringSet(en));
    if (localization === undefined) {
      throw new Error('localization is undefined.');
    }
  }

  if (sdk === undefined) {
    sdk = new UIKitChatSdkContext(ChatClient.getInstance());
    if (sdk === undefined) {
      throw new Error('sdk is undefined.');
    }
  }

  if (header === undefined) {
    header = {
      defaultTitleAlign: 'center',
      defaultStatusBarTranslucent: true,
      defaultHeight: sf(44),
      defaultTopInset: sf(44),
    };
    if (header === undefined) {
      throw new Error('header is undefined.');
    }
  }

  if (services === undefined) {
    services = {};
    if (services === undefined) {
      throw new Error('services is undefined.');
    }
  }

  if (services?.clipboard === undefined) {
    services.clipboard = Services.createClipboardService({
      clipboard: Clipboard,
    });
    if (services?.clipboard === undefined) {
      throw new Error('clipboard is undefined.');
    }
  }

  if (services?.storage === undefined) {
    services.storage = Services.createLocalStorageService();
    if (services?.storage === undefined) {
      throw new Error('storage is undefined.');
    }
  }

  if (services?.permission === undefined) {
    services.permission = Services.createPermissionService({
      permissions: Permissions,
      firebaseMessage: FirebaseMessage,
    });
    if (services?.permission === undefined) {
      throw new Error('permission is undefined.');
    }
  }

  if (services?.media === undefined) {
    services.media = Services.createMediaService({
      videoModule: VideoComponent,
      videoThumbnail: CreateThumbnail,
      imagePickerModule: ImagePicker,
      documentPickerModule: DocumentPicker,
      mediaLibraryModule: MediaLibrary,
      fsModule: FileAccess,
      audioModule: Audio,
      permission: services.permission,
    });
    if (services?.media === undefined) {
      throw new Error('media is undefined.');
    }
  }

  if (services?.notification === undefined) {
    services.notification = Services.createNotificationService({
      firebaseMessage: FirebaseMessage,
      permission: services.permission,
    });
    if (services?.notification === undefined) {
      throw new Error('notification is undefined.');
    }
  }

  if (services?.dir === undefined) {
    services.dir = Services.createDirCacheService({
      media: services.media,
    });
    if (services?.dir === undefined) {
      throw new Error('dir is undefined.');
    }
  }

  if (ModalComponent === undefined) {
    throw new Error(
      'Specify a modal window, for example: UikitModalPlaceholder.'
    );
  }

  const init = once(() => {
    sdk?.client
      .init(
        new ChatOptions({
          autoLogin: option.autoLogin,
          appKey: option.appKey,
          debugModel: true,
        })
      )
      .then(async () => {
        console.log('test:sdk:init:success');
        onInitialized?.();
      })
      .catch((error) => {
        throw new Error('chat sdk init failed.', error);
      });
  });

  init();

  return (
    <SafeAreaProvider>
      <ThemeContextProvider value={theme}>
        <I18nContextProvider i18n={localization}>
          <ChatSdkContextProvider sdk={sdk}>
            <HeaderStyleProvider
              defaultStatusBarTranslucent={header.defaultStatusBarTranslucent}
              defaultTitleAlign={header.defaultTitleAlign}
            >
              <DialogContextProvider>
                <ToastContextProvider dismissTimeout={TIMEOUT}>
                  <ContentStateContextProvider
                    content={{
                      children: (
                        <Text
                          style={{
                            height: 100,
                            width: 100,
                            backgroundColor: 'green',
                          }}
                        >
                          hh
                        </Text>
                      ),
                    }}
                  >
                    {children ? (
                      children
                    ) : (
                      <Text style={{ backgroundColor: theme.colors.error }}>
                        children node is empty.
                      </Text>
                    )}
                    <ModalComponent />
                  </ContentStateContextProvider>
                </ToastContextProvider>
              </DialogContextProvider>
            </HeaderStyleProvider>
          </ChatSdkContextProvider>
        </I18nContextProvider>
      </ThemeContextProvider>
    </SafeAreaProvider>
  );
}
