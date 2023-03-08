import type { MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';
import { CommonActions, CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import * as React from 'react';
import {
  DeviceEventEmitter,
  Linking,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChatConversationType } from 'react-native-chat-sdk';
import {
  createStyleSheet,
  DataEventType,
  Divider,
  getScaleFactor,
  LocalIcon,
  Services,
} from 'react-native-chat-uikit';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppI18nContext } from '../contexts/AppI18nContext';
import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import type { BizEventType, DataActionEventType } from '../events';
import { type sendEventProps, sendEvent } from '../events/sendEvent';
import { useStyleSheet } from '../hooks/useStyleSheet';
import type {
  BottomTabScreenParamsList,
  RootScreenParamsList,
} from '../routes';

type RootScreenParamsListOnly = Omit<
  RootScreenParamsList,
  keyof BottomTabScreenParamsList
>;
type Props = CompositeScreenProps<
  MaterialBottomTabScreenProps<BottomTabScreenParamsList, 'MySetting'>,
  NativeStackScreenProps<RootScreenParamsListOnly>
>;

const sendMySettingEvent = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp' | 'eventBizType'>
) => {
  sendEvent({
    ...params,
    senderId: 'MySetting',
    eventBizType: 'setting',
  } as sendEventProps);
};

const Intervallum = ({ content }: { content: string }) => {
  const sf = getScaleFactor();
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: sf(32),
        backgroundColor: '#FAFAFA',
      }}
    >
      <Text
        style={{
          paddingLeft: sf(20),
          fontSize: sf(12),
          fontWeight: '400',
          lineHeight: sf(18),
          color: 'rgba(153, 153, 153, 1)',
        }}
      >
        {content}
      </Text>
    </View>
  );
};

