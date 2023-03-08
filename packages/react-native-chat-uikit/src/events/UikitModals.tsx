import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';

import { FragmentContainer } from '../containers';
import {
  DialogContextType,
  ToastContextType,
  useActionMenu,
  useAlert,
  useBottomSheet,
  useContentStateContext,
  usePrompt,
  useToastContext,
  VoiceStateContextType,
} from '../contexts';
import { handleAlertEvent } from './AlertEvent';
import { handleDataEvent } from './DataEvent';
import { handleMenuEvent } from './MenuEvent';
import { handlePromptEvent } from './PromptEvent';
import { handleSheetEvent } from './SheetEvent';
import { handleToastEvent } from './ToastEvent';
import type {
  ActionMenuEventType,
  AlertEventType,
  DataEventType,
  ExtraDataType,
  HandleDataType,
  PromptEventType,
  SheetEventType,
  ToastEventType,
  VoiceStateEventType,
} from './types';
import { handleVoiceStateEvent } from './VoiceStateEvent';

type UikitModalPlaceholderInternalRef = {
  getContext: () => {
    sheet: Pick<DialogContextType, 'openSheet'>;
    toast: ToastContextType;
    alert: Pick<DialogContextType, 'openAlert'>;
    prompt: Pick<DialogContextType, 'openPrompt'>;
    menu: Pick<DialogContextType, 'openMenu'>;
    voiceState: VoiceStateContextType;
    others: ExtraDataType;
  };
};
type UikitModalPlaceholderType = ExtraDataType & {
  propsRef?: React.RefObject<UikitModalPlaceholderInternalRef>;
};
type UikitModalPlaceholderInternalProps =
  React.PropsWithChildren<UikitModalPlaceholderType>;
const UikitModalPlaceholderInternal = (
  props: UikitModalPlaceholderInternalProps,
  forwardedRef?: React.ForwardedRef<UikitModalPlaceholderInternalRef>
) => {
  const { getData, children, getForbidEvent, propsRef } = props;
  console.log('test:UikitModalPlaceholderInternal:');
  const sheet = useBottomSheet();
  const toast = useToastContext();
  const alert = useAlert();
  const prompt = usePrompt();
  const menu = useActionMenu();
  const voiceState = useContentStateContext();
  const others = React.useMemo(() => {
    return {
      getData,
      getForbidEvent,
    } as ExtraDataType;
  }, [getData, getForbidEvent]);

  const getContext = React.useCallback((): {
    sheet: Pick<DialogContextType, 'openSheet'>;
    toast: ToastContextType;
    alert: Pick<DialogContextType, 'openAlert'>;
    prompt: Pick<DialogContextType, 'openPrompt'>;
    menu: Pick<DialogContextType, 'openMenu'>;
    voiceState: VoiceStateContextType;
    others: ExtraDataType;
  } => {
    console.log('test:UikitModalPlaceholderInternal:useImperativeHandle');
    return {
      sheet,
      toast,
      alert,
      prompt,
      menu,
      voiceState,
      others,
    };
  }, [alert, menu, others, prompt, sheet, toast, voiceState]);

  React.useImperativeHandle(
    forwardedRef,
    () => ({
      getContext: (): {
        sheet: Pick<DialogContextType, 'openSheet'>;
        toast: ToastContextType;
        alert: Pick<DialogContextType, 'openAlert'>;
        prompt: Pick<DialogContextType, 'openPrompt'>;
        menu: Pick<DialogContextType, 'openMenu'>;
        voiceState: VoiceStateContextType;
        others: ExtraDataType;
      } => {
        return getContext();
      },
    }),
    [getContext]
  );

  if (propsRef) {
    const propsMutableRef =
      propsRef as React.MutableRefObject<UikitModalPlaceholderInternalRef>;
    propsMutableRef.current.getContext = getContext;
  }

  return <>{children}</>;
};

const UikitModalPlaceholderInternalForward = React.forwardRef<
  UikitModalPlaceholderInternalRef,
  UikitModalPlaceholderInternalProps
