import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Alert } from '../../ui/Alert';
import { BlockButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { CommonSwitch } from '../../ui/Switch';
import { Text } from '../../ui/Text';
import { SimpleToast } from '../../ui/Toast';
import { Avatar } from '../Avatar';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import { ListItem } from '../ListItem';
import { TopNavigationBar } from '../TopNavigationBar';
import { useGroupInfo } from './GroupInfo.hooks';
import type { GroupInfoProps, GroupInfoRef } from './types';

export const GroupInfo = React.forwardRef<GroupInfoRef, GroupInfoProps>(
  function (props: GroupInfoProps, ref?: React.ForwardedRef<GroupInfoRef>) {
    const {
      groupId,
      onBack,
      hasAudioCall = true,
      hasSendMessage = true,
      hasVideoCall = true,
      containerStyle,
      navigationBarVisible,
      customNavigationBar,
    } = props;
    const {
      groupName,
      groupAvatar,
      groupDescription,
      alertRef,
      toastRef,
      onClearChat,
      doNotDisturb,
      onDoNotDisturb,
      onGroupName,
      onGroupDescription,
      onGroupMyRemark,
      onCopyId,
      onParticipant,
      menuRef,
      onRequestCloseMenu,
      onMore,
      groupMemberCount,
      onSendMessage,
      onVideoCall,
      onAudioCall,
      isOwner,
      tr,
    } = useGroupInfo(props, ref);
    const { colors } = usePaletteContext();
    const { getColor } = useColors({
      bg: {
        light: colors.neutral[98],
        dark: colors.neutral[1],
      },
      bg2: {
        light: colors.neutral[95],
        dark: colors.neutral[2],
      },
      fg: {
        light: colors.neutral[1],
        dark: colors.neutral[98],
      },
      t1: {
        light: colors.neutral[5],
        dark: colors.neutral[6],
      },
      t2: {
        light: colors.neutral[3],
        dark: colors.neutral[95],
      },
      t3: {
        light: colors.neutral[7],
        dark: colors.neutral[6],
      },
    });

    return (
      <View
        style={[
          {
            flexGrow: 1,
            backgroundColor: getColor('bg'),
          },
          containerStyle,
        ]}
      >
        {navigationBarVisible !== false ? (
          customNavigationBar ? (
            <>{customNavigationBar}</>
          ) : (
            <TopNavigationBar
              Left={
                <Pressable
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={onBack}
                >
                  <Icon
                    name={'chevron_left'}
                    style={{ width: 24, height: 24 }}
                  />
                </Pressable>
              }
              Right={
                <Pressable style={{ width: 32, height: 32 }} onPress={onMore}>
                  <Icon
                    name={'ellipsis_vertical'}
                    style={{ height: 24, width: 24 }}
                  />
                </Pressable>
              }
              containerStyle={{ paddingHorizontal: 12 }}
            />
          )
        ) : null}
        <ScrollView>
          <View style={{ alignItems: 'center', paddingTop: 20 }}>
            <Avatar size={100} url={groupAvatar} />
            <View style={{ height: 12 }} />
            <Text
              textType={'large'}
              paletteType={'headline'}
              style={{ color: getColor('fg') }}
            >
              {groupName ?? groupId}
            </Text>
            <View style={{ height: 4 }} />
            <Text
              textType={'medium'}
              paletteType={'label'}
              style={{ color: getColor('t2') }}
            >
              {groupDescription ?? 'test description'}
            </Text>
            <View style={{ height: 4 }} />
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={onCopyId}
            >
              <Text
                textType={'small'}
                paletteType={'label'}
                style={{ color: getColor('t3') }}
              >
                {groupId}
              </Text>
              <Icon
                name={'doc_on_doc'}
                style={{ width: 16, height: 16, tintColor: getColor('t3') }}
              />
            </Pressable>

            <View style={{ height: 20 }} />
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}
            >
              {hasSendMessage ? (
                <BlockButton
                  iconName={'bubble_fill'}
                  text={tr('_uikit_info_send_msg')}
                  containerStyle={{ height: 62, width: 114 }}
                  onPress={() => onSendMessage?.(groupId)}
                />
              ) : null}
              {hasAudioCall ? (
                <BlockButton
                  iconName={'phone_pick'}
                  text={tr('_uikit_info_send_audio')}
                  containerStyle={{ height: 62, width: 114 }}
                  onPress={() => onAudioCall?.(groupId)}
                />
              ) : null}
              {hasVideoCall ? (
                <BlockButton
                  iconName={'video_camera'}
                  text={tr('_uikit_info_send_video')}
                  containerStyle={{ height: 62, width: 114 }}
                  onPress={() => onVideoCall?.(groupId)}
                />
              ) : null}
            </View>
          </View>
          <View style={{ height: 20 }} />
          <ListItem
            onClicked={onParticipant}
            containerStyle={{ paddingHorizontal: 16 }}
            LeftName={
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_uikit_info_item_member')}
              </Text>
            }
            RightText={
              <Text
                textType={'large'}
                paletteType={'label'}
                style={{ color: getColor('t1') }}
              >
                {groupMemberCount}
              </Text>
            }
            RightIcon={
              <View>
                <Icon
                  name={'chevron_right'}
                  style={{ height: 20, width: 20 }}
                />
              </View>
            }
          />
          <View
            style={{
              height: 12,
              width: '100%',
              backgroundColor: getColor('bg2'),
            }}
          />
          <ListItem
            onClicked={onGroupMyRemark}
            containerStyle={{ paddingHorizontal: 16 }}
            LeftName={
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_uikit_info_item_my_remark')}
              </Text>
            }
            RightIcon={
              <View>
                <Icon
                  name={'chevron_right'}
                  style={{ height: 20, width: 20 }}
                />
              </View>
            }
          />
          <ListItem
            containerStyle={{ paddingHorizontal: 16 }}
            LeftName={
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_uikit_info_not_disturb')}
              </Text>
            }
            RightIcon={
              <View>
                {doNotDisturb !== undefined ? (
                  <CommonSwitch
                    height={31}
                    width={51}
                    value={doNotDisturb}
                    onValueChange={onDoNotDisturb}
                  />
                ) : null}
              </View>
            }
          />
          <ListItem
            onClicked={onClearChat}
            containerStyle={{ paddingHorizontal: 16 }}
            LeftName={
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{ color: getColor('fg') }}
              >
                {tr('_uikit_info_clear_msg')}
              </Text>
            }
          />

          {isOwner === true ? (
            <>
              <View
                style={{
                  height: 12,
                  width: '100%',
                  backgroundColor: getColor('bg2'),
                }}
              />
              <ListItem
                onClicked={onGroupName}
                containerStyle={{ paddingHorizontal: 16 }}
                LeftName={
                  <Text
                    textType={'medium'}
                    paletteType={'title'}
                    style={{ color: getColor('fg') }}
                  >
                    {tr('_uikit_info_item_group_name')}
                  </Text>
                }
                RightText={
                  <Text
                    textType={'large'}
                    paletteType={'label'}
                    style={{ color: getColor('t1') }}
                  >
                    {groupName}
                  </Text>
                }
              />
              <ListItem
                onClicked={onGroupDescription}
                containerStyle={{ paddingHorizontal: 16 }}
                LeftName={
                  <Text
                    textType={'medium'}
                    paletteType={'title'}
                    style={{ color: getColor('fg') }}
                  >
                    {tr('_uikit_info_item_group_desc')}
                  </Text>
                }
                RightIcon={
                  <View>
                    <Icon
                      name={'chevron_right'}
                      style={{ height: 20, width: 20 }}
                    />
                  </View>
                }
              />
            </>
          ) : null}
        </ScrollView>

        <Alert ref={alertRef} />
        <BottomSheetNameMenu
          onRequestModalClose={onRequestCloseMenu}
          ref={menuRef}
        />
        <SimpleToast propsRef={toastRef} />
      </View>
    );
  }
);