export default function MySettingScreen({ navigation }: Props): JSX.Element {
  const sf = getScaleFactor();
  const { settings } = useAppI18nContext();
  const cbs = Services.cbs;
  const ms = Services.ms;
  const bounces = false;
  const memberCount = 5;
  const [userName, setUserName] = React.useState('NickName');
  const [userId, setUserId] = React.useState('Agora ID: xx');
  const sdkVersion = 'AgoraChat v0.0.0';
  const uiVersion = 'AgoraChat v0.0.0';
  const urlName = 'agora.io';
  const { client, getCurrentId, logout: logoutAction } = useAppChatSdkContext();

  const D = () => (
    <Divider
      color="rgba(248, 245, 250, 1)"
      height={sf(0.5)}
      marginLeft={sf(20)}
      marginRight={sf(20)}
    />
  );

  const _openUrl = React.useCallback(async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  }, []);

  const removeAllMessage = React.useCallback(async () => {
    const currentId = getCurrentId();
    client.chatManager
      .deleteAllMessages(currentId, ChatConversationType.PeerChat)
      .then()
      .catch((error) => {
        console.warn('test:removeAllMessage:', error);
      });
    // client.chatManager
    //   .deleteMessagesBeforeTimestamp(timestamp())
    //   .then()
    //   .catch((error) => {
    //     console.warn('test:deleteMessagesBeforeTimestamp:', error);
    //   });
    const list = await client.chatManager.getAllConversations();
    for (const item of list) {
      await client.chatManager.deleteConversation(item.convId, true);
    }
  }, [client.chatManager, getCurrentId]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.getParent()?.setOptions({
        headerBackVisible: false,
        headerRight: undefined,
        headerTitle: () => <Text />,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      });
    });
    return unsubscribe;
  }, [navigation]);

  const logout = React.useCallback(() => {
    logoutAction({
      onResult: ({ result, error }) => {
        if (result === true) {
          console.log('test:logout:success');
          navigation.dispatch(CommonActions.navigate('Login', { params: {} }));
        } else {
          console.log('test:error:', error);
        }
      },
    });
  }, [logoutAction, navigation]);

  const onClickHeader = React.useCallback(() => {
    sendMySettingEvent({
      eventType: 'SheetEvent',
      action: 'open_my_setting_setting',
      params: { userId, userName },
    });
  }, [userId, userName]);

  const openMediaLibrary = React.useCallback(() => {
    ms.openMediaLibrary({
      selectionLimit: 1,
      onFailed: (result) => {
        console.warn('test:openMediaLibrary:', result);
      },
    })
      .then((result) => {
        console.log('test:openMediaLibrary:', result);
        // TODO:
      })
      .catch((error) => {
        console.warn('test:openMediaLibrary:', error);
      });
  }, [ms]);
  const modifyMyName = React.useCallback(
    (params: { userId: string; newMyName: string }) => {
      setUserName(params.newMyName);
    },
    []
  );

  const copyMyId = React.useCallback(
    (params: { userId: string; newMyName: string }) => {
      cbs.setString(params.userId);
      sendMySettingEvent({
        eventType: 'ToastEvent',
        action: 'toast_',
        params: 'ID Copied',
      });
    },
    [cbs]
  );

  const initList = React.useCallback(() => {
    client.userManager
      .fetchOwnInfo()
      .then((result) => {
        console.log('test:result:', result);
        if (result) {
          setUserId(result.userId);
          if (result.nickName) setUserName(result.nickName);
        }
      })
      .catch((error) => {
        console.warn('test:error:', error);
      });
  }, [client.userManager]);

  const addListeners = React.useCallback(() => {
    const sub = DeviceEventEmitter.addListener(
      'DataEvent' as DataEventType,
      (event) => {
        const { action, params } = event as {
          eventBizType: BizEventType;
          action: DataActionEventType;
          senderId: string;
          params: any;
          timestamp: number;
          key: string;
        };
        switch (action) {
          case 'exec_remove_all_conversation_and_messages':
            removeAllMessage();
            break;
          case 'exec_manual_logout':
            logout();
            break;
          case 'open_media_library':
            openMediaLibrary();
            break;
          case 'exec_modify_my_name':
            modifyMyName(params);
            break;
          case 'copy_my_id':
            copyMyId(params);
            break;

          default:
            break;
        }
      }
    );
    return () => {
      sub.remove();
    };
  }, [copyMyId, logout, modifyMyName, openMediaLibrary, removeAllMessage]);

  React.useEffect(() => {
    const load = () => {
      console.log('test:load:', MySettingScreen.name);
      const unsubscribe = addListeners();
      initList();
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', MySettingScreen.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners, initList]);

  return (
    <SafeAreaView
      mode="padding"
      style={useStyleSheet().safe}
      edges={['right', 'left']}
    >
      <ScrollView bounces={bounces}>
        <Pressable
          onPress={() => {
            onClickHeader();
          }}
          style={{ paddingVertical: sf(10), paddingTop: sf(20) }}
        >
          <LocalIcon name="default_avatar" size={sf(100)} />
        </Pressable>
        <TouchableOpacity onPress={() => {}} style={{ paddingVertical: sf(0) }}>
          <Text style={styles.name}>{userName}</Text>
        </TouchableOpacity>
        <Pressable onPress={() => {}} style={{ paddingVertical: sf(5) }}>
          <Text style={styles.id}>{userId}</Text>
        </Pressable>
        <View style={{ height: sf(40) }} />
        <Intervallum content={settings.privacy} />
        <Pressable
          onPress={() => {
            navigation.navigate('ContactList', {
              params: { type: 'block_contact' },
            });
          }}
          style={styles.listItem}
        >
          <Text style={styles.listItemText1}>{settings.blockedList}</Text>
          <View style={{ flexDirection: 'row', width: sf(20) }}>
            <Text style={styles.memberCount}>{memberCount}</Text>
            <View style={{ width: sf(5) }} />
            <LocalIcon
              name="go_small_black_mobile"
              size={sf(14)}
              color="#A9A9A9"
            />
          </View>
        </Pressable>
        <Intervallum content={settings.about} />
        <Pressable
          onPress={() => {
            cbs.setString('Agora v1.0.0');
            sendMySettingEvent({
              eventType: 'ToastEvent',
              action: 'toast_',
              params: 'SDK Version Copied',
            });
          }}
          style={styles.listItem}
        >
          <Text style={styles.listItemText1}>{settings.sdkVersion}</Text>
          <Text style={styles.listItemText3}>{sdkVersion}</Text>
        </Pressable>
        <D />
        <Pressable
          onPress={() => {
            cbs.setString('Agora v1.0.0');
            sendMySettingEvent({
              eventType: 'ToastEvent',
              action: 'toast_',
              params: 'UI Version Copied',
            });
          }}
          style={styles.listItem}
        >
          <Text style={styles.listItemText1}>{settings.uiVersion}</Text>
          <Text style={styles.listItemText3}>{uiVersion}</Text>
        </Pressable>
        <D />
        <Pressable onPress={() => {}} style={styles.listItem}>
          <Text style={styles.listItemText1}>{settings.more}</Text>
          <TouchableOpacity
            onPress={() => {
              _openUrl('https://www.agora.io/en/');
            }}
          >
            <Text style={styles.listItemText4}>{urlName}</Text>
          </TouchableOpacity>
        </Pressable>
        {__DEV__ ? (
          <Pressable onPress={() => {}} style={styles.listItem}>
            <TouchableOpacity
              onPress={() => {
                sendMySettingEvent({
                  eventType: 'AlertEvent',
                  action: 'remove_all_conversation_and_messages',
                  params: {},
                });
              }}
            >
              <Text style={[styles.listItemText1, { color: 'red' }]}>
                Delete All Messages
              </Text>
            </TouchableOpacity>
          </Pressable>
        ) : null}
        <Intervallum content={settings.logins} />
        <Pressable onPress={() => {}} style={styles.listItem}>
          <TouchableOpacity
            onPress={() => {
              sendMySettingEvent({
                eventType: 'AlertEvent',
                action: 'manual_logout',
                params: {},
              });
            }}
          >
            <Text style={[styles.listItemText1, { color: '#114EFF' }]}>
              {settings.logout}
            </Text>
          </TouchableOpacity>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = createStyleSheet({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  id: {
    fontWeight: '400',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 20,
    color: 'rgba(153, 153, 153, 1)',
  },
  chat: {
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    height: 53,
  },
  listItemText1: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
  listItemText3: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color: 'rgba(102, 102, 102, 1)',
  },
  listItemText4: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color: '#114EFF',
    textDecorationLine: 'underline',
  },
  memberCount: {
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
    color: '#666666',
  },
});
