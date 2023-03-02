import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  autoFocus,
  Button,
  createStyleSheet,
  defaultScaleFactor as scaleFactor,
  getScaleFactor,
  LocalIcon,
  TextInput,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppI18nContext } from '../contexts/AppI18nContext';
import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
import { useStyleSheet } from '../hooks/useStyleSheet';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

export default function SignUpScreen({
  route,
  navigation,
}: Props): JSX.Element {
  const rp = route.params as any;
  const params = rp?.params as any;
  const accountType = params.accountType as 'agora' | 'easemob';
  const sf = getScaleFactor();
  const enableKeyboardAvoid = true;
  const { register } = useAppI18nContext();

  const [id, setId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [disabled, setDisabled] = React.useState(true);
  const [tip] = React.useState('');
  const { client } = useAppChatSdkContext();

  React.useEffect(() => {
    if (id.length > 0 && password.length > 0 && confirm.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [confirm.length, id.length, password.length]);

  const execRegister = React.useCallback(() => {
    if (accountType === 'easemob') {
      client
        .createAccount(id, password)
        .then((result) => {
          console.log('test:execRegister:success:', result);
          navigation.goBack();
        })
        .catch((error) => {
          console.warn('test:execRegister:error', error);
        });
    } else {
      console.warn('test:', 'Please use the console to register.');
    }
  }, [accountType, client, id, navigation, password]);

  return (
    <SafeAreaView
      mode="padding"
      style={useStyleSheet().safe}
      edges={['right', 'left', 'bottom']}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        enabled={enableKeyboardAvoid}
        behavior={Platform.select({ ios: 'padding', default: 'height' })}
        pointerEvents="box-none"
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View>
            <View style={styles.space} />
            <View style={styles.logo}>
              <LocalIcon
                name="register_icon"
                size={sf(250)}
                style={{ borderRadius: 0 }}
              />
            </View>
            <View style={[styles.tip, { opacity: tip.length > 0 ? 1 : 0 }]}>
              <LocalIcon name="loginFail" size={scaleFactor(14)} />
              <Text style={styles.comment}>{tip}</Text>
            </View>
            <TextInput
              autoFocus={autoFocus()}
              multiline={false}
              placeholder={register.id}
              clearButtonMode="while-editing"
              onChangeText={(text) => setId(text)}
              style={styles.item}
            />
            <View style={{ height: sf(18) }} />
            <TextInput
              autoFocus={autoFocus()}
              multiline={false}
              placeholder={register.pass}
              textContentType="password"
              visible-password={false}
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              style={styles.item}
            />
            <View style={{ height: sf(18) }} />
            <TextInput
              autoFocus={autoFocus()}
              multiline={false}
              placeholder={register.confirm}
              textContentType="password"
              visible-password={false}
              secureTextEntry
              onChangeText={(text) => setConfirm(text)}
              style={styles.item}
            />
            <View style={{ height: sf(18) }} />
            <Button
              disabled={disabled}
              style={styles.button}
              onPress={() => {
                execRegister();
                // if (password !== confirm) {
                //   setTip(register.comment(1));
                // } else if (password === '1') {
                //   Keyboard.dismiss();
                //   openAlert({
                //     title: register.comment(5),
                //     buttons: [
                //       {
                //         text: login.button,
                //         onPress: () => {
                //           navigation.goBack();
                //         },
                //       },
                //     ],
                //   });
                // }
              }}
            >
              {register.button}
            </Button>
            <View style={styles.tr}>
              <Text
                style={styles.register}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                {register.back}
              </Text>
            </View>
            <View style={styles.space} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = createStyleSheet({
  space: {
    flexGrow: 1,
    flexShrink: 1,
  },
  logo: {
    marginBottom: -8,
  },
  tip: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 18,
  },
  comment: {
    marginLeft: 5,
  },
  item: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 20,
  },
  button: {
    height: 48,
    borderRadius: 24,
    marginBottom: 31,
  },
  tr: {
    alignItems: 'center',
  },
  register: {
    paddingLeft: 10,
    color: 'rgba(17, 78, 255, 1)',
    fontWeight: '600',
  },
});
