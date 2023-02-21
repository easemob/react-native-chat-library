import * as React from 'react';
import { View } from 'react-native';
import { ChatMessageType } from 'react-native-chat-sdk';
import {
  DefaultMessageBubbleList,
  DefaultMessageBubbleListRef,
  seqId,
  TextMessageItemType,
  timestamp,
} from 'react-native-chat-uikit';
import { Button } from 'react-native-paper';

export default function TestMessageList() {
  React.useEffect(() => {}, []);
  const ref = React.useRef<DefaultMessageBubbleListRef>(null);

  const MessageListM = React.memo(DefaultMessageBubbleList);

  return (
    <View
      style={{
        marginTop: 100,
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            ref.current?.addMessage([
              {
                sender: 'zs',
                timestamp: timestamp(),
                isSender: false,
                key: seqId('eml').toString(),
                style: {
                  // backgroundColor: 'yellow',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '66%',
                  // height: 80,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                },
                text: 'test',
                type: ChatMessageType.TXT,
              } as TextMessageItemType,
            ]);
          }}
        >
          change icon
        </Button>
      </View>
      <MessageListM ref={ref} />
    </View>
  );
}
