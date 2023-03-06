import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';

import { FragmentContainer } from '../containers';
import {
  useActionMenu,
  useAlert,
  useBottomSheet,
  usePrompt,
  useToastContext,
} from '../contexts';
import { handleAlertEvent } from './AlertEvent';
import { handleMenuEvent } from './MenuEvent';
import { handlePromptEvent } from './PromptEvent';
import { handleSheetEvent } from './SheetEvent';
import { handleToastEvent } from './ToastEvent';
import type {
  ActionMenuEventType,
  AlertEventType,
  ExtraDataType,
  PromptEventType,
  SheetEventType,
  ToastEventType,
} from './types';

export type UikitModalPlaceholderProps = React.PropsWithChildren<ExtraDataType>;
const UikitModalPlaceholderInternal = React.memo(
  (props: UikitModalPlaceholderProps) => {
    const { getData, children, getForbidEvent } = props;
    console.log('test:UikitModalPlaceholderInternal:', getData?.());
    const sheet = useBottomSheet();
    const toast = useToastContext();
    const alert = useAlert();
    const prompt = usePrompt();
    const menu = useActionMenu();
    const others = React.useMemo(() => {
      return {
        getData,
        getForbidEvent,
      } as ExtraDataType;
    }, [getData, getForbidEvent]);

    React.useEffect(() => {
      console.log('test:UikitModalPlaceholderInternal:load');
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
        console.log('test:UikitModalPlaceholderInternal:unload');
        subToast.remove();
        subSheet.remove();
        subPrompt.remove();
        subAlert.remove();
        subMenu.remove();
      };
    }, [toast, sheet, alert, getData, prompt, menu, others]);

    return <>{children}</>;
  }
);

export function UikitModalPlaceholder(
  props: UikitModalPlaceholderProps
): JSX.Element {
  return (
    <FragmentContainer>
      <UikitModalPlaceholderInternal {...props} />
    </FragmentContainer>
  );
}
