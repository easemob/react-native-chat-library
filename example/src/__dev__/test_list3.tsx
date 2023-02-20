import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView as RNSafeAreaView,
  StatusBar,
  Text,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import {
  autoFocus,
  Button,
  createStyleSheet,
  DefaultAvatar,
  EqualHeightList,
  EqualHeightListItemComponent,
  EqualHeightListItemData,
  EqualHeightListRef,
  getScaleFactor,
  ListHeaderProps,
  queueTask,
  SearchBar,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStyleSheet } from '../hooks/useStyleSheet';
import { COUNTRY } from './const';

export default function TestList2() {
  let count = 0;
  const ref = React.useRef<EqualHeightListRef>(null);

  return (
    <RNSafeAreaView style={styles.container}>
      <Button
        onPress={() => {
          const en = 'aaa';
          const v = en + count++;
          ref.current?.manualRefresh([
            {
              type: 'add',
              data: [
                {
                  en: v,
                  ch: v,
                  key: v,
                } as EqualHeightListItemData,
              ],
              enableSort: true,
            },
          ]);
        }}
      >
        sort add data
      </Button>
      <Button
        onPress={() => {
          const en = 'eee';
          const v = en + count++;
          ref.current?.manualRefresh([
            {
              type: 'add',
              data: [
                {
                  en: v,
                  ch: v,
                  key: v,
                } as EqualHeightListItemData,
              ],
              enableSort: false,
            },
          ]);
        }}
      >
        add data
      </Button>
      <Button
        onPress={() => {
          ref.current?.manualRefresh([
            {
              type: 'clear',
            },
          ]);
        }}
      >
        clear data
      </Button>
      <Button
        onPress={() => {
          const en = 'Angola';
          const v = en + count++;
          ref.current?.manualRefresh([
            {
              type: 'update',
              data: [
                {
                  en: en,
                  ch: v,
                  key: en,
                } as EqualHeightListItemData,
              ],
              enableSort: false,
            },
          ]);
        }}
      >
        update data
      </Button>
      <ContactListScreen />
    </RNSafeAreaView>
  );
}

type Props = {};

type ItemDataType = EqualHeightListItemData & {
  en: string;
  ch: string;
};

const Item: EqualHeightListItemComponent = (props) => {
  const sf = getScaleFactor();
  const item = props.data as ItemDataType;
  return (
    <View style={styles.item}>
      <DefaultAvatar size={sf(50)} radius={sf(25)} />
      <View style={styles.itemText}>
        <Text>{item.en}</Text>
        <Text>{item.ch}</Text>
      </View>
    </View>
  );
};
// const ItemSeparator = () => {
//   return (
//     <View
//       onLayout={(_) => {
//         // console.log('test:event:', event.nativeEvent.layout.height);
//       }}
//     >
//       <Divider color={styles.divider.color} height={styles.divider.height} />
//     </View>
//   );
// };

