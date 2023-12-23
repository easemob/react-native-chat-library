import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ShareContact } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ShareContactScreen(props: Props) {
  const { navigation, route } = props;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  const convName = ((route.params as any)?.params as any)?.convName;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <ShareContact
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        onSearch={() => {
          navigation.navigate('SearchContact', {
            params: { searchType: 'share-contact', convId, convType, convName },
          });
        }}
        onClicked={(data) => {
          console.log('test:zuoyu:ShareContact:onClicked', data);
          navigation.navigate('ConversationDetail', {
            params: {
              convId,
              convType,
              convName,
              selectedContacts: JSON.stringify(data),
              operateType: 'share_card',
            },
          });
        }}
        onBack={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}