import * as React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function TestData() {
  console.log('test:TestData');
  const [value, setValue] = React.useState('');

  React.useEffect(() => {}, []);

  const MemoView = React.memo(({ value }: { value: string }) => {
    return (
      <View style={{ height: 100, width: 100, backgroundColor: 'green' }}>
        <Text>{value}</Text>
      </View>
    );
  });

  const CommonView = ({ value }: { value: string }) => {
    return (
      <View style={{ height: 100, width: 100, backgroundColor: 'green' }}>
        <Text>{value}</Text>
      </View>
    );
  };

  const testInvoke = React.useCallback(() => {
    console.log('test:value:', value);
  }, [value]);

  return (
    <View style={{ marginTop: 100 }}>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            setValue('sdf');
            testInvoke();
          }}
        >
          change icon
        </Button>
      </View>
      <MemoView value={value} />
      <CommonView value={value} />
    </View>
  );
}
