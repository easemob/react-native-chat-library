import * as React from 'react';
import { Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { SingleLineText, Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import {
  TopNavigationBar,
  TopNavigationBarElementType,
  TopNavigationBarRightList,
} from '../TopNavigationBar';
import { useConversationDetail } from './ConversationDetail.hooks';
import type { ConversationDetailProps } from './types';

export function ConversationDetail(props: ConversationDetailProps) {
  const {
    containerStyle,
    onBack,
    convId,
    enableNavigationBar = true,
    ConversationDetailNavigationBar,
  } = props;

  const {
    onClickedSend,
    _messageInputRef,
    _MessageInput,
    messageInputProps,
    _messageListRef,
    _MessageList,
    messageListProps,
    onQuoteMessageForInput,
    onEditMessageForInput,
    onEditMessageFinished,
    convName,
    convAvatar,
    onClickedAvatar,
  } = useConversationDetail(props);

  return (
    <View style={[{ flexGrow: 1 }, containerStyle]}>
      {enableNavigationBar === true ? (
        <_ConversationDetailNavigationBar
          convId={convId}
          convName={convName}
          convAvatar={convAvatar}
          onBack={onBack}
          onClickedAvatar={onClickedAvatar}
          NavigationBar={ConversationDetailNavigationBar}
        />
      ) : null}
      <_MessageList
        onClicked={() => {
          _messageInputRef?.current?.close?.();
        }}
        onQuoteMessageForInput={onQuoteMessageForInput}
        onEditMessageForInput={onEditMessageForInput}
        ref={_messageListRef}
        {...messageListProps}
      />
      <_MessageInput
        ref={_messageInputRef}
        onClickedSend={onClickedSend}
        onEditMessageFinished={onEditMessageFinished}
        onHeightChange={(height) => {
          _messageListRef?.current?.onInputHeightChange?.(height);
        }}
        {...messageInputProps}
      />
      {/* <MessageInput ref={messageInputRef} /> */}
    </View>
  );
}

export type NavigationBarProps<LeftProps, RightProps> = {
  convId: string;
  convName?: string;
  convAvatar?: string;
  onBack?: (data?: any) => void;
  onClickedAvatar?: () => void;
  NavigationBar?: TopNavigationBarElementType<LeftProps, RightProps>;
};
const _ConversationDetailNavigationBar = <LeftProps, RightProps>(
  props: NavigationBarProps<LeftProps, RightProps>
): JSX.Element => {
  const {
    onBack,
    onClickedAvatar,
    convAvatar,
    convName,
    convId,
    NavigationBar,
  } = props;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
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
  if (NavigationBar) {
    // return { NavigationBar };
    return <>{NavigationBar}</>;
  }
  return (
    <TopNavigationBar
      Left={
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton
            iconName={'chevron_left'}
            style={{ width: 24, height: 24 }}
            onPress={onBack}
          />
          <Pressable onPress={onClickedAvatar}>
            <Avatar url={convAvatar} size={32} />
          </Pressable>

          <View
            style={{
              marginLeft: 10,
              maxWidth: '60%',
            }}
          >
            <SingleLineText
              textType={'medium'}
              paletteType={'title'}
              style={{ color: getColor('text') }}
            >
              {convName ?? convId}
            </SingleLineText>
            <Text
              textType={'extraSmall'}
              paletteType={'label'}
              style={{ color: getColor('text_enable') }}
            >
              {tr('state')}
            </Text>
          </View>
        </View>
      }
      Right={TopNavigationBarRightList}
      RightProps={{
        onClickedList: [
          () => {
            // todo: click phone_pick
          },
          () => {
            // todo: click video_camera
          },
        ],
        iconNameList: ['phone_pick', 'video_camera'],
      }}
      containerStyle={{ paddingHorizontal: 12 }}
    />
  );
};
