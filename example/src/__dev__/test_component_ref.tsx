import * as React from 'react';
import { TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';

type MyComponentRef = {
  getValue: () => string;
};
type MyComponentProps = {
  propsRef: React.RefObject<MyComponentRef>;
};
const MyComponent = (
  props: MyComponentProps,
  forwardedRef: React.ForwardedRef<MyComponentRef>
) => {
  const value = React.useRef('');

  const getValue = () => value.current;

  React.useImperativeHandle(
    forwardedRef,
    () => ({
      getValue: getValue,
    }),
    []
  );

  if (props.propsRef.current) {
    props.propsRef.current.getValue = getValue;
  }

  return (
    <View>
      <TextInput
        style={{
          paddingLeft: 20,
          width: 200,
          height: 40,
          backgroundColor: 'green',
        }}
        onChangeText={(text) => {
          console.log(text);
          value.current = text;
        }}
      />
    </View>
  );
};

const MyComponentForward = React.forwardRef<MyComponentRef, MyComponentProps>(
  MyComponent
);

export default function TestComponentRef() {
  const propsRef = React.useRef<MyComponentRef>({} as any);
  const forwardedRef = React.useRef<MyComponentRef>({} as any);

  return (
    <View style={{ marginTop: 100 }}>
      <View>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            console.log('propsRef:', propsRef.current.getValue());
            console.log('forwardedRef:', forwardedRef.current.getValue());
          }}
        >
          change icon
        </Button>
      </View>
      <MyComponentForward propsRef={propsRef} ref={forwardedRef} />
    </View>
  );
}
