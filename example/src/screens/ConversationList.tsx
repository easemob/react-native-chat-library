import type {
  MaterialBottomTabNavigationProp,
  MaterialBottomTabScreenProps,
} from '@react-navigation/material-bottom-tabs';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  useNavigation,
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
  FragmentContainer,
  getScaleFactor,
  LocalIcon,
  useAlert,
  useBottomSheet,
  useThemeContext,
  useToastContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeHeaderTitle from '../components/HomeHeaderTitle';
import { useAppI18nContext } from '../contexts/AppI18nContext';
import {
  type ConversationListEventType,
  ConversationListEvent,
  HomeEvent,
  HomeEventType,
} from '../events';
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

type NavigationProp = CompositeNavigationProp<
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

type SheetEvent = 'sheet_conversation_list' | 'sheet_navigation_menu';

const InvisiblePlaceholder = React.memo(
  ({ data }: { data: ConversationListItemDataType[] }) => {
    console.log('test:InvisiblePlaceholder:', data.length);
    const sheet = useBottomSheet();
    const toast = useToastContext();
    const alert = useAlert();
    const { conversation } = useAppI18nContext();
    const theme = useThemeContext();
    const sf = getScaleFactor();
    // const { client } = useAppChatSdkContext();

    const navigation = useNavigation<NavigationProp>();

    React.useEffect(() => {
      console.log(
        'test:load:InvisiblePlaceholder:',
        ConversationListScreen.name
      );
      const sub = DeviceEventEmitter.addListener(
        ConversationListEvent,
        (event) => {
          console.log('test:ConversationListEvent:', event);
          switch (event.type as ConversationListEventType) {
            case 'long_press':
              sheet.openSheet({
                sheetItems: [
                  {
                    icon: 'loading',
                    iconColor: theme.colors.primary,
                    title: '1',
                    titleColor: 'black',
                    onPress: () => {
                      console.log('test:onPress:data:', data);
                    },
                  },
                  {
                    icon: 'loading',
                    iconColor: theme.colors.primary,
                    title: '2',
                    titleColor: 'black',
                    onPress: () => {
                      console.log('test:onPress:data:', data);
                    },
                  },
                ],
              });
              break;
            case 'sheet_':
              {
                const eventType = event.params.type as SheetEvent;
                if (eventType === 'sheet_navigation_menu') {
                  sheet.openSheet({
                    sheetItems: [
                      {
                        title: conversation.new,
                        titleColor: 'black',
                        onPress: () => {
                          navigation.navigate({
                            name: 'ContactList',
                            params: { params: { type: 'create_conversation' } },
                          });
                        },
                      },
                      {
                        title: conversation.createGroup,
                        titleColor: 'black',
                        onPress: () => {
                          navigation.navigate('ContactList', {
                            params: { type: 'create_group' },
                          });
                        },
                      },
                      {
                        title: conversation.addContact,
                        titleColor: 'black',
                        onPress: () => {
                          navigation.navigate('Search', {
                            params: { type: 'add_contact' },
                          });
                        },
                      },
                      {
                        title: conversation.searchGroup,
                        titleColor: 'black',
                        onPress: () => {
                          navigation.navigate('Search', {
                            params: { type: 'search_public_group_info' },
                          });
                        },
                      },
                      {
                        title: conversation.joinPublicGroup,
                        titleColor: 'black',
                        onPress: () => {
                          navigation.navigate('Search', {
                            params: { type: 'join_public_group' },
                          });
                        },
                      },
                    ],
                  });
                }
              }
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
    }, [
      toast,
      sheet,
      alert,
      navigation,
      theme.colors.primary,
      data,
      sf,
      conversation.new,
      conversation.createGroup,
      conversation.addContact,
      conversation.joinPublicGroup,
      conversation.searchGroup,
    ]);

    return <></>;
  }
);

export default function ConversationListScreen({
  navigation,
}: Props): JSX.Element {
  const sf = getScaleFactor();
  // let data: ConversationListItemDataType[] = React.useMemo(() => [], []); // for search
  const [data, setData] = React.useState([] as ConversationListItemDataType[]); // for search
  const isEmpty = false;

  const NavigationHeaderRight: React.FunctionComponent<HeaderButtonProps> =
    React.useCallback(
      (_: HeaderButtonProps) => {
        return (
          <Pressable
            onPress={() => {
              DeviceEventEmitter.emit(ConversationListEvent, {
                type: 'sheet_' as ConversationListEventType,
                params: {
                  type: 'sheet_navigation_menu' as SheetEvent,
                  content: {},
                },
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
            DeviceEventEmitter.emit(ConversationListEvent, {
              type: 'long_press' as ConversationListEventType,
              params: {
                type: 'sheet_conversation_list' as SheetEvent,
                content: {},
              },
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
            DeviceEventEmitter.emit(HomeEvent, {
              type: 'update_all_count' as HomeEventType,
              params: { count: unreadCount },
            });
          }}
        />
      )}
      <FragmentContainer>
        <InvisiblePlaceholder data={data} />
      </FragmentContainer>
    </SafeAreaView>
  );
}
