/* eslint-disable react/no-unused-prop-types */

import * as React from 'react';
import {
  Animated,
  DeviceEventEmitter,
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
  LayoutChangeEvent,
  ListRenderItemInfo,
  PanResponder,
  Pressable,
  RefreshControlProps,
  ScrollView,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { CustomEvents } from '../nativeEvents';
import createStyleSheet from '../styles/createStyleSheet';
import { arraySort, wait } from '../utils/function';
import { timestamp } from '../utils/generator';

export type ListItemType = 'default' | 'sideslip';

export interface ItemData {
  key: string;
  type?: ListItemType;
  onLongPress?: (data?: ItemData) => void;
  onPress?: (data?: ItemData) => void;
  sideslip?: {
    width: number;
  };
  height?: number;
}

export interface ItemProps {
  data: ItemData;
  style?: StyleProp<ViewStyle>;
}

export type ItemComponent = (props: ItemProps) => JSX.Element;

export type ItemContainerProps = React.PropsWithChildren<{
  index: number;
  alphabet?: string;
  isFirst?: boolean;
  height?: React.Ref<number>;
  style?: StyleProp<ViewStyle>;
  data?: ItemData;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
}>;

export type ItemContainerComponent = (props: ItemContainerProps) => JSX.Element;

type RenderItemProps = {
  itemProps: ItemProps;
  Item: ItemComponent;
  itemContainerProps: ItemContainerProps;
  ItemContainer: ItemContainerComponent;
};

export interface ListHeaderProps {
  name?: string;
}
export type ListHeaderComponent = (props: ListHeaderProps) => JSX.Element;

const DefaultItem: ItemComponent = (props: ItemProps): JSX.Element => {
  return <Text style={[styles.item, props.style]}>{props.data.key}</Text>;
};

const DefaultItemContainer: ItemContainerComponent = (
  props: ItemContainerProps
): JSX.Element => {
  return (
    <Pressable
      style={[props.style]}
      onLayout={(e) => {
        props.onLayout?.(e);
        if (props.height) {
          const ref = props.height as React.MutableRefObject<number>;
          ref.current = e.nativeEvent.layout.height;
          // console.log('test:onLayout:height:', e.nativeEvent.layout);
        }
      }}
      onLongPress={() => {
        props.data?.onLongPress?.(props.data);
      }}
      onPress={() => {
        props.data?.onPress?.(props.data);
      }}
      // onStartShouldSetResponder={(_) => {
      //   return false;
      // }}
      // onStartShouldSetResponderCapture={(_) => {
      //   return false;
      // }}
      // onMoveShouldSetResponder={(_) => {
      //   return false;
      // }}
      // onResponderEnd={(_) => {
      //   return false;
      // }}
      // onResponderGrant={(_) => {
      //   return false;
      // }}
    >
      {props.children}
    </Pressable>
  );
};
const DefaultItemSideslipContainer: ItemContainerComponent = (
  props: ItemContainerProps
): JSX.Element => {
  const horizontal = true;
  const bounces = false;
  const showsHorizontalScrollIndicator = false;
  const scrollViewRef = React.useRef<ScrollView>(null);
  const extraWidth = props.data?.sideslip?.width ?? 0;
  const currentX = React.useRef(0);
  const currentY = React.useRef(0);
  const startTime = React.useRef(0);
  const endTime = React.useRef(0);
  const [isEditable, setIsEditable] = React.useState(false);

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      CustomEvents.closeEditable.key,
      (_) => {
        _closeEditable();
      }
    );
    return () => subscription.remove();
  }, []);

  const _closeEditable = () => {
    setIsEditable(false);
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  const _autoAlign = (moveX: number, width: number) => {
    const w = width / 2;
    if (0 <= moveX && moveX < w) {
      setIsEditable(false);
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    } else {
      setIsEditable(true);
      scrollViewRef.current?.scrollTo({ x: width, animated: true });
    }
  };

  const _onClicked = () => {
    if (isEditable === true) {
      return;
    }
    endTime.current = timestamp();
    if (endTime.current - startTime.current < 1000) {
      props.data?.onPress?.(props.data);
    } else {
      props.data?.onLongPress?.(props.data);
    }
  };

  return (
    <View
      style={[props.style]}
      onLayout={(e) => {
        props.onLayout?.(e);
        if (props.height) {
          const ref = props.height as React.MutableRefObject<number>;
          ref.current = e.nativeEvent.layout.height;
          // console.log('test:onLayout:height:2:', e.nativeEvent.layout);
        }
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        onScrollEndDrag={(event) => {
          const x = event.nativeEvent.contentOffset.x;
          _autoAlign(x, extraWidth);
        }}
        onTouchStart={(event) => {
          currentX.current = event.nativeEvent.locationX;
          currentY.current = event.nativeEvent.locationY;
          startTime.current = timestamp();
        }}
        onTouchEnd={(event) => {
          if (
            event.nativeEvent.locationX === currentX.current &&
            event.nativeEvent.locationY === currentY.current
          ) {
            _onClicked();
          }
        }}
        bounces={bounces}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        // style={{ width: 300, backgroundColor: 'purple', height: 40 }}
      >
        {props.children}
      </ScrollView>
    </View>
  );
};

// let RenderItemInternalCount = 0;
const RenderItemInternal = React.memo(
  (info: ListRenderItemInfo<RenderItemProps>) => {
    // console.log('test:RenderItemM:', ++RenderItemInternalCount);
    const { ItemContainer, itemContainerProps, itemProps, Item } = info.item;
    return (
      <ItemContainer {...itemContainerProps}>
        <Item {...itemProps} />
      </ItemContainer>
    );
  }
  // (a, b) => {
  //   if (
  //     a.item.itemProps.data === b.item.itemProps.data &&
  //     a.item.itemContainerProps.alphabet ===
  //       b.item.itemContainerProps.alphabet &&
  //     a.item.itemContainerProps.height === b.item.itemContainerProps.height &&
  //     a.item.itemContainerProps.index === b.item.itemContainerProps.index &&
  //     a.item.itemContainerProps.isFirst === b.item.itemContainerProps.isFirst
  //   ) {
  //     return true;
  //   }
  //   return false;
  // }
);

// let RenderItemCount = 0;
const RenderItem = ({
  item,
}: ListRenderItemInfo<RenderItemProps>): JSX.Element => {
  // console.log('test:RenderItem:', ++RenderItemCount);
  const { ItemContainer, itemContainerProps, itemProps, Item } = item;
  return (
    <RenderItemInternal
      item={{
        itemProps: itemProps,
        Item: Item,
        itemContainerProps: itemContainerProps,
        ItemContainer: ItemContainer,
      }}
      index={itemContainerProps.index}
      separators={{
        highlight: function (): void {},
        unhighlight: function (): void {},
        updateProps: function (): void {},
      }}
    />
  );
};

type AlphabetType = {
  alphabetItem?: StyleProp<TextStyle>;
  alphabetItemContainer?: StyleProp<TextStyle>;
  alphabetContainer?: StyleProp<ViewStyle>;
  alphabetCurrent?: StyleProp<TextStyle>;
  enableToast?: boolean;
  alphabetToast?: StyleProp<ViewStyle>;
};

type ListHeaderComponentType = {
  Component: React.ComponentType<ListHeaderProps>;
  props: ListHeaderProps;
};

type ListRefreshComponentType = {
  Component: React.ReactElement<RefreshControlProps>;
  props: RefreshControlProps;
};

export type EqualHeightListProps = Omit<
  RNFlatListProps<RenderItemProps>,
  | 'data'
  | 'renderItem'
  | 'getItemLayout'
  | 'keyExtractor'
  | 'refreshing'
  | 'onRefresh'
> & {
  items: ItemData[];
  onItems?: (items: React.RefObject<ItemData[]>) => void;
  itemStyle?: StyleProp<ViewStyle>;
  ItemFC: ItemComponent;
  itemContainerStyle?: StyleProp<ViewStyle>;
  enableAlphabet: boolean;
  enableRefresh: boolean;
  enableHeader: boolean;
  enableSort?: boolean;
  onScroll?: (item: ItemData) => void;
  onRefresh?: (state: 'started' | 'ended') => void;
  RefreshComponent?: ListRefreshComponentType;
  HeaderComponent?: ListHeaderComponentType;
  Header?: ListHeaderComponent;
  alphabet?: AlphabetType;
  parentName?: string;
};

export type ListItemUpdateType = {
  type: 'add' | 'del' | 'update' | 'clear';
  data?: ItemData[];
  enableSort?: boolean;
  sortDirection?: 'asc' | 'dsc';
};

export type EqualHeightListRef = {
  manualRefresh: (updateItems: ListItemUpdateType[]) => void;
};

export const EqualHeightList: (
  props: EqualHeightListProps,
  ref?: React.ForwardedRef<EqualHeightListRef>
) => JSX.Element = (
  props: EqualHeightListProps,
  ref?: React.ForwardedRef<EqualHeightListRef>
): JSX.Element => {
  React.useImperativeHandle(
    ref,
    () => ({
      manualRefresh: (updateItems: ListItemUpdateType[]) => {
        // console.log('test:manualRefresh:', updateItems);
        _handleManualRefresh(updateItems);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // const data = React.useMemo<RenderItemProps[]>(() => [], []);
  const [data, setData] = React.useState<RenderItemProps[]>([]);
  const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#';
  const REFRESH_TIMEOUT = 1500;
  const listRef = React.useRef<RNFlatList>(null);
  const listHeightRef = React.useRef(0);
  const listYRef = React.useRef(0);
  const alphabetListRef = React.useRef<View>(null);
  const responderRef = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderStart: (e, { y0 }) => {
        setIsMoving(true);
        const c = getChar(_calculateAlphabetIndex(y0));
        if (c) jumpToItemByOffset(c, listItemContainerHeightRef.current, false);
        e.preventDefault();
      },
      onPanResponderMove: (e, { moveY }) => {
        setIsMoving(true);
        const c = getChar(_calculateAlphabetIndex(moveY));
        if (c) jumpToItemByOffset(c, listItemContainerHeightRef.current, false);
        e.preventDefault();
      },
      onPanResponderRelease: (e) => {
        setIsMoving(false);
        setLastChar('');
        e.preventDefault();
      },
    })
  ).current;
  const {
    alphabet,
    items,
    onItems,
    itemStyle,
    ItemFC,
    itemContainerStyle,
    enableAlphabet,
    enableRefresh,
    enableHeader,
    enableSort,
    onRefresh,
    RefreshComponent,
    HeaderComponent,
    Header,
    // ItemSeparatorComponent,
    // parentName,
    ...others
  } = props;

  const [refreshing, setRefreshing] = React.useState(false);
  const [isMoving, setIsMoving] = React.useState(false);
  const [lastChar, setLastChar] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  // const [listItemHeightRef, setItemHeight] = React.useState(0);
  const listItemContainerHeightRef = React.useRef(0);
  const listItemHeightRef = React.useRef(0);
  // let listItemHeightRef = 0;
  const childrenItems = React.useRef<ItemData[]>([]);

  if (items.length > 0) {
    const item = items[0];
    if (item?.height !== undefined && typeof item?.height === 'number') {
      listItemHeightRef.current = item.height!;
    }
  }

  const _prepareData = React.useCallback(
    async (items: ItemData[]) => {
      const obj = {} as any;
      let once = false;
      const r = items.map((item, index) => {
        let isFirst = false;
        const alphabet = item.key[0] ? item.key[0] : '#';
        if (obj[alphabet]) {
          isFirst = false;
        } else {
          isFirst = true;
          obj[alphabet] = true;
        }
        return {
          Item: ItemFC ?? DefaultItem,
          itemProps: {
            data: item,
            style: itemStyle,
          },
          ItemContainer:
            item.type === 'default'
              ? DefaultItemContainer
              : item.type === 'sideslip'
              ? DefaultItemSideslipContainer
              : DefaultItemContainer,
          itemContainerProps: {
            index: index,
            alphabet: alphabet,
            isFirst: isFirst,
            style: itemContainerStyle,
            height: once === false ? listItemContainerHeightRef : undefined,
            data: item,
          },
        } as RenderItemProps;
      });
      data.push(...r);
      // setData(data);
    },
    [ItemFC, data, itemContainerStyle, itemStyle]
  );

  const _onItems = React.useCallback(() => {
    childrenItems.current = data.map((data) => {
      return data.itemProps.data;
    });
    onItems?.(childrenItems);
  }, [data, onItems]);

  if (loading) {
    data.splice(0, data.length);
    if (enableSort === true) arraySort(items);
    _prepareData(items).catch((e) => {
      console.warn('test:_prepareData:', e);
    });
    // _onItems();
    setLoading(false);
  }

  const _onRefresh = React.useCallback((): void => {
    if (enableRefresh === undefined || enableRefresh === false) {
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    onRefresh?.('started');
    wait(REFRESH_TIMEOUT).then(() => {
      setRefreshing(false);
      onRefresh?.('ended');
    });
  }, [enableRefresh, onRefresh]);

  const _asyncSetAlphabetListPageY = () => {
    const r = new Promise((success, fail) => {
      if (alphabetListRef?.current) {
        alphabetListRef.current.measure(
          (
            _: number,
            __: number,
            ___: number,
            ____: number,
            _____: number,
            pageY: number
          ) => {
            // console.log('test:measure:', x, y, width, height, pageX, pageY);
            listYRef.current = pageY;
            success(0);
          }
        );
      } else {
        fail();
      }
    });
    return r;
  };

  const _calculateAlphabetIndex = (y: number): number => {
    const AZH = listHeightRef.current;
    const unitH = AZH / (AZ.length + 0);
    const index = Math.round((y - listYRef.current) / unitH);
    // console.log(
    //   'test:AZH:',
    //   AZH,
    //   unitH,
    //   y,
    //   index,
    //   listHeightRef.current,
    //   listYRef.current
    // );
    return index;
  };

  const getChar = (index: number) => {
    return AZ[index];
  };

  const jumpToItemByOffset = React.useCallback(
    (char: string, h: number, animated: boolean) => {
      if (char) setLastChar(char);
      for (const item of data) {
        const isFirst = item.itemContainerProps.isFirst;
        const c = item.itemContainerProps.alphabet;
        if (isFirst === true && char === c) {
          const offset = item.itemContainerProps.index * h;
          listRef.current?.scrollToOffset({
            animated: animated,
            offset: offset,
          });
          break;
        }
      }
    },
    [data]
  );

  const _handleManualRefresh = (updateItems: ListItemUpdateType[]) => {
    for (const item of updateItems) {
      switch (item.type) {
        case 'add':
          if (item.data) {
            _prepareData(item.data).catch((e) => {
              console.warn('test:_prepareData:', e);
            });
          }
          break;
        case 'update':
          if (item.data) {
            for (const d of item.data) {
              for (const dd of data) {
                if (dd.itemProps.data.key === d.key) {
                  dd.itemProps.data = d;
                  break;
                }
              }
            }
          }
          break;
        case 'del':
          if (item.data) {
            let hadDeleted = false;
            for (const d of item.data) {
              for (let index = 0; index < data.length; index++) {
                const dd = data[index];
                if (dd && dd.itemProps.data.key === d.key) {
                  data.splice(index, 1);
                  hadDeleted = true;
                  break;
                }
              }
              if (hadDeleted === true) {
                break;
              }
            }
          }
          break;
        case 'clear':
          data.splice(0, data.length);
          break;
        default:
          throw new Error(`This type ${item.type} is not supported.`);
      }
      if (
        item.enableSort === true &&
        (item.type === 'add' || item.type === 'update')
      ) {
        data.sort((a, b) => {
          if (a.itemProps.data.key > b.itemProps.data.key) {
            return item.sortDirection === 'asc' ? 1 : -1;
          } else if (a.itemProps.data.key < b.itemProps.data.key) {
            return item.sortDirection === 'asc' ? -1 : 1;
          } else {
            return 0;
          }
        });
      }
    }

    setData([...data]);
    _onItems();
  };

  const r = (
    <View style={[styles.container]}>
      <RNFlatList
        ref={(value) => {
          if (value) {
            const s = listRef as React.MutableRefObject<RNFlatList>;
            s.current = value;
          }
        }}
        data={data}
        extraData={data}
        renderItem={RenderItem}
        // !!! scrollToIndex needs to be used with getItemLayout, but getItemLayout is very expensive, so, scrapped.
        // getItemLayout={(
        //   item: RenderItemProps[] | undefined | null,
        //   index: number
        // ) => {
        //   let h = _calculateItemH;
        //   const s = ItemSeparatorComponent ? 0.333 : 0; // ???
        //   h += s;
        //   const r = {
        //     length: h,
        //     offset: h * index,
        //     index: index,
        //   };
        //   // let key;
        //   // if (item) {
        //   //   key = item[index]?.itemProps.data.key;
        //   // }
        //   // console.log('test:getItemLayout:', parentName, h, index, key);
        //   return r;
        // }}
        keyExtractor={(item: RenderItemProps) => {
          // console.log('test:keyExtractor:', item.itemProps.data.key);
          return item.itemProps.data.key;
        }}
        refreshing={enableRefresh === true ? refreshing : undefined}
        onRefresh={enableRefresh === true ? _onRefresh : undefined}
        refreshControl={
          enableRefresh === true
            ? RefreshComponent
              ? RefreshComponent.Component
              : undefined
            : undefined
        }
        onEndReached={(_) => {
          // console.log('test:onEndReached:', info.distanceFromEnd);
        }}
        ListHeaderComponent={
          enableHeader === true
            ? HeaderComponent
              ? React.memo(() => (
                  <HeaderComponent.Component {...HeaderComponent.props} />
                ))
              : Header
              ? Header
              : undefined
            : undefined
        }
        // ListHeaderComponent={enableHeader === true ? Header : undefined}
        // ListHeaderComponent={
        //   enableHeader === true && Header
        //     ? () => <Header name="hh" />
        //     : undefined
        // }
        // ItemSeparatorComponent={ItemSeparatorComponent}
        // keyboardShouldPersistTaps={'never'}
        // keyboardDismissMode={'none'}
        // stickyHeaderIndices={[0]}
        onScrollBeginDrag={(_) => {
          DeviceEventEmitter.emit(CustomEvents.closeEditable.key, {});
        }}
        {...others}
      />
      {enableAlphabet === true ? (
        <React.Fragment>
          <Animated.View
            ref={alphabetListRef}
            style={[styles.alphabetContainer, alphabet?.alphabetContainer]}
            pointerEvents="box-none"
            onLayout={(event) => {
              const h = event.nativeEvent.layout.height;
              listHeightRef.current = h;
              _asyncSetAlphabetListPageY();
            }}
            {...responderRef.panHandlers}
          >
            <Pressable
              pointerEvents="box-only"
              onFocus={(e) => {
                e.preventDefault();
              }}
              style={[styles.alphabetPressable]}
            >
              {AZ.split('').map((char) => {
                return (
                  <View
                    key={char}
                    style={[
                      styles.alphabetView,
                      alphabet?.alphabetItemContainer,
                    ]}
                  >
                    <Text
                      style={[
                        styles.alphabetItem,
                        alphabet?.alphabetItem,
                        lastChar === char
                          ? alphabet?.alphabetCurrent
                          : undefined,
                      ]}
                    >
                      {char}
                    </Text>
                  </View>
                );
              })}
            </Pressable>
          </Animated.View>
          {isMoving && (
            <View
              style={[
                styles.char,
                alphabet?.enableToast === true
                  ? alphabet?.alphabetToast
                  : undefined,
              ]}
            >
              <Text style={styles.chatText}>{lastChar}</Text>
            </View>
          )}
        </React.Fragment>
      ) : null}
    </View>
  );
  return r;
};

const styles = createStyleSheet({
  container: {
    flex: 1,
    justifyContent: 'center',
    // marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    // backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
  },
  alphabetContainer: {
    position: 'absolute',
    right: 0,
    top: 70,
    // bottom: 100,
    width: 40,
    // height: '80%',
    height: 450,
    margin: 0,
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    direction: 'rtl',
  },
  alphabetItem: {
    width: 18,
    flex: 1,
    display: 'flex',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  alphabetView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    flex: 1,
    display: 'flex',
    borderRadius: 9,
    overflow: 'hidden',
    backgroundColor: 'red',
  },
  alphabetPressable: {
    flex: 1,
    width: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  char: {
    flex: 1,
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 6,
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 50,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  chatText: {
    color: 'white',
  },
});

export default React.forwardRef<EqualHeightListRef, EqualHeightListProps>(
  EqualHeightList
);
