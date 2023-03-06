import {
  type NavigationContainerRefWithCurrent,
  CommonActions,
  StackActions,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import {
  ConnectStateChatSdkEvent,
  ConnectStateChatSdkEventType,
  getScaleFactor,
  Loading,
  Services,
} from 'react-native-chat-uikit';

import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import { AppEvent, AppEventType } from '../events';
import { ModalPlaceholder } from '../events2';
import type { RootParamsList } from '../routes';

export function SplashScreen({
  navigation,
}: NativeStackScreenProps<RootParamsList, 'Splash'>): JSX.Element {
  console.log('test:SplashScreen:');
  const sf = getScaleFactor();
  const {
    autoLogin: autoLoginAction,
    getCurrentId,
    client,
  } = useAppChatSdkContext();

  const createUserDir = React.useCallback(() => {
    const currentId = getCurrentId();
    if (currentId.length > 0) {
      Services.dcs.init(
        `${client.options!.appKey.replace('#', '-')}/${currentId}`
      );
    }
  }, [client.options, getCurrentId]);

  const onDisconnected = React.useCallback(
    (errorCode?: number) => {
      console.warn('test:onDisconnected:', errorCode);
      if (
        errorCode === 202 ||
        errorCode === 206 ||
        errorCode === 207 ||
        errorCode === 214 ||
        errorCode === 216 ||
        errorCode === 217 ||
        errorCode === 305
      ) {
        navigation.navigate('Login', { params: {} });
      }
    },
    [navigation]
  );

  const onTokenDidExpire = React.useCallback(() => {
    console.log('test:onTokenDidExpire:');
    navigation.navigate('Login', { params: {} });
  }, [navigation]);

  const onTokenWillExpire = React.useCallback(() => {
    console.log('test:onTokenWillExpire:');
  }, []);

  const addListeners = React.useCallback(() => {
    const sub = DeviceEventEmitter.addListener(AppEvent, (event) => {
      console.log('test:SplashScreen:addListener:', event);
      const eventType = event.type as AppEventType;
      switch (eventType) {
        case 'on_initialized':
          {
            const eventParams = event.params as {
              autoLogin: boolean;
              navigation: NavigationContainerRefWithCurrent<RootParamsList>;
            };
            if (eventParams.autoLogin === true) {
              autoLoginAction({
                onResult: ({ result, error }) => {
                  if (error === undefined) {
                    if (result === true) {
                      createUserDir();
                      eventParams.navigation.dispatch(
                        StackActions.push('Home', { params: {} })
                      );
                    } else {
                      eventParams.navigation.dispatch(
                        CommonActions.navigate('Login', { params: {} })
                      );
                    }
                  } else {
                    console.warn('test:error:', error);
                  }
                },
              });
            } else {
              eventParams.navigation.dispatch(
                CommonActions.navigate('Login', { params: {} })
              );
            }
          }
          break;
        case 'on_logined':
          createUserDir();
          break;
        default:
          break;
      }
    });
    const sub2 = DeviceEventEmitter.addListener(
      ConnectStateChatSdkEvent,
      (event) => {
        console.log('test:SplashScreen:addListener:', event);
        const eventType = event.type as ConnectStateChatSdkEventType;
        switch (eventType) {
          case 'onConnected':
            break;
          case 'onDisconnected':
            {
              const eventParams = event.params as { error: number | undefined };
              onDisconnected(eventParams.error);
            }
            break;
          case 'onTokenDidExpire':
            onTokenDidExpire();
            break;
          case 'onTokenWillExpire':
            onTokenWillExpire();
            break;

          default:
            break;
        }
      }
    );
    return () => {
      sub.remove();
      sub2.remove();
    };
  }, [
    autoLoginAction,
    createUserDir,
    onDisconnected,
    onTokenDidExpire,
    onTokenWillExpire,
  ]);

  React.useEffect(() => {
    const load = () => {
      console.log('test:load:', SplashScreen.name);
      const unsubscribe = addListeners();
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', SplashScreen.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners]);

  return (
    <ModalPlaceholder>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          // backgroundColor: 'red',
        }}
      >
        <Loading color="rgba(15, 70, 230, 1)" size={sf(45)} />
      </View>
    </ModalPlaceholder>
  );
}
