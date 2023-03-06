import type {
  MaterialBottomTabNavigationProp,
  MaterialBottomTabScreenProps,
} from '@react-navigation/material-bottom-tabs';
import type {
  MaterialTopTabNavigationProp,
  MaterialTopTabScreenProps,
} from '@react-navigation/material-top-tabs';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  useNavigation,
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
  DefaultAvatar,
  DefaultListItemSeparator,
  DefaultListSearchHeader,
  DialogContextProvider,
  EqualHeightList,
  EqualHeightListItemComponent,
  EqualHeightListItemData,
  EqualHeightListRef,
  FragmentContainer,
  getScaleFactor,
  LocalIcon,
  queueTask,
  ScreenContainer,
  useAlert,
  useBottomSheet,
  useThemeContext,
  useToastContext,
} from 'react-native-chat-uikit';

import { CreateGroupSettings } from '../components/CreateGroupSettings';
import { useAppI18nContext } from '../contexts/AppI18nContext';
import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import {
  ContactListEvent,
  ContactListEventType,
  CreateGroupSettingsEvent,
} from '../events';
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

type AlertEvent =
  | 'alert_block_contact'
  | 'alert_group_member_modify'
  | 'alert_remove_group_member'
  | 'alert_';
type SheetEvent =
  | 'sheet_contact_list'
  | 'sheet_group_member'
  | 'sheet_create_group_settings'
  | 'sheet_';
type ToastEvent = 'toast_Unblocked' | 'toast_Removed' | 'toast_';

