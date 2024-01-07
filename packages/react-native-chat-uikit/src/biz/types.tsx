import type * as React from 'react';
import type {
  DefaultSectionT,
  SectionListData,
  ViewabilityConfig,
  ViewToken,
} from 'react-native';

import type { DataModelType } from '../chat';
import type { UIKitError } from '../error';
import type { AlertRef } from '../ui/Alert';
import type { FlatListProps, FlatListRef } from '../ui/FlatList';
import type { SectionListProps, SectionListRef } from '../ui/SectionList';
import type {
  BottomSheetNameMenuRef,
  InitMenuItemsType,
} from './BottomSheetMenu';

export type PropsWithTest = { testMode?: 'only-ui' | undefined };
export type PropsWithError = { onError?: (error: UIKitError) => void };
export type PropsWithChildren = React.PropsWithChildren<{}>;
export type PropsWithInit<DataT = any> = {
  onInitialized?: (data?: DataT) => void;
};
export type PropsWithBack<DataT = any> = {
  onBack?: (data?: DataT) => void;
};
export type PropsWithCancel<DataT = any> = {
  onCancel?: (data?: DataT) => void;
};
export type PropsWithSearch<DataT = any> = {
  searchStyleVisible?: boolean;
  customSearch?: React.ReactElement;
  onClickedSearch?: (data?: DataT) => void;
};
export type PropsWithNavigationBar = {
  /**
   * Whether to display the navigation bar.
   */
  navigationBarVisible?: boolean;
  /**
   * Custom navigation bar.
   */
  customNavigationBar?: React.ReactElement;
};
export type PropsWithFlatList<ListItemProps> = {
  /**
   * Properties of the list component. Currently, direct setting of ref, data, renderItem is not supported.
   */
  flatListProps?: Omit<
    FlatListProps<ListItemProps>,
    'ref' | 'data' | 'renderItem'
  >;
};
export type PropsWithSectionList<
  ListItemProps,
  SectionT extends DefaultSectionT = DefaultSectionT
> = {
  /**
   * Properties of the list component. Currently, direct setting of ref, data, renderItem is not supported.
   */
  sectionListProps?: Omit<
    SectionListProps<ListItemProps, SectionT>,
    'ref' | 'data' | 'renderItem'
  >;
};
export type PropsWithMenu = {
  /**
   * Custom menu items. Supports replacing and appending menu items.
   * @param initItems Default menu item list.
   * @returns New menu item list.
   */
  onInitMenu?: (initItems: InitMenuItemsType[]) => InitMenuItemsType[];
};

export type ContactType =
  | 'contact-list'
  | 'new-conversation'
  | 'create-group'
  | 'add-group-member'
  | 'share-contact';
export type GroupParticipantType =
  | 'common'
  | 'delete'
  | 'change-owner'
  | 'mention';

export type SearchType =
  | 'conv-list'
  | 'contact-list'
  | 'new-conversation'
  | 'create-group'
  | 'add-group-member'
  | 'share-contact'
  | 'group-list'
  | 'group-member-list'
  | 'request-list';

export type ListState = 'loading' | 'normal' | 'error' | 'empty';

export type ListItemType =
  | 'conv-list'
  | 'contact-list'
  | 'group-list'
  | 'group-member-list';

export type ChoiceType = 'single' | 'multiple';

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
  }) => void | Promise<void>;
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
  }) => void | Promise<void>;
  /**
   * @description Get data information in batches. If it cannot be obtained, a single acquisition will be attempted during rendering. {@link ListItemRequestProps.onRequestData}
   * @params params -
   * - ids: The id of the item.
   * - result: The callback function of the result.
   */
  onRequestMultiData?: (params: {
    ids: Map<DataModelType, string[]>;
    result: (data?: Map<DataModelType, DataT[]>, error?: UIKitError) => void;
  }) => void | Promise<void>;
};

export type ListStateType = 'loading' | 'empty' | 'error' | 'normal';

export type UseListBasicReturn<ItemT> = {
  /**
   * @description The type of list.
   */
  listType: 'FlatList' | 'SectionList';
  /**
   * @description The state of the list.
   */
  listState?: ListStateType;
  /**
   * Refresh callback.
   */
  onRefresh?: () => void;
  /**
   * Load more callback.
   */
  onMore?: () => void;
  /**
   * There are no more callback notifications.
   */
  onNoMore?: () => void;
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
   * Whether to sort.
   */
  isSort?: boolean;
  /**
   * Sorting strategy callback.
   */
  onSort?: (prevProps: ItemT, nextProps: ItemT) => number;
  /**
   * Whether it is refreshing.
   */
  refreshing?: boolean;
  /**
   * Visibility configuration.
   */
  viewabilityConfig?: ViewabilityConfig;
  /**
   * Visible item callback notification.
   */
  onViewableItemsChanged?: (info: {
    viewableItems: Array<ViewToken>;
    changed: Array<ViewToken>;
  }) => void;
  /**
   * Delayed search callback notification.
   */
  deferSearch?: (key: string) => void;
};

