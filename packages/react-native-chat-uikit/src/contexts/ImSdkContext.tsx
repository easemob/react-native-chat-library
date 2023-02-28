import React from 'react';
import type { ChatClient } from 'react-native-chat-sdk';

import type { ChatSdkContextType } from './types';

export class UIKitChatSdkContext implements ChatSdkContextType {
  currentId: string;
  client: ChatClient;
  login: (params: {
    id: string;
    pass: string;
    type?: 'easemob' | 'agora' | undefined;
    onResult: (result: { result: boolean; error?: any }) => void;
  }) => Promise<void>;
  logout: (params: {
    onResult: (result: { result: boolean; error?: any }) => void;
  }) => Promise<void>;
  autoLogin: (params: {
    onResult: (result: { result: boolean; error?: any }) => void;
  }) => Promise<void>;
  getCurrentId: () => string;
  constructor(client: ChatClient) {
    this.currentId = '';
    this.client = client;
    this.login = async (params: {
      id: string;
      pass: string;
      type?: 'easemob' | 'agora' | undefined;
      onResult: (result: { result: boolean; error?: any }) => void;
    }): Promise<void> => {
      try {
        if (params.type === 'easemob') {
          await this.client.login(params.id, params.pass);
        } else {
          await this.client.loginWithAgoraToken(params.id, params.pass);
        }
        this.currentId = await this.client.getCurrentUsername();
        params.onResult?.({ result: true });
      } catch (error) {
        params.onResult?.({ result: false, error: error });
      }
    };
    this.logout = async (params: {
      onResult: (result: { result: boolean; error?: any }) => void;
    }): Promise<void> => {
      try {
        await this.client.logout();
        params.onResult?.({ result: true });
      } catch (error) {
        params.onResult?.({ result: false, error: error });
      }
    };
    this.autoLogin = async (params: {
      onResult: (result: { result: boolean; error?: any }) => void;
    }): Promise<void> => {
      try {
        const result = await this.client.isLoginBefore();
        const autoLoginFlag = this.client.options?.autoLogin;
        if (autoLoginFlag === true) {
          this.currentId = await this.client.getCurrentUsername();
        }
        params.onResult?.({ result: result });
      } catch (error) {
        params.onResult?.({ result: false, error: error });
      }
    };
    this.getCurrentId = () => this.currentId;
  }
}

type ImSdkContextProps = React.PropsWithChildren<{ sdk: ChatSdkContextType }>;

const ChatSdkContext = React.createContext<ChatSdkContextType | undefined>(
  undefined
);
ChatSdkContext.displayName = 'UIKitChatSdkContext';

export function ChatSdkContextProvider({ sdk, children }: ImSdkContextProps) {
  return (
    <ChatSdkContext.Provider value={sdk}>{children}</ChatSdkContext.Provider>
  );
}

export function useChatSdkContext(): ChatSdkContextType {
  const sdk = React.useContext(ChatSdkContext);
  if (!sdk) throw Error(`${ChatSdkContext.displayName} is not provided`);
  return sdk;
}
