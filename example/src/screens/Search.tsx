import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  DeviceEventEmitter,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Blank,
  Button,
  ContactChatSdkEvent,
  ContactChatSdkEventType,
  createStyleSheet,
  DefaultAvatar,
  DefaultListItemSeparator,
  EqualHeightList,
  EqualHeightListItemComponent,
  EqualHeightListItemData,
  EqualHeightListRef,
  getScaleFactor,
  GroupChatSdkEvent,
  GroupChatSdkEventType,
  LocalIcon,
  SearchBar,
  useToastContext,
} from 'react-native-chat-uikit';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppI18nContext } from '../contexts/AppI18nContext';
import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import { type sendEventProps, sendEvent } from '../events/sendEvent';
import { useStyleSheet } from '../hooks/useStyleSheet';
import type { RootScreenParamsList } from '../routes';
import type { SearchActionType, Undefinable } from '../types';

type Props = NativeStackScreenProps<RootScreenParamsList, 'Search'>;

type AddContactStateType = 'noAdded' | 'hadAdded' | 'adding';
type SearchPublicGroupStateType = 'noJoined' | 'hadJoined' | 'applying';
type ItemActionAddContactDataType = {
  addContact: {
    state: AddContactStateType;
    onClicked?: () => void;
  };
};
type ItemActionPublicGroupDataType = {
  searchPublicGroup: {
    state: SearchPublicGroupStateType;
    onClicked?: () => void;
  };
};
type ItemActionSearchPublicGroupDataType = {
  searchPublicGroupInfo: {
    state: SearchPublicGroupStateType;
    onClicked?: () => void;
  };
};
type ItemActionDataType =
  | ItemActionAddContactDataType
  | ItemActionPublicGroupDataType
  | ItemActionSearchPublicGroupDataType;
type ItemDataType = EqualHeightListItemData & {
  itemId: string;
  itemName: string;
  actionType?: Undefinable<SearchActionType>;
  action?: Undefinable<ItemActionDataType>;
};

const sendSearchEvent = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp' | 'eventBizType'>
) => {
  sendEvent({
    ...params,
    senderId: 'Search',
    eventBizType: 'search',
  } as sendEventProps);
};

