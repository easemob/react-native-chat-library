import * as React from 'react';
import { Text, ViewProps } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import {
  ContentStateContextProvider,
  DialogContextProvider,
  ThemeContextType,
  ToastContextProvider,
  useThemeContext,
} from '../contexts';
import { createStyleSheetP } from '../styles/createStyleSheet';

export interface ScreenContainerProps extends ViewProps {
  children?: React.ReactNode;
  mode?: 'padding' | 'margin';
  edges?: readonly Edge[];
}

export function ScreenContainer({
  children,
  mode,
  edges,
  ...others
}: ScreenContainerProps): JSX.Element {
  console.log('test:ScreenContainer:', mode, edges);

  return (
    <DialogContextProvider>
      <ToastContextProvider>
        <ContentStateContextProvider
          content={{
            children: (
              <Text
                style={{
                  height: 100,
                  width: 100,
                  backgroundColor: 'blue',
                }}
              >
                hh
              </Text>
            ),
          }}
        >
          <SafeAreaView
            mode={mode}
            style={useStyleSheet().safe}
            edges={edges}
            {...others}
          >
            {children}
          </SafeAreaView>
        </ContentStateContextProvider>
      </ToastContextProvider>
    </DialogContextProvider>
  );
}

const useStyleSheet = (): { safe: any } => {
  const styles = createStyleSheetP((theme: ThemeContextType) => {
    const { colors } = theme;
    return {
      safe: { flex: 1, backgroundColor: colors.background },
    };
  }, useThemeContext());
  return styles;
};
