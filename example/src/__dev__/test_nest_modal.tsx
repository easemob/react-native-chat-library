import * as React from 'react';
import { Pressable, View } from 'react-native';
import {
  FragmentContainer,
  useBottomSheet,
  useThemeContext,
} from 'react-native-chat-uikit';

const Content = ({
  name,
  width,
  height,
  bgColor,
  time,
}: {
  name: string;
  width: number;
  height: number;
  bgColor: string;
  time: number;
}) => {
  const sheet = useBottomSheet();
  const theme = useThemeContext();

  const openSheet = React.useCallback(() => {
    console.log('test:openSheet:', name);
    sheet.openSheet({
      sheetItems: [
        {
          icon: 'loading',
          iconColor: theme.colors.primary,
          title: name,
          titleColor: 'black',
          onPress: () => {
            console.log('test:onPress:data:');
          },
        },
      ],
    });
  }, [name, sheet, theme.colors.primary]);

  const onPress = React.useCallback(() => {
    console.log('test:onPress:', name);
    openSheet();
  }, [name, openSheet]);

  React.useEffect(() => {
    console.log('test:load:', name);
    const sub = setTimeout(openSheet, time);
    return () => {
      console.log('test:unload:', name);
      clearTimeout(sub);
    };
  }, [name, openSheet, time]);

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          width: width,
          height: height,
          backgroundColor: bgColor,
          position: 'absolute',
        }}
      />
    </Pressable>
  );
};

const OuterModal = ({ children }: { children?: React.ReactNode }) => {
  console.log('test:OuterModal:');
  const name = OuterModal.name;
  return (
    <FragmentContainer>
      <Content
        name={name}
        width={200}
        height={200}
        bgColor="blue"
        time={5000}
      />
      {children}
    </FragmentContainer>
  );
};
const InterModal = () => {
  const name = InterModal.name;
  return (
    <FragmentContainer>
      <Content
        name={name}
        width={100}
        height={100}
        bgColor="green"
        time={10000}
      />
    </FragmentContainer>
  );
};

const InterModal2 = () => {
  const name = InterModal.name;
  return (
    <Content
      name={name}
      width={100}
      height={100}
      bgColor="green"
      time={10000}
    />
  );
};

export default function TestNestModal() {
  React.useEffect(() => {}, []);

  const [testSort] = React.useState('2');

  return (
    <View style={{ marginTop: 100 }}>
      {testSort === '1' ? (
        <OuterModal>
          <InterModal />
        </OuterModal>
      ) : testSort === '2' ? (
        <OuterModal>
          <InterModal2 />
        </OuterModal>
      ) : null}
    </View>
  );
}
