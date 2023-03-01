import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import {
  createStyleSheet,
  Image,
  LocalIcon,
  timestamp,
} from 'react-native-chat-uikit';
// import {
//   GestureEvent,
//   NativeViewGestureHandlerPayload,
//   ScrollView,
// } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStyleSheet } from '../hooks/useStyleSheet';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList, 'ImagePreview'>;

type ImagePreviewProps = {
  url: string;
  width: number;
  height: number;
};
const ImagePreview = React.memo((props: ImagePreviewProps) => {
  const { width: initWidth, height: initHeight, url } = props;
  const [_width, setWidth] = React.useState(initWidth);
  const [_height, setHeight] = React.useState(initHeight);
  const originalWidth = React.useRef(0);
  const originalHeight = React.useRef(0);
  const horizontal = true;
  const startTimestamp = React.useRef(0);
  const onTouchEnd = () => {
    const currentTimestamp = timestamp();
    if (currentTimestamp < startTimestamp.current) {
      console.log('test:startTimestamp:timeout:no');
      startTimestamp.current = 0;
      setWidth(
        _width === originalWidth.current ? initWidth : originalWidth.current
      );
      setHeight(
        _height === originalHeight.current ? initHeight : originalHeight.current
      );
    } else {
      if (startTimestamp.current === 0) {
        console.log('test:startTimestamp:first');
      } else {
        console.log('test:startTimestamp:timeout:yes');
      }
      startTimestamp.current = timestamp() + 500;
    }
  };

  return (
    <ScrollView style={styles.container} onTouchEnd={onTouchEnd}>
      <ScrollView style={styles.container} horizontal={horizontal}>
        <View>
          <Image
            source={{
              // uri: 'https://pic.3gbizhi.com/2014/0506/20140506021229508.jpg',
              uri: url,
            }}
            resizeMode="contain"
            style={{ height: _height, width: _width }}
            onLoad={(e) => {
              console.log(e);
              originalWidth.current = e.width;
              originalHeight.current = e.height;
            }}
            onError={(e) => {
              console.log(e);
            }}
          />
        </View>
      </ScrollView>
    </ScrollView>
  );
});

export default function ImagePreviewScreen({
  navigation,
  route,
}: Props): JSX.Element {
  const rp = route.params as any;
  const params = rp?.params as any;
  const url = params.url;
  const { width, height } = useWindowDimensions();
  const addListeners = React.useCallback(() => {
    return () => {};
  }, []);

  const initImage = React.useCallback(() => {}, []);

  React.useEffect(() => {
    console.log('test:useEffect:', addListeners, initImage);
    const load = () => {
      console.log('test:load:', ImagePreviewScreen.name);
      const unsubscribe = addListeners();
      initImage();
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', ImagePreviewScreen.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners, initImage]);

  return (
    <SafeAreaView
      mode="padding"
      style={useStyleSheet().safe}
      edges={['top', 'right', 'left']}
    >
      <ImagePreview width={width} height={height} url={url} />
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
      >
        <LocalIcon
          style={{
            position: 'absolute',
            width: 40,
            height: 40,
            // top: -100,
            // left: 100,
            alignSelf: 'flex-start',
            top: -height + 44,
            left: 10,
          }}
          name="gray_goBack"
        />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = createStyleSheet({
  container: { flex: 1 },
  box: {},
});
