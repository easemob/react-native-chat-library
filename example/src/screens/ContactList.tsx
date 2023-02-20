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
import {
  ChatContactEventListener,
  ChatGroupOptions,
  ChatGroupStyle,
} from 'react-native-chat-sdk';
import {
  autoFocus,
  Blank,
  Button,
  CheckButton,
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
  | 'sheet_create_group'
  | 'sheet_';
type ToastEvent = 'toast_Unblocked' | 'toast_Removed' | 'toast_';

const InvisiblePlaceholder = React.memo(
  ({ data }: { data: ItemDataType[] }) => {
    console.log('test:InvisiblePlaceholder:');
    const sheet = useBottomSheet();
    const toast = useToastContext();
    const alert = useAlert();
    const { groupInfo } = useAppI18nContext();
    const theme = useThemeContext();
    const sf = getScaleFactor();
    const { client } = useAppChatSdkContext();

    const navigation = useNavigation<NavigationProp>();

    const isPublic = React.useRef(false);
    const isInvite = React.useRef(false);

    const createGroup = React.useCallback(async () => {
      console.log('test:createGroup:', data);
      const r = [];
      for (const item of data) {
        const i = item.action as ItemActionCreateGroupDataType;
        if (i?.createGroup && i.createGroup.isInvited === true) {
          r.push(item.contactID);
        }
      }
      console.log('test:r:', r);
      if (r.length === 0) {
        // DeviceEventEmitter.emit(ContactListEvent, {
        //   type: 'toast_' as ContactListEventType,
        //   params: {
        //     type: 'toast_custom' as ToastEvent,
        //     content: 'The number of selected persons cannot be 0.',
        //   },
        // });
        DeviceEventEmitter.emit(ContactListEvent, {
          type: 'create_group_result' as ContactListEventType,
          params: {
            result: false,
          },
        });
        return;
      }
      try {
        const currentId = await client.getCurrentUsername();
        r.push(currentId);
      } catch (error) {
        console.warn('test:error:', error);
        DeviceEventEmitter.emit(ContactListEvent, {
          type: 'create_group_result_fail' as ContactListEventType,
          params: {
            content: 'Create Group Failed3.',
          },
        });
        return;
      }
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
            },
          });
        });
    }, [client, data]);

    React.useEffect(() => {
      console.log('test:load:111:');
      const sub = DeviceEventEmitter.addListener(ContactListEvent, (event) => {
        console.log('test:ContactListEvent:', event);
        switch (event.type as ContactListEventType) {
          case 'alert_':
            {
              const eventParams = event.params;
              const eventType = eventParams.type as AlertEvent;
              console.log('test:alert:', eventParams, eventType);
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
              console.log('test:sheet:', eventParams, eventType);
              if (eventType === 'sheet_contact_list') {
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
              } else if (eventType === 'sheet_group_member') {
                const { contactID } = eventParams.content;
                sheet.openSheet({
                  sheetItems: [
                    {
                      title: contactID,
                      titleColor: 'black',
                      onPress: () => {
                        console.log('test:onPress:data:', data);
                      },
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
                        console.log('test:onPress:data:', data);
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
                        console.log('test:onPress:data:', data);
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
                      onPress: () => {
                        console.log('test:onPress:data:', data);
                      },
                    },
                  ],
                });
              } else if (eventType === 'sheet_create_group') {
                console.log('test:sheet_create_group:');
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
              console.log('test:toast:', params, event.type);
              toast.showToast(params.content);
            }
            break;
          case 'create_group_result_fail':
            {
              const params = event.params;
              console.log('test:create_group_result_fail:', params, event.type);
              alert.openAlert({
                title: params.content,
                buttons: [
                  {
                    text: 'Confirm',
                    onPress: () => {},
                  },
                ],
              });
            }
            break;
          default:
            break;
        }
      });
      const sub4 = DeviceEventEmitter.addListener(
        CreateGroupSettingsEvent,
        (event) => {
          console.log('test:event:', event.type, event.params);
          if (event.type === 'create_new_group') {
            isInvite.current = event.params.isInvite;
            isPublic.current = event.params.isPublic;
            createGroup();
          }
        }
      );
      return () => {
        console.log('test:unload:222:');
        sub.remove();
        // sub1.remove();
        // sub2.remove();
        // sub3.remove();
        sub4.remove();
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
      data,
      sf,
      createGroup,
    ]);

    return <></>;
  }
);

