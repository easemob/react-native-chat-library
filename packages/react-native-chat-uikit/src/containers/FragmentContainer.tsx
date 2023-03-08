import * as React from 'react';
import { Text } from 'react-native';

import {
  ContentStateContextProvider,
  DialogContextProvider,
  ToastContextProvider,
} from '../contexts';

export type FragmentContainerProps = {
  children?: React.ReactNode;
  enableModals?: boolean;
};

export function FragmentContainer({
  children,
  enableModals,
}: FragmentContainerProps): JSX.Element {
  console.log('test:FragmentContainer:');

  if (enableModals === true) {
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
                    backgroundColor: 'purple',
                  }}
                >
                  hh
                </Text>
              ),
            }}
          >
            {children}
          </ContentStateContextProvider>
        </ToastContextProvider>
      </DialogContextProvider>
    );
  } else {
    return <>{children}</>;
  }
}
