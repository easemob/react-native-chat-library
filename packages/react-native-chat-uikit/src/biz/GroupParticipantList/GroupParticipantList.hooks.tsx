import * as React from 'react';

import {
  ChatServiceListener,
  GroupParticipantModel,
  useChatContext,
  useChatListener,
} from '../../chat';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useCloseMenu } from '../hooks/useCloseMenu';
import { useFlatList } from '../List';
import { GroupParticipantListItemMemo } from './GroupParticipantList.item';
import type {
  GroupParticipantListItemComponentType,
  GroupParticipantListItemProps,
  GroupParticipantListProps,
} from './types';

export function useGroupParticipantList(props: GroupParticipantListProps) {
  const {
    onClickedItem,
    onLongPressedItem,
    testMode,
    groupId,
    participantType,
    onClickedAddParticipant,
    onClickedDelParticipant,
    onDelParticipant,
    onChangeOwner,
    ListItemRender: propsListItemRender,
    onKicked: propsOnKicked,
  } = props;
  const flatListProps = useFlatList<GroupParticipantListItemProps>({
    onInit: () => init(),
  });
  const { setData, dataRef, setListState } = flatListProps;
  const [participantCount, setParticipantCount] = React.useState(0);
  const [deleteCount, setDeleteCount] = React.useState(0);
  const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const alertRef = React.useRef<AlertRef>({} as any);
  const { closeMenu } = useCloseMenu({ menuRef });
  const ListItemRenderRef = React.useRef<GroupParticipantListItemComponentType>(
    propsListItemRender ?? GroupParticipantListItemMemo
  );
  const [ownerId, setOwnerId] = React.useState<string | undefined>(undefined);

  const im = useChatContext();
  const { tr } = useI18nContext();

  const onClickedCallback = React.useCallback(
    (data?: GroupParticipantModel | undefined) => {
      const ret = onClickedItem?.(data);
      if (ret !== false) {
        if (participantType === 'change-owner') {
          alertRef.current.alertWithInit({
            message: tr(
              '_uikit_group_alert_change_owner_title',
              data?.memberName ?? data?.memberId
            ),
            buttons: [
              {
                text: tr('cancel'),
                onPress: () => {
                  alertRef.current.close?.();
                },
              },
              {
                text: tr('confirm'),
                isPreferred: true,
                onPress: () => {
                  alertRef.current.close?.();
                  onChangeOwner?.(data);
                },
              },
            ],
          });
        }
      }
    },
    [onChangeOwner, onClickedItem, participantType, tr]
  );

  const onLongPressedCallback = React.useCallback(
    (data?: GroupParticipantModel | undefined) => {
      onLongPressedItem?.(data);
    },
    [onLongPressedItem]
  );

  const calculateDeleteCount = React.useCallback(() => {
    if (participantType !== 'delete') {
      return;
    }
    let count = 0;
    dataRef.current = dataRef.current.map((item) => {
      if (item) {
        if (item.data.checked === true) {
          count++;
        }
      }
      return item;
    });
    setDeleteCount(count);
  }, [dataRef, participantType]);

  const onSetData = React.useCallback(() => {
    calculateDeleteCount();
    const uniqueList = dataRef.current.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.data.memberId === item.data.memberId)
    );
    dataRef.current = uniqueList;
    setData([...dataRef.current]);
  }, [calculateDeleteCount, dataRef, setData]);

  const onCheckClickedCallback = React.useCallback(
    (data?: GroupParticipantModel) => {
      if (participantType === 'delete') {
        if (data?.checked !== undefined) {
          im.setModelState({
            tag: groupId,
            id: data.memberId,
            state: { checked: !data.checked },
          });
          dataRef.current = dataRef.current.map((item) => {
            if (item) {
              if (item.id === data.memberId) {
                return {
                  ...item,
                  data: { ...item.data, checked: !data.checked },
                };
              }
            }
            return item;
          });
          onSetData();
        }
      }
    },
    [dataRef, groupId, im, onSetData, participantType]
  );

  const init = async () => {
    if (testMode === 'only-ui') {
    } else {
      im.getGroupInfo({
        groupId,
        onResult: (result) => {
          if (result.isOk && result.value) {
            setOwnerId(result.value.owner);
          } else {
            setListState('error');
          }
        },
      });
      if (participantType === 'delete') {
        im.clearModelState({ tag: groupId });
      }
      im.getGroupAllMembers({
        groupId: groupId,
        isReset: true,
        onResult: (result) => {
          const { isOk, value, error } = result;
          if (isOk === true) {
            if (value) {
              dataRef.current = value.map((item) => {
                if (participantType === 'delete') {
                  const modelState = im.getModelState({
                    tag: groupId,
                    id: item.memberId,
                  });
                  return {
                    id: item.memberId,
                    data: {
                      ...item,
                      checked: modelState?.checked ?? false,
                    },
                  } as GroupParticipantListItemProps;
                } else {
                  return {
                    id: item.memberId,
                    data: { ...item, checked: undefined },
                  } as GroupParticipantListItemProps;
                }
              });
              if (participantType === 'change-owner') {
                dataRef.current = dataRef.current.filter((item) => {
                  return item.data.memberId !== im.userId;
                });
              } else if (participantType === 'delete') {
                dataRef.current = dataRef.current.filter((item) => {
                  return item.data.memberId !== im.userId;
                });
              } else if (participantType === 'mention') {
                dataRef.current.unshift({
                  id: 'All',
                  data: {
                    memberId: 'All',
                    memberName: 'All',
                  } as GroupParticipantModel,
                });
                dataRef.current = dataRef.current.filter((item) => {
                  return item.data.memberId !== im.userId;
                });
              }
              onSetData();
              setParticipantCount(dataRef.current.length);
            }
          } else {
            if (error) {
              im.sendError({ error });
            }
          }
        },
      });
    }
  };

  const onClickedAddParticipantCallback = React.useCallback(() => {
    if (onClickedAddParticipant) {
      onClickedAddParticipant();
    }
  }, [onClickedAddParticipant]);
  const onClickedDelParticipantCallback = React.useCallback(() => {
    if (onClickedDelParticipant) {
      onClickedDelParticipant();
    }
  }, [onClickedDelParticipant]);
  const onDelParticipantCallback = React.useCallback(() => {
    if (participantType !== 'delete') {
      return;
    }

    if (onDelParticipant) {
      const list = dataRef.current
        .filter((item) => {
          return item.data.checked === true;
        })
        .map((item) => item.data);
      alertRef.current.alertWithInit({
        message: tr('_uikit_group_alert_del_member_title'),
        buttons: [
          {
            text: 'cancel',
            onPress: () => {
              alertRef.current?.close?.();
            },
          },
          {
            text: 'confirm',
            isPreferred: true,
            onPress: () => {
              alertRef.current.close?.();
              onDelParticipant?.(list);
            },
          },
        ],
      });
    }
  }, [dataRef, onDelParticipant, participantType, tr]);

  const addData = (gid: string, memberId: string) => {
    if (gid === groupId) {
      const groupMember = im.getGroupMember({
        groupId,
        userId: memberId,
      });
      if (groupMember) {
        dataRef.current.push({
          id: groupMember.memberId,
          data: groupMember,
        });
      } else {
        dataRef.current.push({
          id: memberId,
          data: {
            memberId: memberId,
            memberName: memberId,
          },
        });
      }
      onSetData();
    }
  };
  const removeData = (gid: string, memberId: string) => {
    if (gid === groupId) {
      const index = dataRef.current.findIndex((item) => item.id === memberId);
      if (index !== -1) {
        dataRef.current.splice(index, 1);
      }
      onSetData();
    }
  };

  const chatListenerRef = React.useRef<ChatServiceListener>({
    onMemberRemoved: (_params: { groupId: string; groupName?: string }) => {
      propsOnKicked?.(groupId);
    },
    onMemberJoined: (params: { groupId: string; member: string }) => {
      addData(params.groupId, params.member);
    },
    onMemberExited: (params: { groupId: string; member: string }) => {
      removeData(params.groupId, params.member);
    },
  });
  useChatListener(chatListenerRef.current);

  return {
    ...flatListProps,
    onClicked: onClickedCallback,
    onLongPressed: onLongPressedCallback,
    onCheckClicked: onCheckClickedCallback,
    participantCount: participantCount,
    onClickedAddParticipant: onClickedAddParticipantCallback,
    onClickedDelParticipant: onClickedDelParticipantCallback,
    deleteCount,
    onDelParticipant: onDelParticipantCallback,
    alertRef,
    menuRef,
    onRequestCloseMenu: closeMenu,
    ListItemRender: ListItemRenderRef.current,
    groupId,
    ownerId,
  };
}
