import type { Locale } from 'date-fns';
import en from 'date-fns/locale/en-US';
import {
  NotificationMessageDescriptionType,
  UIKitStringSet2,
} from 'react-native-chat-uikit';

export class AppStringSet extends UIKitStringSet2 {
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
    destroy: string;
    destroyAlert: {
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
    toast: string[];
  };
  requestList: {
    button: string[];
    description: (params: {
      type: NotificationMessageDescriptionType;
      user: string;
      group?: string;
    }) => string;
  };

  constructor(locate: Locale = en) {
    super(locate);
    this.header = {
      groupInvite: 'Invite',
      createConversation: 'Done',
      createGroup: 'Done',
      addMembers: 'Done',
    };
    this.login = {
      logo: 'AgoraChat',
      id: 'AgoraId',
      pass: 'Password',
      button: 'Log In',
      tip: 'No account?',
      register: 'Register',
    };
    this.register = {
      id: 'Enter a AgoraId',
      pass: 'Enter a Password',
      confirm: 'Confirm Password',
      button: 'Sign Up',
      back: 'Back to Login',
      comment: (code) => {
        switch (code) {
          case 1:
            return 'Password do not match';
          case 2:
            return 'Username has already been taken';
          case 3:
            return 'Change a short one please';
          case 4:
            return 'Latin letters and numbers only';
          case 5:
            return 'Registration Success';
          default:
            return '';
        }
      },
    };
    this.search = {
      placeholder: 'Search',
    };
    this.searchServer = {
      cancel: 'Cancel',
      contact: {
        placeholder: 'Contact ID',
        item: {
          button: (type?: 'noAdded' | 'hadAdded' | 'adding') => {
            switch (type) {
              case 'noAdded':
                return 'Add';
              case 'hadAdded':
                return 'Added';
              case 'adding':
                return 'Adding';
              default:
                return '';
            }
          },
        },
      },
      group: {
        placeholder: 'Group ID',
        item: {
          button: (type?: 'noJoined' | 'hadJoined' | 'applying') => {
            switch (type) {
              case 'noJoined':
                return 'Apply';
              case 'hadJoined':
                return 'Joined';
              case 'applying':
                return 'Applying';
              default:
                return '';
            }
          },
        },
      },
      toast: {
        contact: ['Application Sent', 'Application Passed'],
        group: ['Application Sent', 'Application Passed'],
      },
    };
    this.contactInfo = {
      name: (n: string) => n,
      chat: 'Chat',
      mute: 'Mute Notification',
      block: 'Block Contact',
      delete: 'Delete Contact',
      blockAlert: {
        title: 'Block NickName',
        message:
          'When you block this contact, you will not receive any messages from them.',
        cancelButton: 'Cancel',
        confirmButton: 'Confirm',
      },
      deleteAlert: {
        title: 'Delete NickName',
        message: 'Delte this contact and associated chat.',
        cancelButton: 'Cancel',
        confirmButton: 'Confirm',
      },
      toast: ['Contact Blocked', 'Contact Deleted'],
    };
    this.groupInfo = {
      name: (n: string) => n,
      groupDescription: 'Group description',
      chat: 'Chat',
      invite: 'Invite',
      members: 'Members',
      members_1: {
        owner: 'Group Owner',
        admin: 'Group Admin',
      },
      actionToast: {
        enum: (code: number) => code.toString(),
      },
      mute: 'Mute Notification',
      leave: 'Leave Group',
      leaveAlert: {
        title: 'Leave Group',
        message:
          'No prompt for other members and no group messages after you quit this group.',
        cancelButton: 'Cancel',
        confirmButton: 'Confirm',
      },
      destroy: 'Dismiss Group',
      destroyAlert: {
        title: 'Dismiss Group',
        message:
          'No prompt for other members and no group messages after you dismiss this group.',
        cancelButton: 'Cancel',
        confirmButton: 'Confirm',
      },
      modify: {
        name: 'Change group name',
        namePrompt: {
          placeholder: 'Group name',
          cancel: 'Cancel',
          confirm: 'Confirm',
        },
        description: 'Change group description',
        descriptionPrompt: {
          placeholder: 'Group description',
          cancel: 'Cancel',
          confirm: 'Confirm',
        },
        groupId: 'Copy Group ID',
      },
      inviteAlert: {
        title: 'Send group invitation',
        message:
          'You are about to invite nickname, nickname, nickname to the group that.',
        cancelButton: 'Cancel',
        confirmButton: 'Confirm',
      },
      toast: [
        'Invitation Sent',
        'Invitation failed',
        'Setup failed',
        'ID Copied',
        'Application Sent',
      ],
      memberSheet: {
        title: '',
        add: 'Add Contact',
        remove: 'Remove from Group',
        chat: 'Chat',
      },
    };
    this.conversation = {
      new: 'New Conversation',
      createGroup: 'Create a group',
      addContact: 'Search contacts',
      searchGroup: 'Search groups',
      joinPublicGroup: 'Join public groups',
    };
    this.settings = {
      name: 'NickName',
      id: 'AgoraId: xxx',
      privacy: 'Privacy',
      blockedList: 'Blocked List',
      about: 'About',
      sdkVersion: 'SDK version',
      uiVersion: 'UI Library version',
      policy: 'Legals Policies',
      more: 'More',
      logins: 'Logins',
      logout: 'Logout',
    };
    this.chat = {
      voiceButton: 'Hold to talk',
      voiceState: 'Swipe up to cancel',
    };
    this.tabbar = {
      request: 'Requests',
      contact: 'Contacts',
      group: 'Groups',
    };
    this.contactList = {
      groupSetting: {
        groupSetting: 'Group Settings',
        publicGroup: 'Public Group',
        memberInvite: 'Allow members to invite',
        createGroup: 'Create New Group',
      },
      toast: ['1', '2', '3', '4'],
    };
    this.requestList = {
      button: ['Accept', 'Accepted', 'Declined'],
      description: (params: {
        type: NotificationMessageDescriptionType;
        user: string;
        group?: string;
      }) => {
        switch (params.type) {
          case 'ContactInvitation':
            return `${params.user} wants to be your friend. Please accept the request.`;
          case 'ContactInvitationAccepted':
            return 'Your friend request has been accepted.';
          case 'ContactInvitationDeclined':
            return 'Your friend request has been declined.';
          case 'GroupInvitation':
            return `${params.user} invited you to join ${params.group}`;
          case 'GroupInvitationAccepted':
            return `You had been accepted to join ${params.group}.`;
          case 'GroupInvitationDeclined':
            return `You had been declined to join ${params.group}.`;
          case 'GroupRequestJoin':
            return `${params.user} request to join ${params.group}`;
          case 'GroupRequestJoinAccepted':
            return `You has been accepted to request from ${params.user}.`;
          case 'GroupRequestJoinDeclined':
            return `You has been declined to request from ${params.user}.`;

          default:
            return '';
        }
      },
    };
  }
}
