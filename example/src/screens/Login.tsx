import type { ParamListBase } from '@react-navigation/native';
import {
  type NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import * as React from 'react';

import type { RootParamsList } from '../routes';
import SignIn from './SignIn';
import SignUp from './SignUp';

let accountType = '';
let gid: string = '';
let gps: string = '';

try {
  const env = require('../env');
  accountType = env.accountType ?? 'agora';
  gid = env.id ?? '';
  gps = env.ps ?? '';
} catch (e) {
  console.warn('test:', e);
}

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
        initialParams={{
          params: {
            accountType: accountType as 'agora' | 'easemob',
            id: gid,
            pass: gps,
          },
        }}
        component={SignIn}
      />
      <Login.Screen
        name="SignUp"
        options={{
          headerShown: false,
        }}
        initialParams={{
          params: { accountType: accountType as 'agora' | 'easemob' },
        }}
        component={SignUp}
      />
    </Login.Navigator>
  );
}
