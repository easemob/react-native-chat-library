import * as React from 'react';
import { Text, View } from 'react-native';
import {
  Badge,
  createStyleSheet,
  getScaleFactor,
  LocalIcon,
} from 'react-native-chat-uikit';

import { useAppI18nContext } from '../contexts/AppI18nContext';

type TabBarIconProps = {
  focused?: boolean | undefined;
  color: string;
  type:
    | 'ConversationList'
    | 'Contact'
    | 'MySetting'
    | 'TopRequestList'
    | 'TopContacts'
    | 'TopGroups';
  state?: number | boolean;
};

export default function TabBarIcon({
  focused,
  color,
  type,
  state,
}: TabBarIconProps): JSX.Element {
  const { tabbar } = useAppI18nContext();
  const sf = getScaleFactor();
  // console.log('test:TabBarIcon:', focused, type);
  const _ = (_: boolean | undefined) => {};
  _(focused);
  const ConversationList = (): JSX.Element => {
    return (
      <React.Fragment>
        <LocalIcon name="tabbar_chats" color={color} size={sf(32)} />
        {state ? (
          <Badge
            count={state as number}
            badgeColor="rgba(255, 20, 204, 1)"
            textColor="white"
            style={styles.chat}
          />
        ) : null}
      </React.Fragment>
    );
  };
  const Contact = (): JSX.Element => {
    return (
      <React.Fragment>
        <LocalIcon name="tabbar_contacts" color={color} size={sf(32)} />
        {state
          ? state === true && (
              <LocalIcon
                name="contact_request_hint"
                size={sf(14)}
                style={[styles.contact]}
              />
            )
          : null}
      </React.Fragment>
    );
  };
  const MySetting = (): JSX.Element => {
    return (
      <React.Fragment>
        <LocalIcon name="tabbar_setting" color={color} size={sf(32)} />
      </React.Fragment>
    );
  };
  const TopBarRequestList = (): JSX.Element => {
    return (
      <React.Fragment>
        <View style={styles.container}>
          <Text style={[styles.topbar, { color: color }]}>
            {tabbar.request}
          </Text>
        </View>
        {/* <LocalIcon
          name="contact_request_hint"
          size={sf(16)}
          style={styles.request2}
        /> */}
      </React.Fragment>
    );
  };
  const TopBarContacts = (): JSX.Element => {
    return (
      <React.Fragment>
        <View style={styles.container}>
          <Text style={[styles.topbar, { color: color }]}>
            {tabbar.contact}
          </Text>
        </View>
      </React.Fragment>
    );
  };
  const TopBarGroups = (): JSX.Element => {
    return (
      <React.Fragment>
        <View style={styles.container}>
          <Text style={[styles.topbar, { color: color }]}>{tabbar.group}</Text>
        </View>
      </React.Fragment>
    );
  };
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      {type === 'ConversationList'
        ? ConversationList()
        : type === 'Contact'
        ? Contact()
        : type === 'TopRequestList'
        ? TopBarRequestList()
        : type === 'TopContacts'
        ? TopBarContacts()
        : type === 'TopGroups'
        ? TopBarGroups()
        : MySetting()}
    </View>
  );
}

const styles = createStyleSheet({
  chat: {
    position: 'absolute',
    right: -16,
    top: -6,
    borderColor: 'white',
    borderWidth: 1,
  },
  contact: {
    position: 'absolute',
    right: -8,
    top: -20,
    borderColor: 'white',
    borderWidth: 1,
  },
  request: {
    top: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  request2: {
    position: 'absolute',
    right: -15,
    top: -10,
    borderColor: 'white',
    borderWidth: 1,
  },
  topbar: {
    top: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    width: 70,
  },
});
