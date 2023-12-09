import * as React from 'react';
import { Platform, View } from 'react-native';

import { useConfigContext } from '../../config';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext, useThemeContext } from '../../theme';
import { IconButtonMemo } from '../../ui/Button';
import { KeyboardAvoidingView } from '../../ui/Keyboard';
import { TextInput } from '../../ui/TextInput';
import { timeoutTask } from '../../utils';
import { EmojiListMemo } from '../EmojiList';
import { DelButtonMemo } from './DelButton';
import { useMessageInput } from './MessageInput.hooks';
import type { MessageInputProps, MessageInputRef } from './types';
import { VoiceBar } from './VoiceBar';

export const MessageInput = React.forwardRef<
  MessageInputRef,
  MessageInputProps
>(function (
  props: React.PropsWithChildren<MessageInputProps>,
  ref?: React.ForwardedRef<MessageInputRef>
) {
  const { top, numberOfLines, closeAfterSend, onClickedSend } = props;

  const testRef = React.useRef<View>(null);
  const { fontFamily } = useConfigContext();
  const {} = useI18nContext();
  const { style } = useThemeContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    text: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    text_disable: {
      light: colors.neutral[7],
      dark: colors.neutral[3],
    },
    text_enable: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });

  const {
    value,
    valueRef,
    setValue,
    onClickedFaceListItem,
    onClickedDelButton,
    onClickedEmojiButton,
    onClickedVoiceButton,
    closeKeyboard,
    inputRef,
    emojiHeight,
    emojiIconName,
    onFocus,
    onBlur,
    changeInputBarState,
    voiceHeight,
  } = useMessageInput(props);

  const onSend = () => {
    const content = valueRef.current;
    if (content.length > 0) {
      onClickedSend?.(content);
    }

    if (closeAfterSend === true) {
      timeoutTask(0, closeKeyboard);
    }
  };

  React.useImperativeHandle(ref, () => {
    return {
      close: () => {
        changeInputBarState('normal');
      },
    };
  });

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={top}
      >
        <View
          ref={testRef}
          style={{
            backgroundColor: getColor('backgroundColor'),
            display: 'flex',
          }}
          onLayout={() => {
            // testRef.current?.measure(
            //   (
            //     _x: number,
            //     _y: number,
            //     _width: number,
            //     _height: number,
            //     _pageX: number,
            //     pageY: number
            //   ) => {
            //     console.log(
            //       'Sub:Sub:measure:',
            //       _x,
            //       _y,
            //       _width,
            //       _height,
            //       _pageX,
            //       pageY
            //     );
            //     // setPageY(pageY);
            //   }
            // );
            // testRef.current?.measureInWindow(
            //   (_x: number, _y: number, _width: number, _height: number) => {
            //     // console.log('Sub:Sub:measureInWindow:', _x, _y, _width, _height);
            //   }
            // );
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              margin: 8,
            }}
          >
            <IconButtonMemo
              style={{
                width: 30,
                height: 30,
                tintColor: getColor('tintColor'),
              }}
              containerStyle={{
                alignSelf: 'flex-end',
                margin: 6,
              }}
              onPress={onClickedVoiceButton}
              iconName={'wave_in_circle'}
            />
            <View
              style={{
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'center',
                flexShrink: 1,
                marginHorizontal: 6,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 16,
                  paddingVertical: 7,
                  backgroundColor: getColor('backgroundColor2'),
                  borderRadius: 18,
                }}
              >
                <TextInput
                  ref={inputRef}
                  numberOfLines={numberOfLines}
                  multiline={true}
                  unitHeight={Platform.OS === 'ios' ? 22 : 22}
                  style={{
                    fontSize: 16,
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: 22,
                    fontFamily: fontFamily,
                    color: getColor('input_text'),
                  }}
                  containerStyle={{
                    width: '100%',
                    minHeight: 22,
                  }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onChangeText={setValue}
                  value={value}
                  keyboardAppearance={style === 'light' ? 'light' : 'dark'}
                />
              </View>
            </View>
            <IconButtonMemo
              style={{
                width: 30,
                height: 30,
                tintColor: getColor('tintColor'),
              }}
              containerStyle={{
                alignSelf: 'flex-end',
                margin: 6,
              }}
              onPress={onClickedEmojiButton}
              iconName={emojiIconName}
            />
            <IconButtonMemo
              style={{
                width: 30,
                height: 30,
                tintColor: getColor('tintColor2'),
                backgroundColor: undefined,
                borderRadius: 30,
              }}
              containerStyle={{
                alignSelf: 'flex-end',
                margin: 6,
              }}
              onPress={onSend}
              iconName={'airplane'}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
      <View
        style={{
          backgroundColor:
            emojiHeight === 0 ? undefined : getColor('backgroundColor'),
          height: emojiHeight,
        }}
      >
        <EmojiListMemo
          containerStyle={{
            flex: 1,
          }}
          onFace={onClickedFaceListItem}
        />
        <DelButtonMemo
          getColor={getColor}
          emojiHeight={emojiHeight}
          onClicked={onClickedDelButton}
        />
      </View>
      <VoiceBar height={voiceHeight} />
    </>
  );
});

export type MessageInputComponent = typeof MessageInput;
