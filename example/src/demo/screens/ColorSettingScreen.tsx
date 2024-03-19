import { default as Slider } from '@react-native-community/slider';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import {
  Icon,
  SingleLineText,
  Text,
  TopNavigationBar,
  useColors,
  useI18nContext,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGeneralSetting } from '../common/useGeneralSetting';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ColorSettingScreen(props: Props) {
  const { navigation } = props;
  // todo: save to user info.
  //   const remark = ((route.params as any)?.params as any)?.remark;
  //   const avatar = ((route.params as any)?.params as any)?.avatar;
  //   const from = ((route.params as any)?.params as any)?.from;
  //   const hash = ((route.params as any)?.params as any)?.hash;
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    bg2: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
    t1: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    fg: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    enable: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    disable: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
  const {
    appPrimaryColor,
    onSetAppPrimaryColor,
    appErrorColor,
    appNeutralSColor,
    appSecondColor,
    appNeutralColor,
    onSetAppErrorColor,
    onSetAppSecondColor,
    onSetAppNeutralColor,
    onSetAppNeutralSColor,
  } = useGeneralSetting();
  const [changed, setChanged] = React.useState(false);
  const [priColor, setPriColor] = React.useState(appPrimaryColor);
  const [errorColor, setErrorColor] = React.useState(appErrorColor);
  const [secondColor, setSecondColor] = React.useState(appSecondColor);
  const [neutralColor, setNeutralColor] = React.useState(appNeutralColor);
  const [neutralSColor, setNeutralSColor] = React.useState(appNeutralSColor);

  const onBack = () => {
    navigation.goBack();
  };
  const onConfirm = () => {
    onSetAppPrimaryColor(priColor);
    onSetAppErrorColor(errorColor);
    onSetAppSecondColor(secondColor);
    onSetAppNeutralColor(neutralColor);
    onSetAppNeutralSColor(neutralSColor);
    navigation.navigate('CommonSetting', {
      params: {
        from: 'ColorSetting',
        hash: Date.now(),
      },
    });
  };
  const onChanged = () => {
    setChanged(true);
  };

  const onSetPriColor = (v: number) => {
    setPriColor(v);
    onChanged();
  };
  const onSetErrorColor = (v: number) => {
    setErrorColor(v);
    onChanged();
  };
  const onSetSecondColor = (v: number) => {
    setSecondColor(v);
    onChanged();
  };
  const onSetNeutralColor = (v: number) => {
    setNeutralColor(v);
    onChanged();
  };
  const onSetNeutralSColor = (v: number) => {
    setNeutralSColor(v);
    onChanged();
  };

  React.useEffect(() => {
    setPriColor(appPrimaryColor);
  }, [appPrimaryColor]);
  React.useEffect(() => {
    setErrorColor(appErrorColor);
  }, [appErrorColor]);
  React.useEffect(() => {
    setSecondColor(appSecondColor);
  }, [appSecondColor]);
  React.useEffect(() => {
    setNeutralColor(appNeutralColor);
  }, [appNeutralColor]);
  React.useEffect(() => {
    setNeutralSColor(appNeutralSColor);
  }, [appNeutralSColor]);

  return (
    <View
      style={{
        backgroundColor: getColor('bg'),
        // justifyContent: 'center',
        // alignItems: 'center',
        flex: 1,
      }}
    >
      <SafeAreaView
        style={{
          // backgroundColor: getColor('bg'),
          flex: 1,
        }}
      >
        <TopNavigationBar
          containerStyle={{ backgroundColor: undefined }}
          Left={
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 44,
              }}
              onPress={onBack}
            >
              <Icon
                name={'chevron_left'}
                style={{ width: 24, height: 24, tintColor: getColor('icon') }}
              />
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{
                  color: getColor('t1'),
                }}
              >
                {tr('_demo_language_setting_navi_title')}
              </Text>
            </Pressable>
          }
          Right={
            <Pressable
              onPress={onConfirm}
              style={{ paddingHorizontal: 8 }}
              disabled={changed ? false : true}
            >
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={{
                  color: getColor(changed ? 'enable' : 'disable'),
                }}
              >
                {tr('_demo_language_setting_navi_confim')}
              </Text>
            </Pressable>
          }
        />

        <View
          style={{
            backgroundColor: getColor('bg2'),
            justifyContent: 'center',
            paddingHorizontal: 16,
            height: 44,
          }}
        >
          <SingleLineText
            style={{
              color: getColor('disable'),
            }}
            paletteType={'title'}
            textType={'small'}
          >
            {tr('_demo_color_setting_primary')}
          </SingleLineText>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            backgroundColor: getColor('bg'),
          }}
        >
          <ColorSetting
            valueType={'primary'}
            value={priColor}
            onValueChange={onSetPriColor}
          />
        </View>

        <View
          style={{
            backgroundColor: getColor('bg2'),
            justifyContent: 'center',
            paddingHorizontal: 16,
            height: 44,
          }}
        >
          <SingleLineText
            style={{
              color: getColor('disable'),
            }}
            paletteType={'title'}
            textType={'small'}
          >
            {tr('_demo_color_setting_second')}
          </SingleLineText>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            backgroundColor: getColor('bg'),
          }}
        >
          <ColorSetting
            valueType={'second'}
            value={secondColor}
            onValueChange={onSetSecondColor}
          />
        </View>

        <View
          style={{
            backgroundColor: getColor('bg2'),
            justifyContent: 'center',
            paddingHorizontal: 16,
            height: 44,
          }}
        >
          <SingleLineText
            style={{
              color: getColor('disable'),
            }}
            paletteType={'title'}
            textType={'small'}
          >
            {tr('_demo_color_setting_error')}
          </SingleLineText>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            backgroundColor: getColor('bg'),
          }}
        >
          <ColorSetting
            valueType={'error'}
            value={errorColor}
            onValueChange={onSetErrorColor}
          />
        </View>

        <View
          style={{
            backgroundColor: getColor('bg2'),
            justifyContent: 'center',
            paddingHorizontal: 16,
            height: 44,
          }}
        >
          <SingleLineText
            style={{
              color: getColor('disable'),
            }}
            paletteType={'title'}
            textType={'small'}
          >
            {tr('_demo_color_setting_neutral')}
          </SingleLineText>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            backgroundColor: getColor('bg'),
          }}
        >
          <ColorSetting
            valueType={'neutral'}
            value={neutralColor}
            onValueChange={onSetNeutralColor}
          />
        </View>

        <View
          style={{
            backgroundColor: getColor('bg2'),
            justifyContent: 'center',
            paddingHorizontal: 16,
            height: 44,
          }}
        >
          <SingleLineText
            style={{
              color: getColor('disable'),
            }}
            paletteType={'title'}
            textType={'small'}
          >
            {tr('_demo_color_setting_neutralS')}
          </SingleLineText>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            backgroundColor: getColor('bg'),
          }}
        >
          <ColorSetting
            valueType={'neutralS'}
            value={neutralSColor}
            onValueChange={onSetNeutralSColor}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

