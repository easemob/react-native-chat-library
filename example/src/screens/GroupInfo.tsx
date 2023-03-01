import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter, Pressable, Text, View } from 'react-native';
import {
  Avatar,
  createStyleSheet,
  getScaleFactor,
  LocalIcon,
  ScreenContainer,
  Services,
  Switch,
  useAlert,
  useBottomSheet,
  usePrompt,
  useToastContext,
} from 'react-native-chat-uikit';

import { useAppI18nContext } from '../contexts/AppI18nContext';
import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import { GroupInfoEvent } from '../events';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

const sf = getScaleFactor();

export function GroupInfoScreenInternal({
  route,
  navigation,
}: Props): JSX.Element {
  //   console.log('test:ConversationListScreen:', route.params, navigation);
  //   return <Placeholder content={`${GroupInfoScreen.name}`} />;
  const rp = route.params as any;
  const params = rp?.params as { groupId: string };

  const { groupInfo } = useAppI18nContext();
  const { client } = useAppChatSdkContext();
  const alert = useAlert();
  const sheet = useBottomSheet();
  const prompt = usePrompt();
  const toast = useToastContext();
  const cbs = Services.cbs;
  const groupId = params.groupId ?? 'GroupId: xxx';
  const memberCount = 5;
  const [groupName, setGroupName] = React.useState('GroupName');
  const [groupDesc, setGroupDesc] = React.useState(groupInfo.groupDescription);
  const [isAllMemberMuted, setIsAllMemberMuted] = React.useState(false);

  const onMute = (isMute: boolean) => {
    setIsAllMemberMuted(isMute);
  };

  const onHeader = () => {
    sheet.openSheet({
      sheetItems: [
        {
          title: groupInfo.modify.name,
          titleColor: 'black',
          onPress: () => {
            prompt.openPrompt({
              title: groupInfo.modify.name,
              placeholder: groupInfo.modify.namePrompt.placeholder,
              submitLabel: groupInfo.modify.namePrompt.confirm,
              cancelLabel: groupInfo.modify.namePrompt.cancel,
              onSubmit: (text: string) => {
                console.log('test:onSubmit:', text);
              },
              onCancel() {
                console.log('test:onCancel:');
              },
            });
          },
        },
        {
          title: groupInfo.modify.description,
          titleColor: 'black',
          onPress: () => {
            prompt.openPrompt({
              title: groupInfo.modify.description,
              placeholder: groupInfo.modify.descriptionPrompt.placeholder,
              submitLabel: groupInfo.modify.descriptionPrompt.confirm,
              cancelLabel: groupInfo.modify.descriptionPrompt.cancel,
              onSubmit: (text: string) => {
                console.log('test:onSubmit:', text);
              },
              onCancel() {
                console.log('test:onCancel:');
              },
            });
          },
        },
        {
          title: groupInfo.modify.groupId,
          titleColor: 'black',
          onPress: () => {
            cbs.setString(groupId);
            cbs.getString().then((text) => {
              console.log('test:openSheet:', text);
              toast.showToast(groupInfo.toast[3]!);
            });
          },
        },
      ],
    });
  };

  const onInvite = () => {
    navigation.push('ContactList', {
      params: {
        type: 'group_invite',
      },
    });
  };

  const onMembers = () => {
    navigation.push('ContactList', {
      params: {
        type: 'group_member',
      },
    });
  };

  const onDestroyGroup = React.useCallback(
    (groupId: string) => {
      client.groupManager
        .destroyGroup(groupId)
        .then((result) => {
          console.log('test:destroyGroup:success:', result);
          DeviceEventEmitter.emit(GroupInfoEvent, {
            type: 'destroy_group',
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

  const addListeners = React.useCallback(() => {
    return () => {};
  }, []);

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
      <Pressable style={{ paddingHorizontal: sf(50) }} onPress={onHeader}>
        <View style={styles.top}>
          <Avatar uri="" size={sf(100)} radius={sf(50)} />
        </View>
        <View style={styles.top}>
          <Text style={styles.name}>{groupInfo.name(groupName)}</Text>
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
          justifyContent: 'space-between',
          width: 130,
        }}
      >
        <Pressable onPress={onInvite}>
          <View style={styles.chatButton}>
            <LocalIcon name="group_invite" size={sf(30)} />
          </View>
          <Text style={[styles.chat, { marginTop: sf(5) }]}>
            {groupInfo.invite}
          </Text>
        </Pressable>
        <View>
          <Pressable
            onPress={() => {
              navigation.navigate('Chat', {
                params: { chatId: 'xxx', chatType: 0 },
              });
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
      <Pressable onPress={onMembers} style={styles.listItem}>
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
      </Pressable>
      <View style={styles.listItem}>
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
      </View>
      <Pressable
        style={styles.listItem}
        onPress={() => {
          alert.openAlert({
            title: groupInfo.leaveAlert.title,
            message: groupInfo.leaveAlert.message,
            buttons: [
              {
                text: groupInfo.leaveAlert.cancelButton,
              },
              {
                text: groupInfo.leaveAlert.confirmButton,
                onPress: () => onLeaveGroup(groupId),
              },
            ],
          });
        }}
      >
        <Text style={styles.listItemText2}>{groupInfo.leave}</Text>
      </Pressable>
      <Pressable
        style={styles.listItem}
        onPress={() => {
          alert.openAlert({
            title: groupInfo.destroyAlert.title,
            message: groupInfo.destroyAlert.message,
            buttons: [
              {
                text: groupInfo.destroyAlert.cancelButton,
              },
              {
                text: groupInfo.destroyAlert.confirmButton,
                onPress: () => onDestroyGroup(groupId),
              },
            ],
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
