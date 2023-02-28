import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';
import {
  ConnectStateEventDispatch,
  ContactEventDispatch,
  ConversationEventDispatch,
  MessageEventDispatch,
  MultiDevicesEventDispatch,
} from 'react-native-chat-uikit';

import TabBarIcon from '../components/TabBarIcon';
import {
  type HomeEventBarType,
  type HomeEventType,
  HomeEvent,
} from '../events';
import type { RootParamsList } from '../routes';
import ContactScreen from './Contact';
import ConversationList from './ConversationList';
import MySetting from './MySetting';

const Home = createMaterialBottomTabNavigator<RootParamsList>();

const HomeScreenInternal = React.memo(() => {
  console.log('test:HomeScreenInternal:');
  const [convBarState, setConvBarState] = React.useState<
    number | boolean | undefined
  >(undefined);
  const [contactBarState, setContactBarState] = React.useState<
    number | boolean | undefined
  >(undefined);
  const [settingBarState, setSettingBarState] = React.useState<
    number | boolean | undefined
  >(undefined);

  const addListeners = React.useCallback(() => {
    const sub = DeviceEventEmitter.addListener(HomeEvent, (event) => {
      console.log('test:event:', event);
      const eventType = event.type as HomeEventType;
      if (eventType === 'update_state') {
        const eventParams = event.params as {
          count: number;
          unread: boolean;
          barType: HomeEventBarType;
        };
        if (eventParams.count) {
          const barType = eventParams.barType;
          if (barType === 'contact') {
            setContactBarState(eventParams.count as number);
          } else if (barType === 'conv') {
            setConvBarState(eventParams.count as number);
          } else if (barType === 'setting') {
            setSettingBarState(eventParams.count as number);
          }
        } else if (eventParams.unread) {
          const barType = eventParams.barType;
          if (barType === 'contact') {
            setContactBarState(eventParams.unread as boolean);
          } else if (barType === 'conv') {
            setConvBarState(eventParams.unread as boolean);
          } else if (barType === 'setting') {
            setSettingBarState(eventParams.unread as boolean);
          }
        }
      } else if (eventType === 'update_all_count') {
        const eventParams = event.params as {
          count: number;
        };
        setConvBarState(eventParams.count);
      }
    });
    return () => {
      sub.remove();
    };
  }, []);

  React.useEffect(() => {
    console.log('test:useEffect:', addListeners);
    const load = () => {
      console.log('test:load:', HomeScreen.name);
      const unsubscribe = addListeners();
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', HomeScreen.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners]);

  const shifting = true;
  return (
    <Home.Navigator
      initialRouteName="ConversationList"
      shifting={shifting}
      labeled={false}
      activeColor="blue"
      inactiveColor="black"
      barStyle={{ backgroundColor: 'white' }}
    >
      <Home.Screen
        name="ConversationList"
        options={() => {
          return {
            tabBarIcon: ({ focused, color }) => {
              return (
                <TabBarIcon
                  focused={focused}
                  color={color}
                  type="ConversationList"
                  state={convBarState}
                />
              );
            },
          };
        }}
        component={ConversationList}
      />
      <Home.Screen
        name="Contact"
        options={{
          tabBarIcon: ({ focused, color }) => {
            return (
              <TabBarIcon
                focused={focused}
                color={color}
                type="Contact"
                state={contactBarState}
              />
            );
          },
        }}
        component={ContactScreen}
      />
      <Home.Screen
        name="MySetting"
        options={{
          tabBarIcon: ({ focused, color }) => {
            return (
              <TabBarIcon
                focused={focused}
                color={color}
                type="MySetting"
                state={settingBarState}
              />
            );
          },
        }}
        component={MySetting}
      />
    </Home.Navigator>
  );
});

export default function HomeScreen(
  _: NativeStackScreenProps<RootParamsList, 'Home'>
): JSX.Element {
  console.log('test:HomeScreen:');

  const contactEventListener = React.useRef<ContactEventDispatch>(
    new ContactEventDispatch()
  );
  const messageEventListener = React.useRef<MessageEventDispatch>(
    new MessageEventDispatch()
  );
  const connectEventListener = React.useRef<ConnectStateEventDispatch>(
    new ConnectStateEventDispatch()
  );
  const convEventListener = React.useRef<ConversationEventDispatch>(
    new ConversationEventDispatch()
  );
  const multiEventListener = React.useRef<MultiDevicesEventDispatch>(
    new MultiDevicesEventDispatch()
  );

  const addListeners = React.useCallback(() => {
    return () => {};
  }, []);

  const init = React.useCallback(() => {
    console.log('test:HomeScreen:init:');
    contactEventListener.current.init();
    messageEventListener.current.init();
    convEventListener.current.init();
    connectEventListener.current.init();
    multiEventListener.current.init();
  }, []);

  const unInit = React.useCallback(() => {
    console.log('test:HomeScreen:unInit:');
    contactEventListener.current.unInit();
    messageEventListener.current.unInit();
    convEventListener.current.unInit();
    connectEventListener.current.unInit();
    multiEventListener.current.unInit();
  }, []);

  React.useEffect(() => {
    console.log('test:useEffect:', addListeners, init);
    const load = () => {
      console.log('test:load:', HomeScreen.name);
      const unsubscribe = addListeners();
      init();
      return {
        unsubscribe: unsubscribe,
        unInit: unInit,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', HomeScreen.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners, init, unInit]);

  return <HomeScreenInternal />;
}
