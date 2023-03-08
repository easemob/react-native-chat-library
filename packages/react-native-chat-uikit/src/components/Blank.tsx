import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { ICON_ASSETS } from '../../assets/icons';
import createStyleSheet from '../styles/createStyleSheet';
import Image from './Image';

type Props = {
  style?: StyleProp<ViewStyle> | undefined;
};
export default function Blank(props: Props): JSX.Element {
  return (
    <View style={[styles.container, props.style]}>
      <Image
        style={styles.image}
        // source={{
        //   uri: 'https://t4.focus-img.cn/sh740wsh/zx/duplication/9aec104f-1380-4425-a5c6-bc03000c4332.JPEG',
        // }}
        source={ICON_ASSETS['empty']('2x') as number}
        onLoad={() => {
          console.log('test:Image:onLoad:');
        }}
        onError={(event) => {
          console.log('test:Image:onError:', event);
        }}
      />
    </View>
  );
}

const styles = createStyleSheet({
  image: {
    width: 198,
    height: 115,
  },
  container: {
    flex: 1,
    // color: 'rgba(153, 153, 153, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
