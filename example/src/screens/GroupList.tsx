import type { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import * as React from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import type { ChatGroupEventListener } from 'react-native-chat-sdk';
import {
  autoFocus,
  Blank,
  createStyleSheet,
  DefaultAvatar,
  DefaultListItemSeparator,
  DefaultListSearchHeader,
  EqualHeightList,
  EqualHeightListItemComponent,
  EqualHeightListItemData,
  EqualHeightListRef,
  getScaleFactor,
  queueTask,
  throttle,
  useChatSdkContext,
  useDeferredValue,
} from 'react-native-chat-uikit';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GroupInfoEvent, GroupInfoEventType } from '../events';
import { useStyleSheet } from '../hooks/useStyleSheet';
import type { RootParamsList } from '../routes';

export const useDeferredQueueTask = (f: Function, ...args: any[]) => {
  try {
    const deferred = useDeferredValue(() => f(args));
    queueTask(deferred);
  } catch (error) {
    console.warn('test:useDeferredQueueTask:', error);
  }
};

type Props = MaterialTopTabScreenProps<RootParamsList>;

type ItemDataType = EqualHeightListItemData & {
  groupID: string;
  groupName: string;
};

const Item: EqualHeightListItemComponent = (props) => {
  const sf = getScaleFactor();
  const item = props.data as ItemDataType;
  return (
    <View style={styles.item}>
      <DefaultAvatar size={sf(50)} radius={sf(25)} />
      <View style={styles.itemText}>
        <Text style={{ lineHeight: 20, fontSize: 16, fontWeight: '600' }}>
          {item.groupName.length !== 0 ? item.groupName : item.groupID}
        </Text>
        {/* <Text>{item.groupID}</Text> */}
      </View>
    </View>
  );
};

