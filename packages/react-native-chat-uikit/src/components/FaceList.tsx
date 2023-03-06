import * as React from 'react';
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moji from 'twemoji';

import { FACE_ASSETS } from '../../assets/faces';
import { getScaleFactor } from '../styles/createScaleFactor';
import createStyleSheet from '../styles/createStyleSheet';

type FaceListProps = {
  height: Animated.Value;
  onFace?: (face: string) => void;
};

export const FaceList = React.memo(
  (props: FaceListProps) => {
    const { height } = props;
    const sf = getScaleFactor();
    const arr = FACE_ASSETS;
    return (
      <Animated.View style={{ height: height }}>
        <ScrollView>
          <View style={styles.faceContainer}>
            {arr.map((face) => {
              return (
                <TouchableOpacity
                  key={face}
                  style={{ padding: sf(5) }}
                  onPress={() => {
                    props.onFace?.(face);
                  }}
                >
                  <Text style={{ fontSize: sf(32) }}>
                    {moji.convert.fromCodePoint(face)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>
    );
  },
  () => {
    return true;
  }
);

const styles = createStyleSheet({
  faceContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-evenly',
  },
});
