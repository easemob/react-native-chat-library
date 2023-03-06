import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';
import {
  type ActionMenuEventType,
  type AlertEventType,
  type PromptEventType,
  type SheetEventType,
  UikitModalPlaceholder,
  useActionMenu,
  useAlert,
  useBottomSheet,
  usePrompt,
  useToastContext,
} from 'react-native-chat-uikit';

import type { ToastEventType } from '../events';
import { handleAlertEvent } from './AlertEvent';
import { handleMenuEvent } from './MenuEvent';
import { handlePromptEvent } from './PromptEvent';
import { handleSheetEvent } from './SheetEvent';
import { handleToastEvent } from './ToastEvent';

export type ModalPlaceholderProps = React.PropsWithChildren<{}>;
const ModalPlaceholderInternal = React.memo((props: ModalPlaceholderProps) => {
  console.log('test:ModalPlaceholderInternal:load', props);
  const sheet = useBottomSheet();
  const toast = useToastContext();
  const alert = useAlert();
  const prompt = usePrompt();
  const menu = useActionMenu();
  const others = React.useMemo(() => {
    return {};
  }, []);

  React.useEffect(() => {
    console.log('test:ModalPlaceholderInternal:');
    const subToast = DeviceEventEmitter.addListener(
      'ToastEvent' as ToastEventType,
      (event) => {
        handleToastEvent({ toast: toast, event, extra: others });
      }
    );
    const subSheet = DeviceEventEmitter.addListener(
      'SheetEvent' as SheetEventType,
      (event) => {
        handleSheetEvent({ sheet: sheet, event, extra: others });
      }
    );
    const subPrompt = DeviceEventEmitter.addListener(
      'PromptEvent' as PromptEventType,
      (event) => {
        handlePromptEvent({ prompt: prompt, event, extra: others });
      }
    );
    const subAlert = DeviceEventEmitter.addListener(
      'AlertEvent' as AlertEventType,
      (event) => {
        handleAlertEvent({ alert: alert, event, extra: others });
      }
    );
    const subMenu = DeviceEventEmitter.addListener(
      'ActionMenuEvent' as ActionMenuEventType,
      (event) => {
        handleMenuEvent({ menu: menu, event, extra: others });
      }
    );
    return () => {
      console.log('test:ModalPlaceholderInternal:unload:');
      subToast.remove();
      subSheet.remove();
      subPrompt.remove();
      subAlert.remove();
      subMenu.remove();
    };
  }, [toast, sheet, alert, prompt, menu, others]);

  return <>{props.children}</>;
});

export function ModalPlaceholder(props: ModalPlaceholderProps): JSX.Element {
  return (
    <UikitModalPlaceholder
      getForbidEvent={() => {
        return ['test'];
      }}
    >
      <ModalPlaceholderInternal {...props} />
    </UikitModalPlaceholder>
  );
}
