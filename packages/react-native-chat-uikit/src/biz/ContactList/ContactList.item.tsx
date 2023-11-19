import * as React from 'react';
import { SectionListData, View } from 'react-native';

import { g_not_existed_url } from '../../const';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { ListItem } from '../ListItem';
import type { DataModel, ListItemProps, ListItemRequestProps } from '../types';

export type ContactListItemProps = ListItemProps &
  ListItemRequestProps<DataModel> & {};
export function ContactListItem(props: ContactListItemProps) {
  const {} = props;
  return (
    <View
      style={{
        width: '100%',
        height: 59.5,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
        paddingRight: 16,
        borderColor: 'grey',
        borderBottomWidth: 0.5,
      }}
    >
      <Avatar url={g_not_existed_url} size={40} />
      <View style={{ flexGrow: 1, paddingLeft: 12 }}>
        <Text paletteType={'title'} textType={'medium'}>
          {'用户昵称'}
        </Text>
      </View>
    </View>
  );
}
export const ContactListItemMemo = React.memo(ContactListItem);

export function ContactListItemHeader(
  props: SectionListData<ContactListItemProps, { indexTitle: string }>
) {
  const { indexTitle } = props;
  return (
    <View style={[{ height: 32, justifyContent: 'center', paddingLeft: 16 }]}>
      <Text paletteType={'title'} textType={'small'}>
        {indexTitle}
      </Text>
    </View>
  );
}
export const ContactListItemHeaderMemo = React.memo(ContactListItemHeader);

export type ContactItemProps = {
  name: string;
  count?: React.ReactElement;
  hasArrow?: boolean;
  onClicked?: () => void;
};
export function ContactItem(props: ContactItemProps) {
  const { name, count, hasArrow, onClicked } = props;
  return (
    <ListItem
      LeftName={
        <Text paletteType={'title'} textType={'medium'}>
          {name}
        </Text>
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
