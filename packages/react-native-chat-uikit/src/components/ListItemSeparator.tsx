import * as React from 'react';
import { View } from 'react-native';

import createStyleSheet from '../styles/createStyleSheet';
import Divider from './Divider';

export const ListItemSeparator = () => {
  return (
    <View>
      <Divider color={styles.divider.color} height={styles.divider.height} />
    </View>
  );
};

const styles = createStyleSheet({
  divider: {
    color: 'rgba(153, 153, 153, 1)',
    height: 0.25,
    marginLeft: 100,
  },
});
