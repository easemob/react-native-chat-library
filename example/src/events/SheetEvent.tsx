import {
  DialogContextType,
  ExtraDataType,
  getScaleFactor,
  Services,
  ThemeContextType,
} from 'react-native-chat-uikit';

import { CreateGroupSettings } from '../components/CreateGroupSettings';
import type { AppStringSet } from '../I18n/AppCStringSet.en';
import type { SheetActionEventType } from './Events';
import { sendEvent, sendEventProps } from './sendEvent';
import type { BizEventType } from './types';

const sendEventFromSheet = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp'>
) => {
  sendEvent({
    ...params,
    senderId: 'SheetEvent',
  } as sendEventProps);
};

export function handleSheetEvent(params: {
  sheet: Pick<DialogContextType, 'openSheet'>;
  event: any;
  extra: ExtraDataType;
}): boolean {
  const sheetEvent = params.event as {
    eventBizType: BizEventType;
    action: SheetActionEventType;
    senderId: string;
    params: any;
    timestamp: number;
    key: string;
  };
  console.log(
    'test:handleSheetEvent:',
    sheetEvent.eventBizType,
    sheetEvent.action,
    sheetEvent.senderId,
    sheetEvent.timestamp,
    sheetEvent.key
  );
  let ret = true;
  switch (sheetEvent.action) {
    case 'sheet_contact_list':
      {
        const extra = params.extra.getData?.() as {
          theme: ThemeContextType;
          i18n: AppStringSet;
        };
        const { theme } = extra;
        params.sheet.openSheet({
          sheetItems: [
            {
              icon: 'loading',
              iconColor: theme.colors.primary,
              title: '1',
              titleColor: 'black',
              onPress: () => {},
            },
            {
              icon: 'loading',
              iconColor: theme.colors.primary,
              title: '2',
              titleColor: 'black',
              onPress: () => {},
            },
          ],
        });
      }
      break;
    case 'sheet_conversation_list':
      {
        const extra = params.extra.getData?.() as {
          theme: ThemeContextType;
          i18n: AppStringSet;
        };
        const { theme } = extra;
        params.sheet.openSheet({
          sheetItems: [
            {
              icon: 'loading',
              iconColor: theme.colors.primary,
              title: '1',
              titleColor: 'black',
              onPress: () => {},
            },
            {
              icon: 'loading',
              iconColor: theme.colors.primary,
              title: '2',
              titleColor: 'black',
              onPress: () => {},
            },
          ],
        });
      }
      break;
    case 'sheet_create_group_settings':
      {
        const props = { test: 'hh' } as any;
        params.sheet.openSheet({
          sheetItems: [
            {
              key: '1',
              Custom: CreateGroupSettings,
              CustomProps: props,
            },
          ],
        });
      }
      break;
    case 'sheet_group_member':
      {
        const { contactID } = sheetEvent.params;
        const sf = getScaleFactor();
        const extra = params.extra.getData?.() as {
          theme: ThemeContextType;
          i18n: AppStringSet;
        };
        const { groupInfo } = extra.i18n;
        params.sheet.openSheet({
          sheetItems: [
            {
              title: contactID,
              titleColor: 'black',
              onPress: () => {},
              containerStyle: {
                marginTop: sf(10),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: undefined,
                minWidth: undefined,
                backgroundColor: undefined,
                borderRadius: undefined,
              },
              titleStyle: {
                fontWeight: '600',
                fontSize: sf(14),
                lineHeight: sf(16),
                color: 'rgba(102, 102, 102, 1)',
                marginHorizontal: undefined,
              },
            },
            {
              title: groupInfo.memberSheet.add,
              titleColor: 'black',
              onPress: () => {
                sendEventFromSheet({
                  eventType: 'ToastEvent',
                  eventBizType: 'contact',
                  params: groupInfo.toast[4]!,
                  action: 'toast_',
                });
              },
            },
            {
              title: groupInfo.memberSheet.remove,
              titleColor: 'rgba(255, 20, 204, 1)',
              onPress: () => {
                sendEventFromSheet({
                  eventType: 'AlertEvent',
                  eventBizType: 'contact',
                  params: {},
                  action: 'alert_remove_group_member',
                });
              },
            },
            {
              title: groupInfo.memberSheet.chat,
              titleColor: 'black',
              onPress: () => {},
            },
          ],
        });
      }
      break;
    case 'sheet_navigation_menu':
      {
        const extra = params.extra.getData?.() as {
          theme: ThemeContextType;
          i18n: AppStringSet;
        };
        const { conversation } = extra.i18n;
        params.sheet.openSheet({
          sheetItems: [
            {
              title: conversation.new,
              titleColor: 'black',
              onPress: () => {
                sendEventFromSheet({
                  eventType: 'DataEvent',
                  eventBizType: 'conversation',
                  action: 'create_conversation_item',
                  params: {},
                });
              },
            },
            {
              title: conversation.createGroup,
              titleColor: 'black',
              onPress: () => {
                sendEventFromSheet({
                  eventType: 'DataEvent',
                  eventBizType: 'conversation',
                  action: 'create_new_group',
                  params: {},
                });
              },
            },
            {
              title: conversation.addContact,
              titleColor: 'black',
              onPress: () => {
                sendEventFromSheet({
                  eventType: 'DataEvent',
                  eventBizType: 'conversation',
                  action: 'add_new_contact',
                  params: {},
                });
              },
            },
            {
              title: conversation.searchGroup,
              titleColor: 'black',
              onPress: () => {
                sendEventFromSheet({
                  eventType: 'DataEvent',
                  eventBizType: 'conversation',
                  action: 'search_public_group_info',
                  params: {},
                });
              },
            },
            {
              title: conversation.joinPublicGroup,
              titleColor: 'black',
              onPress: () => {
                sendEventFromSheet({
                  eventType: 'DataEvent',
                  eventBizType: 'conversation',
                  action: 'join_public_group',
                  params: {},
                });
              },
            },
          ],
        });
      }
      break;
    case 'open_input_extension':
      {
        const ms = Services.ms;
        const extra = params.extra.getData?.() as {
          theme: ThemeContextType;
          i18n: AppStringSet;
        };
        params.sheet.openSheet({
          sheetItems: [
            {
              iconColor: extra.theme.colors.primary,
              title: 'Camera',
              titleColor: 'black',
              onPress: () => {
                ms.openCamera({})
                  .then(() => {})
                  .catch((error) => {
                    console.warn('error:', error);
                  });
              },
            },
            {
              iconColor: extra.theme.colors.primary,
              title: 'Album',
              titleColor: 'black',
              onPress: () => {
                Services.ms
                  .openMediaLibrary({ selectionLimit: 1 })
                  .then((result) => {
                    sendEventFromSheet({
                      eventType: 'DataEvent',
                      eventBizType: 'contact',
                      params: result,
                      action: 'send_image_message',
                    });
                  })
                  .catch((error) => {
                    console.warn('error:', error);
                  });
              },
            },
            {
              iconColor: extra.theme.colors.primary,
              title: 'Files',
              titleColor: 'black',
              onPress: () => {
                ms.openDocument({})
                  .then(() => {})
                  .catch((error) => {
                    console.warn('error:', error);
                  });
              },
            },
          ],
        });
      }
      break;
    case 'open_group_info_setting':
      {
        const extra = params.extra.getData?.() as {
          theme: ThemeContextType;
          i18n: AppStringSet;
        };
        const { groupInfo } = extra.i18n;
        params.sheet.openSheet({
          sheetItems: [
            {
              title: groupInfo.modify.name,
              titleColor: 'black',
              onPress: () => {
                sendEventFromSheet({
                  eventType: 'PromptEvent',
                  action: 'modify_group_name',
                  params: sheetEvent.params,
                  eventBizType: 'group',
                });
              },
            },
            {
              title: groupInfo.modify.description,
              titleColor: 'black',
              onPress: () => {
                sendEventFromSheet({
                  eventType: 'PromptEvent',
                  action: 'modify_group_description',
                  params: sheetEvent.params,
                  eventBizType: 'group',
                });
              },
            },
            {
              title: groupInfo.modify.groupId,
              titleColor: 'black',
              onPress: () => {
                sendEventFromSheet({
                  eventType: 'DataEvent',
                  action: 'copy_group_id',
                  params: { groupId: sheetEvent.params.groupId },
                  eventBizType: 'group',
                });
              },
            },
          ],
        });
      }
      break;
    case 'open_my_setting_setting':
      params.sheet.openSheet({
        sheetItems: [
          {
            title: 'Change Profile Picture',
            titleColor: 'black',
            onPress: () => {
              sendEventFromSheet({
                eventType: 'DataEvent',
                action: 'open_media_library',
                params: sheetEvent.params,
                eventBizType: 'setting',
              });
            },
          },
          {
            title: 'Change NickName',
            titleColor: 'black',
            onPress: () => {
              sendEventFromSheet({
                eventType: 'PromptEvent',
                action: 'modify_my_name',
                params: sheetEvent.params,
                eventBizType: 'setting',
              });
            },
          },
          {
            title: 'Copy Agora ID',
            titleColor: 'black',
            onPress: () => {
              sendEventFromSheet({
                eventType: 'DataEvent',
                action: 'copy_my_id',
                params: sheetEvent.params,
                eventBizType: 'setting',
              });
            },
          },
        ],
      });
      break;

    default:
      ret = false;
      break;
  }
  return ret;
}
