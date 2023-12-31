import * as React from 'react';

import { useChatContext } from '../../chat';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useCloseMenu } from './useCloseMenu';

export type useConversationListMoreActionsProps = {
  onClickedNewConversation?: () => void;
  onClickedNewGroup?: () => void;
  onClickedNewContact?: () => void;
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
};
export function useConversationListMoreActions(
  props: useConversationListMoreActionsProps
) {
  const {
    onClickedNewConversation,
    onClickedNewGroup,
    onClickedNewContact,
    menuRef,
    alertRef,
  } = props;
  const { closeMenu } = useCloseMenu({ menuRef });
  const { tr } = useI18nContext();
  const im = useChatContext();
  const onShowMenu = React.useCallback(() => {
    menuRef.current?.startShowWithProps?.({
      initItems: [
        {
          name: '_uikit_contact_menu_new_conv',
          isHigh: false,
          icon: 'bubble_fill',
          onClicked: () => {
            closeMenu(() => {
              onClickedNewConversation?.();
            });
          },
        },
        {
          name: '_uikit_contact_menu_add_contact',
          isHigh: false,
          icon: 'person_add_fill',
          onClicked: () => {
            closeMenu(() => {
              if (onClickedNewContact) {
                onClickedNewContact();
              } else {
                alertRef.current?.alertWithInit?.({
                  title: tr('_uikit_contact_alert_title'),
                  message: tr('_uikit_contact_alert_content'),
                  supportInput: true,
                  buttons: [
                    {
                      text: tr('cancel'),
                      onPress: () => {
                        alertRef.current?.close?.();
                      },
                    },
                    {
                      text: tr('add'),
                      isPreferred: true,
                      onPress: (value) => {
                        alertRef.current?.close?.();
                        if (value) {
                          im.addNewContact({
                            useId: value.trim(),
                            reason: 'add contact',
                            onResult: (_result) => {
                              // todo:
                            },
                          });
                        }
                      },
                    },
                  ],
                });
              }
            });
          },
        },
        {
          name: '_uikit_contact_menu_create_group',
          isHigh: false,
          icon: 'person_double_fill',
          onClicked: () => {
            closeMenu(() => {
              onClickedNewGroup?.();
            });
          },
        },
      ],
      onRequestModalClose: closeMenu,
      layoutType: 'left',
      hasCancel: false,
    });
  }, [
    alertRef,
    closeMenu,
    im,
    menuRef,
    onClickedNewContact,
    onClickedNewConversation,
    onClickedNewGroup,
    tr,
  ]);

  return {
    onShowConversationListMoreActions: onShowMenu,
  };
}