>(UikitModalPlaceholderInternal);

type UikitModalPlaceholderProps = React.PropsWithChildren<
  ExtraDataType & HandleDataType
>;
export function UikitModalPlaceholder(
  props: UikitModalPlaceholderProps
): JSX.Element {
  console.log('test:UikitModalPlaceholder:');
  const forwardedRef = React.useRef<UikitModalPlaceholderInternalRef>(
    {} as any
  );
  const propsRef = React.useRef<UikitModalPlaceholderInternalRef>({} as any);

  React.useEffect(() => {
    console.log('test:UikitModalPlaceholder:load');
    const subToast = DeviceEventEmitter.addListener(
      'ToastEvent' as ToastEventType,
      (event) => {
        const { toast, others } = propsRef.current.getContext();
        if (
          props.handleToastEvent === undefined ||
          props.handleToastEvent({ toast: toast, event, extra: others }) ===
            false
        ) {
          handleToastEvent({ toast: toast, event, extra: others });
        }
      }
    );
    const subSheet = DeviceEventEmitter.addListener(
      'SheetEvent' as SheetEventType,
      (event) => {
        const { sheet, others } = propsRef.current.getContext();
        if (
          props.handleSheetEvent === undefined ||
          props.handleSheetEvent({ sheet: sheet, event, extra: others }) ===
            false
        ) {
          handleSheetEvent({ sheet: sheet, event, extra: others });
        }
      }
    );
    const subPrompt = DeviceEventEmitter.addListener(
      'PromptEvent' as PromptEventType,
      (event) => {
        const { prompt, others } = propsRef.current.getContext();
        if (
          props.handlePromptEvent === undefined ||
          props.handlePromptEvent({ prompt: prompt, event, extra: others }) ===
            false
        ) {
          handlePromptEvent({ prompt: prompt, event, extra: others });
        }
      }
    );
    const subAlert = DeviceEventEmitter.addListener(
      'AlertEvent' as AlertEventType,
      (event) => {
        const { alert, others } = forwardedRef.current.getContext();
        if (
          props.handleAlertEvent === undefined ||
          props.handleAlertEvent({ alert: alert, event, extra: others }) ===
            false
        ) {
          handleAlertEvent({ alert: alert, event, extra: others });
        }
      }
    );
    const subMenu = DeviceEventEmitter.addListener(
      'ActionMenuEvent' as ActionMenuEventType,
      (event) => {
        const { menu, others } = forwardedRef.current.getContext();
        if (
          props.handleMenuEvent === undefined ||
          props.handleMenuEvent({ menu: menu, event, extra: others }) === false
        ) {
          handleMenuEvent({ menu: menu, event, extra: others });
        }
      }
    );
    const subState = DeviceEventEmitter.addListener(
      'VoiceStateEvent' as VoiceStateEventType,
      (event) => {
        const { voiceState, others } = forwardedRef.current.getContext();
        if (
          props.handleVoiceStateEvent === undefined ||
          props.handleVoiceStateEvent({
            voiceState: voiceState,
            event,
            extra: others,
          }) === false
        ) {
          handleVoiceStateEvent({
            voiceState: voiceState,
            event,
            extra: others,
          });
        }
      }
    );
    const subData = DeviceEventEmitter.addListener(
      'DataEvent' as DataEventType,
      (event) => {
        const { others } = forwardedRef.current.getContext();
        if (
          props.handleDataEvent === undefined ||
          props.handleDataEvent({ event, extra: others }) === false
        ) {
          handleDataEvent({
            event,
            extra: others,
          });
        }
      }
    );
    return () => {
      console.log('test:UikitModalPlaceholder:unload');
      subToast.remove();
      subSheet.remove();
      subPrompt.remove();
      subAlert.remove();
      subMenu.remove();
      subState.remove();
      subData.remove();
    };
  }, [props]);

  return (
    <FragmentContainer>
      <UikitModalPlaceholderInternalForward
        ref={forwardedRef}
        propsRef={propsRef}
        {...props}
      />
    </FragmentContainer>
  );
}
