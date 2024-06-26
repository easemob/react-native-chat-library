import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter, Switch, Text, View } from 'react-native';
import {
  LanguageCode,
  useColors,
  useI18nContext,
  usePaletteContext,
  useThemeContext,
} from 'react-native-chat-uikit';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConfigScreen(props: Props) {
  const {} = props;
  const { style } = useThemeContext();
  const { currentLanguage } = useI18nContext();
  const [value, onValueChange] = React.useState(
    style === 'light' ? false : true
  );
  const [language, setLanguage] = React.useState<boolean>(
    currentLanguage() === 'en' ? true : false
  );
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    text: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  return (
    <View style={{ flex: 1, backgroundColor: getColor('bg') }}>
      <View>
        <Text style={{ color: getColor('text') }}>
          {'Click the switch button to switch themes.'}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={(v) => {
          onValueChange(v);
          DeviceEventEmitter.emit(
            '_demo_emit_app_theme',
            value === true ? 'light' : 'dark'
          );
        }}
      />
      <View>
        <Text style={{ color: getColor('text') }}>
          {'Click the switch button to switch language.'}
        </Text>
      </View>
      <Switch
        value={language}
        onValueChange={(v) => {
          setLanguage(v);
          DeviceEventEmitter.emit(
            '_demo_emit_app_language',
            language === false
              ? ('en' as LanguageCode)
              : ('zh-Hans' as LanguageCode)
          );
        }}
      />
    </View>
  );
}
