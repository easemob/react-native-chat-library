import React from 'react';
import {
  ImageStyle,
  Pressable,
  StyleProp,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { useThemeContext } from '../contexts/ThemeContext';
import { getScaleFactor } from '../styles/createScaleFactor';
import createStyleSheet from '../styles/createStyleSheet';
import { LocalIcon } from './Icon';

type TextInputProps = RNTextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
};

function TextInput(
  {
    containerStyle,
    iconStyle,
    children,
    style,
    editable = true,
    clearButtonMode,
    secureTextEntry,
    onChangeText,
    ...props
  }: TextInputProps,
  ref: React.LegacyRef<RNTextInput>
) {
  const { colors } = useThemeContext();
  const sf = getScaleFactor();
  const input = editable ? colors.input.enabled : colors.input.disabled;
  const [_value, setValue] = React.useState('');
  const [height, setHeight] = React.useState(0);
  const _onChangeText = React.useCallback(
    (text: string) => {
      setValue(text);
      onChangeText?.(text);
    },
    [onChangeText]
  );
  const _clearButtonMode = 'never';
  const [_secureTextEntry, setSecureTextEntry] =
    React.useState(secureTextEntry);
  const iconSize = sf(28);

  const _onClearButtonMode = React.useCallback(
    (
      clearButtonMode?:
        | 'never'
        | 'while-editing'
        | 'unless-editing'
        | 'always'
        | undefined,
      secureTextEntry?: boolean | undefined
    ) => {
      if (secureTextEntry !== undefined) {
        return (
          <Pressable
            onPress={() => {
              setSecureTextEntry(!secureTextEntry);
            }}
            onLayout={(event) => {
              setHeight(event.nativeEvent.layout.y);
            }}
          >
            <LocalIcon
              name={secureTextEntry === true ? 'eye' : 'eye_slash'}
              style={[
                styles.icon,
                {
                  top: -(height / 2 + iconSize / 2),
                },
                iconStyle,
              ]}
              size={iconSize}
            />
          </Pressable>
        );
      } else {
        if (_value.length === 0) {
          return null;
        }
        if (clearButtonMode === 'while-editing') {
          return (
            <Pressable
              onPress={() => {
                _onChangeText('');
              }}
              onLayout={(event) => {
                setHeight(event.nativeEvent.layout.y);
              }}
            >
              <LocalIcon
                name="input_delete"
                style={[
                  styles.icon,
                  {
                    top: -(height / 2 + iconSize / 2),
                  },
                  iconStyle,
                ]}
                size={iconSize}
              />
            </Pressable>
          );
        } else {
          return null;
        }
      }
    },
    [_onChangeText, _value.length, height, iconSize, iconStyle]
  );

  return (
    <View style={[containerStyle]}>
      <RNTextInput
        ref={ref}
        editable={editable}
        clearButtonMode={_clearButtonMode}
        secureTextEntry={_secureTextEntry}
        selectionColor={input.highlight}
        placeholderTextColor={input.placeholder}
        onChangeText={_onChangeText}
        style={[
          styles.input,
          { color: input.text, backgroundColor: input.background },
          style,
        ]}
        value={_value}
        {...props}
        // value={_value}
      >
        {children}
      </RNTextInput>
      {_onClearButtonMode(clearButtonMode, _secureTextEntry)}
    </View>
  );
}

const styles = createStyleSheet({
  input: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    paddingLeft: 15,
  },
  icon: {
    position: 'absolute',
    right: 10,
  },
});

export default React.forwardRef<RNTextInput, TextInputProps>(TextInput);
