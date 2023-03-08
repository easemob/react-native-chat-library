import type {
  MaterialBottomTabNavigationProp,
  MaterialBottomTabScreenProps,
} from '@react-navigation/material-bottom-tabs';
import type {
  MaterialTopTabNavigationProp,
  MaterialTopTabScreenProps,
} from '@react-navigation/material-top-tabs';
import type {
  CompositeNavigationProp,
  CompositeScreenProps,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type {
  HeaderButtonProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack/lib/typescript/src/types';
import * as React from 'react';
import {
  DeviceEventEmitter,
  Pressable,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { ChatGroupOptions, ChatGroupStyle } from 'react-native-chat-sdk';
import {
  autoFocus,
  Blank,
  Button,
  CheckButton,
  ContactChatSdkEvent,
  ContactChatSdkEventType,
  createStyleSheet,
  DataEventType,
  DefaultAvatar,
  DefaultListItemSeparator,
  DefaultListSearchHeader,
  DialogContextProvider,
  EqualHeightList,
  EqualHeightListItemComponent,
  EqualHeightListItemData,
  EqualHeightListRef,
  getScaleFactor,
  LocalIcon,
  queueTask,
  ScreenContainer,
} from 'react-native-chat-uikit';

import { useAppI18nContext } from '../contexts/AppI18nContext';
import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import type { BizEventType, DataActionEventType } from '../events';
import { type sendEventProps, sendEvent } from '../events/sendEvent';
import type {
  BottomTabParamsList,
  BottomTabScreenParamsList,
  RootParamsList,
  RootScreenParamsList,
  TopTabParamsList,
  TopTabScreenParamsList,
} from '../routes';
import type { ContactActionType, Undefinable } from '../types';

type BottomTabScreenParamsListOnly = Omit<
  BottomTabScreenParamsList,
  keyof TopTabScreenParamsList
>;
type RootScreenParamsListOnly = Omit<
  RootScreenParamsList,
  keyof BottomTabScreenParamsList
>;
type Props = CompositeScreenProps<
  MaterialTopTabScreenProps<TopTabScreenParamsList, 'ContactList'>,
  CompositeScreenProps<
    MaterialBottomTabScreenProps<BottomTabScreenParamsListOnly>,
    NativeStackScreenProps<RootScreenParamsListOnly>
  >
>;

export type NavigationProp = CompositeNavigationProp<
  MaterialTopTabNavigationProp<
    TopTabScreenParamsList<TopTabParamsList, 'option'>,
    'ContactList',
    undefined
  >,
  CompositeNavigationProp<
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
  >
>;

type ItemActionRadioDataType = {
  isActionEnabled: boolean;
  isInvited: boolean;
  onAction?: (checked: boolean) => void;
};
type ItemActionBoolDataType = {
  name: string;
  onClicked?: () => void;
};
type ItemActionGroupInviteDataType = { groupInvite?: ItemActionRadioDataType };
type ItemActionCreateGroupDataType = { createGroup?: ItemActionRadioDataType };
type ItemActionModifyGroupMemberDataType = {
  modifyGroupMember?: ItemActionRadioDataType;
};
type ItemActionBlockDataType = { block?: ItemActionBoolDataType };
type ItemActionDataType =
  | ItemActionGroupInviteDataType
  | ItemActionCreateGroupDataType
  | ItemActionModifyGroupMemberDataType
  | ItemActionBlockDataType;
type ItemDataType = EqualHeightListItemData & {
  contactID: string;
  contactName: string;
  actionType?: Undefinable<ContactActionType>;
  action?: ItemActionDataType;
};

const sendEventFromContactList = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp' | 'eventBizType'>
) => {
  sendEvent({
    ...params,
    senderId: 'ContactList',
    eventBizType: 'contact',
  } as sendEventProps);
};

const Item: EqualHeightListItemComponent = (props) => {
  const sf = getScaleFactor();
  const item = props.data as ItemDataType;

  const Right = (type: ContactActionType | undefined) => {
    switch (type) {
      case 'group_invite':
        return (
          <View style={styles.rightItem}>
            <CheckButton
              checked={
                (item.action as ItemActionGroupInviteDataType)?.groupInvite
                  ?.isInvited
              }
              onChecked={
                (item.action as ItemActionGroupInviteDataType)?.groupInvite
                  ?.onAction
              }
            />
          </View>
        );
      case 'create_group':
        return (
          <View style={styles.rightItem}>
            <CheckButton
              checked={
                (item.action as ItemActionCreateGroupDataType)?.createGroup
                  ?.isInvited
              }
              onChecked={
                (item.action as ItemActionCreateGroupDataType)?.createGroup
                  ?.onAction
              }
            />
          </View>
        );
      case 'block_contact':
        return (
          <View style={styles.rightItem}>
            <Button
              style={{ height: 30, borderRadius: 24, paddingHorizontal: 10 }}
              color={{
                disabled: {
                  content: 'rgba(102, 102, 102, 1)',
                  background: '#F2F2F2',
                },
                enabled: {
                  content: 'rgba(102, 102, 102, 1)',
                  background: '#F2F2F2',
                },
                pressed: {
                  content: 'rgba(102, 102, 102, 1)',
                  background: '#E6E6E6',
                },
              }}
              onPress={() => {
                sendEventFromContactList({
                  eventType: 'AlertEvent',
                  action: 'alert_block_contact',
                  params: { item: item },
                });
              }}
            >
              {(item.action as ItemActionBlockDataType)?.block?.name}
            </Button>
          </View>
        );
      case 'group_member_modify':
        return (
          <View style={styles.rightItem}>
            <CheckButton
              checked={
                (item.action as ItemActionModifyGroupMemberDataType)
                  ?.modifyGroupMember?.isInvited
              }
              onChecked={
                (item.action as ItemActionModifyGroupMemberDataType)
                  ?.modifyGroupMember?.onAction
              }
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.item}>
      <DefaultAvatar size={sf(50)} radius={sf(25)} />
      <View style={styles.itemText}>
        <Text style={{ lineHeight: 20, fontSize: 16, fontWeight: '600' }}>
          {item.contactID}
        </Text>
        {/* <Text>{item.contactName}</Text> */}
      </View>
      {Right(item.actionType)}
    </View>
  );
};

const NavigationHeaderTitle = (type: Undefinable<ContactActionType>) => {
  switch (type) {
    case 'group_member_modify':
      return 'Members';
    case 'block_contact':
      return 'Blocked Lists';
    default:
      return undefined;
  }
};

export function ContactListScreenInternal({
  route,
  navigation,
}: Props): JSX.Element {
  const sf = getScaleFactor();
  const rp = route.params as any;
  const params = rp?.params as any;
  const type = params?.type as Undefinable<ContactActionType>;
  const { header, groupInfo } = useAppI18nContext();
  const { height: screenHeight } = useWindowDimensions();

  const [selectedCount] = React.useState(10);

  const listRef = React.useRef<EqualHeightListRef>(null);
  const enableRefresh = type === 'contact_list' ? true : false;
  const enableAlphabet = type === 'contact_list' ? true : false;
  const enableHeader = false;
  const data: ItemDataType[] = React.useMemo(() => [], []); // for search
  const [isEmpty, setIsEmpty] = React.useState(true);
  const { client, getCurrentId } = useAppChatSdkContext();
  console.log('test:ContactListScreenInternal:', params, type);

  const manualRefresh = React.useCallback(
    (params: {
      type: 'init' | 'add' | 'search' | 'del-one' | 'update-one';
      items: ItemDataType[];
    }) => {
      if (params.type === 'init') {
        data.length = 0;
        listRef.current?.manualRefresh([
          {
            type: 'clear',
          },
          {
            type: 'add',
            data: params.items as EqualHeightListItemData[],
            enableSort: true,
            sortDirection: 'asc',
          },
        ]);
        data.push(...params.items);
      } else if (params.type === 'search') {
        listRef.current?.manualRefresh([
          {
            type: 'clear',
          },
          {
            type: 'add',
            data: params.items as EqualHeightListItemData[],
            enableSort: true,
            sortDirection: 'asc',
          },
        ]);
      } else if (params.type === 'add') {
        listRef.current?.manualRefresh([
          {
            type: 'add',
            data: params.items as EqualHeightListItemData[],
            enableSort: true,
            sortDirection: 'asc',
          },
        ]);
        data.push(...params.items);
      } else if (params.type === 'del-one') {
        listRef.current?.manualRefresh([
          {
            type: 'del',
            data: params.items as EqualHeightListItemData[],
            enableSort: false,
          },
        ]);
        let hadDeleted = false;
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          for (const item of params.items) {
            if (element && item.key === element.key) {
              data.splice(index, 1);
              hadDeleted = true;
              break;
            }
          }
          if (hadDeleted === true) {
            break;
          }
        }
      } else if (params.type === 'update-one') {
        listRef.current?.manualRefresh([
          {
            type: 'update',
            data: params.items as EqualHeightListItemData[],
            enableSort: true,
            sortDirection: 'asc',
          },
        ]);
        let hadUpdated = false;
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          for (const item of params.items) {
            if (element && item.key === element.key) {
              data[index] = item;
              hadUpdated = true;
              break;
            }
          }
          if (hadUpdated === true) {
            break;
          }
        }
      } else {
        return;
      }
      setIsEmpty(data.length === 0);
    },
    [data]
  );

  const standardizedData = React.useCallback(
    (item: Omit<ItemDataType, 'onLongPress' | 'onPress'>): ItemDataType => {
      const createAction = (
        item: Omit<ItemDataType, 'onLongPress' | 'onPress'>
      ) => {
        switch (item.actionType) {
          case 'group_invite': {
            const a = item.action as ItemActionGroupInviteDataType | undefined;
            return {
              groupInvite: {
                isActionEnabled: a?.groupInvite?.isActionEnabled,
                isInvited: a?.groupInvite?.isInvited,
                onAction: () => {
                  console.log('test:onAction:group_invite:');
                },
              },
            };
          }

          case 'create_group': {
            const a = item.action as ItemActionCreateGroupDataType;
            return {
              createGroup: {
                isActionEnabled: a?.createGroup?.isActionEnabled,
                isInvited: a?.createGroup?.isInvited,
                onAction: (checked: boolean) => {
                  if (a.createGroup?.isInvited !== undefined) {
                    a.createGroup.isInvited = checked;
                  }
                  manualRefresh({
                    type: 'update-one',
                    items: [standardizedData(item)],
                  });
                },
              },
            };
          }

          case 'block_contact': {
            const a = item.action as ItemActionBlockDataType;
            return {
              block: {
                name: a?.block?.name,
                onClicked: () => {
                  console.log('test:block_contact:');
                },
              },
            };
          }

          case 'group_member_modify': {
            const a = item.action as ItemActionModifyGroupMemberDataType;
            return {
              modifyGroupMember: {
                isActionEnabled: a?.modifyGroupMember?.isActionEnabled,
                isInvited: a?.modifyGroupMember?.isInvited,
                onAction: () => {
                  console.log('test:onAction:group_member_modify:');
                },
              },
            };
          }

          default:
            return undefined;
        }
      };

      const { contactID } = item;
      const r = {
        ...item,
        onLongPress: (_: ItemDataType) => {},
        onPress: (data: ItemDataType) => {
          if (type === 'create_conversation') {
            navigation.navigate('Chat', {
              params: { chatId: data.contactID, chatType: 0 },
            });
          } else if (type === 'group_member') {
            sendEventFromContactList({
              eventType: 'SheetEvent',
              action: 'sheet_group_member',
              params: { contactID: contactID },
            });
          } else {
            navigation.navigate({
              name: 'ContactInfo',
              params: { params: { userId: item.contactID } },
            });
          }
        },
        action: createAction(item),
      } as ItemDataType;
      return r;
    },
    [manualRefresh, navigation, type]
  );

  const initData = React.useCallback(
    (list: ItemDataType[]) => {
      const r = list.map((item) => {
        return standardizedData({
          ...item,
          height: 80,
        });
      });
      manualRefresh({
        type: 'init',
        items: r,
      });
    },
    [manualRefresh, standardizedData]
  );

  const _calculateAlphabetHeight = () => {
    const r = sf(screenHeight - 450 - 340);
    return r;
  };

  const NavigationHeaderRight = React.useCallback(
    (_: HeaderButtonProps) => {
      // const navigation = useNavigation<NavigationProp>();
      // const route = useRoute();
      const rp = route.params as any;
      const params = rp?.params as any;
      const type = params?.type as Undefinable<ContactActionType>;
      console.log('test:NavigationHeaderRight:', params, type);
      const sf = getScaleFactor();

      const Right = React.memo(
        ({ type }: { type: Undefinable<ContactActionType> }) => {
          if (type === 'group_invite') {
            const right = `${header.groupInvite}(${selectedCount})`;
            return (
              <View style={styles.rightButton}>
                <Text>{right}</Text>
              </View>
            );
          } else if (type === 'group_member') {
            return (
              <View style={styles.rightButton}>
                <LocalIcon name="contact_add_contacts" size={sf(28)} />
              </View>
            );
          } else if (type === 'create_group') {
            const _createGroup = () => {
              sendEventFromContactList({
                eventType: 'SheetEvent',
                action: 'sheet_create_group_settings',
                params: {},
              });
            };
            const right = `${header.createGroup}(${selectedCount})`;
            return (
              <TouchableOpacity
                style={styles.rightButton}
                onPress={_createGroup}
              >
                <Text
                  style={{ color: selectedCount === 0 ? 'black' : '#114EFF' }}
                >
                  {right}
                </Text>
              </TouchableOpacity>
            );
          } else if (type === 'group_member_modify') {
            const _addMember = () => {
              sendEventFromContactList({
                eventType: 'AlertEvent',
                action: 'alert_group_member_modify',
                params: {},
              });
            };
            const right = `${header.addMembers}(${selectedCount})`;
            return (
              <TouchableOpacity style={styles.rightButton} onPress={_addMember}>
                <Text
                  style={{ color: selectedCount === 0 ? 'black' : '#114EFF' }}
                >
                  {right}
                </Text>
              </TouchableOpacity>
            );
          } else {
            return null;
          }
        }
      );

      return (
        <Pressable
          onPress={() => {
            if (type === 'group_member') {
              navigation.push('ContactList' as any, {
                params: { type: 'group_member_modify' },
              });
            } else {
              sendEventFromContactList({
                eventType: 'AlertEvent',
                action: 'alert_group_member_modify',
                params: {},
              });
            }
          }}
        >
          <DialogContextProvider>
            <Right type={type} />
          </DialogContextProvider>
        </Pressable>
      );
    },
    [
      header.addMembers,
      header.createGroup,
      header.groupInvite,
      navigation,
      route.params,
      selectedCount,
    ]
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: NavigationHeaderRight,
      headerTitle: NavigationHeaderTitle(type),
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    });
  }, [NavigationHeaderRight, navigation, type]);

  const createGroupAction = React.useCallback(
    async ({
      data,
      isInvite,
      isPublic,
    }: {
      data: ItemDataType[];
      isInvite: boolean;
      isPublic: boolean;
    }) => {
      console.log('test:createGroupAction:', type, data.length);
      if (type !== 'create_group') {
        return;
      }
      const r = [] as string[];
      for (const item of data) {
        const i = item.action as ItemActionCreateGroupDataType;
        if (i?.createGroup && i.createGroup.isInvited === true) {
          r.push(item.contactID);
        }
      }
      if (r.length === 0) {
        sendEventFromContactList({
          eventType: 'DataEvent',
          action: 'create_group_result',
          params: {
            result: false,
            error: 'The number of members cannot be less than 1.',
          },
        });
        return;
      }
      const currentId = getCurrentId();
      r.push(currentId);
      const groupName = (r: string[]) => {
        let _r = '';
        for (const id of r) {
          _r += `${id},`;
        }
        _r = _r.substring(0, _r.length - 1);
        return _r;
      };
      client.groupManager
        .createGroup(
          new ChatGroupOptions({
            style:
              isPublic === true
                ? ChatGroupStyle.PublicJoinNeedApproval
                : ChatGroupStyle.PrivateMemberCanInvite,
            maxCount: 200,
            inviteNeedConfirm: isInvite,
          }),
          groupName(r),
          'This is new group.',
          r,
          'Welcome to group'
        )
        .then((result) => {
          console.log('test:createGroupAction:success:', result);
          sendEventFromContactList({
            eventType: 'DataEvent',
            action: 'create_group_result',
            params: {
              result: true,
              id: result.groupId,
            },
          });
        })
        .catch((error) => {
          console.warn('test:createGroupAction:fail:', error);
          sendEventFromContactList({
            eventType: 'DataEvent',
            action: 'create_group_result',
            params: {
              result: false,
              error: error,
            },
          });
        });
    },
    [client.groupManager, getCurrentId, type]
  );

  const initList = React.useCallback(
    (type: Undefinable<ContactActionType>) => {
      if (type === 'contact_list') {
        client.contactManager
          .getAllContactsFromServer()
          .then((result) => {
            initData(
              result.map((id) => {
                return {
                  key: id,
                  contactID: id,
                  contactName: id,
                  actionType: 'contact_list',
                  action: undefined,
                } as ItemDataType;
              })
            ); // for test
          })
          .catch((error) => {
            console.warn('test:getAllContactsFromServer:error:', error);
          });
      } else if (type === 'create_group') {
        client.contactManager
          .getAllContactsFromServer()
          .then((result) => {
            console.log('test:getAllContactsFromServer:success:', result);
            initData(
              result.map((id) => {
                return {
                  key: id,
                  contactID: id,
                  contactName: id,
                  actionType: 'create_group',
                  action: {
                    createGroup: { isActionEnabled: true, isInvited: false },
                  },
                } as ItemDataType;
              })
            ); // for test
          })
          .catch((error) => {
            console.warn('test:getAllContactsFromServer:error:', error);
          });
      }
    },
    [client, initData]
  );

  const duplicateCheck = React.useCallback(
    (id: string) => {
      for (const item of data) {
        if (item.contactID === id) {
          return true;
        }
      }
      return false;
    },
    [data]
  );

  const addListeners = React.useCallback(
    (_: Undefinable<ContactActionType>) => {
      console.log('test:addListeners:', ContactListScreenInternal.name);
      const sub = DeviceEventEmitter.addListener(
        ContactChatSdkEvent,
        (event) => {
          const eventType = event.type as ContactChatSdkEventType;
          const eventParams = event.params as { id: string };
          switch (eventType) {
            case 'onContactAdded':
              {
                const userName = eventParams.id;
                if (duplicateCheck(userName)) {
                  return;
                }
                // toast.showToast(contactList.toast[0]!); /// !!! dead lock
                if (type === 'contact_list') {
                  manualRefresh({
                    type: 'add',
                    items: [
                      standardizedData({
                        key: userName,
                        contactID: userName,
                        contactName: userName,
                        actionType: 'contact_list',
                        action: undefined,
                      }),
                    ],
                  });
                }
              }
              break;
            case 'onContactDeleted':
              {
                const userName = eventParams.id;
                if (type === 'contact_list') {
                  manualRefresh({
                    type: 'del-one',
                    items: [
                      standardizedData({
                        key: userName,
                        contactID: userName,
                        contactName: userName,
                        actionType: 'contact_list',
                        action: undefined,
                      }),
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
      const sub2 = DeviceEventEmitter.addListener(
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
            case 'alert_group_member_modify_result':
              if (params.isConfirmed) {
                navigation.goBack();
                sendEventFromContactList({
                  eventType: 'ToastEvent',
                  action: 'toast_',
                  params: groupInfo.toast[0]!,
                });
              } else {
                navigation.goBack();
              }
              break;
            case 'create_group_result_fail_result':
              navigation.goBack();
              break;
            case 'create_group_result_success':
              if (navigation.canGoBack()) {
                // navigation.goBack();
                navigation.pop(1);
                navigation.push('Chat', {
                  params: {
                    chatId: params.chatId,
                    chatType: params.chatType,
                  },
                });
                // navigation.popToTop();
              }
              break;
            case 'start_create_new_group':
              {
                const isInvite = params.isInvite as boolean;
                const isPublic = params.isPublic as boolean;
                createGroupAction({ data, isInvite, isPublic });
              }
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
    },
    [
      createGroupAction,
      data,
      duplicateCheck,
      groupInfo.toast,
      manualRefresh,
      navigation,
      standardizedData,
      type,
    ]
  );

  React.useEffect(() => {
    const load = () => {
      console.log('test:load:', ContactListScreen.name);
      const unsubscribe = addListeners(type);
      initList(type);
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', ContactListScreen.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners, initList, type]);

  return (
    <>
      <DefaultListSearchHeader
        autoFocus={autoFocus()}
        onChangeText={(text) => {
          queueTask(() => {
            const r: ItemDataType[] = [];
            for (const item of data) {
              if (item.key.includes(text)) {
                r.push(item);
              }
            }
            manualRefresh({
              type: 'search',
              items: r,
            });
          });
        }}
      />
      <EqualHeightList
        parentName="ContactList"
        ref={listRef}
        items={data}
        ItemFC={Item}
        enableAlphabet={enableAlphabet}
        enableRefresh={enableRefresh}
        enableHeader={enableHeader}
        alphabet={{
          alphabetCurrent: {
            backgroundColor: 'orange',
            color: 'white',
          },
          alphabetItemContainer: {
            width: 15,
            borderRadius: 8,
          },
          alphabetContainer: {
            top: _calculateAlphabetHeight(),
          },
        }}
        ItemSeparatorComponent={DefaultListItemSeparator}
        onRefresh={(refreshType) => {
          if (refreshType === 'started') {
            initList(type);
          }
        }}
      />
      {isEmpty === true ? <Blank style={styles.blank} /> : null}
    </>
  );
}

const styles = createStyleSheet({
  item: {
    flex: 1,
    // backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 0,
    marginHorizontal: 0,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    marginLeft: 10,
  },
  rightItem: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexGrow: 1,
    paddingRight: 5,
  },
  rightButton: { padding: 10, marginRight: -10 },
  blank: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default function ContactListScreen({
  route,
  navigation,
}: Props): JSX.Element {
  return (
    <ScreenContainer mode="padding" edges={['right', 'left']}>
      <ContactListScreenInternal route={route} navigation={navigation} />
    </ScreenContainer>
  );
}
