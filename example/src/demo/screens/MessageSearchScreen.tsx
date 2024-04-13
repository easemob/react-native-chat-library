import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  MessageSearch,
  MessageSearchModel,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function MessageSearchScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <MessageSearch
        containerStyle={{
          flexGrow: 1,
        }}
        onCancel={(_data?: MessageSearchModel) => {
          navi.goBack();
        }}
        convId={convId}
        convType={convType}
        onClickedItem={(item) => {
          navi.push({
            to: 'MessageHistory',
            props: {
              convId: convId,
              convType: convType,
              messageId: item.msg.msgId,
            },
          });
        }}
      />
    </SafeAreaView>
  );
}