export default function GroupListScreen({ navigation }: Props): JSX.Element {
  const sf = getScaleFactor();

  const listRef = React.useRef<EqualHeightListRef>(null);
  const enableRefresh = true;
  const enableAlphabet = false;
  const enableHeader = true;
  // const autoFocus = false;
  const data: ItemDataType[] = React.useMemo(() => [], []); // for search
  const [isEmpty, setIsEmpty] = React.useState(true);

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
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          for (const item of params.items) {
            if (element && item.key === element.key) {
              element.groupName = item.groupName;
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
      setIsEmpty(data.length === 0);
    },
    [data]
  );

  const standardizedData = React.useCallback(
    (item: Omit<ItemDataType, 'onLongPress' | 'onPress'>): ItemDataType => {
      return {
        ...item,
        onPress: (data) => {
          console.log('test:onPress:data:', data);
          const info = data as ItemDataType;
          navigation.navigate('GroupInfo', {
            params: { groupId: info.groupID },
          });
          // navigation.navigate({ name: 'GroupInfo', params: {} });
        },
      };
    },
    [navigation]
  );

  const initData = React.useCallback(
    (list: ItemDataType[]) => {
      manualRefresh({ type: 'init', items: list });
    },
    [manualRefresh]
  );

  const { client } = useChatSdkContext();
  const initList = React.useCallback(() => {
    client.groupManager
      .getJoinedGroups()
      .then((result) => {
        console.log('test:GroupListScreen:success:', result);
        initData(
          result.map((item) => {
            return standardizedData({
              key: item.groupId,
              groupID: item.groupId,
              groupName: item.groupName,
            });
          })
        ); // for test
      })
      .catch((error) => {
        console.warn('test:error:', error);
      });
  }, [client.groupManager, initData, standardizedData]);

  const requestGroupInfo = React.useCallback(
    (groupId: string) => {
      client.groupManager
        .getGroupWithId(groupId)
        .then((result) => {
          console.log('test:requestGroupInfo:', result);
          if (result) {
            manualRefresh({
              type: 'update-one',
              items: [
                {
                  key: result.groupId,
                  groupID: result.groupId,
                  groupName: result.groupName ?? '',
                },
              ],
            });
          }
        })
        .catch((error) => {
          console.warn('test:requestGroupInfo:', error);
        });
    },
    [client.groupManager, manualRefresh]
  );

  const duplicateCheck = React.useCallback(
    (groupId: string) => {
      for (const item of data) {
        if (item.groupID === groupId) {
          return true;
        }
      }
      return false;
    },
    [data]
  );

  const getData = React.useCallback(
    (groupId: string) => {
      for (const item of data) {
        if (item.groupID === groupId) {
          return item;
        }
      }
      return undefined;
    },
    [data]
  );

  const addListeners = React.useCallback(() => {
    const groupEventListener: ChatGroupEventListener = {
      onRequestToJoinAccepted: (params: {
        groupId: string;
        accepter: string;
        groupName?: string;
      }): void => {
        if (duplicateCheck(params.groupId)) {
          return;
        }
        manualRefresh({
          type: 'add',
          items: [
            {
              key: params.groupId,
              groupID: params.groupId,
              groupName: params.groupName ?? '',
            },
          ],
        });
        if (params.groupName === undefined) {
          requestGroupInfo(params.groupId);
        }
      },
      onUserRemoved: (params: {
        groupId: string;
        groupName?: string;
      }): void => {
        if (duplicateCheck(params.groupId)) {
          return;
        }
        manualRefresh({
          type: 'del-one',
          items: [
            {
              key: params.groupId,
              groupID: params.groupId,
              groupName: params.groupName ?? '',
            },
          ],
        });
        if (params.groupName === undefined) {
          requestGroupInfo(params.groupId);
        }
      },
      onGroupDestroyed: (params: {
        groupId: string;
        groupName?: string;
      }): void => {
        if (duplicateCheck(params.groupId)) {
          return;
        }
        manualRefresh({
          type: 'del-one',
          items: [
            {
              key: params.groupId,
              groupID: params.groupId,
              groupName: params.groupName ?? '',
            },
          ],
        });
        if (params.groupName === undefined) {
          requestGroupInfo(params.groupId);
        }
      },
      onAutoAcceptInvitation: (params: {
        groupId: string;
        inviter: string;
        inviteMessage?: string;
      }): void => {
        if (duplicateCheck(params.groupId)) {
          return;
        }
        manualRefresh({
          type: 'add',
          items: [
            {
              key: params.groupId,
              groupID: params.groupId,
              groupName: '',
            },
          ],
        });
        requestGroupInfo(params.groupId);
      },
    };
    client.groupManager.addGroupListener(groupEventListener);
    const sub = DeviceEventEmitter.addListener(GroupInfoEvent, (event) => {
      console.log('test:GroupInfoEvent:', event);
      const eventType = event.type as GroupInfoEventType;
      switch (eventType) {
        case 'modify_group_name':
          {
            const eventParams = event.params as {
              groupId: string;
              groupName: string;
            };
            const d = getData(eventParams.groupId);
            if (d) {
              manualRefresh({
                type: 'update-one',
                items: [
                  standardizedData({ ...d, groupName: eventParams.groupName }),
                ],
              });
            }
          }
          break;

        default:
          break;
      }
    });
    return () => {
      client.groupManager.removeGroupListener(groupEventListener);
      sub.remove();
    };
  }, [
    client.groupManager,
    duplicateCheck,
    getData,
    manualRefresh,
    requestGroupInfo,
    standardizedData,
  ]);

  React.useEffect(() => {
    const load = () => {
      console.log('test:load:', GroupListScreen.name);
      const unsubscribe = addListeners();
      initList();
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', GroupListScreen.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners, initList]);

  React.useEffect(() => {
    const sub1 = DeviceEventEmitter.addListener(GroupInfoEvent, (event) => {
      console.log('test:GroupInfoEvent:', event);
      const eventType = event.type as GroupInfoEventType;
      if (eventType === 'destroy_group') {
        manualRefresh({
          type: 'del-one',
          items: [
            standardizedData({
              groupID: event.params.groupId,
              key: event.params.groupId,
              groupName: '',
            }),
          ],
        });
      }
    });
    return () => {
      sub1.remove();
    };
  }, [manualRefresh, standardizedData]);

  const deferredSearch = throttle((text: string) => {
    const r: ItemDataType[] = [];
    for (const item of data) {
      if (item.groupName?.includes(text)) {
        r.push(item);
      }
    }
    manualRefresh({
      type: 'search',
      items: r,
    });
  });

  return (
    <SafeAreaView
      mode="padding"
      style={useStyleSheet().safe}
      edges={['right', 'left']}
    >
      <DefaultListSearchHeader
        autoFocus={autoFocus()}
        onChangeText={(text) => {
          console.log('test:DefaultListSearchHeader:onChangeText:', Text);
          deferredSearch(text);
        }}
      />
      <EqualHeightList
        parentName="GroupList"
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
        onRefresh={(type) => {
          if (type === 'started') {
            initList();
          }
        }}
      />
      {isEmpty === true ? <Blank style={styles.blank} /> : null}
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
  blank: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
