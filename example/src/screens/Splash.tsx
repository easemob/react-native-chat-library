import {
  type NavigationContainerRefWithCurrent,
  CommonActions,
  StackActions,
} from '@react-navigation/native';
import * as React from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import { getScaleFactor, Loading, Services } from 'react-native-chat-uikit';

import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import { AppEvent, AppEventType } from '../events';
import type { RootParamsList } from '../routes';

export function SplashScreen(): JSX.Element {
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
    return () => {
      sub.remove();
    };
  }, [autoLoginAction, createUserDir]);

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
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      <Loading color="rgba(15, 70, 230, 1)" size={sf(45)} />
    </View>
  );
}
