import * as React from 'react';
import { Pressable, SectionListData, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { SingleLineText } from '../../ui/Text';
import { Avatar } from '../Avatar';
import type { IndexModel } from '../ListIndex';
import { ListItem } from '../ListItem';
import type { ContactItemProps, ContactListItemProps } from './types';

export function ContactListItem(props: ContactListItemProps) {
  const { section, onClicked, onCheckClicked } = props;
  const { checked } = section;
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
    no_checked: {
      light: colors.neutral[7],
      dark: colors.neutral[4],
    },
    checked: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });
  return (
    <View
      style={{
        backgroundColor: getColor('bg'),
      }}
    >
      <Pressable
        style={{
          width: '100%',
          height: 59.5,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
        onPress={() => {
          onClicked?.(section);
        }}
      >
        {checked !== undefined ? (
          <View style={{ marginRight: 12 }}>
            <IconButton
              iconName={
                checked !== false ? 'checked_rectangle' : 'unchecked_rectangle'
              }
              style={{
                height: 28,
                width: 28,
                tintColor: getColor(
                  checked !== false ? 'checked' : 'no_checked'
                ),
              }}
              onPress={() => {
                onCheckClicked?.(section.checked, section);
              }}
            />
          </View>
        ) : null}
        <Avatar url={section.avatar} size={40} />
        <View
          style={{
            flexGrow: 1,
            paddingLeft: 12,
            maxWidth: checked !== undefined ? '70%' : '80%',
          }}
        >
          <SingleLineText
            paletteType={'title'}
            textType={'medium'}
            style={{ color: getColor('t1') }}
          >
            {section.nickName}
          </SingleLineText>
        </View>
      </Pressable>
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: getColor('divider'),
          marginLeft: 68,
        }}
      />
    </View>
  );
}
export const ContactListItemMemo = React.memo(ContactListItem);

export function ContactListItemHeader(
  props: SectionListData<ContactListItemProps, IndexModel>
) {
  const { indexTitle } = props;
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
    <View
      style={[
        {
          backgroundColor: getColor('bg'),
        },
      ]}
    >
      <View
        style={[
          {
            height: 32,
            justifyContent: 'center',
            paddingLeft: 16,
          },
        ]}
      >
        <SingleLineText paletteType={'title'} textType={'small'}>
          {indexTitle}
        </SingleLineText>
      </View>
    </View>
  );
}
export const ContactListItemHeaderMemo = React.memo(ContactListItemHeader);

export function ContactItem(props: ContactItemProps) {
  const { icon, name, count, hasArrow, onClicked } = props;
  return (
    <ListItem
      LeftName={
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {icon ? (
            <>
              <Icon name={icon} style={{ height: 18, width: 18 }} />
              <View style={{ width: 13 }} />
            </>
          ) : null}

          <SingleLineText paletteType={'title'} textType={'medium'}>
            {name}
          </SingleLineText>
        </View>
      }
      RightText={count}
      RightIcon={
        hasArrow ? (
          <Icon name={'chevron_right'} style={{ height: 20, width: 20 }} />
        ) : undefined
      }
      onClicked={onClicked}
      containerStyle={{
        marginHorizontal: 16,
      }}
    />
  );
}
