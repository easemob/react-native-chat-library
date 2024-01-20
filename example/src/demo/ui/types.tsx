import type { InfoProps } from 'react-native-chat-uikit';

/**
 * User State.
 */
export type UserState = 'online' | 'offline' | 'busy' | 'leave' | 'no-disturb';

export type MineInfoProps = InfoProps & {
  userId: string;
  userName?: string;
  userAvatar?: string;
  onClickedLogout?: () => void;
};
