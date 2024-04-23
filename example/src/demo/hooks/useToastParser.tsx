import { type UIKitError, useI18nContext } from 'react-native-chat-uikit';

export function useOnFinishedParser() {
  const { tr } = useI18nContext();
  const parseFinished = (eventType: string) => {
    switch (eventType) {
      case 'copyGroupId':
        return tr('_demo_copyGroupId');
      case 'copyUserId':
        return tr('_demo_copyUserId');

      default:
        break;
    }
    return eventType;
  };
  return {
    parseFinished,
  };
}

export function useOnErrorParser() {
  const parseError = (error: UIKitError) => {
    return error.toString();
  };
  return {
    parseError,
  };
}
