import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

const Content = ({
  name,
  width,
  height,
  bgColor,
}: {
  name: string;
  width: number;
  height: number;
  bgColor: string;
}) => {
  return (
    <Pressable>
      <View
        style={{
          width: width,
          height: height,
          backgroundColor: bgColor,
        }}
      >
        <Text>{name}</Text>
      </View>
    </Pressable>
  );
};

const Brother1 = () => {
  console.log('test:Brother1:');
  return (
    <Content width={100} height={100} bgColor="blue" name={Brother1.name} />
  );
};
const Brother2 = React.memo(() => {
  console.log('test:Brother2:');
  return (
    <Content width={100} height={100} bgColor="green" name={Brother2.name} />
  );
});

export default function TestMemo() {
  console.log('test:TestMemo:');
  const [count, setCount] = React.useState(1);

  return (
    <View style={{ marginTop: 100 }}>
      <Button
        onPress={() => {
          setCount(count + 1);
        }}
      >
        ++count
      </Button>
      <Brother1 />
      <Brother2 />
      <Text>{count}</Text>
    </View>
  );
}
