import type * as React from 'react';
import type {
  DefaultSectionT,
  SectionListData,
  ViewabilityConfig,
  ViewToken,
} from 'react-native';

import type { DataModelType } from '../chat';
import type { UIKitError } from '../error';
import type { FlatListRef } from '../ui/FlatList';
import type { SectionListRef } from '../ui/SectionList';

export type PropsWithTest = { testMode?: 'only-ui' | undefined };
export type PropsWithError = { onError?: (error: UIKitError) => void };
export type PropsWithChildren = React.PropsWithChildren<{}>;

export type ListState = 'loading' | 'normal' | 'error' | 'empty';

export type ListItemType =
  | 'conv-list'
  | 'contact-list'
  | 'group-list'
  | 'group-member-list';
export type ListItemProps = {
  id: string;
};

export type ListItemRequestProps<DataT> = {
  /**
   * Single request, supports asynchronous. If you need to get it over the network instead of locally, it is recommended to use `` to complete the provided data.
   * @params params -
   * - id: The id of the item.
   * - result: The callback function of the result.
   */
  onRequestData?: (params: {
    id: string;
    result: (data?: DataT, error?: UIKitError) => void;
  }) => void;
};

export type ListRequestProps<DataT> = {
  /**
   * @description Get data information in batches. If it cannot be obtained, a single acquisition will be attempted during rendering. {@link ListItemRequestProps.onRequestData}
   * @params params -
   * - ids: The id of the item.
   * - result: The callback function of the result.
   */
  onRequestData?: (params: {
    ids: string[];
    result: (data?: DataT[], error?: UIKitError) => void;
  }) => void;
  /**
   * @description Get data information in batches. If it cannot be obtained, a single acquisition will be attempted during rendering. {@link ListItemRequestProps.onRequestData}
   * @params params -
   * - ids: The id of the item.
   * - result: The callback function of the result.
   */
  onRequestMultiData?: (params: {
    ids: Map<DataModelType, string[]>;
    result: (data?: Map<DataModelType, DataT[]>, error?: UIKitError) => void;
  }) => void;
};

export type UseFlatListReturn<ItemT> = {
  /**
   * @description The data source of the list.
   */
  data: ArrayLike<ItemT>;
  /**
   * @description The type of list.
   */
  listType: 'FlatList' | 'SectionList';
  /**
   * @description The state of the list.
   */
  listState?: 'loading' | 'empty' | 'error' | 'normal';
  /**
   * Refresh callback.
   */
  onRefresh?: () => void;
  /**
   * Load more callback.
   */
  onMore?: () => void;
  /**
   * Whether to load.
   */
  isAutoLoad?: boolean;
  /**
   * Whether to load all.
   */
  isLoadAll?: boolean;
  /**
   * Whether to display after loading.
   */
  isShowAfterLoaded?: boolean;
  /**
   * Load data once or multiple times.
   */
  loadType?: 'once' | 'multiple';
  /**
   * Whether to update when the list is visible.
   */
  isVisibleUpdate?: boolean;
  /**
   * Whether to update automatically.
   */
  isAutoUpdate?: boolean;
  /**
   * Whether to update when the event occurs.
   */
  isEventUpdate?: boolean;
  /**
   * The list item component.
   */
  ListItem?: React.ComponentType<ItemT>;
  /**
   * Sorting strategy callback.
   */
  sort?: (prevProps: ItemT, nextProps: ItemT) => boolean;
  /**
   * The list component reference.
   */
  ref?: React.MutableRefObject<FlatListRef<ItemT>>;
};

export type UseSectionListReturn<
  ItemT,
  SectionT extends DefaultSectionT,
  ListIndexPropsT extends {}
> = {
  /**
   * @description The data source of the list.
   */
  sections: ReadonlyArray<SectionListData<ItemT, SectionT>>;
  /**
   * @description The type of list.
   */
  listType: 'FlatList' | 'SectionList';
  /**
   * @description The state of the list.
   */
  listState?: 'loading' | 'empty' | 'error' | 'normal';
  /**
   * Refresh callback.
   */
  onRefresh?: () => void;
  /**
   * Load more callback.
   */
  onMore?: () => void;
  /**
   * Whether to load.
   */
  isAutoLoad?: boolean;
  /**
   * Whether to load all.
   */
  isLoadAll?: boolean;
  /**
   * Whether to display after loading.
   */
  isShowAfterLoaded?: boolean;
  /**
   * Load data once or multiple times.
   */
  loadType?: 'once' | 'multiple';
  /**
   * Whether to update when the list is visible.
   */
  isVisibleUpdate?: boolean;
  /**
   * Whether to update automatically.
   */
  isAutoUpdate?: boolean;
  /**
   * Whether to update when the event occurs.
   */
  isEventUpdate?: boolean;
  /**
   * The list item component.
   */
  ListItem?: React.ComponentType<ItemT>;
  /**
   * The list item header component.
   */
  ListItemHeader?: React.ComponentType<SectionListData<ItemT, SectionT>>;
  /**
   * Sorting strategy callback.
   */
  sort?: (prevProps: ItemT, nextProps: ItemT) => boolean;
  /**
   * The list index component.
   */
  AlphabeticIndex?: React.ComponentType<ListIndexPropsT>;
  /**
   * The list component reference.
   */
  ref?: React.MutableRefObject<SectionListRef<ItemT, SectionT>>;
};

export type UseListReturn = {
  refreshing?: boolean;
  viewabilityConfig?: ViewabilityConfig;
  onViewableItemsChanged?: (info: {
    viewableItems: Array<ViewToken>;
    changed: Array<ViewToken>;
  }) => void;
  deferSearch?: (key: string) => void;
};

export type ListItemActions<DataT> = {
  onClicked?: (data?: DataT) => void;
  onLongPressed?: (data?: DataT) => void;
  onToRightSlide?: (data?: DataT) => void;
  onToLeftSlide?: (data?: DataT) => void;
};
