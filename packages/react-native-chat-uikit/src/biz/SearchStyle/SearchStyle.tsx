import * as React from 'react';
import { Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';

export type SearchStyleProps = {
  title: string;
  onPress: () => void;
};
export function SearchStyle(props: SearchStyleProps) {
  const { title, onPress } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    backgroundColor: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
    color: {
      light: colors.neutral[6],
      dark: colors.neutral[4],
    },
  });
  const { tr } = useI18nContext();
  return (
    <View
      style={{
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 4,
        height: 44,
      }}
    >
      <Pressable onPress={onPress}>
        <View
          style={{
            flexDirection: 'row',
            borderRadius: 18,
            height: 36,
            paddingVertical: 7,
            width: '100%',
            backgroundColor: getColor('backgroundColor'),
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon
            name={'magnifier'}
            style={{
              width: 22,
              height: 22,
              tintColor: getColor('color'),
            }}
          />
          <View style={{ width: 4 }} />
          <Text
            textType={'large'}
            paletteType={'body'}
            style={{
              color: getColor('color'),
            }}
          >
            {tr(title)}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
