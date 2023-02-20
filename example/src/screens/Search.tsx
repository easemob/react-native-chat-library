import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { TextInput as RNTextInput, View } from 'react-native';
import {
  Blank,
  Button,
  createStyleSheet,
  DefaultAvatar,
  EqualHeightList,
  EqualHeightListItemComponent,
  EqualHeightListItemData,
  EqualHeightListRef,
  getScaleFactor,
  SearchBar,
  useToastContext,
} from 'react-native-chat-uikit';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COUNTRY } from '../__dev__/const';
import { ListItemSeparator } from '../components/ListItemSeparator';
import { useAppI18nContext } from '../contexts/AppI18nContext';
import { useStyleSheet } from '../hooks/useStyleSheet';
import type { RootScreenParamsList } from '../routes';
import type { SearchActionType, Undefinable } from '../types';

type Props = NativeStackScreenProps<RootScreenParamsList, 'Search'>;

type ItemDataType = EqualHeightListItemData & {
  en: string;
  ch: string;
  type?: Undefinable<SearchActionType>;
  action?: {
    addContact?: {
      state: 'noAdded' | 'hadAdded' | 'adding';
      onClicked?: () => void;
    };
    searchPublicGroup?: {
      state: 'noJoined' | 'hadJoined' | 'applying';
      onClicked?: () => void;
    };
  };
};