export type UseFlatListReturn<ItemT> = UseListBasicReturn<ItemT> & {
  /**
   * @description The data source of the list.
   */
  data: ReadonlyArray<ItemT>;
  /**
   * The list item component.
   */
  ListItem?: React.ComponentType<ItemT>;
  /**
   * The list component reference.
   */
  ref?: React.MutableRefObject<FlatListRef<ItemT>>;
};

export type UseSectionListReturn<
  ItemT,
  SectionT extends DefaultSectionT,
  ListIndexPropsT extends DefaultListIndexPropsT
> = UseListBasicReturn<ItemT> & {
  /**
   * @description The data source of the list.
   */
  sections: ReadonlyArray<SectionListData<ItemT, SectionT>>;
  /**
   * @description The index titles of the list.
   */
  indexTitles: ReadonlyArray<string>;
  /**
   * The list item component.
   */
  ListItem?: React.ComponentType<ItemT>;
  /**
   * The list item header component.
   */
  ListItemHeader?: React.ComponentType<SectionListData<ItemT, SectionT>>;
  /**
   * The list index component.
   */
  AlphabeticIndex?: React.ComponentType<ListIndexPropsT>;
  /**
   * The list component reference.
   */
  ref?: React.MutableRefObject<SectionListRef<ItemT, SectionT>>;
  /**
   * @description The callback function when the index is selected.
   */
  onIndexSelected?: (index: number) => void;
};

export type ListItemActions<DataT> = {
  /**
   * Callback notification when a list item is clicked. If the return result is true, execution continues, otherwise it terminates.
   */
  onClicked?: ((data?: DataT) => void) | undefined;
  /**
   * Callback notification when a list item is long pressed. If the return result is true, execution continues, otherwise it terminates.
   */
  onLongPressed?: ((data?: DataT) => void) | undefined;
  /**
   * Callback notification when a list item is swiped to the left. If the return result is true, execution continues, otherwise it terminates.
   */
  onToRightSlide?: ((data?: DataT) => void) | undefined;
  /**
   * Callback notification when a list item is swiped to the right. If the return result is true, execution continues, otherwise it terminates.
   */
  onToLeftSlide?: ((data?: DataT) => void) | undefined;
};

export type DefaultListIndexPropsT = {
  /**
   * Header of alphabetical list. For example: A, B, C, etc.
   */
  indexTitles: ReadonlyArray<string>;
  /**
   * Callback notification when the index is selected.
   */
  onIndexSelected?: (index: number) => void;
};

export type BasicListRefType<DataModel> = {
  /**
   * get data model list.
   */
  getList: () => DataModel[];
  /**
   * add data model.
   *
   * If the operation fails, an error is returned through `ErrorServiceListener.onError`.
   *
   * ** To create a new data, you need to send the data through the contact details page, group details page, group member details page, or create a new data through the data extension menu. No direct support is provided here. **
   */
  addItem: (items: DataModel) => void;
  /**
   * remove data model.
   *
   * If the operation fails, an error is returned through `ErrorServiceListener.onError`.
   *
   * You can also delete a data by long-pressing the data list item to pop up the menu.
   */
  deleteItem: (items: DataModel) => void;
  /**
   * update data model.
   *
   * If the operation fails, an error is returned through `ErrorServiceListener.onError`.
   */
  updateItem: (items: DataModel) => void;
  /**
   * clear data model list.
   *
   * If the operation fails, an error is returned through `ErrorServiceListener.onError`.
   */
  clearItem: () => void;
  /**
   * refresh data model list.
   */
  refreshList: () => void;
  /**
   * reload data model list. Compared with `refreshList`, data will be retrieved from native, which may solve some temporary problems.
   *
   * If the operation fails, an error is returned through `ErrorServiceListener.onError`.
   */
  reloadList: () => void;
  /**
   * Display the session list menu. Menu customization needs to be implemented through `onInitMenu`. If you need complete customization, you can use `menuRef` and `alertRef` directly for more control. Some menus need to pop up a confirmation dialog box, which can be controlled using `alertRef`.
   */
  showMenu: () => void;
  /**
   * Close the menu.
   * @param onFinished Close the callback notification after the menu is completed.
   */
  closeMenu: (onFinished?: () => void) => void;
  /**
   * Gets a reference to the menu component of the content.
   */
  getMenuRef: () => React.RefObject<BottomSheetNameMenuRef>;
  /**
   * Gets a reference to the alert component of the content.
   */
  getAlertRef: () => React.RefObject<AlertRef>;
};

export type FlatListRefType<DataModel, ListItemProps> =
  BasicListRefType<DataModel> & {
    getFlatListRef: () => React.RefObject<FlatListRef<ListItemProps>>;
  };

export type SectionListRefType<
  DataModel,
  ListItemProps,
  SectionT extends DefaultSectionT = DefaultSectionT
> = BasicListRefType<DataModel> & {
  getSectionListRef: () => React.RefObject<
    SectionListRef<ListItemProps, SectionT>
  >;
};
