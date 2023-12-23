import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ChatMessageType } from 'react-native-chat-sdk';
import {
  ConversationDetail,
  MessageInputRef,
  MessageListRef,
  MessageModel,
  SystemMessageModel,
  TimeMessageModel,
} from 'react-native-chat-uikit';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationDetailScreen(props: Props) {
  const { navigation, route } = props;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  const convName = ((route.params as any)?.params as any)?.convName;
  const operateType = ((route.params as any)?.params as any)?.operateType;
  const selectedParticipants = ((route.params as any)?.params as any)
    ?.selectedParticipants;
  const selectedContacts = ((route.params as any)?.params as any)
    ?.selectedContacts;
  const listRef = React.useRef<MessageListRef>({} as any);
  const inputRef = React.useRef<MessageInputRef>({} as any);
  const { top, bottom } = useSafeAreaInsets();
  console.log('test:zuoyu:ConversationDetailScreen', route.params);

  React.useEffect(() => {
    if (selectedParticipants && operateType === 'mention') {
      try {
        const p = JSON.parse(selectedParticipants);
        inputRef.current?.mentionSelected(
          p.map((item: any) => {
            return {
              id: item.id,
              name: item.name ?? item.id,
            };
          })
        );
      } catch {}
    }
  }, [selectedParticipants, operateType]);

  React.useEffect(() => {
    if (selectedContacts && operateType === 'share_card') {
      try {
        const p = JSON.parse(selectedContacts);
        listRef.current?.addSendMessage?.({
          type: 'card',
          userId: p.userId,
          userName: p.nickName,
          userAvatar: p.avatar,
        });
      } catch {}
    }
  }, [selectedContacts, operateType]);

  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <ConversationDetail
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        convId={convId}
        convType={convType}
        convName={convName}
        input={{
          ref: inputRef,
          props: {
            top,
            bottom,
            // onInputMention: (groupId: string) => {
            //   // todo : select group member.
            //   console.log('test:zuoyu:SelectSingleParticipant:', groupId);
            //   navigation.push('SelectSingleParticipant', {
            //     params: {
            //       groupId,
            //     },
            //   });
            // },
            onClickedCardMenu: () => {
              // todo: select contact. need contact list screen
              navigation.push('ShareContact', {
                params: {
                  convId,
                  convType,
                  convName,
                  operateType: 'share_card',
                },
              });
            },
          },
        }}
        list={{
          ref: listRef,
          props: {
            onClickedItem: (
              id: string,
              model: SystemMessageModel | TimeMessageModel | MessageModel
            ) => {
              console.log('onClickedItem', id, model);
              if (model.modelType !== 'message') {
                return;
              }
              const msgModel = model as MessageModel;
              if (msgModel.msg.body.type === ChatMessageType.IMAGE) {
                navigation.push('ImageMessagePreview', {
                  params: {
                    msgId: id,
                  },
                });
              } else if (msgModel.msg.body.type === ChatMessageType.VIDEO) {
                navigation.push('VideoMessagePreview', {
                  params: {
                    msgId: id,
                  },
                });
              }
            },
          },
        }}
        onBack={() => {
          // todo: maybe need update
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
