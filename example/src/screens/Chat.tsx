import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter, Text, View } from 'react-native';
import {
  type DefaultMessageBubbleListProps,
  ChatFragment,
  DefaultMessageBubbleList,
  FragmentContainer,
  getScaleFactor,
  LocalIcon,
  ScreenContainer,
  Services,
  useAlert,
  useBottomSheet,
  useContentStateContext,
  useThemeContext,
  useToastContext,
} from 'react-native-chat-uikit';

import { useAppI18nContext } from '../contexts/AppI18nContext';
import { type AlertEvent, type ChatEventType, ChatEvent } from '../events';
import type { RootParamsList, RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

type NavigationProp = NativeStackNavigationProp<
  RootScreenParamsList<RootParamsList, 'option'>,
  'Chat',
  undefined
>;

const InvisiblePlaceholder = React.memo(() => {
  console.log('test:InvisiblePlaceholder:');
  const sheet = useBottomSheet();
  const toast = useToastContext();
  const alert = useAlert();
  const { groupInfo, chat } = useAppI18nContext();
  const theme = useThemeContext();
  const sf = getScaleFactor();
  const state = useContentStateContext();
  const ms = Services.ms;

  const navigation = useNavigation<NavigationProp>();

  React.useEffect(() => {
    console.log('test:load:InvisiblePlaceholder:');
    const sub = DeviceEventEmitter.addListener(ChatEvent, (event) => {
      // console.log('test:ChatEvent:Chat:', event);
      switch (event.type as ChatEventType) {
        case 'enable_voice':
          {
            const eventParams = event.params;
            const eventType = eventParams.type as AlertEvent;
            console.log('test:state:', eventParams, eventType);
            state.showState({
              children: (
                <View
                  style={{
                    height: sf(100),
                    width: sf(161),
                    borderRadius: sf(16),
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <LocalIcon name="mic" size={sf(40)} />
                    <LocalIcon name="volume8" size={sf(40)} />
                  </View>
                  <Text style={{ color: 'white' }}>{chat.voiceState}</Text>
                </View>
              ),
            });
          }
          break;
        case 'disable_voice':
          {
            const eventParams = event.params;
            const eventType = eventParams.type as AlertEvent;
            console.log('test:state:', eventParams, eventType);
            state.hideState();
          }
          break;
        case 'open_input_extension':
          {
            const eventParams = event.params;
            console.log('test:state:', eventParams);
            sheet.openSheet({
              sheetItems: [
                {
                  iconColor: theme.colors.primary,
                  title: 'Camera',
                  titleColor: 'black',
                  onPress: () => {
                    ms.openCamera({})
                      .then((result) => {
                        console.log('test:result:', result);
                      })
                      .catch((error) => {
                        console.warn('error:', error);
                      });
                  },
                },
                {
                  iconColor: theme.colors.primary,
                  title: 'Album',
                  titleColor: 'black',
                  onPress: () => {
                    ms.openMediaLibrary({ selectionLimit: 1 })
                      .then((result) => {
                        console.log('test:result:', result);
                      })
                      .catch((error) => {
                        console.warn('error:', error);
                      });
                  },
                },
                {
                  iconColor: theme.colors.primary,
                  title: 'Files',
                  titleColor: 'black',
                  onPress: () => {
                    ms.openDocument({})
                      .then((result) => {
                        console.log('test:result:', result);
                      })
                      .catch((error) => {
                        console.warn('error:', error);
                      });
                  },
                },
              ],
            });
          }
          break;
        default:
          break;
      }
    });
    return () => {
      console.log('test:unload:InvisiblePlaceholder:');
      sub.remove();
    };
  }, [
    toast,
    sheet,
    alert,
    groupInfo.inviteAlert.title,
    groupInfo.inviteAlert.message,
    groupInfo.inviteAlert.cancelButton,
    groupInfo.inviteAlert.confirmButton,
    groupInfo.toast,
    groupInfo.memberSheet.add,
    groupInfo.memberSheet.remove,
    groupInfo.memberSheet.chat,
    navigation,
    theme.colors.primary,
    sf,
    state,
    chat.voiceState,
    ms,
  ]);

  return <></>;
});

export default function ChatScreen({ route, navigation }: Props): JSX.Element {
  console.log('test:ChatScreen:');
  const rp = route.params as any;
  const params = rp?.params as { chatId: string; chatType: number };
  const chatId = params.chatId;
  const messageBubbleListRefP =
    React.useRef<typeof DefaultMessageBubbleList>(null);

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: chatId,
    });
  }, [chatId, navigation]);

  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={route.params}
        messageBubbleList={{
          MessageBubbleListP: DefaultMessageBubbleList,
          MessageBubbleListPropsP: {
            onPressed: () => {
              console.log('test:onPressed:MessageBubbleListPropsP:');
            },
          } as DefaultMessageBubbleListProps,
          MessageBubbleListRefP: messageBubbleListRefP as any,
        }}
        onFace={() => {
          console.log('test:onFace:111:');
        }}
      />
      <FragmentContainer>
        <InvisiblePlaceholder />
      </FragmentContainer>
    </ScreenContainer>
  );
}
