import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter, Pressable, Text, View } from 'react-native';
import { ChatConversationType } from 'react-native-chat-sdk';
import {
  Avatar,
  createStyleSheet,
  DataEventType,
  getScaleFactor,
  LocalIcon,
  ScreenContainer,
  Services,
} from 'react-native-chat-uikit';

import { useAppI18nContext } from '../contexts/AppI18nContext';
import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import type { BizEventType, DataActionEventType } from '../events';
import { type sendEventProps, sendEvent } from '../events/sendEvent';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

const sendGroupInfoEvent = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp' | 'eventBizType'>
) => {
  sendEvent({
    ...params,
    senderId: 'ContactInfo',
    eventBizType: 'contact',
  } as sendEventProps);
};

const sendEventFromGroupInfo = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp' | 'eventBizType'>
) => {
  sendEvent({
    ...params,
    senderId: 'GroupInfo',
    eventBizType: 'group',
  } as sendEventProps);
};

export function GroupInfoScreenInternal({
  route,
  navigation,
}: Props): JSX.Element {
  const rp = route.params as any;
  const params = rp?.params as { groupId: string };

  const sf = getScaleFactor();
  const { groupInfo } = useAppI18nContext();
  const { client } = useAppChatSdkContext();
  const cbs = Services.cbs;
  const groupId = params.groupId ?? 'GroupId: xxx';
  // const memberCount = 5;
  const [groupName, setGroupName] = React.useState('GroupName');
  const [groupDesc, setGroupDesc] = React.useState(groupInfo.groupDescription);
  const [, setIsAllMemberMuted] = React.useState(false);

  // const onMute = (isMute: boolean) => {
  //   setIsAllMemberMuted(isMute);
  // };

  const onChangeName = React.useCallback(
    (groupId: string, groupName: string) => {
      if (groupName.length > 0) {
        client.groupManager
          .changeGroupName(groupId, groupName)
          .then(() => {
            console.log('test:onChangeName:');
            setGroupName(groupName);
            sendEventFromGroupInfo({
              eventType: 'DataEvent',
              action: 'exec_modify_group_name',
              params: { groupId, groupName },
            });
          })
          .catch((error) => {
            console.warn('test:onChangeName:error:', error);
          });
      }
    },
    [client.groupManager]
  );
  const onChangeDescription = React.useCallback(
    (groupId: string, groupDescription: string) => {
      if (groupDescription.length > 0) {
        client.groupManager
          .changeGroupDescription(groupId, groupDescription)
          .then(() => {
            console.log('test:onChangeDescription:');
            setGroupDesc(groupDescription);
          })
          .catch((error) => {
            console.warn('test:onChangeDescription:error:', error);
          });
      }
    },
    [client.groupManager]
  );

  const onChat = React.useCallback(
    (groupId: string) => {
      navigation.navigate('Chat', {
        params: { chatId: groupId, chatType: ChatConversationType.GroupChat },
      });
    },
    [navigation]
  );

  const onClickHeader = () => {
    sendGroupInfoEvent({
      eventType: 'SheetEvent',
      action: 'open_group_info_setting',
      params: { groupId, groupName, groupDesc },
    });
  };

  // const onInvite = () => {};

  // const onMembers = () => {};

  const onDestroyGroup = React.useCallback(
    (groupId: string) => {
      client.groupManager
        .destroyGroup(groupId)
        .then((result) => {
          console.log('test:destroyGroup:success:', result);
          sendEventFromGroupInfo({
            eventType: 'DataEvent',
            action: 'exec_destroy_group',
            params: { groupId: groupId },
          });
          navigation.goBack();
        })
        .catch((error) => {
          console.warn('test:destroyGroup:error:', error);
        });
    },
    [client.groupManager, navigation]
  );

  const onLeaveGroup = React.useCallback(
    (groupId: string) => {
      client.groupManager
        .leaveGroup(groupId)
        .then((result) => {
          console.log('test:leaveGroup:success:', result);
          navigation.goBack();
        })
        .catch((error) => {
          console.warn('test:leaveGroup:error:', error);
        });
    },
    [client.groupManager, navigation]
  );

  const onCopyGroupId = React.useCallback(
    (groupId: string) => {
      cbs.setString(groupId);
      cbs.getString().then(() => {
        sendGroupInfoEvent({
          eventType: 'ToastEvent',
          action: 'toast_',
          params: groupInfo.toast[3]!,
        });
      });
    },
    [cbs, groupInfo.toast]
  );

  const addListeners = React.useCallback(() => {
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
          case 'exec_leave_group':
            onLeaveGroup(params.groupId);
            break;
          case 'exec_destroy_group':
            onDestroyGroup(params.groupId);
            break;
          case 'exec_modify_group_name':
            onChangeName(params.groupId, params.newGroupName);
            break;
          case 'exec_modify_group_description':
            onChangeDescription(params.groupId, params.newGroupDescription);
            break;
          case 'copy_group_id':
            onCopyGroupId(params.groupId);
            break;

          default:
            break;
        }
      }
    );
    return () => {
      sub.remove();
    };
  }, [
    onChangeDescription,
    onChangeName,
    onCopyGroupId,
    onDestroyGroup,
    onLeaveGroup,
  ]);

  const initList = React.useCallback(() => {
    client.groupManager
      .getGroupWithId(groupId)
      .then((result) => {
        console.log('test:getGroupWithId:success:', result);
        if (result) {
          setGroupName(result.groupName);
          setGroupDesc(result.description);
          setIsAllMemberMuted(result.isAllMemberMuted);
        }
      })
      .catch((error) => {
        console.warn('test:getGroupWithId:error:', error);
      });
  }, [client.groupManager, groupId]);

  React.useEffect(() => {
    console.log('test:useEffect:', addListeners, initList);
    const load = () => {
      console.log('test:load:', GroupInfoScreen.name);
      const unsubscribe = addListeners();
      initList();
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', GroupInfoScreen.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners, initList]);

  return (
    <View style={styles.container}>
      <Pressable
        style={{ paddingHorizontal: sf(50), alignItems: 'center' }}
        onPress={onClickHeader}
      >
        <View style={styles.top}>
          <Avatar uri="" size={sf(100)} radius={sf(50)} />
        </View>
        <View style={styles.top}>
          <Text numberOfLines={1} style={[styles.name, { maxWidth: '80%' }]}>
            {groupInfo.name(groupName)}
          </Text>
        </View>
        <View style={{ marginTop: sf(10) }}>
          <Text style={styles.id}>{groupId}</Text>
        </View>
        <View style={{ marginTop: sf(10) }}>
          <Text style={styles.description}>{groupDesc}</Text>
        </View>
      </Pressable>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: 130,
        }}
      >
        {/* <Pressable onPress={onInvite}>
          <View style={styles.chatButton}>
            <LocalIcon name="group_invite" size={sf(30)} />
          </View>
          <Text style={[styles.chat, { marginTop: sf(5) }]}>
            {groupInfo.invite}
          </Text>
        </Pressable> */}
        <View>
          <Pressable
            onPress={() => {
              onChat(groupId);
            }}
            style={styles.chatButton}
          >
            <LocalIcon name="tabbar_chats" size={sf(30)} />
          </Pressable>
          <Text style={[styles.chat, { marginTop: sf(5) }]}>
            {groupInfo.chat}
          </Text>
        </View>
      </View>
      <View style={{ height: sf(66) }} />
      {/* <Pressable onPress={onMembers} style={styles.listItem}>
        <Text style={styles.listItemText1}>{groupInfo.members}</Text>
        <View
          style={{
            flexDirection: 'row',
            width: sf(20),
            justifyContent: 'space-between',
          }}
        >
          <Text style={styles.memberCount}>{memberCount}</Text>
          <View style={{ width: sf(5) }} />
          <LocalIcon name="go_small_black_mobile" size={sf(14)} />
        </View>
      </Pressable> */}
      {/* <View style={styles.listItem}>
        <Text style={styles.listItemText1}>{groupInfo.mute}</Text>
        <Switch
          value={isAllMemberMuted}
          onChangeValue={function (val: boolean): void {
            onMute(val);
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
          sendGroupInfoEvent({
            eventType: 'AlertEvent',
            action: 'manual_leave_group',
            params: { groupId },
          });
        }}
      >
        <Text style={styles.listItemText2}>{groupInfo.leave}</Text>
      </Pressable>
      <Pressable
        style={styles.listItem}
        onPress={() => {
          sendGroupInfoEvent({
            eventType: 'AlertEvent',
            action: 'manual_destroy_group',
            params: { groupId },
          });
        }}
      >
        <Text style={[styles.listItemText2, { color: 'red' }]}>
          {groupInfo.destroy}
        </Text>
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
  description: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
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
  memberCount: {
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
  },
});

export default function GroupInfoScreen({
  route,
  navigation,
}: Props): JSX.Element {
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <GroupInfoScreenInternal route={route} navigation={navigation} />
    </ScreenContainer>
  );
}
