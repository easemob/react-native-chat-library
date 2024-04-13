import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  AddGroupParticipant,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function AddGroupParticipantScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const data = ((route.params as any)?.params as any)?.data
    ? JSON.parse(((route.params as any)?.params as any)?.data)
    : undefined;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <AddGroupParticipant
        containerStyle={{
          flexGrow: 1,
        }}
        onClickedSearch={() => {
          navi.navigate({
            to: 'SearchContact',
            props: {
              searchType: 'add-group-member',
              groupId,
            },
          });
        }}
        selectedData={data}
        groupId={groupId}
        onAddedResult={() => {
          console.log('onAddedResult');
          navi.goBack();
        }}
        onBack={() => {
          navi.goBack();
        }}
      />
    </SafeAreaView>
  );
}