let count = 0;
export function ContactListScreen(_: Props): JSX.Element {
  // console.log('test:ContactListScreen:', route, navigation);
  // const theme = useThemeContext();
  // const { search } = useAppI18nContext();

  const listRef = React.useRef<EqualHeightListRef>(null);
  // const searchRef = React.useRef<RNTextInput>(null);
  // const [searchValue, setSearchValue] = React.useState('');
  // const [autoFocus, setAutoFocus] = React.useState(true);
  // const [enableValue, setEnableValue] = React.useState(true);
  const enableRefresh = true;
  const enableAlphabet = true;
  const enableHeader = true;
  // const enableCancel = false;
  // const enableClear = true;
  const enableKeyboardAvoid = true;
  // const autoFocus = true;
  const data: ItemDataType[] = [];
  const r = COUNTRY.map((value) => {
    const i = value.lastIndexOf(' ');
    const en = value.slice(0, i);
    const ch = value.slice(i + 1);
    return {
      key: en,
      en: en,
      ch: ch,
    } as ItemDataType;
  });
  data.push(...r);

  // // https://juejin.cn/post/7083466010505773093#3
  // // This function does not exist before react 18.
  // const useDeferredValue = (
  //   defer: number,
  //   f: (...args: any[]) => any,
  //   ...args: any[]
  // ) => {
  //   console.log('test:version:', React.version);

  //   const timeout = React.useRef<{
  //     timeoutId: NodeJS.Timeout;
  //     cur: number;
  //   }>();

  //   const _create = React.useCallback(
  //     (defer: number, f: (...args: any[]) => any, ...args: any[]) => {
  //       if (timeout.current === undefined) {
  //         timeout.current = {
  //           timeoutId: setTimeout(() => f(...args), defer),
  //           cur: new Date().getTime(),
  //         };
  //       }
  //     },
  //     []
  //   );
  //   const _cancel = React.useCallback((defer: number) => {
  //     if (timeout.current) {
  //       if (timeout.current.cur + defer < new Date().getTime()) {
  //         clearTimeout(timeout.current?.timeoutId);
  //         timeout.current = undefined;
  //       }
  //     }
  //   }, []);

  //   _cancel(defer);
  //   _create(defer, f, ...args);
  // };

  // const filter = (text: string) => {
  //   // console.log('test:filter:', text);
  //   // setAutoFocus(true);
  //   setSearchValue(text);
  //   // process.nextTick(() => {
  //   //   const r: ItemDataType[] = [];
  //   //   for (const item of data) {
  //   //     if (item.key.includes(text)) {
  //   //       r.push(item);
  //   //     }
  //   //   }
  //   //   listRef.current?.manualRefresh([
  //   //     {
  //   //       type: 'clear',
  //   //     },
  //   //     {
  //   //       type: 'add',
  //   //       data: r,
  //   //       enableSort: true,
  //   //     },
  //   //   ]);
  //   // });
  //   // asyncTask(() => {
  //   //   const r: ItemDataType[] = [];
  //   //   for (const item of data) {
  //   //     if (item.key.includes(text)) {
  //   //       r.push(item);
  //   //     }
  //   //   }
  //   //   listRef.current?.manualRefresh([
  //   //     {
  //   //       type: 'clear',
  //   //     },
  //   //     {
  //   //       type: 'add',
  //   //       data: r,
  //   //       enableSort: true,
  //   //     },
  //   //   ]);
  //   // });
  // };

  // const SearchHeader2 = () => {
  //   const listRef = React.useRef<EqualHeightListRef>(null);
  //   const searchRef = React.useRef<RNTextInput>(null);
  //   const [searchValue, setSearchValue] = React.useState('');
  //   // const [autoFocus, setAutoFocus] = React.useState(true);
  //   // const [enableValue, setEnableValue] = React.useState(true);
  //   // const enableRefresh = true;
  //   // const enableAlphabet = true;
  //   // const enableHeader = true;
  //   const enableCancel = false;
  //   const enableClear = true;
  //   // const enableKeyboardAvoid = true;
  //   const autoFocus = true;
  //   return (
  //     <View
  //       style={{
  //         backgroundColor: 'red',
  //         height: 36,
  //         marginBottom: 20,
  //         marginTop: 10,
  //         marginLeft: 20,
  //         marginRight: 20,
  //       }}
  //     >
  //       <SearchBar
  //         ref={searchRef}
  //         autoFocus={autoFocus}
  //         enableCancel={enableCancel}
  //         enableClear={enableClear}
  //         placeholder="{search.placeholder}"
  //         onChangeText={(text) => {
  //           console.log('test:SearchBar:onChangeText:', text);
  //           setSearchValue(text);
  //           queueTask(() => {
  //             const r: ItemDataType[] = [];
  //             for (const item of data) {
  //               if (item.key.includes(text)) {
  //                 r.push(item);
  //               }
  //             }
  //             listRef.current?.manualRefresh([
  //               {
  //                 type: 'clear',
  //               },
  //               {
  //                 type: 'add',
  //                 data: r,
  //                 enableSort: true,
  //               },
  //             ]);
  //           });
  //           // setEnableValue(true);
  //           // filter(text);
  //         }}
  //         value={searchValue}
  //         onClear={() => {
  //           console.log('test:onClear');
  //           // setEnableValue(true);
  //           setSearchValue('');
  //           // setAutoFocus(true);
  //           // if (searchRef.current?.blur) {
  //           //   asyncTask(searchRef.current.blur);
  //           // }
  //           // searchRef.current?.blur();
  //           // wait(500).then(() => {
  //           //   // console.log('test:500:');
  //           //   searchRef.current?.blur();
  //           // });
  //         }}
  //         onBlur={() => {
  //           // console.log('test:onBlur:', autoFocus);
  //           // setAutoFocus(false);
  //         }}
  //       />
  //     </View>
  //   );
  // };
  interface SearchHeader3Props extends ListHeaderProps {
    autoFocus: boolean;
    onChangeText?: (text: string) => void;
  }
  const SearchHeader3 = (props: SearchHeader3Props) => {
    // const listRef = React.useRef<EqualHeightListRef>(null);
    const searchRef = React.useRef<RNTextInput>(null);
    const [searchValue, setSearchValue] = React.useState('');
    // const [autoFocus, setAutoFocus] = React.useState(true);
    // const [enableValue, setEnableValue] = React.useState(true);
    // const enableRefresh = true;
    // const enableAlphabet = true;
    // const enableHeader = true;
    const enableCancel = false;
    const enableClear = true;
    // const enableKeyboardAvoid = true;
    // const autoFocus = true;
    // const autoFocus = props.autoFocus;
    return (
      <View
        style={{
          backgroundColor: 'red',
          height: 36,
          marginBottom: 20,
          marginTop: 10,
          marginLeft: 20,
          marginRight: 20,
        }}
      >
        <SearchBar
          ref={searchRef}
          autoFocus={autoFocus()}
          enableCancel={enableCancel}
          enableClear={enableClear}
          placeholder="{search.placeholder3}"
          onChangeText={(text) => {
            console.log('test:onChangeText:1:', text);
            setSearchValue(text);
            props.onChangeText?.(text);
            // setEnableValue(true);
            // filter(text);
          }}
          value={searchValue}
          onClear={() => {
            console.log('test:onClear');
            // setEnableValue(true);
            setSearchValue('');
            // setAutoFocus(true);
            // if (searchRef.current?.blur) {
            //   asyncTask(searchRef.current.blur);
            // }
            // searchRef.current?.blur();
            // wait(500).then(() => {
            //   // console.log('test:500:');
            //   searchRef.current?.blur();
            // });
          }}
          onBlur={() => {
            // console.log('test:onBlur:', autoFocus);
            // setAutoFocus(false);
          }}
        />
      </View>
    );
  };

  // const RenderSearchHeader = () => {
  //   return (
  //     <View
  //       style={{
  //         backgroundColor: 'red',
  //         height: 36,
  //         marginBottom: 20,
  //         marginTop: 10,
  //         marginLeft: 20,
  //         marginRight: 20,
  //       }}
  //     >
  //       <SearchBar
  //         ref={searchRef}
  //         autoFocus={autoFocus}
  //         enableCancel={enableCancel}
  //         enableClear={enableClear}
  //         placeholder={search.placeholder}
  //         onChangeText={(text) => {
  //           setEnableValue(true);
  //           filter(text);
  //         }}
  //         value={enableValue ? searchValue : undefined}
  //         onClear={() => {
  //           // console.log('test:onClear');
  //           setEnableValue(true);
  //           filter('');
  //           // setAutoFocus(true);
  //           // if (searchRef.current?.blur) {
  //           //   asyncTask(searchRef.current.blur);
  //           // }
  //           // searchRef.current?.blur();
  //           wait(0).then(() => {
  //             // console.log('test:500:');
  //             searchRef.current?.blur();
  //           });
  //         }}
  //         onBlur={() => {
  //           // console.log('test:onBlur:', autoFocus);
  //           // setAutoFocus(false);
  //         }}
  //       />
  //     </View>
  //   );
  // };

  // const SearchHeader = {
  //   Component: RenderSearchHeader,
  //   props: {
  //     backgroundColor: 'red',
  //     height: 36,
  //     marginBottom: 20,
  //     marginTop: 10,
  //     marginLeft: 20,
  //     marginRight: 20,
  //   },
  // };
  // const SearchHeaderS = {
  //   Component: SearchHeader2,
  //   props: {
  //     backgroundColor: 'red',
  //     height: 36,
  //     marginBottom: 20,
  //     marginTop: 10,
  //     marginLeft: 20,
  //     marginRight: 20,
  //   },
  // };

  return (
    <SafeAreaView
      mode="padding"
      style={useStyleSheet().safe}
      edges={['right', 'left', 'bottom']}
    >
      {/* {RenderSearchHeader()} */}

      <KeyboardAvoidingView
        style={{ backgroundColor: 'red', flex: 1 }}
        enabled={enableKeyboardAvoid}
        behavior={Platform.select({ ios: 'padding', default: 'height' })}
        keyboardVerticalOffset={enableKeyboardAvoid && 0}
        pointerEvents="box-none"
      >
        <EqualHeightList
          style={{
            flex: 1,
            backgroundColor: 'green',
            flexBasis: 521,
            height: 521,
          }}
          onLayout={(event) => {
            console.log(
              'test:EqualHeightList:',
              event.nativeEvent.layout.height
            );
          }}
          ref={listRef}
          items={data}
          ItemFC={Item}
          enableAlphabet={enableAlphabet}
          enableRefresh={enableRefresh}
          enableHeader={enableHeader}
          alphabet={{
            alphabetCurrent: {
              backgroundColor: 'orange',
              color: 'white',
            },
            alphabetItemContainer: {
              width: 15,
              borderRadius: 8,
            },
          }}
          // HeaderComponent={enableHeader === true ? SearchHeaderS : undefined}
          // Header={RenderSearchHeader} // error
          // Header={SearchHeader2} //ok
          Header={(props: ListHeaderProps) => (
            <SearchHeader3
              autoFocus={autoFocus()}
              onChangeText={(text) => {
                console.log('test:SearchHeader3:onChangeText:', Text);
                queueTask(() => {
                  const r: ItemDataType[] = [];
                  for (const item of data) {
                    if (item.key.includes(text)) {
                      r.push(item);
                    }
                  }
                  listRef.current?.manualRefresh([
                    {
                      type: 'clear',
                    },
                    {
                      type: 'add',
                      data: r,
                      enableSort: true,
                    },
                  ]);
                });
              }}
              {...props}
            />
          )}
          // ItemSeparatorComponent={ItemSeparator}
          onRefresh={(type) => {
            if (type === 'started') {
              const en = 'aaa';
              const v = en + count++;
              listRef.current?.manualRefresh([
                {
                  type: 'add',
                  data: [
                    {
                      en: v,
                      ch: v,
                      key: v,
                    } as EqualHeightListItemData,
                  ],
                  enableSort: true,
                },
              ]);
            }
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = createStyleSheet({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    // backgroundColor: 'red',
  },
  // item: {
  //   flex: 1,
  //   backgroundColor: '#f9c2ff',
  //   padding: 20,
  //   marginVertical: 8,
  //   marginHorizontal: 16,
  //   height: 80,
  // },
  item: {
    flex: 1,
    // backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 0,
    marginHorizontal: 0,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    marginLeft: 10,
  },
  divider: {
    color: 'rgba(153, 153, 153, 1)',
    height: 0.25,
    marginLeft: 100,
  },
});
