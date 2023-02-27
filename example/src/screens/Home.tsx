import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import type { ParamListBase } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import type { RootParamsList } from '../routes';
import ContactScreen from './Contact';
import ConversationList from './ConversationList';
import MySetting from './MySetting';

const Home = createMaterialBottomTabNavigator<RootParamsList>();

export default function HomeScreen(
  _: NativeStackScreenProps<ParamListBase, 'Home'>
): JSX.Element {
  // console.log('test:HomeScreen:', route, navigation);

  const shifting = true;
  return (
    <Home.Navigator
      initialRouteName="ConversationList"
      shifting={shifting}
      labeled={false}
      activeColor="blue"
      inactiveColor="black"
      barStyle={{ backgroundColor: 'white' }}
    >
      <Home.Screen
        name="ConversationList"
        options={() => {
          return {
            tabBarIcon: ({ focused, color }) => (
              <TabBarIcon
                focused={focused}
                color={color}
                type="ConversationList"
              />
            ),
          };
        }}
        component={ConversationList}
      />
      <Home.Screen
        name="Contact"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} type="Contact" />
          ),
        }}
        component={ContactScreen}
      />
      <Home.Screen
        name="MySetting"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} type="MySetting" />
          ),
        }}
        component={MySetting}
      />
    </Home.Navigator>
  );
}
