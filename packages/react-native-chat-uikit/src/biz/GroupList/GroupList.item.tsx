import * as React from 'react';
import { Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import type { GroupListItemProps } from './types';

export function GroupListItem(props: GroupListItemProps) {
  const { data, onClicked } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    t1: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    t2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[2],
    },
  });
  return (
    <Pressable
      style={{
        backgroundColor: getColor('bg'),
      }}
      onPress={() => {
        onClicked?.(data);
      }}
    >
      <View
        style={{
          width: '100%',
          height: 75.5,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <Avatar url={data.groupAvatar} size={50} />
        <View style={{ flexDirection: 'column', flexGrow: 1, paddingLeft: 12 }}>
          <Text paletteType={'title'} textType={'medium'}>
            {data.groupName === undefined || data.groupName.length === 0
              ? data.groupId
              : data.groupName}
          </Text>
        </View>
      </View>

      <View
        style={{
          width: '100%',
          borderBottomWidth: 0.5,
          borderBottomColor: getColor('divider'),
          marginLeft: 78,
        }}
      />
    </Pressable>
  );
}
export const GroupListItemMemo = React.memo(GroupListItem);
