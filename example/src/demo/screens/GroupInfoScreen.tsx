import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  GroupInfo,
  GroupInfoRef,
  useI18nContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupInfoScreen(props: Props) {
  const { navigation, route } = props;
  const { tr } = useI18nContext();
  const editTypeRef = React.useRef<string>();
  const groupInfoRef = React.useRef<GroupInfoRef>({} as any);
  const groupId = ((route.params as any)?.params as any)?.groupId;
  const ownerId = ((route.params as any)?.params as any)?.ownerId;
  console.log('test:zuoyu:GroupInfoScreen', route.params);
  // const goBack2 = React.useCallback(
  //   (data: any) => {
  //     console.log('test:zuoyu:GroupInfoScreen:goBack', data);
  //     groupInfoRef.current?.setGroupName?.(groupId, data);
  //   },
  //   [groupId]
  // );
  const goBack = (data: any) => {
    console.log('test:zuoyu:GroupInfoScreen:goBack', data);
    if (editTypeRef.current === 'groupName') {
      groupInfoRef.current?.setGroupName?.(groupId, data);
    } else if (editTypeRef.current === 'groupDescription') {
      groupInfoRef.current?.setGroupDescription?.(groupId, data);
    } else if (editTypeRef.current === 'groupMyRemark') {
      groupInfoRef.current?.setGroupMyRemark?.(groupId, data);
    }
  };
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <GroupInfo
        ref={groupInfoRef}
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        groupId={groupId}
        ownerId={ownerId}
        onParticipant={(groupId) => {
          navigation.push('GroupParticipantList', { params: { groupId } });
        }}
        onGroupDestroy={() => {
          navigation.goBack();
        }}
        onGroupQuit={() => {
          navigation.goBack();
        }}
        onClickedChangeGroupOwner={() => {
          navigation.push('ChangeGroupOwner', { params: { groupId } });
        }}
        onSendMessage={() => {
          navigation.navigate('ConversationDetail', {
            params: {
              convId: groupId,
              convType: 1,
              convName: groupId,
            },
          });
        }}
        onGroupName={(_groupId, groupName) => {
          editTypeRef.current = 'groupName';
          navigation.push('EditInfo', {
            params: {
              backName: tr('edit_group_name'),
              saveName: 'Save',
              initialData: groupName,
              maxLength: 128,
              goBack: goBack,
            },
          });
        }}
        onGroupDescription={(_groupId, groupDescription) => {
          editTypeRef.current = 'groupDescription';
          navigation.push('EditInfo', {
            params: {
              backName: tr('edit_group_description'),
              saveName: 'Save',
              initialData: groupDescription,
              maxLength: 128,
              goBack: goBack,
            },
          });
        }}
        onGroupMyRemark={(_groupId, groupMyRemark) => {
          editTypeRef.current = 'groupMyRemark';
          navigation.push('EditInfo', {
            params: {
              backName: tr('edit_group_my_remark'),
              saveName: 'Save',
              initialData: groupMyRemark,
              maxLength: 128,
              goBack: goBack,
            },
          });
        }}
      />
    </SafeAreaView>
  );
}
