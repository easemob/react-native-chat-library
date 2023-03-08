import * as React from 'react';
import {
  UikitModalPlaceholder,
  useThemeContext,
} from 'react-native-chat-uikit';

import { useAppI18nContext } from '../contexts/AppI18nContext';
import { handleAlertEvent } from './AlertEvent';
import { handleDataEvent } from './DataEvent';
import { handleMenuEvent } from './MenuEvent';
import { handlePromptEvent } from './PromptEvent';
import { handleSheetEvent } from './SheetEvent';
import { handleToastEvent } from './ToastEvent';
import { handleVoiceStateEvent } from './VoiceStateEvent';

export type ModalPlaceholderProps = React.PropsWithChildren<{}>;
export function ModalPlaceholder(props: ModalPlaceholderProps): JSX.Element {
  const theme = useThemeContext();
  const i18n = useAppI18nContext();

  const getData = () => {
    return {
      theme,
      i18n,
    } as any;
  };

  return (
    <UikitModalPlaceholder
      getForbidEvent={() => {
        return ['test'];
      }}
      getData={getData}
      handleAlertEvent={handleAlertEvent}
      handleDataEvent={handleDataEvent}
      handleMenuEvent={handleMenuEvent}
      handlePromptEvent={handlePromptEvent}
      handleSheetEvent={handleSheetEvent}
      handleToastEvent={handleToastEvent}
      handleVoiceStateEvent={handleVoiceStateEvent}
    >
      {props?.children}
    </UikitModalPlaceholder>
  );
}
