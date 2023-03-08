import type {
  MaterialBottomTabNavigationProp,
  MaterialBottomTabScreenProps,
} from '@react-navigation/material-bottom-tabs';
import type {
  CompositeNavigationProp,
  CompositeScreenProps,
} from '@react-navigation/native';
import type {
  HeaderButtonProps,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack/lib/typescript/src/types';
import * as React from 'react';
import { DeviceEventEmitter, Pressable, View } from 'react-native';
import {
  Blank,
  DataEventType,
  getScaleFactor,
  LocalIcon,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeHeaderTitle from '../components/HomeHeaderTitle';
import type { BizEventType, DataActionEventType } from '../events2';
import { type sendEventProps, sendEvent } from '../events2/sendEvent';
import ConversationListFragment, {
  ItemDataType as ConversationListItemDataType,
} from '../fragments/ConversationList';
import { useStyleSheet } from '../hooks/useStyleSheet';
import type {
  BottomTabParamsList,
  BottomTabScreenParamsList,
  RootParamsList,
  RootScreenParamsList,
} from '../routes';

type RootScreenParamsListOnly = Omit<
  RootScreenParamsList,
  keyof BottomTabScreenParamsList
>;
type Props = CompositeScreenProps<
  MaterialBottomTabScreenProps<BottomTabScreenParamsList, 'ConversationList'>,
  NativeStackScreenProps<RootScreenParamsListOnly>
>;

export type NavigationProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<
    BottomTabScreenParamsList<BottomTabParamsList, 'option'>,
    any,
    undefined
  >,
  NativeStackNavigationProp<
    RootScreenParamsList<RootParamsList, 'option'>,
    any,
    undefined
  >
>;

const sendConversationEvent = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp' | 'eventBizType'>
) => {
  sendEvent({
    ...params,
    senderId: 'Conversation',
    eventBizType: 'conversation',
  } as sendEventProps);
};

export default function ConversationListScreen({
  navigation,
}: Props): JSX.Element {
  const sf = getScaleFactor();
  // let data: ConversationListItemDataType[] = React.useMemo(() => [], []); // for search
  const [, setData] = React.useState([] as ConversationListItemDataType[]); // for search
  const isEmpty = false;

  const NavigationHeaderRight: React.FunctionComponent<HeaderButtonProps> =
    React.useCallback(
      (_: HeaderButtonProps) => {
        return (
          <Pressable
            onPress={() => {
              sendConversationEvent({
                eventType: 'SheetEvent',
                action: 'sheet_navigation_menu',
                params: {},
              });
            }}
          >
            <View style={{ padding: sf(10), marginRight: -sf(10) }}>
              <LocalIcon
                name="chat_nav_add"
                style={{ padding: 0 }}
                size={sf(20)}
              />
            </View>
          </Pressable>
        );
      },
      [sf]
    );

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.getParent()?.setOptions({
        headerBackVisible: false,
        headerRight: NavigationHeaderRight,
        headerTitle: () => <HomeHeaderTitle name="Chats" />,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      });
    });
    return unsubscribe;
  }, [NavigationHeaderRight, navigation]);

  React.useEffect(() => {
    console.log('test:load:InvisiblePlaceholder:', ConversationListScreen.name);
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
          case 'create_conversation_item':
            navigation.navigate({
              name: 'ContactList',
              params: { params: { type: 'create_conversation' } },
            });
            break;
          case 'create_new_group':
            navigation.navigate('ContactList', {
              params: { type: 'create_group' },
            });
            break;
          case 'add_new_contact':
            navigation.navigate('Search', {
              params: { type: 'add_contact' },
            });
            break;
          case 'search_public_group_info':
            navigation.navigate('Search', {
              params: { type: 'search_public_group_info' },
            });
            break;
          case 'join_public_group':
            navigation.navigate('Search', {
              params: { type: 'join_public_group' },
            });
            break;

          default:
            break;
        }
      }
    );

    return () => {
      console.log(
        'test:unload:InvisiblePlaceholder:',
        ConversationListScreen.name
      );
      sub.remove();
    };
  }, [navigation]);

  return (
    <SafeAreaView
      mode="padding"
      style={useStyleSheet().safe}
      edges={['right', 'left']}
    >
      {isEmpty ? (
        <Blank />
      ) : (
        <ConversationListFragment
          onLongPress={(_?: ConversationListItemDataType) => {
            sendConversationEvent({
              eventType: 'SheetEvent',
              action: 'sheet_conversation_list',
              params: {},
            });
          }}
          onPress={(data?: ConversationListItemDataType) => {
            if (data) {
              const d = data as ConversationListItemDataType;
              navigation.navigate('Chat', {
                params: { chatId: d.convId, chatType: d.convType },
              });
            }
          }}
          onData={(d) => {
            setData(d);
          }}
          onUpdateReadCount={(unreadCount) => {
            sendEvent({
              eventType: 'DataEvent',
              action: 'update_all_count',
              params: { count: unreadCount },
              eventBizType: 'conversation',
              senderId: 'ConversationList',
            });
          }}
        />
      )}
    </SafeAreaView>
  );
}
