import type { StyleProp, ViewStyle } from 'react-native';

import type { DataModel, GroupModel } from '../../chat';
import type {
  FlatListRefType,
  ListItemActions,
  ListItemProps,
  ListItemRequestProps,
  ListRequestProps,
  ListStateType,
  PropsWithBack,
  PropsWithCancel,
  PropsWithFlatList,
  PropsWithInit,
  PropsWithMenu,
  PropsWithNavigationBar,
  PropsWithSearch,
  PropsWithTest,
} from '../types';

export type GroupListItemProps = ListItemProps &
  ListItemRequestProps<DataModel> &
  Omit<ListItemActions<GroupModel>, 'onToRightSlide' | 'onToLeftSlide'> & {
    data: GroupModel;
  };

export type GroupListItemComponentType =
  | React.ComponentType<GroupListItemProps>
  | React.ExoticComponent<GroupListItemProps>;

export type GroupListRef = Omit<
  FlatListRefType<GroupModel, GroupListItemProps>,
  'addItem' | 'clearItem' | 'updateItem' | 'showMenu' | 'closeMenu'
> & {
  /**
   * Supported updates include: group name, group description, my group remark name within the group, and updating the group owner.
   *
   * If the operation fails, an error is returned through `ErrorServiceListener.onError`.
   */
  updateItem: (items: GroupModel) => void;
};

export type GroupListProps = Pick<
  ListRequestProps<DataModel>,
  'onRequestGroupData'
> &
  PropsWithTest &
  PropsWithInit &
  PropsWithBack &
  PropsWithSearch &
  PropsWithNavigationBar &
  PropsWithFlatList<GroupListItemProps> &
  PropsWithMenu &
  Omit<ListItemActions<GroupModel>, 'onToRightSlide' | 'onToLeftSlide'> & {
    /**
     * Container style for the session list component.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * The group list is in paging request mode. When all groups are requested, no more callback notifications will be called.
     */
    onNoMore?: () => void;
    /**
     * Custom group list item component.
     */
    ListItemRender?: GroupListItemComponentType;
    /**
     * Callback notification of list data status. For example: the session list usually changes from loading state to normal state. If the data request fails, an error state will be reached.
     */
    onStateChanged?: (state: ListStateType) => void;

    /**
     * The reference object of the conversation list component.
     *
     * Please see {@link GroupListRef} for more operations.
     */
    propsRef?: React.MutableRefObject<GroupListRef>;
  };
export type SearchGroupProps = ListRequestProps<DataModel> &
  PropsWithTest &
  PropsWithCancel &
  Omit<
    ListItemActions<GroupModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > & {
    containerStyle?: StyleProp<ViewStyle>;
  };

export type UseGroupListProps = GroupListProps;

export type GroupSearchModel = GroupModel & DataModel;
export type UseSearchGroupProps = SearchGroupProps;
