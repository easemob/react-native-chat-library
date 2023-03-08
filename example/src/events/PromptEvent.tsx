import type {
  DialogContextType,
  ExtraDataType,
  ThemeContextType,
} from 'react-native-chat-uikit';

import type { AppStringSet } from '../I18n/AppCStringSet.en';
import type { PromptActionEventType } from './Events';
import { type sendEventProps, sendEvent } from './sendEvent';
import type { BizEventType } from './types';

const sendEventFromPrompt = (
  params: Omit<sendEventProps, 'senderId' | 'timestamp'>
) => {
  sendEvent({
    ...params,
    senderId: 'SheetEvent',
  } as sendEventProps);
};

export function handlePromptEvent(params: {
  prompt: Pick<DialogContextType, 'openPrompt'>;
  event: any;
  extra: ExtraDataType;
}): boolean {
  const promptEvent = params.event as {
    eventBizType: BizEventType;
    action: PromptActionEventType;
    senderId: string;
    params: any;
    timestamp: number;
    key: string;
  };
  console.log(
    'test:handlePromptEvent:',
    promptEvent.eventBizType,
    promptEvent.action,
    promptEvent.senderId,
    promptEvent.timestamp,
    promptEvent.key
  );
  let ret = true;
  switch (promptEvent.action) {
    case 'modify_group_name':
      {
        const extra = params.extra.getData?.() as {
          theme: ThemeContextType;
          i18n: AppStringSet;
        };
        const { groupInfo } = extra.i18n;
        params.prompt.openPrompt({
          title: groupInfo.modify.name,
          placeholder: groupInfo.modify.namePrompt.placeholder,
          submitLabel: groupInfo.modify.namePrompt.confirm,
          cancelLabel: groupInfo.modify.namePrompt.cancel,
          onSubmit: (text: string) => {
            sendEventFromPrompt({
              eventType: 'DataEvent',
              action: 'exec_modify_group_name',
              params: {
                groupId: promptEvent.params.groupId,
                newGroupName: text,
              },
              eventBizType: 'group',
            });
          },
          onCancel() {
            console.log('test:onCancel:');
          },
        });
      }
      break;
    case 'modify_group_description':
      {
        const extra = params.extra.getData?.() as {
          theme: ThemeContextType;
          i18n: AppStringSet;
        };
        const { groupInfo } = extra.i18n;
        params.prompt.openPrompt({
          title: groupInfo.modify.description,
          placeholder: groupInfo.modify.descriptionPrompt.placeholder,
          submitLabel: groupInfo.modify.descriptionPrompt.confirm,
          cancelLabel: groupInfo.modify.descriptionPrompt.cancel,
          onSubmit: (text: string) => {
            sendEventFromPrompt({
              eventType: 'DataEvent',
              action: 'exec_modify_group_description',
              params: {
                groupId: promptEvent.params.groupId,
                newGroupDescription: text,
              },
              eventBizType: 'group',
            });
          },
          onCancel() {
            console.log('test:onCancel:');
          },
        });
      }
      break;
    case 'modify_my_name':
      params.prompt.openPrompt({
        title: 'Change NickName',
        placeholder: 'name',
        submitLabel: 'Confirm',
        cancelLabel: 'Cancel',
        onSubmit: (text: string) => {
          sendEventFromPrompt({
            eventType: 'DataEvent',
            action: 'exec_modify_my_name',
            params: { userId: promptEvent.params.userId, newMyName: text },
            eventBizType: 'setting',
          });
        },
        onCancel() {
          console.log('test:onCancel:');
        },
      });
      break;

    default:
      break;
  }
  return ret;
}
