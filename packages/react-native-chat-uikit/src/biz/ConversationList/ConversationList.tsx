import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { g_not_existed_url } from '../../const';
import { Alert } from '../../ui/Alert';
import { FlatListFactory } from '../../ui/FlatList';
import { Avatar } from '../Avatar';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import {
  EmptyPlaceholder,
  ErrorPlaceholder,
  LoadingPlaceholder,
} from '../Placeholder';
import { SearchStyle } from '../SearchStyle';
import {
  TopNavigationBar,
  TopNavigationBarRight,
  TopNavigationBarTitle,
} from '../TopNavigationBar';
import { useConversationList } from './ConversationList.hooks';
import { ConversationListItemMemo } from './ConversationList.item';
import type { ConversationListItemProps, ConversationListProps } from './types';

const FlatList = FlatListFactory<ConversationListItemProps>();

export function ConversationList(props: ConversationListProps) {
  const { containerStyle } = props;
  const {
    data,
    refreshing,
    onRefresh,
    ref,
    onMore,
    viewabilityConfig,
    onViewableItemsChanged,
    listState,
    menuRef,
    onRequestModalClose,
    alertRef,
  } = useConversationList(props);

  return (
    <View style={[containerStyle]}>
      <TopNavigationBar
        Left={<Avatar url={g_not_existed_url} size={24} />}
        Right={TopNavigationBarRight}
        RightProps={{
          onClicked: () => {
            // todo: right
          },
          iconName: 'plus_in_circle',
        }}
        Title={TopNavigationBarTitle({ text: 'Chat' })}
        containerStyle={{ paddingHorizontal: 12 }}
      />
      <SearchStyle
        title={'Search'}
        onPress={() => {
          if (listState === 'normal') {
            // todo: search
          }
        }}
      />
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          ref={ref}
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          data={data}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={(info: ListRenderItemInfo<ConversationListItemProps>) => {
            const { item } = info;
            return <ConversationListItemMemo {...item} />;
          }}
          keyExtractor={(item: ConversationListItemProps) => {
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
          ListLoadingComponent={
            listState === 'loading' ? <LoadingPlaceholder /> : null
          }
        />
      </View>

      <BottomSheetNameMenu
        ref={menuRef}
        onRequestModalClose={onRequestModalClose}
      />
      <Alert ref={alertRef} />
    </View>
  );
}
