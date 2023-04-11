import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
import {
  CallEndReason,
  CallError,
  CallListener,
  CallType,
  useCallkitSdkContext,
} from 'react-native-chat-callkit';
import { Button, RadioButton } from 'react-native-chat-uikit';
import { FlatList } from 'react-native-gesture-handler';

import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import { sendEvent, sendEventProps } from '../events/sendEvent';
import type { RootParamsList } from '../routes';

let gid: string = '';
let gps: string = '';
let gt = 'agora' as 'agora' | 'easemob';
let agoraAppId = '';

try {
  const env = require('../env');
  gid = env.id ?? '';
  gps = env.ps ?? '';
  gt = env.accountType ?? 'agora';
  agoraAppId = env.agoraAppId;
} catch (e) {
  console.warn('test:', e);
}

const sendHomeEvent = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp' | 'eventBizType'>
) => {
  sendEvent({
    ...params,
    senderId: 'Home',
    eventBizType: 'others',
  } as sendEventProps);
};

type DataType = {
  userId: string;
  userName?: string;
  isSelected?: boolean;
  onChecked?: ((checked: boolean) => boolean) | undefined;
};
const FlatListRenderItem = (
  info: ListRenderItemInfo<DataType>
): React.ReactElement | null => {
  const { item } = info;
  return (
    <View
      style={{
        height: 40,
        backgroundColor: '#f5f5f5',
        marginHorizontal: 20,
        justifyContent: 'center',
        marginVertical: 1,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 18 }}>{item.userId}</Text>
        <RadioButton onChecked={item.onChecked} />
      </View>
    </View>
  );
};
type ContactListRef = {
  showCall: (params: {
    callType: CallType;
    isInviter: boolean;
    inviterId?: string;
  }) => void;
  hideCall: () => void;
};
type ContactListProps = {
  propsRef?: React.RefObject<ContactListRef>;
};
const ContactList = React.memo((props: ContactListProps) => {
  console.log('test:ContactList:', props);
  const { currentId } = useAppChatSdkContext();
  const { propsRef } = props;
  const { client } = useAppChatSdkContext();
  const data = React.useMemo(() => [] as DataType[], []);
  const [_data, setData] = React.useState(data);

  if (propsRef?.current) {
    propsRef.current.showCall = (params: {
      callType: CallType;
      isInviter: boolean;
      inviterId?: string;
    }) => {
      console.log('test:showCall:', params);
      const l = [] as string[];
      for (const i of _data) {
        if (i.isSelected === true) {
          l.push(i.userId);
        }
      }
      sendHomeEvent({
        eventType: 'VoiceStateEvent',
        action:
          params.callType === CallType.Audio1v1 ||
          params.callType === CallType.Video1v1
            ? 'show_single_call'
            : 'show_multi_call',
        params: {
          appKey: client.options?.appKey ?? '',
          agoraAppId: agoraAppId,
          isInviter: params.isInviter,
          inviterId: params.isInviter === true ? currentId : params.inviterId!,
          currentId: currentId,
          inviteeIds: params.isInviter === true ? l : [currentId],
          callType: params.callType,
        },
      });
    };
    propsRef.current.hideCall = () => {
      sendHomeEvent({
        eventType: 'VoiceStateEvent',
        action: 'hide_call',
        params: {},
      });
    };
  }

  const init = React.useCallback(() => {
    console.log('test:ContactList:init:');
    client.contactManager
      .getAllContactsFromServer()
      .then((result) => {
        console.log('test:ContactList:init:result:', result);
        data.length = 0;
        for (const i of result) {
          const user = {
            userId: i,
            userName: i,
            onChecked: (checked: boolean) => {
              user.isSelected = checked;
              return true;
            },
          } as DataType;
          data.push(user);
        }
        setData([...data]);
      })
      .catch((error) => {
        console.log('test:', error);
      });
  }, [client.contactManager, data]);
  React.useEffect(() => {
    init();
    // initApi();
  }, [init]);
  return (
    <FlatList data={_data} extraData={_data} renderItem={FlatListRenderItem} />
  );
});

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootParamsList, 'Home'>): JSX.Element {
  console.log('test:HomeScreen:');
  const contactListRef = React.useRef<ContactListRef>({} as any);
  const { currentId, logout: logoutAction } = useAppChatSdkContext();
  const { call } = useCallkitSdkContext();

  const addListener = React.useCallback(() => {
    const listener = {
      onCallEnded: (params: {
        channelId: string;
        callType: CallType;
        endReason: CallEndReason;
        elapsed: number;
      }) => {
        console.log('onCallEnded:', params);
      },
      onCallReceived: (params: {
        channelId: string;
        inviterId: string;
        callType: CallType;
        extension?: any;
      }) => {
        console.log('onCallReceived:', params);
        contactListRef.current.showCall({
          callType: params.callType,
          isInviter: false,
          inviterId: params.inviterId,
        });
      },
      onCallOccurError: (params: { channelId: string; error: CallError }) => {
        console.warn('onCallOccurError:', params);
      },
    } as CallListener;
    call.addListener(listener);
    return () => {
      call.removeListener(listener);
    };
  }, [call]);

  React.useEffect(() => {
    const sub = addListener();
    return () => {
      sub();
    };
  }, [addListener]);

  const info = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ marginHorizontal: 20 }}>
          <Text>{currentId}</Text>
        </View>
        <Button
          style={{ height: 40, width: 100 }}
          onPress={() => {
            logoutAction({
              onResult: ({ result, error }) => {
                if (error) {
                  console.warn('test:error:', error, result);
                  throw new Error('Failed to log out. Procedure');
                }
                navigation.navigate('Login', {
                  params: { id: gid, pass: gps, accountType: gt },
                });
              },
            });
          }}
        >
          logout
        </Button>
      </View>
    );
  };

  const tools = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          marginVertical: 20,
          flexWrap: 'wrap',
        }}
      >
        <Button
          style={style.button}
          onPress={() => {
            contactListRef.current.showCall({
              callType: CallType.Video1v1,
              isInviter: true,
            });
          }}
        >
          singleV
        </Button>
        <Button
          style={style.button}
          onPress={() => {
            contactListRef.current.showCall({
              callType: CallType.Audio1v1,
              isInviter: true,
            });
          }}
        >
          singleA
        </Button>
        <Button
          style={style.button}
          onPress={() => {
            contactListRef.current.showCall({
              callType: CallType.VideoMulti,
              isInviter: true,
            });
          }}
        >
          multiV
        </Button>
        <Button
          style={style.button}
          onPress={() => {
            contactListRef.current.showCall({
              callType: CallType.AudioMulti,
              isInviter: true,
            });
          }}
        >
          multiA
        </Button>
        <Button
          style={style.button}
          onPress={() => {
            navigation.push('Test', { params: {} });
          }}
        >
          navi
        </Button>
        <Button
          style={style.button}
          onPress={() => {
            contactListRef.current.hideCall();
          }}
        >
          close
        </Button>
      </View>
    );
  };
  const list = () => {
    return (
      <View
        style={{
          flex: 1,
          marginBottom: 100,
          // backgroundColor: 'red',
        }}
      >
        <ContactList propsRef={contactListRef} />
      </View>
    );
  };
  return (
    <View style={{ top: 44, flex: 1 }}>
      {info()}
      {tools()}
      {list()}
    </View>
  );
}

const style = StyleSheet.create({
  button: {
    height: 40,
    width: 100,
    marginHorizontal: 10,
    marginBottom: 10,
  },
});
