import * as React from 'react';
import { Text } from 'react-native';
import { ChatOptions } from 'react-native-chat-sdk';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
import { ChatSdkContextProvider } from '../contexts/ImSdkContext';
import { ThemeContextProvider } from '../contexts/ThemeContext';
import type {
  ClipboardService,
  LocalStorageService,
  MediaService,
  NotificationService,
  PermissionService,
} from '../services';
import { once } from '../utils/function';

const TIMEOUT = 3000;

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
  };
}>;

export function GlobalContainer({
  option,
  localization,
  theme,
  sdk,
  header,
  services,
  children,
}: GlobalContainerProps): JSX.Element {
  console.log('test:GlobalContainer:', option);

  if (theme === undefined) {
    throw new Error('theme is undefined.');
  }

  if (localization === undefined) {
    throw new Error('localization is undefined.');
  }

  if (sdk === undefined) {
    throw new Error('sdk is undefined.');
  }

  if (header === undefined) {
    throw new Error('header is undefined.');
  }

  if (services === undefined) {
    throw new Error('services is undefined.');
  }

  if (services?.clipboard === undefined) {
    throw new Error('clipboard is undefined.');
  }

  if (services?.media === undefined) {
    throw new Error('media is undefined.');
  }

  if (services?.notification === undefined) {
    throw new Error('notification is undefined.');
  }

  if (services?.permission === undefined) {
    throw new Error('permission is undefined.');
  }

  if (services?.storage === undefined) {
    throw new Error('storage is undefined.');
  }

  const init = once(() => {
    sdk.client
      .init(
        new ChatOptions({
          autoLogin: option.autoLogin,
          appKey: option.appKey,
          debugModel: true,
        })
      )
      .then(() => {
        console.log('test:sdk:init:success');
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
