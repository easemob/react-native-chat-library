import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter, Pressable, Text, View } from 'react-native';
import {
  Avatar,
  createStyleSheet,
  DataEventType,
  getScaleFactor,
  LocalIcon,
  ScreenContainer,
} from 'react-native-chat-uikit';

import { useAppI18nContext } from '../contexts/AppI18nContext';
import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import type { BizEventType, DataActionEventType } from '../events';
import { type sendEventProps, sendEvent } from '../events/sendEvent';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

const sendContactInfoEvent = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp' | 'eventBizType'>
) => {
  sendEvent({
    ...params,
    senderId: 'ContactInfo',
    eventBizType: 'contact',
  } as sendEventProps);
};

export function ContactInfoScreenInternal({
  route,
  navigation,
}: Props): JSX.Element {
  const rp = route.params as any;
  const params = rp?.params as { userId: string };
  const { contactInfo } = useAppI18nContext();
  const { client } = useAppChatSdkContext();
  // const [isMute, setIsMute] = React.useState(false);
  const userId = params.userId;
  const [userName, setUserName] = React.useState(contactInfo.name('NickName'));
  const sf = getScaleFactor();
  console.log('test:ContactInfoScreen:', params, userName);

  const removeContact = React.useCallback(
    (userId: string, onResult: (result: boolean) => void) => {
      client.contactManager
        .deleteContact(userId)
        .then((result) => {
          console.log('test:deleteContact:success:', result);
          onResult?.(true);
        })
        .catch((error) => {
          onResult?.(false);
          console.warn('test:deleteContact:fail:', error);
        });
    },
    [client.contactManager]
  );
  const blockContact = React.useCallback(
    (userId: string, onResult: (result: boolean) => void) => {
      client.contactManager
        .addUserToBlockList(userId)
        .then((result) => {
          console.log('test:blockContact:success:', result);
          onResult?.(true);
        })
        .catch((error) => {
          onResult?.(false);
          console.warn('test:blockContact:fail:', error);
        });
    },
    [client.contactManager]
  );

  const addListeners = React.useCallback(() => {
    console.log('test:ContactInfoScreen:addListeners:');
    const sub = DeviceEventEmitter.addListener(
      'DataEvent' as DataEventType,
      (event) => {
        const { action, params } = event as {
          eventBizType: BizEventType;
          action: DataActionEventType;
          senderId: string;
          params: any;
          timestamp?: number;
        };
        switch (action) {
          case 'exec_block_contact':
            {
              const userId = params.userId;
              blockContact(userId, (result) => {
                if (result === true) {
                  // toast.showToast(contactInfo.toast[0]!); // !!! dead lock
                  sendContactInfoEvent({
                    eventType: 'ToastEvent',
                    action: 'toast_',
                    params: contactInfo.toast[0]!,
                  });
                }
              });
            }
            break;
          case 'exec_remove_contact':
            {
              const userId = params.userId;
              removeContact(userId, (result) => {
                if (result === true) {
                  // toast.showToast(contactInfo.toast[1]!); // !!! dead lock
                  sendContactInfoEvent({
                    eventType: 'ToastEvent',
                    action: 'toast_',
                    params: contactInfo.toast[1]!,
                  });
                  navigation.goBack();
                }
              });
            }
            break;

          default:
            break;
        }
      }
    );
    return () => {
      sub.remove();
    };
  }, [blockContact, contactInfo.toast, navigation, removeContact]);

  const init = React.useCallback(() => {
    client.userManager
      .fetchUserInfoById([userId])
      .then((result) => {
        if (result) {
          const info = result.get(userId);
          console.log('test:info:', info);
          if (info) {
            setUserName(info.nickName ?? '');
          }
        }
      })
      .catch((error) => {
        console.warn('test:error:', error);
      });
  }, [client.userManager, userId]);

  React.useEffect(() => {
    const load = () => {
      console.log('test:load:', ContactInfoScreen.name);
      const unsubscribe = addListeners();
      init();
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', ContactInfoScreen.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners, init]);

  return (
    <View style={[styles.container, { alignItems: 'center' }]}>
      <View style={styles.top}>
        <Avatar uri="" size={sf(100)} radius={sf(50)} />
      </View>
      <View style={styles.top}>
        <Text numberOfLines={1} style={[styles.name, { maxWidth: '80%' }]}>
          {userName}
        </Text>
      </View>
      <View style={{ marginTop: sf(10) }}>
        <Text style={styles.id}>{userId}</Text>
      </View>
      <Pressable
        onPress={() => {
          navigation.navigate('Chat', {
            params: { chatId: userId, chatType: 0 },
          });
        }}
        style={styles.chatButton}
      >
        <LocalIcon name="tabbar_chats" size={sf(30)} />
      </Pressable>
      <View style={{ marginTop: sf(10) }}>
        <Text style={styles.chat}>{contactInfo.chat}</Text>
      </View>
      <View style={{ height: sf(66) }} />
      {/* <View style={styles.listItem}>
        <Text style={styles.listItemText1}>{contactInfo.mute}</Text>
        <Switch
          value={isMute}
          onChangeValue={function (val: boolean): void {
            console.log('test:Switch:', val);
            setIsMute(val);
          }}
          size={sf(28)}
          thumbColor="white"
          inactiveThumbColor="white"
          inactiveTrackColor="rgba(216, 216, 216, 1)"
        />
      </View> */}
      <Pressable
        style={styles.listItem}
        onPress={() => {
          sendContactInfoEvent({
            eventType: 'AlertEvent',
            action: 'manual_block_contact',
            params: { userId },
          });
        }}
      >
        <Text style={styles.listItemText1}>{contactInfo.block}</Text>
      </Pressable>
      <Pressable
        style={styles.listItem}
        onPress={() => {
          sendContactInfoEvent({
            eventType: 'AlertEvent',
            action: 'manual_remove_contact',
            params: { userId },
          });
        }}
      >
        <Text style={styles.listItemText2}>{contactInfo.delete}</Text>
      </Pressable>
    </View>
  );
}

const styles = createStyleSheet({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'green',
  },
  top: { marginTop: 10 },
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
  chatButton: {
    marginTop: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(228, 228, 228, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    // flex: 1,
    // flexGrow: 1,
    width: '90%',
    paddingVertical: 16,
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'space-between',
  },
  listItemText1: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
  listItemText2: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    color: 'rgba(255, 20, 204, 1)',
  },
});

export default function ContactInfoScreen({
  route,
  navigation,
}: Props): JSX.Element {
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ContactInfoScreenInternal route={route} navigation={navigation} />
    </ScreenContainer>
  );
}
