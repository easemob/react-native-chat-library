import * as React from 'react';
import { Pressable, View } from 'react-native';

import type { IconNameType } from '../../assets';
import { useConfigContext } from '../../config';
import { getElement, useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { SingleLineText, Text } from '../../ui/Text';
import { BackButton } from '../Back';
import type { TopNavigationBarProps } from './types';

/**
 * Top Navigation Bar Component.
 *
 * This component is usually displayed at the top of the page-level component, with a left-center-right layout. It generally provides a return button on the left, a title in the middle, and an expand button on the right.
 */
export function TopNavigationBar<LeftProps = any, RightProps = any>(
  props: TopNavigationBarProps<LeftProps, RightProps>
) {
  const { containerStyle, Title, Left, Right, LeftProps, RightProps } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });

  return (
    <View
      style={[
        {
          height: 44,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: getColor('bg'),
          paddingHorizontal: 8,
        },
        containerStyle,
      ]}
    >
      {getElement(Left, LeftProps)}
      {Title}
      {getElement(Right, RightProps)}
    </View>
  );
}

/**
 * The component on the right side of the navigation bar.
 */
export function TopNavigationBarRight({
  onClicked,
  iconName,
}: {
  onClicked?: () => void;
  iconName: IconNameType;
}) {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
  });
  return (
    <Pressable
      style={{
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={onClicked}
    >
      <Icon
        name={iconName}
        style={{ height: 24, width: 24, tintColor: getColor('bg') }}
      />
    </Pressable>
  );
}
export function TopNavigationBarRightTextList({
  onClickedList,
  textList,
}: {
  onClickedList?: (() => void)[];
  textList: string[];
}) {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    text: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });
  return (
    <Pressable
      style={{
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={onClickedList![0]}
    >
      <SingleLineText
        paletteType={'label'}
        textType={'medium'}
        style={{ color: getColor('text') }}
      >
        {textList[0]}
      </SingleLineText>
    </Pressable>
  );
}
export function TopNavigationBarRightList({
  onClickedList,
  iconNameList,
}: {
  onClickedList: (() => void)[];
  iconNameList: IconNameType[];
}) {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
  });
  return (
    <View style={{ flexDirection: 'row' }}>
      {iconNameList.map((name, index) => {
        return (
          <IconButton
            key={index}
            iconName={name}
            onPress={onClickedList[index]}
            style={{
              height: 24,
              width: 24,
              margin: 6,
              tintColor: getColor('bg'),
            }}
          />
        );
      })}
    </View>
  );
}

/**
 * The component on the middle side of the navigation bar.
 */
export function TopNavigationBarTitle({ text }: { text: string }) {
  const { tr } = useI18nContext();
  const { headerFontFamily } = useConfigContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    title: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });
  return (
    <View style={{ justifyContent: 'center' }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: '400',
          // lineHeight: 22,
          fontStyle: 'normal',
          alignSelf: 'center',
          fontFamily: headerFontFamily,
          color: getColor('title'),
        }}
      >
        {tr(text)}
      </Text>
    </View>
  );
}

type TopNavigationBarLeftProps = {
  onBack?: () => void;
  content: string;
};
export function TopNavigationBarLeft(props: TopNavigationBarLeftProps) {
  const { onBack, content } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    fg: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
  });
  return (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
      }}
      onPress={onBack}
    >
      <BackButton />
      <SingleLineText
        textType={'medium'}
        paletteType={'title'}
        style={{
          color: getColor('fg'),
        }}
      >
        {content}
      </SingleLineText>
    </Pressable>
  );
}
