import { DeviceEventEmitter } from 'react-native';
import {
  ChatClient,
  ChatGroup,
  ChatGroupEventListener,
} from 'react-native-chat-sdk';

export const GroupChatSdkEvent = 'GroupChatSdkEvent';
export type GroupChatSdkEventType =
  | 'onInvitationReceived'
  | 'onRequestToJoinReceived'
  | 'onRequestToJoinAccepted'
  | 'onRequestToJoinDeclined'
  | 'onInvitationAccepted'
  | 'onInvitationDeclined'
  | 'onUserRemoved'
  | 'onGroupDestroyed'
  | 'onAutoAcceptInvitation'
  | 'onMuteListAdded'
  | 'onMuteListRemoved'
  | 'onAdminAdded'
  | 'onAdminRemoved'
  | 'onOwnerChanged'
  | 'onMemberJoined'
  | 'onMemberExited'
  | 'onMemberExited'
  | 'onAnnouncementChanged'
  | 'onSharedFileAdded'
  | 'onSharedFileDeleted'
  | 'onAllowListAdded'
  | 'onAllowListRemoved'
  | 'onAllGroupMemberMuteStateChanged'
  | 'onDetailChanged'
  | 'onStateChanged';

export class GroupEventDispatch {
  name: string;
  listener?: ChatGroupEventListener;
  constructor() {
    console.log('test:', GroupEventDispatch.name);
    this.name = GroupEventDispatch.name;
  }
  init(): void {
    console.log('test:init:', GroupEventDispatch.name);
    this.listener = {
      onInvitationReceived: (params: {
        groupId: string;
        inviter: string;
        groupName: string;
        reason?: string;
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onInvitationReceived' as GroupChatSdkEventType,
          params: params,
        });
      },
      onRequestToJoinReceived: (params: {
        groupId: string;
        applicant: string;
        groupName?: string;
        reason?: string;
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onRequestToJoinReceived' as GroupChatSdkEventType,
          params: params,
        });
      },
      onRequestToJoinAccepted: (params: {
        groupId: string;
        accepter: string;
        groupName?: string;
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onRequestToJoinAccepted' as GroupChatSdkEventType,
          params: params,
        });
      },
      onRequestToJoinDeclined: (params: {
        groupId: string;
        decliner: string;
        groupName?: string;
        reason?: string;
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onRequestToJoinDeclined' as GroupChatSdkEventType,
          params: params,
        });
      },
      onInvitationAccepted: (params: {
        groupId: string;
        invitee: string;
        reason?: string;
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onInvitationAccepted' as GroupChatSdkEventType,
          params: params,
        });
      },
      onInvitationDeclined: (params: {
        groupId: string;
        invitee: string;
        reason?: string;
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onInvitationDeclined' as GroupChatSdkEventType,
          params: params,
        });
      },
      onUserRemoved: (params: {
        groupId: string;
        groupName?: string;
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onUserRemoved' as GroupChatSdkEventType,
          params: params,
        });
      },
      onGroupDestroyed: (params: {
        groupId: string;
        groupName?: string;
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onGroupDestroyed' as GroupChatSdkEventType,
          params: params,
        });
      },
      onAutoAcceptInvitation: (params: {
        groupId: string;
        inviter: string;
        inviteMessage?: string;
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onAutoAcceptInvitation' as GroupChatSdkEventType,
          params: params,
        });
      },
      onMuteListAdded: (params: {
        groupId: string;
        mutes: string[];
        muteExpire?: number;
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onMuteListAdded' as GroupChatSdkEventType,
          params: params,
        });
      },
      onMuteListRemoved: (params: {
        groupId: string;
        mutes: string[];
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onMuteListRemoved' as GroupChatSdkEventType,
          params: params,
        });
      },
      onAdminAdded: (params: { groupId: string; admin: string }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onAdminAdded' as GroupChatSdkEventType,
          params: params,
        });
      },
      onAdminRemoved: (params: { groupId: string; admin: string }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onAdminRemoved' as GroupChatSdkEventType,
          params: params,
        });
      },
      onOwnerChanged: (params: {
        groupId: string;
        newOwner: string;
        oldOwner: string;
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onOwnerChanged' as GroupChatSdkEventType,
          params: params,
        });
      },
      onMemberJoined: (params: { groupId: string; member: string }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onMemberJoined' as GroupChatSdkEventType,
          params: params,
        });
      },
      onMemberExited: (params: { groupId: string; member: string }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onMemberExited' as GroupChatSdkEventType,
          params: params,
        });
      },
      onAnnouncementChanged: (params: {
        groupId: string;
        announcement: string;
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onAnnouncementChanged' as GroupChatSdkEventType,
          params: params,
        });
      },
      onSharedFileAdded: (params: {
        groupId: string;
        sharedFile: string;
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onSharedFileAdded' as GroupChatSdkEventType,
          params: params,
        });
      },
      onSharedFileDeleted: (params: {
        groupId: string;
        fileId: string;
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onSharedFileDeleted' as GroupChatSdkEventType,
          params: params,
        });
      },
      onAllowListAdded: (params: {
        groupId: string;
        members: string[];
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onAllowListAdded' as GroupChatSdkEventType,
          params: params,
        });
      },
      onAllowListRemoved: (params: {
        groupId: string;
        members: string[];
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onAllowListRemoved' as GroupChatSdkEventType,
          params: params,
        });
      },
      onAllGroupMemberMuteStateChanged: (params: {
        groupId: string;
        isAllMuted: boolean;
      }): void => {
        console.log('test:', params);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onAllGroupMemberMuteStateChanged' as GroupChatSdkEventType,
          params: params,
        });
      },
      onDetailChanged: (group: ChatGroup): void => {
        console.log('test:', group);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onDetailChanged' as GroupChatSdkEventType,
          params: { group },
        });
      },
      onStateChanged: (group: ChatGroup): void => {
        console.log('test:', group);
        DeviceEventEmitter.emit(GroupChatSdkEvent, {
          type: 'onStateChanged' as GroupChatSdkEventType,
          params: { group },
        });
      },
    } as ChatGroupEventListener;
    ChatClient.getInstance().groupManager.addGroupListener(this.listener);
  }
  unInit(): void {
    console.log('test:unInit:', GroupEventDispatch.name);
    if (this.listener) {
      ChatClient.getInstance().groupManager.removeGroupListener(this.listener);
    }
  }
}
