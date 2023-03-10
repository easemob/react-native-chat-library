import React from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import type { ImageStyle } from 'react-native-fast-image';

import { useThemeContext } from '../contexts/ThemeContext';
import { getScaleFactor } from '../styles/createScaleFactor';
import createStyleSheet from '../styles/createStyleSheet';
import type { ButtonStateColor } from '../types';
import type { LocalIconName } from './Icon';
import { LocalIcon } from './Icon';

type ButtonProps = React.PropsWithChildren<{
  icon?: LocalIconName | undefined;
  iconStyle?: StyleProp<ImageStyle>;
  disabled?: boolean | undefined;
  onPress?: () => void | undefined;
  style?: StyleProp<ViewStyle> | undefined;
  color?: Partial<ButtonStateColor> | undefined;
  font?: StyleProp<TextStyle> | undefined;
  onPressIn?: ((event: GestureResponderEvent) => void) | null | undefined;
  onPressOut?: ((event: GestureResponderEvent) => void) | null | undefined;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
}>;
export default function Button({
  icon,
  iconStyle,
  disabled,
  onPress,
  style,
  color,
  font,
  children,
  onPressIn,
  onPressOut,
  onLayout,
}: ButtonProps): JSX.Element {
  const { colors, fonts } = useThemeContext();
  const sf = getScaleFactor();

  const getStateColor = (pressed: boolean, disabled?: boolean) => {
    if (disabled) {
      if (color?.disabled !== undefined) {
        return color.disabled;
      }
      return colors.button.disabled;
    }
    if (pressed) {
      if (color?.pressed !== undefined) {
        return color.pressed;
      }
      return colors.button.pressed;
    }
    if (color?.enabled !== undefined) {
      return color.enabled;
    }
    return colors.button.enabled;
  };

  return (
    <Pressable
      onLayout={onLayout}
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={({ pressed }) => {
        const s = getStateColor(pressed, disabled);
        return [{ backgroundColor: s.background }, styles.container, style];
      }}
    >
      {({ pressed }) => {
        const s = getStateColor(pressed, disabled);

        return (
          <React.Fragment>
            {icon && (
              <LocalIcon
                size={sf(28)}
                name={icon}
                color={s.content}
                containerStyle={[styles.icon, iconStyle]}
              />
            )}
            {typeof children === 'string' ? (
              children.length !== 0 ? (
                <Text
                  style={[
                    styles.text,
                    { color: s.content },
                    fonts.button,
                    font,
                  ]}
                >
                  {children}
                </Text>
              ) : null
            ) : (
              children
            )}
          </React.Fragment>
        );
      }}
    </Pressable>
  );
}

const styles = createStyleSheet({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { marginVertical: -4, marginRight: 8 },
  text: {},
});
