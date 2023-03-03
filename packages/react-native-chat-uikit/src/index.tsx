import {
  Platform,
  requireNativeComponent,
  UIManager,
  ViewStyle,
} from 'react-native';
import { ChatClient, ChatOptions } from 'react-native-chat-sdk';

export function multiply(a: number, b: number): Promise<number> {
  const r = ChatClient.getInstance().init(
    new ChatOptions({ appKey: 'test', autoLogin: false })
  );
  console.log('test:', r);
  return Promise.resolve(a * b);
}
const LINKING_ERROR =
  `The package 'react-native-chat-uikit' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

type ChatUikitProps = {
  color: string;
  style: ViewStyle;
};

const ComponentName = 'ChatUikitView';

export const ChatUikitView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<ChatUikitProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };

// import type rn from 'react-native';
// import type { addons } from 'react-native';

export { FACE_ASSETS } from '../assets/faces';
export { ICON_ASSETS } from '../assets/icons';
export { default as ActionMenu } from './components/ActionMenu';
export { default as Alert } from './components/Alert';
export { default as Avatar } from './components/Avatar';
export { default as Badge } from './components/Badge';
export { default as Blank } from './components/Blank';
export { default as BottomSheet } from './components/BottomSheet';
export { default as Button } from './components/Button';
export { default as CheckButton } from './components/CheckButton';
export { default as ContentState } from './components/ContentState';
export { DefaultAvatar } from './components/DefaultAvatars';
export { default as DialogBox } from './components/DialogBox';
export { default as Divider } from './components/Divider';
export {
  default as DynamicHeightList,
  DynamicHeightListProps,
  DynamicHeightListRef,
} from './components/DynamicHeightList';
export {
  default as EqualHeightList,
  ItemComponent as EqualHeightListItemComponent,
  ItemData as EqualHeightListItemData,
  EqualHeightListProps,
  EqualHeightListRef,
  ListHeaderProps,
} from './components/EqualHeightList';
export { FaceList } from './components/FaceList';
export { LocalIcon, LocalIconName, VectorIcon } from './components/Icon';
export { default as Image } from './components/Image';
export { ListItemSeparator as DefaultListItemSeparator } from './components/ListItemSeparator';
export { ListSearchHeader as DefaultListSearchHeader } from './components/ListSearchHeader';
export { default as Loading } from './components/Loading';
export { default as LoadingButton } from './components/LoadingButton';
export { default as LoadingRN } from './components/LoadingRN';
export { default as MenuBar } from './components/MenuBar';
export { default as Modal } from './components/Modal';
export { default as Prompt } from './components/Prompt';
export { default as RadioButton } from './components/RadioButton';
export { default as SearchBar, SearchBarProps } from './components/SearchBar';
export { default as Switch } from './components/Switch';
export { default as TextInput } from './components/TextInput';
export { default as Toast } from './components/Toast';
export * from './containers';
export * from './contexts';
export * from './events';
// export * from './fragments';
export { useAsyncTask, useDeferredValue, useForceUpdate } from './hooks';
export { createStringSetEn, createStringSetFEn } from './I18n/StringSet.en';
export { CreateStringSet, StringSetOptions } from './I18n/StringSet.type';
export {
  createStringSetEn as createStringSetEn2,
  createStringSetFEn as createStringSetFEn2,
  UIKitStringSet as UIKitStringSet2,
} from './I18n2/CStringSet.en';
export {
  CreateStringSet as CreateStringSet2,
  StringSetOptions as StringSetOptions2,
} from './I18n2/CStringSet.type';
export { default as DevDebug } from './screens/DevDebug';
export { default as Placeholder } from './screens/Placeholder';
export * from './services';
export {
  defaultRatio,
  defaultScaleFactor,
  defaultScaleFactorS,
  getScaleFactor,
  getScaleFactorS,
  updateScaleFactor,
} from './styles/createScaleFactor';
export {
  default as createStyleSheet,
  createStyleSheetP,
} from './styles/createStyleSheet';
export { default as DarkTheme } from './theme/DarkTheme';
export { default as LightTheme } from './theme/LightTheme';
export * from './types';
export { darkPalette, lightPalette } from './utils/defaultColorPalette';
export { default as defaultHeaderHeight } from './utils/defaultHeaderHeight';
export { generateFileName, getFileExtension } from './utils/file';
export {
  getDateTimePoint,
  messageTimestamp,
  truncateContent,
  truncatedBadgeCount,
} from './utils/format';
export {
  arraySort,
  asyncTask,
  callbackToAsync,
  once,
  onceEx,
  queueTask,
  timeoutTask,
  versionToArray,
  wait,
} from './utils/function';
export { seqId, timestamp, uuid } from './utils/generator';
export {
  autoFocus,
  localUrl,
  playUrl,
  removeFileHeader,
} from './utils/platform';
export { throttle } from './utils/throttle';

// declare module 'example/src/common' {
//   import type DevDebugInternal from './example/src/common/screens/DevDebug';
//   export interface TestModuleStatic {
//     verifySnapshot: (done: (indicator?: any) => void) => void;
//     markTestPassed: (indicator: any) => void;
//     markTestCompleted: () => void;
//   }

//   export const TestModule: DevDebugInternal;
//   export type TestModule = DevDebugInternal;
// }

// function test222(): void {
//   interface ss extends rn.addons.TestModule {}
//   interface sss extends addons.TestModule {}
// }
