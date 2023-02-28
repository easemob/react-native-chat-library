import type { MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import type { ParamListBase } from '@react-navigation/native';
import * as React from 'react';
import { DeviceEventEmitter, View } from 'react-native';

import HomeHeaderTitle from '../components/HomeHeaderTitle';
import TabBarIcon from '../components/TabBarIcon';
import { ContactEvent, ContactEventBarType, ContactEventType } from '../events';
import type { RootParamsList } from '../routes';
import ContactList from './ContactList';
import GroupList from './GroupList';
import RequestList from './RequestList';

const Contact = createMaterialTopTabNavigator<RootParamsList>();

export default function ContactScreen({
  navigation,
}: MaterialBottomTabScreenProps<ParamListBase, 'Contact'>): JSX.Element {
  // console.log('test:ContactScreen:', route, navigation);

  const [contactBarState, setContactBarState] = React.useState<
    boolean | undefined
  >(undefined);
  const [groupBarState, setGroupBarState] = React.useState<boolean | undefined>(
    undefined
  );
  const [requestBarState, setRequestBarState] = React.useState<
    boolean | undefined
  >(undefined);

  const BarBadge = () => {
    console.log('test:1234:');
    return (
      <View style={{ top: 14, right: 20 }}>
        <View
          style={{
            width: 9,
            height: 9,
            backgroundColor: '#FF14CC',
            borderRadius: 9,
          }}
        />
      </View>
    );
  };

  React.useEffect(() => {
    const sub1 = navigation.addListener('focus', () => {
      navigation.getParent()?.setOptions({
        headerBackVisible: false,
        headerRight: undefined,
        headerTitle: () => <HomeHeaderTitle name="Contacts" />,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      });
    });
    const sub2 = DeviceEventEmitter.addListener(ContactEvent, (event) => {
      console.log('test:event:', event);
      const eventType = event.type as ContactEventType;
      if (eventType === 'update_state') {
        const eventParams = event.params as {
          unread: boolean;
          barType: ContactEventBarType;
        };
        const barType = eventParams.barType;
        if (barType === 'contact') {
          setContactBarState(eventParams.unread as boolean);
        } else if (barType === 'group') {
          setGroupBarState(eventParams.unread as boolean);
        } else if (barType === 'request') {
          setRequestBarState(eventParams.unread as boolean);
        }
      }
    });
    return () => {
      sub1();
      sub2.remove();
    };
  }, [navigation]);

  return (
    <Contact.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        // tabBarIndicatorStyle: {backgroundColor: 'red'},
        // tabBarActiveTintColor: 'red',
        // tabBarInactiveTintColor: 'blue',
        // tabBarBounces: false,
        // tabBarIconStyle: {backgroundColor: 'red', borderColor: 'blue'},
        // tabBarContentContainerStyle: { borderColor: 'blue'},
        // tabBarStyle: {shadowColor: 'red'},
        // tabBarIndicatorContainerStyle: {shadowColor: 'blue'}
        // tabBarBadge: BarBadge,
        // tabBarLabelStyle: { borderColor: 'red' },
        // tabBarItemStyle: { height: 40 },
        // tabBarStyle: { borderColor: 'red', backgroundColor: 'blue' },
      }}
    >
      <Contact.Screen
        name="ContactList"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              type="TopContacts"
              state={contactBarState}
            />
          ),
          tabBarBadge: contactBarState === true ? BarBadge : undefined,
        }}
        initialParams={{ params: { type: 'contact_list' } }}
        component={ContactList}
      />
      <Contact.Screen
        name="GroupList"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              type="TopGroups"
              state={groupBarState}
            />
          ),
          tabBarBadge: groupBarState === true ? BarBadge : undefined,
        }}
        component={GroupList}
      />
      <Contact.Screen
        name="RequestList"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              type="TopRequestList"
              state={requestBarState}
            />
          ),
          tabBarBadge: requestBarState === true ? BarBadge : undefined,
        }}
        component={RequestList}
      />
    </Contact.Navigator>
  );
}
