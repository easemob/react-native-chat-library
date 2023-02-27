import * as React from 'react';
import { View } from 'react-native';
import { getScaleFactor, Loading } from 'react-native-chat-uikit';

export function SplashScreen(): JSX.Element {
  const sf = getScaleFactor();
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      <Loading color="rgba(15, 70, 230, 1)" size={sf(45)} />
    </View>
  );
}