const Item: EqualHeightListItemComponent = (props) => {
  const sf = getScaleFactor();
  const item = props.data as ItemDataType;
  // const toast = useToastContext();
  // const alert = useAlert();

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
                // alert.openAlert({
                //   title: 'Unblock NickName?',
                //   buttons: [
                //     {
                //       text: 'Cancel',
                //       onPress: () => {},
                //     },
                //     {
                //       text: 'Confirm',
                //       onPress: () => {
                //         // toast.showToast('Unblocked');
                //         DeviceEventEmitter.emit('toast_', {
                //           type: 'toast_Unblocked',
                //           content: 'Unblocked',
                //         });
                //       },
                //     },
                //   ],
                // });
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
  console.log('test:ContactListScreen:', params, type, route);
  // const theme = useThemeContext();
  // const menu = useActionMenu();
  // const sheet = useBottomSheet();
  const toast = useToastContext();
  // const alert = useAlert();
  const { header, contactList } = useAppI18nContext();
  const { height: screenHeight } = useWindowDimensions();
  // const isPublic = React.useRef(false);
  // const isInvite = React.useRef(false);

  // const { manualClose } = useManualCloseDialog();

  const [selectedCount] = React.useState(10);

  const listRef = React.useRef<EqualHeightListRef>(null);
  const enableRefresh = type === 'contact_list' ? true : false;
  const enableAlphabet = type === 'contact_list' ? true : false;
  const enableHeader = false;
  // const autoFocus = false;
  const data: ItemDataType[] = React.useMemo(() => [], []); // for search
  // let managedData = React.useRef<ItemDataType[]>(null);
  const [isEmpty, setIsEmpty] = React.useState(true);
  const { client } = useAppChatSdkContext();

  const manualRefresh = React.useCallback(
    (params: {
      type: 'init' | 'add' | 'search' | 'del-one' | 'update-one';
      items: ItemDataType[];
    }) => {
      console.log('test:useCallback:manualRefresh:');
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
        console.warn('test:');
        return;
      }
    },
    [data]
  );

  const standardizedData = React.useCallback(
    (item: Omit<ItemDataType, 'onLongPress' | 'onPress'>): ItemDataType => {
      console.log('test:useCallback:standardizedData:');
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
                  // console.log('test:create_group:111:', checked);
                  if (a.createGroup?.isInvited !== undefined) {
                    a.createGroup.isInvited = checked;
                  }
                  manualRefresh({
                    type: 'update-one',
                    items: [standardizedData(item)],
                  });
                  // console.log(
                  //   'test:create_group:222:',
                  //   checked,
                  //   item,
                  //   a?.createGroup?.onAction
                  // );
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
            // sheet.openSheet({
            //   sheetItems: [
            //     {
            //       icon: 'loading',
            //       iconColor: theme.colors.primary,
            //       title: '1',
            //       titleColor: 'black',
            //       onPress: () => {
            //         console.log('test:onPress:data:', data);
            //       },
            //     },
            //     {
            //       icon: 'loading',
            //       iconColor: theme.colors.primary,
            //       title: '2',
            //       titleColor: 'black',
            //       onPress: () => {
            //         console.log('test:onPress:data:', data);
            //       },
            //     },
            //   ],
            // });
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
            // sheet.openSheet({
            //   sheetItems: [
            //     {
            //       title: contactID,
            //       titleColor: 'black',
            //       onPress: () => {
            //         console.log('test:onPress:data:', data);
            //       },
            //       containerStyle: {
            //         marginTop: sf(10),
            //         flexDirection: 'row',
            //         alignItems: 'center',
            //         justifyContent: 'center',
            //         height: undefined,
            //         minWidth: undefined,
            //         backgroundColor: undefined,
            //         borderRadius: undefined,
            //       },
            //       titleStyle: {
            //         fontWeight: '600',
            //         fontSize: sf(14),
            //         lineHeight: sf(16),
            //         color: 'rgba(102, 102, 102, 1)',
            //         marginHorizontal: undefined,
            //       },
            //     },
            //     {
            //       title: groupInfo.memberSheet.add,
            //       titleColor: 'black',
            //       onPress: () => {
            //         console.log('test:onPress:data:', data);
            //         toast.showToast(groupInfo.toast[4]!);
            //         DeviceEventEmitter.emit('toast_', {
            //           type: 'toast_custom',
            //           content: groupInfo.toast[4]!,
            //         });
            //       },
            //     },
            //     {
            //       title: groupInfo.memberSheet.remove,
            //       titleColor: 'rgba(255, 20, 204, 1)',
            //       onPress: () => {
            //         console.log('test:onPress:data:', data);
            //         alert.openAlert({
            //           title: 'Remove NickName?',
            //           buttons: [
            //             {
            //               text: 'Cancel',
            //               onPress: () => {},
            //             },
            //             {
            //               text: 'Confirm',
            //               onPress: () => {
            //                 // toast.showToast('Removed');
            //                 DeviceEventEmitter.emit('toast_', {
            //                   type: 'toast_Removed',
            //                   content: 'Removed',
            //                 });
            //               },
            //             },
            //           ],
            //         });
            //       },
            //     },
            //     {
            //       title: groupInfo.memberSheet.chat,
            //       titleColor: 'black',
            //       onPress: () => {
            //         console.log('test:onPress:data:', data);
            //       },
            //     },
            //   ],
            // });
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

  // const createGroup = React.useCallback(() => {
  //   console.log('test:createGroup:', data);
  //   const r = [];
  //   for (const item of data) {
  //     const i = item.action as ItemActionCreateGroupDataType;
  //     if (i?.createGroup && i.createGroup.isInvited === true) {
  //       r.push(item.contactID);
  //     }
  //   }
  //   console.log('test:r:', r);
  //   if (r.length === 0) {
  //     DeviceEventEmitter.emit(ContactListEvent, {
  //       type: 'toast_' as ContactListEventType,
  //       params: {
  //         type: 'toast_custom' as ToastEvent,
  //         content: 'The number of selected persons cannot be 0.',
  //       },
  //     });
  //     DeviceEventEmitter.emit(ContactListEvent, {
  //       type: 'create_group_result' as ContactListEventType,
  //       params: {
  //         result: false,
  //       },
  //     });
  //   }
  //   client.groupManager
  //     .createGroup(
  //       new ChatGroupOptions({
  //         style:
  //           isPublic.current === true
  //             ? ChatGroupStyle.PublicJoinNeedApproval
  //             : ChatGroupStyle.PrivateMemberCanInvite,
  //         maxCount: 200,
  //         inviteNeedConfirm: isInvite.current,
  //       }),
  //       'New Group',
  //       'This is new group.',
  //       r,
  //       'Welcome to group'
  //     )
  //     .then((result) => {
  //       console.log('test:createGroup:success:', result);
  //       DeviceEventEmitter.emit(ContactListEvent, {
  //         type: 'create_group_result' as ContactListEventType,
  //         params: {
  //           result: true,
  //           id: result.groupId,
  //         },
  //       });
  //     })
  //     .catch((error) => {
  //       console.warn('test:createGroup:fail:', error);
  //       DeviceEventEmitter.emit(ContactListEvent, {
  //         type: 'create_group_result' as ContactListEventType,
  //         params: {
  //           result: false,
  //         },
  //       });
  //     });
  // }, [client.groupManager, data, isInvite, isPublic]);

  const initData = React.useCallback(
    (list: ItemDataType[]) => {
      console.log('test:useCallback:initData:');
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
      console.log('test:useCallback:NavigationHeaderRight:');
      // const navigation = useNavigation<NavigationProp>();
      // const route = useRoute();
      const rp = route.params as any;
      const params = rp?.params as any;
      const type = params?.type as Undefinable<ContactActionType>;
      console.log('test:NavigationHeaderRight:', params, type);
      const sf = getScaleFactor();
      // return <Text>hh</Text>;

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
              // setSelectedCount(selectedCount + 1);
              // sheet.openSheet({
              //   sheetItems: [
              //     {
              //       key: '1',
              //       Custom: CreateGroupSettings,
              //       CustomProps: { test: 'hh' } as any,
              //     },
              //   ],
              // });
              DeviceEventEmitter.emit(ContactListEvent, {
                type: 'sheet_' as ContactListEventType,
                params: {
                  type: 'sheet_create_group' as SheetEvent,
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
              // alert.openAlert({
              //   title: groupInfo.inviteAlert.title,
              //   message: groupInfo.inviteAlert.message,
              //   buttons: [
              //     {
              //       text: groupInfo.inviteAlert.cancelButton,
              //       onPress: () => {
              //         navigation.goBack();
              //       },
              //     },
              //     {
              //       text: groupInfo.inviteAlert.confirmButton,
              //       onPress: () => {
              //         navigation.goBack();
              //         // toast.showToast(groupInfo.toast[0]!);
              //         DeviceEventEmitter.emit('toast_', {
              //           type: 'toast_custom',
              //           content: groupInfo.toast[0]!,
              //         });
              //       },
              //     },
              //   ],
              // });
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
              // alert.openAlert({
              //   title: groupInfo.inviteAlert.title,
              //   message: groupInfo.inviteAlert.message,
              //   buttons: [
              //     {
              //       text: groupInfo.inviteAlert.cancelButton,
              //       onPress: () => {
              //         navigation.goBack();
              //       },
              //     },
              //     {
              //       text: groupInfo.inviteAlert.confirmButton,
              //       onPress: () => {
              //         navigation.goBack();
              //         // toast.showToast(groupInfo.toast[0]!);
              //         DeviceEventEmitter.emit('toast_', {
              //           type: 'toast_custom',
              //           content: groupInfo.toast[0]!,
              //         });
              //       },
              //     },
              //   ],
              // });
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

  const initList = React.useCallback(
    (type: Undefinable<ContactActionType>) => {
      console.log('test:useCallback:initList:');
      if (type === 'contact_list') {
        client.contactManager
          .getAllContactsFromServer()
          .then((result) => {
            console.log('test:ContactListScreen:success:', result);
            setIsEmpty(result.length === 0);
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
            setIsEmpty(result.length === 0);
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
      console.log('test:useCallback:duplicateCheck:');
      for (const item in data) {
        if (item.includes(id)) {
          return true;
        }
      }
      return false;
    },
    [data]
  );

  const addListeners = React.useCallback(
    (_: Undefinable<ContactActionType>) => {
      console.log(
        'test:useCallback:addListeners:',
        contactList.toast,
        toast,
        type
      );
      const contactEventListener: ChatContactEventListener = {
        onContactAdded: (userName: string) => {
          console.log('test:onContactAdded:', userName);
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
        },

        onContactDeleted: (userName: string): void => {
          console.log('test:onContactDeleted:', userName);
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
        },

        onFriendRequestAccepted: (userName: string): void => {
          console.log('test:onFriendRequestAccepted:', userName);
          // toast.showToast(contactList.toast[2]!);
        },

        onFriendRequestDeclined: (userName: string): void => {
          console.log('test:onFriendRequestDeclined:', userName);
          // toast.showToast(contactList.toast[3]!);
        },
      };
      client.contactManager.addContactListener(contactEventListener);
      return () => {
        client.contactManager.removeContactListener(contactEventListener);
      };
    },
    [
      client.contactManager,
      contactList.toast,
      duplicateCheck,
      manualRefresh,
      standardizedData,
      toast,
      type,
    ]
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

  // !!! must be last React.useEffect
  // https://github.com/facebook/react/issues/14920
  // React.useEffect(() => {
  //   console.log('test:load:111:');
  //   const sub = DeviceEventEmitter.addListener(ContactListEvent, (event) => {
  //     console.log('test:ContactListEvent:', event);
  //     switch (event.type as ContactListEventType) {
  //       case 'alert_':
  //         {
  //           const eventParams = event.params;
  //           const eventType = eventParams.type as AlertEvent;
  //           console.log('test:alert:', eventParams, eventType);
  //           if (eventType === 'alert_group_member_modify') {
  //             alert.openAlert({
  //               title: groupInfo.inviteAlert.title,
  //               message: groupInfo.inviteAlert.message,
  //               buttons: [
  //                 {
  //                   text: groupInfo.inviteAlert.cancelButton,
  //                   onPress: () => {
  //                     navigation.goBack();
  //                   },
  //                 },
  //                 {
  //                   text: groupInfo.inviteAlert.confirmButton,
  //                   onPress: () => {
  //                     navigation.goBack();
  //                     DeviceEventEmitter.emit(ContactListEvent, {
  //                       type: 'toast_' as ContactListEventType,
  //                       params: {
  //                         type: 'toast_custom' as ToastEvent,
  //                         content: groupInfo.toast[0]!,
  //                       },
  //                     });
  //                   },
  //                 },
  //               ],
  //             });
  //           } else if (eventType === 'alert_block_contact') {
  //             alert.openAlert({
  //               title: 'Unblock NickName?',
  //               buttons: [
  //                 {
  //                   text: 'Cancel',
  //                   onPress: () => {},
  //                 },
  //                 {
  //                   text: 'Confirm',
  //                   onPress: () => {
  //                     DeviceEventEmitter.emit(ContactListEvent, {
  //                       type: 'toast_' as ContactListEventType,
  //                       params: {
  //                         type: 'toast_Unblocked' as ToastEvent,
  //                         content: 'Unblocked',
  //                       },
  //                     });
  //                   },
  //                 },
  //               ],
  //             });
  //           } else if (eventType === 'alert_remove_group_member') {
  //             alert.openAlert({
  //               title: 'Remove NickName?',
  //               buttons: [
  //                 {
  //                   text: 'Cancel',
  //                   onPress: () => {},
  //                 },
  //                 {
  //                   text: 'Confirm',
  //                   onPress: () => {
  //                     DeviceEventEmitter.emit(ContactListEvent, {
  //                       type: 'toast_' as ContactListEventType,
  //                       params: {
  //                         type: 'toast_Removed' as ToastEvent,
  //                         content: 'Removed',
  //                       },
  //                     });
  //                   },
  //                 },
  //               ],
  //             });
  //           }
  //         }
  //         break;
  //       case 'sheet_':
  //         {
  //           const eventParams = event.params;
  //           const eventType = eventParams.type as SheetEvent;
  //           console.log('test:sheet:', eventParams, eventType);
  //           if (eventType === 'sheet_contact_list') {
  //             sheet.openSheet({
  //               sheetItems: [
  //                 {
  //                   icon: 'loading',
  //                   iconColor: theme.colors.primary,
  //                   title: '1',
  //                   titleColor: 'black',
  //                   onPress: () => {
  //                     console.log('test:onPress:data:', data);
  //                   },
  //                 },
  //                 {
  //                   icon: 'loading',
  //                   iconColor: theme.colors.primary,
  //                   title: '2',
  //                   titleColor: 'black',
  //                   onPress: () => {
  //                     console.log('test:onPress:data:', data);
  //                   },
  //                 },
  //               ],
  //             });
  //           } else if (eventType === 'sheet_group_member') {
  //             const { contactID } = eventParams.content;
  //             sheet.openSheet({
  //               sheetItems: [
  //                 {
  //                   title: contactID,
  //                   titleColor: 'black',
  //                   onPress: () => {
  //                     console.log('test:onPress:data:', data);
  //                   },
  //                   containerStyle: {
  //                     marginTop: sf(10),
  //                     flexDirection: 'row',
  //                     alignItems: 'center',
  //                     justifyContent: 'center',
  //                     height: undefined,
  //                     minWidth: undefined,
  //                     backgroundColor: undefined,
  //                     borderRadius: undefined,
  //                   },
  //                   titleStyle: {
  //                     fontWeight: '600',
  //                     fontSize: sf(14),
  //                     lineHeight: sf(16),
  //                     color: 'rgba(102, 102, 102, 1)',
  //                     marginHorizontal: undefined,
  //                   },
  //                 },
  //                 {
  //                   title: groupInfo.memberSheet.add,
  //                   titleColor: 'black',
  //                   onPress: () => {
  //                     console.log('test:onPress:data:', data);
  //                     DeviceEventEmitter.emit(ContactListEvent, {
  //                       type: 'toast_' as ContactListEventType,
  //                       params: {
  //                         type: 'toast_custom' as ToastEvent,
  //                         content: groupInfo.toast[4]!,
  //                       },
  //                     });
  //                   },
  //                 },
  //                 {
  //                   title: groupInfo.memberSheet.remove,
  //                   titleColor: 'rgba(255, 20, 204, 1)',
  //                   onPress: () => {
  //                     console.log('test:onPress:data:', data);
  //                     DeviceEventEmitter.emit(ContactListEvent, {
  //                       type: 'alert_' as ContactListEventType,
  //                       params: {
  //                         type: 'alert_remove_group_member' as AlertEvent,
  //                         content: {},
  //                       },
  //                     });
  //                   },
  //                 },
  //                 {
  //                   title: groupInfo.memberSheet.chat,
  //                   titleColor: 'black',
  //                   onPress: () => {
  //                     console.log('test:onPress:data:', data);
  //                   },
  //                 },
  //               ],
  //             });
  //           } else if (eventType === 'sheet_create_group') {
  //             console.log('test:sheet_create_group:');
  //             sheet.openSheet({
  //               sheetItems: [
  //                 {
  //                   key: '1',
  //                   Custom: CreateGroupSettings,
  //                   CustomProps: { test: 'hh' } as any,
  //                 },
  //               ],
  //             });
  //           }
  //         }
  //         break;
  //       case 'toast_':
  //         {
  //           const params = event.params;
  //           console.log('test:toast:', params, event.type);
  //           toast.showToast(params.content);
  //         }
  //         break;
  //       default:
  //         break;
  //     }
  //   });
  //   // const sub1 = DeviceEventEmitter.addListener(
  //   //   'toast_' as ToastEvent,
  //   //   (event) => {
  //   //     console.log('test:toast:', event);
  //   //     toast.showToast(event.content);
  //   //   }
  //   // );
  //   // const sub2 = DeviceEventEmitter.addListener(
  //   //   'sheet_' as SheetEvent,
  //   //   (event) => {
  //   //     console.log('test:sheet:', event);
  //   //     if (event.type === 'sheet_contact_list') {
  //   //       sheet.openSheet({
  //   //         sheetItems: [
  //   //           {
  //   //             icon: 'loading',
  //   //             iconColor: theme.colors.primary,
  //   //             title: '1',
  //   //             titleColor: 'black',
  //   //             onPress: () => {
  //   //               console.log('test:onPress:data:', data);
  //   //             },
  //   //           },
  //   //           {
  //   //             icon: 'loading',
  //   //             iconColor: theme.colors.primary,
  //   //             title: '2',
  //   //             titleColor: 'black',
  //   //             onPress: () => {
  //   //               console.log('test:onPress:data:', data);
  //   //             },
  //   //           },
  //   //         ],
  //   //       });
  //   //     } else if (event.type === 'sheet_group_member') {
  //   //       const { contactID } = event.content;
  //   //       sheet.openSheet({
  //   //         sheetItems: [
  //   //           {
  //   //             title: contactID,
  //   //             titleColor: 'black',
  //   //             onPress: () => {
  //   //               console.log('test:onPress:data:', data);
  //   //             },
  //   //             containerStyle: {
  //   //               marginTop: sf(10),
  //   //               flexDirection: 'row',
  //   //               alignItems: 'center',
  //   //               justifyContent: 'center',
  //   //               height: undefined,
  //   //               minWidth: undefined,
  //   //               backgroundColor: undefined,
  //   //               borderRadius: undefined,
  //   //             },
  //   //             titleStyle: {
  //   //               fontWeight: '600',
  //   //               fontSize: sf(14),
  //   //               lineHeight: sf(16),
  //   //               color: 'rgba(102, 102, 102, 1)',
  //   //               marginHorizontal: undefined,
  //   //             },
  //   //           },
  //   //           {
  //   //             title: groupInfo.memberSheet.add,
  //   //             titleColor: 'black',
  //   //             onPress: () => {
  //   //               console.log('test:onPress:data:', data);
  //   //               DeviceEventEmitter.emit(ContactListEvent, {
  //   //                 type: 'toast_' as ContactListEventType,
  //   //                 params: {
  //   //                   type: 'toast_custom' as ToastEvent,
  //   //                   content: groupInfo.toast[4]!,
  //   //                 },
  //   //               });
  //   //             },
  //   //           },
  //   //           {
  //   //             title: groupInfo.memberSheet.remove,
  //   //             titleColor: 'rgba(255, 20, 204, 1)',
  //   //             onPress: () => {
  //   //               console.log('test:onPress:data:', data);
  //   //               DeviceEventEmitter.emit(ContactListEvent, {
  //   //                 type: 'alert_' as ContactListEventType,
  //   //                 params: {
  //   //                   type: 'alert_remove_group_member' as AlertEvent,
  //   //                   content: {},
  //   //                 },
  //   //               });
  //   //             },
  //   //           },
  //   //           {
  //   //             title: groupInfo.memberSheet.chat,
  //   //             titleColor: 'black',
  //   //             onPress: () => {
  //   //               console.log('test:onPress:data:', data);
  //   //             },
  //   //           },
  //   //         ],
  //   //       });
  //   //     } else if (event.type === 'sheet_create_group') {
  //   //       sheet.openSheet({
  //   //         sheetItems: [
  //   //           {
  //   //             key: '1',
  //   //             Custom: CreateGroupSettings,
  //   //             CustomProps: { test: 'hh' } as any,
  //   //           },
  //   //         ],
  //   //       });
  //   //     }
  //   //   }
  //   // );
  //   // const sub3 = DeviceEventEmitter.addListener(
  //   //   'alert_' as AlertEvent,
  //   //   (event) => {
  //   //     console.log('test:alert:', event);
  //   //     if (event.type === 'alert_group_member_modify') {
  //   //       alert.openAlert({
  //   //         title: groupInfo.inviteAlert.title,
  //   //         message: groupInfo.inviteAlert.message,
  //   //         buttons: [
  //   //           {
  //   //             text: groupInfo.inviteAlert.cancelButton,
  //   //             onPress: () => {
  //   //               navigation.goBack();
  //   //             },
  //   //           },
  //   //           {
  //   //             text: groupInfo.inviteAlert.confirmButton,
  //   //             onPress: () => {
  //   //               navigation.goBack();
  //   //               DeviceEventEmitter.emit(ContactListEvent, {
  //   //                 type: 'toast_' as ContactListEventType,
  //   //                 params: {
  //   //                   type: 'toast_custom' as ToastEvent,
  //   //                   content: groupInfo.toast[0]!,
  //   //                 },
  //   //               });
  //   //             },
  //   //           },
  //   //         ],
  //   //       });
  //   //     } else if (event.type === 'alert_block_contact') {
  //   //       alert.openAlert({
  //   //         title: 'Unblock NickName?',
  //   //         buttons: [
  //   //           {
  //   //             text: 'Cancel',
  //   //             onPress: () => {},
  //   //           },
  //   //           {
  //   //             text: 'Confirm',
  //   //             onPress: () => {
  //   //               DeviceEventEmitter.emit(ContactListEvent, {
  //   //                 type: 'toast_' as ContactListEventType,
  //   //                 params: {
  //   //                   type: 'toast_Unblocked' as ToastEvent,
  //   //                   content: 'Unblocked',
  //   //                 },
  //   //               });
  //   //             },
  //   //           },
  //   //         ],
  //   //       });
  //   //     } else if (event.type === 'alert_remove_group_member') {
  //   //       alert.openAlert({
  //   //         title: 'Remove NickName?',
  //   //         buttons: [
  //   //           {
  //   //             text: 'Cancel',
  //   //             onPress: () => {},
  //   //           },
  //   //           {
  //   //             text: 'Confirm',
  //   //             onPress: () => {
  //   //               DeviceEventEmitter.emit(ContactListEvent, {
  //   //                 type: 'toast_' as ContactListEventType,
  //   //                 params: {
  //   //                   type: 'toast_Removed' as ToastEvent,
  //   //                   content: 'Removed',
  //   //                 },
  //   //               });
  //   //             },
  //   //           },
  //   //         ],
  //   //       });
  //   //     }
  //   //   }
  //   // );
  //   const sub4 = DeviceEventEmitter.addListener(
  //     CreateGroupSettingsEvent,
  //     (event) => {
  //       console.log('test:event:', event.type, event.params);
  //       if (event.type === 'create_new_group') {
  //         isInvite.current = event.params.isInvite;
  //         isPublic.current = event.params.isPublic;
  //         createGroup();
  //       }
  //     }
  //   );
  //   return () => {
  //     console.log('test:unload:222:');
  //     sub.remove();
  //     // sub1.remove();
  //     // sub2.remove();
  //     // sub3.remove();
  //     sub4.remove();
  //   };
  // }, [
  //   toast,
  //   sheet,
  //   theme.colors.primary,
  //   data,
  //   sf,
  //   groupInfo.memberSheet.add,
  //   groupInfo.memberSheet.remove,
  //   groupInfo.memberSheet.chat,
  //   groupInfo.toast,
  //   alert,
  //   groupInfo.inviteAlert.title,
  //   groupInfo.inviteAlert.message,
  //   groupInfo.inviteAlert.cancelButton,
  //   groupInfo.inviteAlert.confirmButton,
  //   navigation,
  //   createGroup,
  // ]);

  // const onItems = (items: React.RefObject<EqualHeightListItemData[]>) => {
  //   console.log('test:onItems:', items.current);
  //   // managedData = items as React.RefObject<ItemDataType[]>;
  //   // const r = managedData as React.MutableRefObject<ItemDataType[]>;
  //   // r.current = items.current as ItemDataType[];
  // };

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
        <InvisiblePlaceholder data={data} />
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
