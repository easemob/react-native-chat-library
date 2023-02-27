import type { ParamListBase } from '@react-navigation/native';
import {
  type NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import * as React from 'react';

import type { RootParamsList } from '../routes';
import SignIn from './SignIn';
import SignUp from './SignUp';

const Login = createNativeStackNavigator<RootParamsList>();

export default function LoginScreen(
  _props: NativeStackScreenProps<ParamListBase, 'Login'>
): JSX.Element {
  return (
    <Login.Navigator initialRouteName="SignIn">
      <Login.Screen
        name="SignIn"
        options={{
          headerShown: false,
        }}
        component={SignIn}
      />
      <Login.Screen
        name="SignUp"
        options={{
          headerShown: false,
        }}
        component={SignUp}
      />
    </Login.Navigator>
  );
}