type ColorSettingProps = {
  value: number;
  onValueChange: (value: number) => void;
  valueType: 'primary' | 'second' | 'error' | 'neutral' | 'neutralS';
};
function ColorSetting(props: ColorSettingProps) {
  const { value, onValueChange, valueType } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    bg1: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    bg2: {
      light: colors.neutral[9],
      dark: colors.neutral[7],
    },
    border: {
      light: colors.neutral[7],
      dark: colors.neutral[5],
    },
    v: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
  // const [value, setValue] = React.useState<number>(0);
  const [color, setColor] = React.useState<string>('hsla(203, 100%, 50%, 1)');

  const getInitColor = React.useCallback(() => {
    if (valueType === 'primary') {
      return `hsla(203, 100%, 50%, 1)`;
    } else if (valueType === 'second') {
      return `hsla(155, 100%, 50%, 1)`;
    } else if (valueType === 'error') {
      return `hsla(350, 100%, 50%, 1)`;
    } else if (valueType === 'neutral') {
      return `hsla(203, 8%, 50%, 1)`;
    } else if (valueType === 'neutralS') {
      return `hsla(220, 36%, 50%, 1)`;
    }
    return 'hsla(203, 100%, 50%, 1)';
  }, [valueType]);

  React.useEffect(() => {
    setColor(getInitColor());
  }, [getInitColor]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          padding: 2,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: getColor('border'),
        }}
      >
        <View
          style={{
            width: 24,
            height: 24,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
      </View>
      <View style={{ width: 12 }} />
      <Slider
        minimumValue={0}
        maximumValue={360}
        step={1}
        minimumTrackTintColor={getColor('bg1') as string}
        value={value}
        style={{
          height: 4,
          // width: '80%',
          flexGrow: 1,
        }}
        onValueChange={(value) => {
          onValueChange(value);
          console.log('value', value);
          setColor(`hsla(${value}, 100%, 50%, 1)`);
        }}
      />
      <View style={{ width: 10 }} />
      <View
        style={{
          width: 30,
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <SingleLineText style={{ color: getColor('v') }}>
          {value}
        </SingleLineText>
      </View>
    </View>
  );
}