const Item: EqualHeightListItemComponent = (props) => {
  const sf = getScaleFactor();
  const item = props.data as ItemDataType;
  const toast = useToastContext();
  const { searchServer } = useAppI18nContext();

  const Right = (type: SearchActionType | undefined) => {
    switch (type) {
      case 'add_contact': {
        const action = item.action as ItemActionAddContactDataType;
        return (
          <View style={styles.rightItem}>
            <Button
              disabled={action.addContact.state !== 'noAdded'}
              onPress={() => {
                action.addContact.onClicked?.();
                toast.showToast(searchServer.toast.contact[0]!);
              }}
              color={{ disabled: { content: 'black', background: '#F2F2F2' } }}
              font={styles.rightItemFont}
              style={styles.rightItemStyle}
            >
              {searchServer.contact.item.button(action.addContact.state)}
            </Button>
          </View>
        );
      }
      case 'join_public_group': {
        const action = item.action as ItemActionPublicGroupDataType;
        return (
          <View style={styles.rightItem}>
            <Button
              disabled={action.searchPublicGroup.state !== 'noJoined'}
              onPress={() => {
                action.searchPublicGroup.onClicked?.();
                toast.showToast(searchServer.toast.group[0]!);
              }}
              color={{ disabled: { content: 'black', background: '#F2F2F2' } }}
              font={styles.rightItemFont}
              style={styles.rightItemStyle}
            >
              {searchServer.group.item.button(action.searchPublicGroup.state)}
            </Button>
          </View>
        );
      }
      case 'search_public_group_info': {
        const action = item.action as ItemActionSearchPublicGroupDataType;
        return (
          <View style={styles.rightItem}>
            <Button
              disabled={action.searchPublicGroupInfo.state !== 'noJoined'}
              onPress={() => {
                action.searchPublicGroupInfo.onClicked?.();
                toast.showToast(searchServer.toast.group[0]!);
              }}
              color={{ disabled: { content: 'black', background: '#F2F2F2' } }}
              font={styles.rightItemFont}
              style={styles.rightItemStyle}
            >
              {searchServer.group.item.button(
                action.searchPublicGroupInfo.state
              )}
            </Button>
          </View>
        );
      }

      default:
        return null;
    }
  };

  return (
    <View style={styles.item}>
      <DefaultAvatar size={sf(50)} radius={sf(25)} />
      <View style={styles.itemText}>
        {item.itemName && item.itemName.length > 0 ? (
          <>
            <Text>{item.itemId}</Text>
            <Text>{item.itemName}</Text>
          </>
        ) : (
          <Text>{item.itemId}</Text>
        )}
      </View>
      {Right(item.actionType)}
    </View>
  );
};
type RawDataStateType = 'initialized' | 'requesting' | 'resulting';
export default function SearchScreen({
  route,
  navigation,
}: Props): JSX.Element {
  const rp = route.params as any;
  const params = rp?.params as any;
  const type = params?.type as Undefinable<SearchActionType>;
  console.log('test:SearchScreen:', params, type);
  const sf = getScaleFactor();

  const listRef = React.useRef<EqualHeightListRef>(null);
  const enableRefresh = false;
  const enableAlphabet = false;
  const enableHeader = false;
  const [isEmpty, setIsEmpty] = React.useState(true);
  const enableCancel = true;
  const enableClear = true;
  const bounces = false;
  const rawData = React.useMemo(
    () => [] as { id: string; name: string; state: RawDataStateType }[],
    []
  );
  const data: ItemDataType[] = React.useMemo(() => [], []);
  let inputRef = React.useRef<RNTextInput>(null);
  const { client } = useAppChatSdkContext();
  // const [selectedCount] = React.useState(10);

  const getData = React.useCallback(
    (key: string) => {
      for (const item of data) {
        if (item.key === key) {
          return item;
        }
      }
      return undefined;
    },
    [data]
  );

  const manualRefresh = React.useCallback(
    (params: {
      type: 'init' | 'add' | 'search' | 'del-one' | 'update-one' | 'clear';
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
      } else if (params.type === 'clear') {
        data.length = 0;
        listRef.current?.manualRefresh([
          {
            type: 'clear',
          },
        ]);
      } else {
        return;
      }
      setIsEmpty(data.length === 0);
    },
    [data]
  );

  const sendContactRequest = React.useCallback(
    (id: string) => {
      console.log('test:id:', id);
      if (type !== ('add_contact' as SearchActionType)) {
        return;
      }
      client.contactManager
        .addContact(id, 'Request to be a friend.')
        .then()
        .catch((error) => {
          console.warn('test:error:', error);
          // TODO: Probably already friends.
          sendSearchEvent({
            eventType: 'ToastEvent',
            action: 'toast_',
            params: 'The other person rejected the friend request.',
          });
        });
    },
    [client.contactManager, type]
  );

  const sendJoinGroupRequest = React.useCallback(
    (id: string) => {
      if (
        type !== ('join_public_group' as SearchActionType) &&
        type !== ('search_public_group_info' as SearchActionType)
      ) {
        return;
      }
      client.groupManager
        .joinPublicGroup(id)
        .then()
        .catch((error) => {
          console.warn('test:error:', error);
          // TODO: Probably already friends.
          sendSearchEvent({
            eventType: 'ToastEvent',
            action: 'toast_',
            params: 'The group administrator refused to join the group.',
          });
        });
    },
    [client.groupManager, type]
  );

  const standardizedData = React.useCallback(
    (item: Omit<ItemDataType, 'onLongPress' | 'onPress'>): ItemDataType => {
      const createAction = (
        item: Omit<ItemDataType, 'onLongPress' | 'onPress'>
      ) => {
        switch (item.actionType) {
          case 'add_contact': {
            const action = item.action as ItemActionAddContactDataType;
            return {
              addContact: {
                state: action.addContact.state,
                onClicked: () => {
                  console.log('test:onAction:add_contact:');
                  if (action.addContact.state === 'noAdded') {
                    action.addContact.state = 'adding';
                    manualRefresh({
                      type: 'update-one',
                      items: [standardizedData(item)],
                    });
                    sendContactRequest(item.itemId);
                  }
                },
              },
            } as ItemActionAddContactDataType;
          }

          case 'join_public_group': {
            const action = item.action as ItemActionPublicGroupDataType;
            return {
              searchPublicGroup: {
                state: action.searchPublicGroup.state,
                onClicked: () => {
                  console.log('test:onAction:search_public_group:');
                  if (action.searchPublicGroup.state === 'noJoined') {
                    action.searchPublicGroup.state = 'applying';
                    manualRefresh({
                      type: 'update-one',
                      items: [standardizedData(item)],
                    });

                    // TODO: send join group request
                    sendJoinGroupRequest(item.itemId);
                  }
                },
              },
            } as ItemActionPublicGroupDataType;
          }

          case 'search_public_group_info': {
            const action = item.action as ItemActionSearchPublicGroupDataType;
            return {
              searchPublicGroupInfo: {
                state: action.searchPublicGroupInfo.state,
                onClicked: () => {
                  console.log('test:onAction:search_group_info:');
                  if (action.searchPublicGroupInfo.state === 'noJoined') {
                    action.searchPublicGroupInfo.state = 'applying';
                    manualRefresh({
                      type: 'update-one',
                      items: [standardizedData(item)],
                    });

                    // TODO: send join group request
                    sendJoinGroupRequest(item.itemId);
                  }
                },
              },
            } as ItemActionSearchPublicGroupDataType;
          }

          default:
            return undefined;
        }
      };

      const r = {
        ...item,
        action: createAction(item),
      } as ItemDataType;
      return r;
    },
    [manualRefresh, sendContactRequest, sendJoinGroupRequest]
  );

  const loadSearchResult = React.useCallback(
    (params: {
      type: Undefinable<SearchActionType>;
      id: string;
      name: string;
    }) => {
      const r = [] as ItemDataType[];
      switch (params.type) {
        case 'add_contact':
          r.push(
            standardizedData({
              key: params.id,
              itemId: params.id,
              itemName: params.name,
              actionType: params.type,
              action: {
                addContact: {
                  state: 'noAdded' as AddContactStateType,
                },
              } as ItemActionAddContactDataType,
            } as ItemDataType)
          );
          manualRefresh({ type: 'init', items: r });
          break;

        case 'join_public_group':
          for (const item of rawData) {
            if (item.id.includes(params.id)) {
              r.push(
                standardizedData({
                  key: item.id,
                  itemId: item.id,
                  itemName: item.name,
                  actionType: params.type,
                  action: {
                    searchPublicGroup: {
                      state:
                        item.state === 'initialized'
                          ? 'noJoined'
                          : item.state === 'requesting'
                          ? 'applying'
                          : 'hadJoined',
                    },
                  } as ItemActionPublicGroupDataType,
                } as ItemDataType)
              );
            }
          }
          manualRefresh({ type: 'init', items: r });
          break;

        case 'search_public_group_info':
          r.push(
            standardizedData({
              key: params.id,
              itemId: params.id,
              itemName: params.name,
              actionType: params.type,
              action: {
                searchPublicGroupInfo: {
                  state: 'noJoined',
                },
              } as ItemActionSearchPublicGroupDataType,
            } as ItemDataType)
          );
          manualRefresh({ type: 'init', items: r });
          break;

        default:
          break;
      }
    },
    [manualRefresh, rawData, standardizedData]
  );

  const addListeners = React.useCallback(
    (type: Undefinable<SearchActionType>) => {
      console.log('test:', type);
      const sub = DeviceEventEmitter.addListener(
        ContactChatSdkEvent,
        (event) => {
          console.log('test:ContactChatSdkEvent:', event);
          const eventType = event.type as ContactChatSdkEventType;
          const eventParams = event.params as { id: string };
          switch (eventType) {
            case 'onFriendRequestAccepted':
              {
                const item = getData(eventParams.id);
                if (item) {
                  manualRefresh({
                    type: 'update-one',
                    items: [
                      {
                        ...item,
                        action: {
                          addContact: {
                            state: 'hadAdded',
                          },
                        } as ItemActionAddContactDataType,
                      } as ItemDataType,
                    ],
                  });
                  sendSearchEvent({
                    eventType: 'ToastEvent',
                    action: 'toast_',
                    params:
                      'The other party has already applied through friends.',
                  });
                }
              }
              break;
            case 'onFriendRequestDeclined':
              {
                const item = getData(eventParams.id);
                if (item) {
                  manualRefresh({
                    type: 'update-one',
                    items: [
                      standardizedData({
                        ...item,
                        action: {
                          addContact: {
                            state: 'noAdded',
                          },
                        } as ItemActionAddContactDataType,
                      } as ItemDataType),
                    ],
                  });
                  sendSearchEvent({
                    eventType: 'ToastEvent',
                    action: 'toast_',
                    params: 'The other person rejected the friend request.',
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
        GroupChatSdkEvent,
        (event) => {
          console.log('test:GroupChatSdkEvent:', event);
          const eventType = event.type as GroupChatSdkEventType;
          const eventParams = event.params;
          switch (eventType) {
            case 'onRequestToJoinAccepted':
              {
                const item = getData(eventParams.groupId);
                if (item) {
                  manualRefresh({
                    type: 'update-one',
                    items: [
                      {
                        ...item,
                        action: {
                          searchPublicGroupInfo: {
                            state: 'hadJoined',
                          },
                        } as ItemActionSearchPublicGroupDataType,
                      } as ItemDataType,
                    ],
                  });
                  sendSearchEvent({
                    eventType: 'ToastEvent',
                    action: 'toast_',
                    params:
                      'The group administrator has applied to join the group.',
                  });
                }
              }
              break;
            case 'onRequestToJoinDeclined':
              {
                const item = getData(eventParams.groupId);
                if (item) {
                  manualRefresh({
                    type: 'update-one',
                    items: [
                      {
                        ...item,
                        action: {
                          searchPublicGroupInfo: {
                            state: 'noJoined',
                          },
                        } as ItemActionSearchPublicGroupDataType,
                      } as ItemDataType,
                    ],
                  });
                  sendSearchEvent({
                    eventType: 'ToastEvent',
                    action: 'toast_',
                    params:
                      'The group administrator refused to join the group.',
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
        sub.remove();
        sub2.remove();
      };
    },
    [getData, manualRefresh, standardizedData]
  );

  const initList = React.useCallback(
    (type: Undefinable<SearchActionType>) => {
      console.log('test:initList:SearchScreen:', type);
      switch (type) {
        case 'add_contact':
          break;
        case 'join_public_group':
          /// !!! This may not be all public groups.
          client.groupManager
            .fetchPublicGroupsFromServer(200)
            .then((result) => {
              console.log('test:result:fetchPublicGroupsFromServer:', result);
              if (result.list) {
                for (const item of result.list) {
                  rawData.push({
                    id: item.groupId,
                    name: item.groupName,
                    state: 'initialized',
                  });
                }
                client.groupManager
                  .fetchJoinedGroupsFromServer(20, 0)
                  .then((result) => {
                    console.log(
                      'test:result:fetchJoinedGroupsFromServer:',
                      result
                    );
                    for (const localItem of rawData) {
                      for (const item of result) {
                        if (item.groupId === localItem.id) {
                          localItem.state = 'resulting';
                        }
                      }
                    }
                  })
                  .catch((error) => {
                    console.warn('test:error:', error);
                  });
              }
            })
            .catch((error) => {
              console.warn('test:error:', error);
            });
          break;
        case 'search_public_group_info':
          break;
        default:
          break;
      }
    },
    [client.groupManager, rawData]
  );

  React.useEffect(() => {
    console.log('test:useEffect:', addListeners, initList, type);
    const load = () => {
      console.log('test:load:', SearchScreen.name);
      const unsubscribe = addListeners(type);
      initList(type);
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', SearchScreen.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners, initList, type]);

  const fetchInfo = async (params: {
    type: Undefinable<SearchActionType>;
    keyword: string;
  }) => {
    try {
      if (params.type === 'search_public_group_info') {
        const info = await client.groupManager.fetchGroupInfoFromServer(
          params.keyword
        );
        console.log('test:1231231:', info);
        if (info) {
          loadSearchResult({ type, id: info.groupId, name: info.groupName });
        } else {
          sendSearchEvent({
            eventType: 'ToastEvent',
            action: 'toast_',
            params: 'The group administrator refused to join the group.',
          });
        }
      } else if (params.type === 'add_contact') {
        const kv = await client.userManager.fetchUserInfoById([params.keyword]);
        if (kv.has(params.keyword)) {
          const info = kv.get(params.keyword);
          if (info) {
            loadSearchResult({
              type,
              id: info.userId,
              name: info.nickName ?? '',
            });
          } else {
            sendSearchEvent({
              eventType: 'ToastEvent',
              action: 'toast_',
              params: 'The other person rejected the friend request.',
            });
          }
        }
      }
    } catch (error) {
      console.warn('test:error:', error);
    }
  };

  const execSearch = async (params: {
    type: Undefinable<SearchActionType>;
    keyword: string;
  }) => {
    fetchInfo(params);
  };

  const execClear = () => {
    inputRef.current?.blur();
    inputRef.current?.clear();
    manualRefresh({ type: 'clear', items: [] });
  };

  const onReturn = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView
      mode="padding"
      style={useStyleSheet().safe}
      edges={['top', 'right', 'left']}
    >
      <View style={[styles.container, { flexDirection: 'row' }]}>
        <TouchableOpacity
          style={{ justifyContent: 'center' }}
          onPress={onReturn}
        >
          <LocalIcon name="gray_goBack" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <SearchBar
            ref={inputRef}
            enableCancel={enableCancel}
            enableClear={enableClear}
            inputContainerStyle={styles.inputContainer}
            cancel={{
              buttonName: 'cancel',
              onCancel: () => {
                navigation.goBack();
              },
            }}
            onChangeText={() => {}}
            onClear={execClear}
            returnKeyType="search"
            onSubmitEditing={(event) => {
              const c = event.nativeEvent.text;
              // Keyboard.dismiss();
              event.preventDefault();
              execSearch({ type, keyword: c });
            }}
          />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <EqualHeightList
          bounces={bounces}
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
              width: sf(15),
              borderRadius: 8,
            },
          }}
          ItemSeparatorComponent={DefaultListItemSeparator}
        />
        {isEmpty === true ? <Blank style={styles.blank} /> : null}
      </View>
    </SafeAreaView>
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
  rightItemFont: { fontSize: 14, fontWeight: '400', lineHeight: 18 },
  rightItemStyle: { height: 30, borderRadius: 24, paddingHorizontal: 15 },
  container: { paddingTop: 10, marginHorizontal: 20 },
  inputContainer: {
    backgroundColor: 'rgba(242, 242, 242, 1)',
    borderRadius: 24,
  },
  blank: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
