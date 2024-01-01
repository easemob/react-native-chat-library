import * as React from 'react';
import { ListRenderItemInfo, Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { FlatListFactory } from '../../ui/FlatList';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';
import { SearchStyle } from '../SearchStyle';
import { TopNavigationBar } from '../TopNavigationBar';
import { useGroupList } from './GroupList.hooks';
import type { GroupListItemProps, GroupListProps } from './types';

const FlatList = FlatListFactory<GroupListItemProps>();

export function GroupList(props: GroupListProps) {
  const {
    containerStyle,
    onBack,
    onSearch,
    enableSearch,
    enableNavigationBar,
    NavigationBar,
  } = props;
  const {
    data,
    refreshing,
    onRefresh,
    ref,
    onMore,
    viewabilityConfig,
    onViewableItemsChanged,
    listState,
    onClicked,
    tr,
    ListItemRender,
  } = useGroupList(props);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });

  return (
    <View
      style={[
        {
          flexGrow: 1,
          backgroundColor: getColor('bg'),
        },
        containerStyle,
      ]}
    >
      {enableNavigationBar !== false ? (
        NavigationBar ? (
          <>{NavigationBar}</>
        ) : (
          <TopNavigationBar
            Left={
              <Pressable
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={onBack}
              >
                <Icon name={'chevron_left'} style={{ width: 24, height: 24 }} />
                <Text>{tr('_uikit_group_title')}</Text>
              </Pressable>
            }
            Right={<View style={{ width: 32, height: 32 }} />}
            containerStyle={{ paddingHorizontal: 12 }}
          />
        )
      ) : null}
      {enableSearch !== false ? (
        <SearchStyle
          title={tr('search')}
          onPress={() => {
            onSearch?.();
          }}
        />
      ) : null}

      <View style={{ flex: 1 }}>
        <FlatList
          ref={ref}
          style={{ flexGrow: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            // height: '100%',
            // height: 400,
            // backgroundColor: 'yellow',
          }}
          data={data}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={(info: ListRenderItemInfo<GroupListItemProps>) => {
            const { item } = info;
            return <ListItemRender {...item} onClicked={onClicked} />;
          }}
          keyExtractor={(item: GroupListItemProps) => {
            return item.id;
          }}
          onEndReached={onMore}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          ListEmptyComponent={EmptyPlaceholder}
          ListErrorComponent={
            listState === 'error' ? (
              <ErrorPlaceholder
                onClicked={() => {
                  onRefresh?.();
                }}
              />
            ) : null
          }
        />
      </View>
    </View>
  );
}
