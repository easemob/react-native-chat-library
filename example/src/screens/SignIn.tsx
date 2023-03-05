import { StackActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  DeviceEventEmitter,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  autoFocus,
  createStyleSheet,
  getScaleFactor,
  LoadingButton,
  LocalIcon,
  TextInput,
  useChatSdkContext,
  useHeaderContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppI18nContext } from '../contexts/AppI18nContext';
import { AppEvent, AppEventType } from '../events';
import { useStyleSheet } from '../hooks/useStyleSheet';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

export default function SignInScreen({
  route,
  navigation,
}: Props): JSX.Element {
  const rp = route.params as any;
  const params = rp?.params as any;
  const accountType = params.accountType as 'agora' | 'easemob';
  const gid = params.id;
  const gps = params.pass;
  const sf = getScaleFactor();
  const enableKeyboardAvoid = true;
  const { defaultStatusBarTranslucent: statusBarTranslucent } =
    useHeaderContext();
  const { login } = useAppI18nContext();
  const [id, setId] = React.useState(gid);
  const [tip, setTip] = React.useState('');
  const [password, setPassword] = React.useState(gps);
  const [disabled, setDisabled] = React.useState(
    id.length > 0 && password.length > 0 ? false : true
  );
  const [buttonState, setButtonState] = React.useState<'loading' | 'stop'>(
    'stop'
  );
  const { client, login: loginAction } = useChatSdkContext();
  console.log('test:SignInScreen:', params);

  React.useEffect(() => {
    if (id.length > 0 && password.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [id, password]);

  const execLogin = (state: 'loading' | 'stop') => {
    if (state === 'loading') {
      return;
    }
    setButtonState('loading');
    loginAction({
      id: id,
      pass: password,
      type: accountType,
      onResult: (result) => {
        if (result.result === true) {
          console.log('test:login:success');
          setButtonState('stop');
          DeviceEventEmitter.emit(AppEvent, {
            type: 'on_logined' as AppEventType,
            params: {},
          });
          navigation.dispatch(StackActions.push('Home', { params: {} }));
        } else {
          console.warn('test:login:fail:', result.error);
          setButtonState('stop');
          if (result.error.code === 200) {
            DeviceEventEmitter.emit(AppEvent, {
              type: 'on_logined' as AppEventType,
              params: {},
            });
            navigation.dispatch(StackActions.push('Home', { params: {} }));
          } else {
            setTip(result.error.description);
            // toast.showToast('Login Failed');
          }
        }
      },
    });
  };

  const addListeners = React.useCallback(() => {
    return () => {};
  }, []);

  React.useEffect(() => {
    const load = () => {
      console.log('test:load:', SignInScreen.name);
      const unsubscribe = addListeners();
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', SignInScreen.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners, client]);

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
        keyboardVerticalOffset={
          enableKeyboardAvoid && statusBarTranslucent ? sf(80) : 0
        }
        pointerEvents="box-none"
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View>
            <View style={styles.space} />
            <View>
              <LocalIcon
                name="login_icon"
                size={sf(250)}
                style={{ borderRadius: 0 }}
              />
            </View>
            <View
              style={[styles.errorTip, { opacity: tip.length > 0 ? 1 : 0 }]}
            >
              <LocalIcon name="loginFail" size={sf(14)} />
              <Text style={styles.comment}>{tip}</Text>
            </View>
            <TextInput
              autoFocus={autoFocus()}
              multiline={false}
              placeholder={login.id}
              clearButtonMode="while-editing"
              onChangeText={(text) => setId(text)}
              style={styles.item}
              value={id}
            />
            <View style={{ height: sf(18) }} />
            <TextInput
              autoFocus={autoFocus()}
              multiline={false}
              placeholder={login.pass}
              textContentType="password"
              visible-password={false}
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              style={styles.item}
              value={password}
            />
            <View style={{ height: sf(18) }} />
            <LoadingButton
              disabled={disabled}
              content={login.button}
              style={styles.button}
              state={buttonState}
              onChangeState={(state) => {
                console.log('test:state:', state);
                execLogin(state);
              }}
            />
            <View style={styles.tr}>
              <Text style={styles.tip}>{login.tip}</Text>
              <Text
                style={styles.register}
                onPress={() => {
                  navigation.push('SignUp', {
                    params: { accountType: accountType },
                  });
                }}
              >
                {login.register}
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
    justifyContent: 'center',
    flexDirection: 'row',
  },
  tip: {
    color: 'rgba(153, 153, 153, 1)',
  },
  register: {
    paddingLeft: 10,
    color: 'rgba(17, 78, 255, 1)',
    fontWeight: '600',
  },
  errorTip: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 18,
  },
  comment: {
    marginLeft: 5,
  },
});
