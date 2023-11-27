import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  DataModel,
  DataModelType,
  GroupParticipantList,
  UIKitError,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupParticipantListScreen(props: Props) {
  const { navigation, route } = props;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <GroupParticipantList
        groupId={groupId}
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        onRequestData={(params: {
          ids: string[];
          result: (data?: DataModel[], error?: UIKitError) => void;
        }) => {
          console.log('test:zuoyu:onRequestData', params);
          params?.result([{ id: 'xx', name: 'test', avatar: '' }]);
        }}
        onRequestMultiData={(params: {
          ids: Map<DataModelType, string[]>;
          result: (
            data?: Map<DataModelType, DataModel[]>,
            error?: UIKitError
          ) => void;
        }) => {
          console.log('test:zuoyu:onRequestMultiData', params);
          const userIds = params.ids.get('user');
          const users = userIds?.map<DataModel>((id) => {
            return {
              id,
              name: id + 'name',
              // avatar: 'https://i.pravatar.cc/300',
              avatar:
                'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
            };
          });
          const groupIds = params.ids.get('group');
          const groups = groupIds?.map<DataModel>((id) => {
            return {
              id,
              name: id + 'name',
              avatar:
                'https://cdn0.iconfinder.com/data/icons/user-pictures/100/maturewoman-2-512.png',
            };
          });
          params?.result(
            new Map([
              ['user', users ?? []],
              ['group', groups ?? []],
            ])
          );
        }}
        onSearch={() => {
          navigation.push('GroupParticipantList', {});
        }}
        onClicked={() => {}}
      />
    </SafeAreaView>
  );
}
