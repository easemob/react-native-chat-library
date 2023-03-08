import type {
  DialogContextType,
  ExtraDataType,
  ThemeContextType,
} from 'react-native-chat-uikit';

import type { AppStringSet } from '../I18n/AppCStringSet.en';
import type { AlertActionEventType } from './Events';
import { sendEvent, sendEventProps } from './sendEvent';
import type { BizEventType } from './types';

const sendEventFromAlert = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp'>
) => {
  sendEvent({
    ...params,
    senderId: 'AlertEvent',
  } as sendEventProps);
};

export function handleAlertEvent(params: {
  alert: Pick<DialogContextType, 'openAlert'>;
  event: any;
  extra: ExtraDataType;
}): boolean {
  const alertEvent = params.event as {
    eventBizType: BizEventType;
    action: AlertActionEventType;
    senderId: string;
    params: any;
    timestamp: number;
    key: string;
  };
  console.log(
    'test:handleAlertEvent:',
    alertEvent.eventBizType,
    alertEvent.action,
    alertEvent.senderId,
    alertEvent.timestamp,
    alertEvent.key
  );
  let ret = true;
  switch (alertEvent.action) {
    case 'alert_block_contact':
      {
        const s = `Unblock ${alertEvent.params.contactID}?`;
        params.alert.openAlert({
          title: s,
          buttons: [
            {
              text: 'Cancel',
              onPress: () => {},
            },
            {
              text: 'Confirm',
              onPress: () => {
                sendEvent({
                  eventType: 'ToastEvent',
                  eventBizType: 'contact',
                  params: 'Unblocked',
                  senderId: 'AlertEvent',
                  action: 'toast_',
                });
              },
            },
          ],
        });
      }
      break;
    case 'alert_group_member_modify':
      {
        const extra = params.extra.getData?.() as {
          theme: ThemeContextType;
          i18n: AppStringSet;
        };
        const { groupInfo } = extra.i18n;
        params.alert.openAlert({
          title: groupInfo.inviteAlert.title,
          message: groupInfo.inviteAlert.message,
          buttons: [
            {
              text: groupInfo.inviteAlert.cancelButton,
              onPress: () => {
                sendEvent({
                  eventType: 'DataEvent',
                  eventBizType: 'contact',
                  params: { isConfirmed: false },
                  senderId: 'AlertEvent',
                  action: 'alert_group_member_modify_result',
                });
              },
            },
            {
              text: groupInfo.inviteAlert.confirmButton,
              onPress: () => {
                sendEvent({
                  eventType: 'DataEvent',
                  eventBizType: 'contact',
                  params: { isConfirmed: true },
                  senderId: 'AlertEvent',
                  action: 'alert_group_member_modify_result',
                });
              },
            },
          ],
        });
      }
      break;
    case 'alert_remove_group_member':
      {
        const s = 'Remove NickName?';
        params.alert.openAlert({
          title: s,
          buttons: [
            {
              text: 'Cancel',
              onPress: () => {},
            },
            {
              text: 'Confirm',
              onPress: () => {
                sendEvent({
                  eventType: 'ToastEvent',
                  eventBizType: 'contact',
                  params: 'Removed',
                  senderId: 'AlertEvent',
                  action: 'toast_',
                });
              },
            },
          ],
        });
      }
      break;
    case 'create_group_result_fail':
      {
        const title = alertEvent.params.content;
        params.alert.openAlert({
          title: title,
          buttons: [
            {
              text: 'Confirm',
              onPress: () => {
                sendEvent({
                  eventType: 'DataEvent',
                  eventBizType: 'contact',
                  senderId: 'DataEvent',
                  action: 'create_group_result_fail_result',
                  params: {},
                });
              },
            },
          ],
        });
      }
      break;
    case 'manual_block_contact':
      {
        const extra = params.extra.getData?.() as {
          theme: ThemeContextType;
          i18n: AppStringSet;
        };
        const { contactInfo } = extra.i18n;
        params.alert.openAlert({
          title: contactInfo.blockAlert.title,
          message: contactInfo.blockAlert.message,
          buttons: [
            {
              text: contactInfo.blockAlert.cancelButton,
            },
            {
              text: contactInfo.blockAlert.confirmButton,
              onPress: () => {
                sendEventFromAlert({
                  eventType: 'DataEvent',
                  action: 'exec_block_contact',
                  params: alertEvent.params,
                  eventBizType: 'contact',
                });
              },
            },
          ],
        });
      }
      break;
    case 'manual_remove_contact':
      {
        const extra = params.extra.getData?.() as {
          theme: ThemeContextType;
          i18n: AppStringSet;
        };
        const { contactInfo } = extra.i18n;
        const s = alertEvent.params as { userId: string };
        params.alert.openAlert({
          title: `Block ${s.userId}`,
          message: contactInfo.deleteAlert.message,
          buttons: [
            {
              text: contactInfo.deleteAlert.cancelButton,
            },
            {
              text: contactInfo.deleteAlert.confirmButton,
              onPress: () => {
                sendEventFromAlert({
                  eventType: 'DataEvent',
                  action: 'exec_remove_contact',
                  params: alertEvent.params,
                  eventBizType: 'contact',
                });
              },
            },
          ],
        });
      }
      break;
    case 'manual_leave_group':
      {
        const extra = params.extra.getData?.() as {
          theme: ThemeContextType;
          i18n: AppStringSet;
        };
        const { groupInfo } = extra.i18n;
        params.alert.openAlert({
          title: groupInfo.leaveAlert.title,
          message: groupInfo.leaveAlert.message,
          buttons: [
            {
              text: groupInfo.leaveAlert.cancelButton,
            },
            {
              text: groupInfo.leaveAlert.confirmButton,
              onPress: () => {
                sendEventFromAlert({
                  eventType: 'DataEvent',
                  action: 'exec_leave_group',
                  params: alertEvent.params,
                  eventBizType: 'group',
                });
              },
            },
          ],
        });
      }
      break;
    case 'manual_destroy_group':
      {
        const extra = params.extra.getData?.() as {
          theme: ThemeContextType;
          i18n: AppStringSet;
        };
        const { groupInfo } = extra.i18n;
        params.alert.openAlert({
          title: groupInfo.destroyAlert.title,
          message: groupInfo.destroyAlert.message,
          buttons: [
            {
              text: groupInfo.destroyAlert.cancelButton,
            },
            {
              text: groupInfo.destroyAlert.confirmButton,
              onPress: () => {
                sendEventFromAlert({
                  eventType: 'DataEvent',
                  action: 'exec_destroy_group',
                  params: alertEvent.params,
                  eventBizType: 'group',
                });
              },
            },
          ],
        });
      }
      break;
    case 'remove_all_conversation_and_messages':
      params.alert.openAlert({
        title: 'Sure to delete all messages',
        buttons: [
          {
            text: 'Cancel',
            onPress: () => {},
          },
          {
            text: 'Confirm',
            onPress: () => {
              sendEventFromAlert({
                eventType: 'DataEvent',
                action: 'exec_remove_all_conversation_and_messages',
                params: {},
                eventBizType: 'setting',
              });
            },
          },
        ],
      });
      break;
    case 'manual_logout':
      params.alert.openAlert({
        title: 'Sure to logout',
        buttons: [
          {
            text: 'Cancel',
            onPress: () => {},
          },
          {
            text: 'Confirm',
            onPress: () => {
              sendEventFromAlert({
                eventType: 'DataEvent',
                action: 'exec_manual_logout',
                params: {},
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