const InvisiblePlaceholder = React.memo(
  ({ getData }: { getData: () => ItemDataType[] }) => {
    console.log('test:InvisiblePlaceholder:', getData());
    const sheet = useBottomSheet();
    const toast = useToastContext();
    const alert = useAlert();
    const { groupInfo } = useAppI18nContext();
    const theme = useThemeContext();
    const sf = getScaleFactor();

    const navigation = useNavigation<NavigationProp>();

    React.useEffect(() => {
      const sub = DeviceEventEmitter.addListener(ContactListEvent, (event) => {
        console.log('test:ContactListEvent:sub:', event);
        switch (event.type as ContactListEventType) {
          case 'alert_':
            {
              const eventParams = event.params;
              const eventType = eventParams.type as AlertEvent;
              if (eventType === 'alert_group_member_modify') {
                alert.openAlert({
                  title: groupInfo.inviteAlert.title,
                  message: groupInfo.inviteAlert.message,
                  buttons: [
                    {
                      text: groupInfo.inviteAlert.cancelButton,
                      onPress: () => {
                        navigation.goBack();
                      },
                    },
                    {
                      text: groupInfo.inviteAlert.confirmButton,
                      onPress: () => {
                        navigation.goBack();
                        DeviceEventEmitter.emit(ContactListEvent, {
                          type: 'toast_' as ContactListEventType,
                          params: {
                            type: 'toast_custom' as ToastEvent,
                            content: groupInfo.toast[0]!,
                          },
                        });
                      },
                    },
                  ],
                });
              } else if (eventType === 'alert_block_contact') {
                alert.openAlert({
                  title: 'Unblock NickName?',
                  buttons: [
                    {
                      text: 'Cancel',
                      onPress: () => {},
                    },
                    {
                      text: 'Confirm',
                      onPress: () => {
                        DeviceEventEmitter.emit(ContactListEvent, {
                          type: 'toast_' as ContactListEventType,
                          params: {
                            type: 'toast_Unblocked' as ToastEvent,
                            content: 'Unblocked',
                          },
                        });
                      },
                    },
                  ],
                });
              } else if (eventType === 'alert_remove_group_member') {
                alert.openAlert({
                  title: 'Remove NickName?',
                  buttons: [
                    {
                      text: 'Cancel',
                      onPress: () => {},
                    },
                    {
                      text: 'Confirm',
                      onPress: () => {
                        DeviceEventEmitter.emit(ContactListEvent, {
                          type: 'toast_' as ContactListEventType,
                          params: {
                            type: 'toast_Removed' as ToastEvent,
                            content: 'Removed',
                          },
                        });
                      },
                    },
                  ],
                });
              }
            }
            break;
          case 'sheet_':
            {
              const eventParams = event.params;
              const eventType = eventParams.type as SheetEvent;
              if (eventType === 'sheet_contact_list') {
                sheet.openSheet({
                  sheetItems: [
                    {
                      icon: 'loading',
                      iconColor: theme.colors.primary,
                      title: '1',
                      titleColor: 'black',
                      onPress: () => {},
                    },
                    {
                      icon: 'loading',
                      iconColor: theme.colors.primary,
                      title: '2',
                      titleColor: 'black',
                      onPress: () => {},
                    },
                  ],
                });
              } else if (eventType === 'sheet_group_member') {
                const { contactID } = eventParams.content;
                sheet.openSheet({
                  sheetItems: [
                    {
                      title: contactID,
                      titleColor: 'black',
                      onPress: () => {},
                      containerStyle: {
                        marginTop: sf(10),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: undefined,
                        minWidth: undefined,
                        backgroundColor: undefined,
                        borderRadius: undefined,
                      },
                      titleStyle: {
                        fontWeight: '600',
                        fontSize: sf(14),
                        lineHeight: sf(16),
                        color: 'rgba(102, 102, 102, 1)',
                        marginHorizontal: undefined,
                      },
                    },
                    {
                      title: groupInfo.memberSheet.add,
                      titleColor: 'black',
                      onPress: () => {
                        DeviceEventEmitter.emit(ContactListEvent, {
                          type: 'toast_' as ContactListEventType,
                          params: {
                            type: 'toast_custom' as ToastEvent,
                            content: groupInfo.toast[4]!,
                          },
                        });
                      },
                    },
                    {
                      title: groupInfo.memberSheet.remove,
                      titleColor: 'rgba(255, 20, 204, 1)',
                      onPress: () => {
                        DeviceEventEmitter.emit(ContactListEvent, {
                          type: 'alert_' as ContactListEventType,
                          params: {
                            type: 'alert_remove_group_member' as AlertEvent,
                            content: {},
                          },
                        });
                      },
                    },
                    {
                      title: groupInfo.memberSheet.chat,
                      titleColor: 'black',
                      onPress: () => {},
                    },
                  ],
                });
              } else if (eventType === 'sheet_create_group_settings') {
                sheet.openSheet({
                  sheetItems: [
                    {
                      key: '1',
                      Custom: CreateGroupSettings,
                      CustomProps: { test: 'hh' } as any,
                    },
                  ],
                });
              }
            }
            break;
          case 'toast_':
            {
              const params = event.params;
              toast.showToast(params.content);
            }
            break;
          case 'create_group_result_fail':
            {
              const params = event.params;
              alert.openAlert({
                title: params.content,
                buttons: [
                  {
                    text: 'Confirm',
                    onPress: () => {
                      navigation.goBack();
                    },
                  },
                ],
              });
            }
            break;
          default:
            break;
        }
      });
      return () => {
        sub.remove();
      };
    }, [
      toast,
      sheet,
      alert,
      groupInfo.inviteAlert.title,
      groupInfo.inviteAlert.message,
      groupInfo.inviteAlert.cancelButton,
      groupInfo.inviteAlert.confirmButton,
      groupInfo.toast,
      groupInfo.memberSheet.add,
      groupInfo.memberSheet.remove,
      groupInfo.memberSheet.chat,
      navigation,
      theme.colors.primary,
      sf,
      getData,
    ]);

    return <></>;
  }
);

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
                DeviceEventEmitter.emit(ContactListEvent, {
                  type: 'alert_' as ContactListEventType,
                  params: {
                    type: 'alert_block_contact' as AlertEvent,
                    content: { item: item },
                  },
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
  console.log('test:ContactListScreenInternal:', params, type, route);
  const { header } = useAppI18nContext();
  const { height: screenHeight } = useWindowDimensions();

  const [selectedCount] = React.useState(10);

  const listRef = React.useRef<EqualHeightListRef>(null);
  const enableRefresh = type === 'contact_list' ? true : false;
  const enableAlphabet = type === 'contact_list' ? true : false;
  const enableHeader = false;
  const data: ItemDataType[] = React.useMemo(() => [], []); // for search
  const [isEmpty, setIsEmpty] = React.useState(true);
  const { client, getCurrentId } = useAppChatSdkContext();
  const isInvite = React.useRef(true);
  const isPublic = React.useRef(true);

  const getData = React.useCallback(() => {
    return data;
  }, [data]);

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
        onLongPress: (_: ItemDataType) => {
          if (type === 'contact_list') {
            DeviceEventEmitter.emit(ContactListEvent, {
              type: 'sheet_' as ContactListEventType,
              params: { type: 'sheet_contact_list' as SheetEvent, content: {} },
            });
          }
        },
        onPress: (data: ItemDataType) => {
          if (type === 'create_conversation') {
            navigation.navigate('Chat', {
              params: { chatId: data.contactID, chatType: 0 },
            });
          } else if (type === 'group_member') {
            DeviceEventEmitter.emit('sheet_', {
              type: 'sheet_' as ContactListEventType,
              params: {
                type: 'sheet_group_member' as SheetEvent,
                content: {
                  contactID: contactID,
                },
              },
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
              DeviceEventEmitter.emit(ContactListEvent, {
                type: 'sheet_' as ContactListEventType,
                params: {
                  type: 'sheet_create_group_settings' as SheetEvent,
                  content: {},
                },
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
              DeviceEventEmitter.emit(ContactListEvent, {
                type: 'alert_' as ContactListEventType,
                params: {
                  type: 'alert_group_member_modify' as AlertEvent,
                  content: {},
                },
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
              DeviceEventEmitter.emit(ContactListEvent, {
                type: 'alert_' as ContactListEventType,
                params: {
                  type: 'alert_group_member_modify' as AlertEvent,
                  content: {},
                },
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

  const createGroup = React.useCallback(
    async (data: ItemDataType[]) => {
      console.log('test:createGroup:', data);
      const r = [];
      for (const item of data) {
        const i = item.action as ItemActionCreateGroupDataType;
        if (i?.createGroup && i.createGroup.isInvited === true) {
          r.push(item.contactID);
        }
      }
      if (r.length === 0) {
        DeviceEventEmitter.emit(ContactListEvent, {
          type: 'create_group_result' as ContactListEventType,
          params: {
            result: false,
            error: 'The number of members cannot be less than 1.',
          },
        });
        return;
      }
      const currentId = getCurrentId();
      r.push(currentId);
      client.groupManager
        .createGroup(
          new ChatGroupOptions({
            style:
              isPublic.current === true
                ? ChatGroupStyle.PublicJoinNeedApproval
                : ChatGroupStyle.PrivateMemberCanInvite,
            maxCount: 200,
            inviteNeedConfirm: isInvite.current,
          }),
          'New Group',
          'This is new group.',
          r,
          'Welcome to group'
        )
        .then((result) => {
          console.log('test:createGroup:success:', result);
          DeviceEventEmitter.emit(ContactListEvent, {
            type: 'create_group_result' as ContactListEventType,
            params: {
              result: true,
              id: result.groupId,
            },
          });
        })
        .catch((error) => {
          console.warn('test:createGroup:fail:', error);
          DeviceEventEmitter.emit(ContactListEvent, {
            type: 'create_group_result' as ContactListEventType,
            params: {
              result: false,
              error: error,
            },
          });
        });
    },
    [client.groupManager, getCurrentId]
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
            console.warn('test:error:', error);
          });
      } else if (type === 'create_group') {
        client.contactManager
          .getAllContactsFromServer()
          .then((result) => {
            console.log('test:ContactListScreen:success:', result);
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
            console.warn('test:error:', error);
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
      const sub4 = DeviceEventEmitter.addListener(
        CreateGroupSettingsEvent,
        (event) => {
          console.log('test:CreateGroupSettingsEvent:sub4:', event);
          if (event.type === 'create_new_group') {
            isInvite.current = event.params.isInvite;
            isPublic.current = event.params.isPublic;
            createGroup(data);
          }
        }
      );
      return () => {
        sub.remove();
        sub4.remove();
      };
    },
    [createGroup, data, duplicateCheck, manualRefresh, standardizedData, type]
  );

  React.useEffect(() => {
    console.log('test:useEffect:', addListeners, initList, type);
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
      {isEmpty === true ? (
        <Blank />
      ) : (
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
            console.log('test:onRefresh:', refreshType);
            if (refreshType === 'started') {
              initList(type);
            }
          }}
        />
      )}
      <FragmentContainer>
        <InvisiblePlaceholder getData={getData} />
      </FragmentContainer>
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