const Item: EqualHeightListItemComponent = (props) => {
  const sf = getScaleFactor();
  const item = props.data as ItemDataType;
  const toast = useToastContext();
  const { searchServer } = useAppI18nContext();

  const Right = (type: SearchActionType | undefined) => {
    switch (type) {
      case 'add_contact':
        return (
          <View style={styles.rightItem}>
            <Button
              disabled={item.action?.addContact?.state !== 'noAdded'}
              onPress={() => {
                item.action?.addContact?.onClicked?.();
                toast.showToast(searchServer.toast.contact[0]!);
              }}
              color={{ disabled: { content: 'black', background: '#F2F2F2' } }}
              font={styles.rightItemFont}
              style={styles.rightItemStyle}
            >
              {searchServer.contact.item.button(item.action?.addContact?.state)}
            </Button>
          </View>
        );
      case 'join_public_group':
        return (
          <View style={styles.rightItem}>
            <Button
              disabled={item.action?.searchPublicGroup?.state !== 'noJoined'}
              onPress={() => {
                item.action?.searchPublicGroup?.onClicked?.();
                toast.showToast(searchServer.toast.group[0]!);
              }}
              color={{ disabled: { content: 'black', background: '#F2F2F2' } }}
              font={styles.rightItemFont}
              style={styles.rightItemStyle}
            >
              {searchServer.group.item.button(
                item.action?.searchPublicGroup?.state
              )}
            </Button>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.item}>
      <DefaultAvatar size={sf(50)} radius={sf(25)} />
      <View style={styles.itemText}>
        <Text>{item.en}</Text>
        <Text>{item.ch}</Text>
      </View>
      {Right(item.type)}
    </View>
  );
};

let count = 0;
export default function SearchScreen({
  route,
  navigation,
}: Props): JSX.Element {
  const rp = route.params as any;
  const params = rp?.params as any;
  const type = params?.type as Undefinable<SearchActionType>;
  console.log('test:SearchScreen:', params, type);
  // const theme = useThemeContext();
  const sf = getScaleFactor();
  // const menu = useActionMenu();
  // const sheet = useBottomSheet();
  // const { manualClose } = useManualCloseDialog();
  // const alert = useAlert();
  // const { header, groupInfo } = useAppI18nContext();
  // const { width: screenWidth } = useWindowDimensions();

  const listRef = React.useRef<EqualHeightListRef>(null);
  const enableRefresh = false;
  const enableAlphabet = false;
  const enableHeader = false;
  // const autoFocus = false;
  // const isEmpty = true;
  const [isEmpty, setIsEmpty] = React.useState(true);
  const enableCancel = true;
  const enableClear = true;
  const bounces = false;
  const [value, setValue] = React.useState('');
  const [enableValue, setEnableValue] = React.useState(false);
  const data: ItemDataType[] = React.useMemo(() => [], []);
  let inputRef = React.useRef<RNTextInput>(null);
  let dataCount = React.useRef(0);
  // const [selectedCount] = React.useState(10);

  const action = React.useCallback(
    (type: SearchActionType | undefined, index: number) => {
      const arr = ['noAdded', 'hadAdded', 'adding'];
      const arr2 = ['noJoined', 'hadJoined', 'applying'];
      switch (type) {
        case 'add_contact':
          return {
            addContact: {
              state: arr[index % 3],
              onClicked: () => {
                console.log('test:onClicked:');
              },
            },
          };
        case 'join_public_group':
          return {
            searchPublicGroup: {
              state: arr2[index % 3],
              onClicked: () => {
                console.log('test:onClicked:');
              },
            },
          };
        default:
          return undefined;
      }
    },
    []
  );

  const _loadData = () => {
    console.log('test:load:data:', dataCount);
    const tmp = COUNTRY.slice(dataCount.current, dataCount.current + 2);
    dataCount.current += 2;
    const r = tmp.map((value, index) => {
      const i = value.lastIndexOf(' ');
      const en = value.slice(0, i);
      const ch = value.slice(i + 1);

      return {
        key: en,
        en: en,
        ch: ch,
        height: 80,
        onPress: (data) => {
          if (type === 'add_contact') {
            navigation.navigate('ContactInfo', { params: { userId: 'test' } });
          } else if (type === 'join_public_group') {
            navigation.navigate('GroupInfo', {
              params: { groupId: data!.key },
            });
          }
        },
        type: type,
        action: action(type, index),
      } as ItemDataType;
    });
    setIsEmpty(false);
    // data.push(...r);
    listRef.current?.manualRefresh([
      {
        type: 'add',
        data: [...r],
        enableSort: false,
      },
    ]);
  };

  const _search = (keyword: string) => {
    console.log('test:search:', keyword);
    _loadData();
  };

  return (
    <SafeAreaView
      mode="padding"
      style={useStyleSheet().safe}
      edges={['top', 'right', 'left']}
    >
      <View style={styles.container}>
        <SearchBar
          ref={inputRef}
          enableCancel={enableCancel}
          enableClear={enableClear}
          inputContainerStyle={styles.inputContainer}
          cancel={{
            buttonName: 'cancel',
            onCancel: () => {
              navigation.goBack();
            },
          }}
          onChangeText={(text) => {
            setEnableValue(false);
            setValue(text);
          }}
          onClear={() => {
            setEnableValue(true);
            setValue('');
            inputRef.current?.blur();
          }}
          value={enableValue ? value : undefined}
          returnKeyType="search"
          onSubmitEditing={(event) => {
            const c = event.nativeEvent.text;
            // Keyboard.dismiss();
            event.preventDefault();
            _search(c);
          }}
        />
      </View>
      {isEmpty ? (
        <Blank />
      ) : (
        <EqualHeightList
          bounces={bounces}
          parentName="ContactList"
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
              width: sf(15),
              borderRadius: 8,
            },
          }}
          ItemSeparatorComponent={ListItemSeparator}
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
      )}
    </SafeAreaView>
  );
}

const styles = createStyleSheet({
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
  rightItem: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexGrow: 1,
    paddingRight: 5,
  },
  rightItemFont: { fontSize: 14, fontWeight: '400', lineHeight: 18 },
  rightItemStyle: { height: 30, borderRadius: 24, paddingHorizontal: 15 },
  container: { paddingHorizontal: 20, paddingTop: 10 },
  inputContainer: {
    backgroundColor: 'rgba(242, 242, 242, 1)',
    borderRadius: 24,
  },
});
