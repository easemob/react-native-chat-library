import * as React from 'react';

import DevApp from './test_loading_rn';

export default function dev(): JSX.Element {
  return (
    <React.StrictMode>
      <DevApp />
    </React.StrictMode>
  );
}
