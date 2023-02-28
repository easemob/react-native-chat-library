import type { ChatClient } from 'react-native-chat-sdk';

import type {
  ButtonStateColor,
  ColorPaletteType,
  ContentStateProps,
  DialogPropsT,
  FontAttributes,
  InputStateColor,
  ItemColor,
  ToastType,
} from '../types';

export type ThemeContextType = {
  scheme: 'light' | 'dark' | string;
  paperColors: ColorPaletteType;
  colors: {
    primary: string;
    background: string;
    text: string;
    border: string;
    backdrop: string;
    button: ButtonStateColor;
    input: InputStateColor;
    error: string;
    badge: ItemColor;
    avatar: string;
    transparent: 'transparent';
    card: {
      background: string;
      title: string;
      body: string;
      button: string;
    };
    divider: string;
  };
  fonts: {
    primary: FontAttributes;
    button: FontAttributes;
    input: FontAttributes;
    title: FontAttributes;
    subtitle: FontAttributes;
    body: FontAttributes;
    caption: FontAttributes;
    sheet: FontAttributes;
  };
};

export interface ChatSdkContextType {
  client: ChatClient;
  login: (params: {
    id: string;
    pass: string;
    type?: 'easemob' | 'agora';
    onResult: (result: { result: boolean; error?: any }) => void;
  }) => Promise<void>;
  logout: (params: {
    onResult: (result: { result: boolean; error?: any }) => void;
  }) => Promise<void>;
  autoLogin: (params: {
    onResult: (result: { result: boolean; error?: any }) => void;
  }) => Promise<void>;
  getCurrentId: () => string;
}

export type HeaderContextType = {
  defaultHeight: number;
  defaultStatusBarTranslucent: boolean;
  defaultTitleAlign: 'left' | 'center';
  defaultTopInset: number;
};

export interface StringSetContextType {
  xxx: {
    yyy: string;
    zzz: (a: Date) => string;
  };
  ttt: {
    yyy: string;
  };
  header: {
    groupInvite: string;
    createConversation: string;
    createGroup: string;
    addMembers: string;
  };
  login: {
    logo: string;
    id: string;
    pass: string;
    button: string;
    tip: string;
    register: string;
  };
  register: {
    id: string;
    pass: string;
    confirm: string;
    button: string;
    back: string;
    comment: (code: number) => string;
  };
  search: {
    placeholder: string;
  };
  searchServer: {
    cancel: string;
    contact: {
      placeholder: string;
      item: {
        button: (type?: 'noAdded' | 'hadAdded' | 'adding') => string;
      };
    };
    group: {
      placeholder: string;
      item: {
        button: (type?: 'noJoined' | 'hadJoined' | 'applying') => string;
      };
    };
    toast: {
      contact: string[];
      group: string[];
    };
  };
  contactInfo: {
    name: (name: string) => string;
    chat: string;
    mute: string;
    block: string;
    blockAlert: {
      title: string;
      message: string;
      cancelButton: string;
      confirmButton: string;
    };
    delete: string;
    deleteAlert: {
      title: string;
      message: string;
      cancelButton: string;
      confirmButton: string;
    };
    toast: string[];
  };
  groupInfo: {
    name: (name: string) => string;
    groupDescription: string;
    chat: string;
    invite: string;
    members: string;
    members_1: {
      owner: string;
      admin: string;
    };
    actionToast: {
      enum: (code: number) => string;
    };
    mute: string;
    leave: string;
    leaveAlert: {
      title: string;
      message: string;
      cancelButton: string;
      confirmButton: string;
    };
    modify: {
      name: string;
      namePrompt: {
        placeholder: string;
        cancel: string;
        confirm: string;
      };
      description: string;
      descriptionPrompt: {
        placeholder: string;
        cancel: string;
        confirm: string;
      };
      groupId: string;
    };
    inviteAlert: {
      title: string;
      message: string;
      cancelButton: string;
      confirmButton: string;
    };
    toast: string[];
    memberSheet: {
      title: string;
      add: string;
      remove: string;
      chat: string;
    };
  };
  conversation: {
    new: string;
    createGroup: string;
    addContact: string;
    searchGroup: string;
    joinPublicGroup: string;
  };
  settings: {
    name: string;
    id: string;
    privacy: string;
    blockedList: string;
    about: string;
    sdkVersion: string;
    uiVersion: string;
    policy: string;
    more: string;
    logins: string;
    logout: string;
  };
  chat: {
    voiceButton: string;
    voiceState: string;
  };
  tabbar: {
    request: string;
    contact: string;
    group: string;
  };
  contactList: {
    groupSetting: {
      groupSetting: string;
      publicGroup: string;
      memberInvite: string;
      createGroup: string;
    };
  };
  requestList: {
    button: string[];
  };
}

export type ToastContextType = {
  showToast(text: string, type?: ToastType): void;
};

export type DialogContextType = {
  openMenu: (props: DialogPropsT<'ActionMenu'>) => void;
  openAlert: (props: DialogPropsT<'Alert'>) => void;
  openPrompt: (props: DialogPropsT<'Prompt'>) => void;
  openSheet: (props: DialogPropsT<'BottomSheet'>) => void;
};

export type VoiceStateContextType = {
  showState: (props?: ContentStateProps) => void;
  hideState: () => void;
};
