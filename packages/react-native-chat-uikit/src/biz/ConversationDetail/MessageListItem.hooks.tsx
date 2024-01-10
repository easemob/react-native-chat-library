import { Dimensions, Image } from 'react-native';
import {
  ChatCustomMessageBody,
  ChatImageMessageBody,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageDirection,
  ChatMessageStatus,
  ChatMessageType,
  ChatVideoMessageBody,
} from 'react-native-chat-sdk';

import type { IconNameType } from '../../assets';
import {
  gCustomMessageCardEventType,
  gCustomMessageCreateGroupEventType,
  gCustomMessageRecallEventType,
  gMessageAttributeQuote,
  gMessageAttributeVoiceReadFlag,
} from '../../chat';
import { Services } from '../../services';
import { ImageUrl, localUrlEscape } from '../../utils';
import type { MessageStateType } from './types';

export function isSupportMessage(msg: ChatMessage) {
  if (msg.body.type === ChatMessageType.CMD) {
    return false;
  } else if (msg.body.type === ChatMessageType.LOCATION) {
    return false;
  } else if (msg.body.type === ChatMessageType.COMBINE) {
    return false;
  } else if (msg.body.type === ChatMessageType.CUSTOM) {
    const body = msg.body as ChatCustomMessageBody;
    if (body.event === gCustomMessageCardEventType) {
      return true;
    }
    return false;
  }
  return true;
}
export function getMessageState(msg: ChatMessage): MessageStateType {
  let ret: MessageStateType = 'none';
  if (msg.direction === ChatMessageDirection.RECEIVE) {
    switch (msg.body.type) {
      case ChatMessageType.VOICE: {
        const r = msg.attributes?.[gMessageAttributeVoiceReadFlag] as
          | boolean
          | undefined;
        ret = r !== true ? 'no-play' : 'none';
      }
    }
  } else {
    if (msg.status === ChatMessageStatus.SUCCESS) {
      ret = 'send-success';
    } else if (msg.status === ChatMessageStatus.FAIL) {
      ret = 'send-fail';
    } else {
      ret = 'sending';
    }
    if (
      msg.chatType === ChatMessageChatType.PeerChat &&
      msg.hasDeliverAck === true
    ) {
      ret = 'send-to-peer';
    }
    if (
      msg.chatType === ChatMessageChatType.PeerChat &&
      msg.hasReadAck === true
    ) {
      ret = 'peer-read';
    }
  }
  return ret;
}

export function getStateIcon(state: MessageStateType): IconNameType {
  let ret = 'loading' as IconNameType;
  switch (state) {
    case 'loading-attachment':
      ret = 'loading';
      break;
    case 'send-success':
      ret = 'check';
      break;
    case 'send-fail':
      ret = 'exclamation_mark_in_circle';
      break;
    case 'send-to-peer':
      ret = 'check_2';
      break;
    case 'peer-read':
      ret = 'check_2';
      break;
    case 'sending':
      ret = 'loading';
      break;
    case 'no-play':
      ret = 'dot_1';
      break;
    case 'none':
      ret = 'loading';
      break;

    default:
      break;
  }
  return ret;
}
export function getStateIconColor(state: MessageStateType): string {
  let ret = 'common';
  switch (state) {
    case 'loading-attachment':
      ret = 'common';
      break;
    case 'send-success':
      ret = 'common';
      break;
    case 'send-fail':
      ret = 'red';
      break;
    case 'send-to-peer':
      ret = 'common';
      break;
    case 'peer-read':
      ret = 'green';
      break;
    case 'sending':
      ret = 'common';
      break;
    case 'no-play':
      ret = 'red';
      break;
    case 'none':
      ret = 'common';
      break;

    default:
      break;
  }
  return ret;
}

export async function getImageThumbUrl(msg: ChatMessage) {
  const body = msg.body as ChatImageMessageBody;
  // todo: file is or not exist
  // todo: 判断顺序，如果是发送的消息，本地缩略图 -》 本地大图 =》 服务器缩略图
  // todo: 如果是接收的消息，本地缩略图 =》 服务器缩略图
  let isExisted = await Services.dcs.isExistedFile(body.thumbnailLocalPath);
  if (isExisted) {
    return localUrlEscape(ImageUrl(body.thumbnailLocalPath));
    // return `file://${body.thumbnailLocalPath}`;
  }
  isExisted = await Services.dcs.isExistedFile(body.localPath);
  if (isExisted) {
    return localUrlEscape(ImageUrl(body.localPath));
    // return `file://${body.localPath}`;
  }
  return body.thumbnailRemotePath;
}

export async function getVideoThumbUrl(
  msg: ChatMessage,
  onGenerate?: (url: string) => void
) {
  const body = msg.body as ChatVideoMessageBody;
  // todo: file is or not exist
  // todo: 判断顺序，如果是发送的消息，本地缩略图 -》 本地大图 =》 服务器缩略图
  // todo: 如果是接收的消息，本地缩略图 =》 服务器缩略图
  let isExisted = await Services.dcs.isExistedFile(body.thumbnailLocalPath);
  if (isExisted) {
    return localUrlEscape(ImageUrl(body.thumbnailLocalPath));
    // return `file://${body.thumbnailLocalPath}`;
  }
  isExisted =
    body.thumbnailRemotePath !== undefined &&
    body.thumbnailRemotePath.length > 0
      ? body.thumbnailRemotePath.startsWith('http')
      : false;
  if (isExisted) {
    return body.thumbnailRemotePath;
  } else {
    if (
      body.localPath !== undefined &&
      body.localPath.length > 0 &&
      body.thumbnailLocalPath !== undefined &&
      body.thumbnailLocalPath.length > 0
    ) {
      Services.ms
        .getVideoThumbnail({ url: body.localPath })
        .then((url) => {
          if (url !== undefined && url.length > 0) {
            onGenerate?.(url);
          }
        })
        .catch();
    }
  }
  return undefined;
}

const hw = (params: {
  height: number;
  width: number;
  maxWidth: number;
}): { width: number; height: number } => {
  const { height, width, maxWidth } = params;
  let ret;
  if (width / height >= 10) {
    const w = maxWidth;
    ret = {
      width: w,
      height: w * 0.1,
    };
  } else if (width * 4 >= 3 * height) {
    const w = maxWidth;
    ret = {
      width: w,
      height: w * (height / width),
    };
  } else if (width * 10 >= 1 * height) {
    const h = (maxWidth * 4) / 3;
    ret = {
      width: (width / height) * h,
      height: h,
    };
  } else {
    // width / height < 1 / 10
    const h = (maxWidth * 4) / 3;
    ret = {
      width: 0.1 * h,
      height: h,
    };
  }
  return ret;
};
export function getImageShowSize(msg: ChatMessage, maxW?: number) {
  const maxWidth = maxW ?? Dimensions.get('window').width * 0.6;
  const body = msg.body as ChatImageMessageBody | ChatVideoMessageBody;
  const width = body.width;
  const height = body.height;
  if (
    width !== undefined &&
    height !== undefined &&
    width !== 0 &&
    height !== 0
  ) {
    return hw({ width, height, maxWidth });
  } else {
    return {
      width: maxWidth,
      height: maxWidth,
    };
  }
}

export function getImageSizeFromUrl(url: string) {
  Image.getSize(
    url,
    (width: number, height: number) => {
      console.log('dev:getImageSizeFromUrl', width, height);
    },
    (error: any) => {
      console.log('dev:getImageSizeFromUrl', error);
    }
  );
}

// export class VoicePlayManager {
//   static list: Map<string, boolean> = new Map();
//   static setPlaying(msgId: string, isVoicePlaying: boolean) {
//     if (isVoicePlaying === true) {
//       this.list.set(msgId, isVoicePlaying);
//     } else {
//       this.list.delete(msgId);
//     }
//   }
//   static isVoicePlaying(msgId: string) {
//     return this.list.get(msgId) === true;
//   }
// }

export function getFileSize(size: number) {
  if (size === undefined) {
    return '0B';
  }
  if (size < 1024) {
    return `${size}B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)}KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(1)}MB`;
  } else {
    return `${(size / 1024 / 1024 / 1024).toFixed(1)}GB`;
  }
}

// export function getFormatTime(time: number) {
//   return formatTsForConvDetail(time);
// }

export function getMessageBubblePadding(msg: ChatMessage) {
  if (msg.body.type === ChatMessageType.IMAGE) {
    return {
      paddingHorizontal: undefined,
      paddingVertical: undefined,
    };
  } else if (msg.body.type === ChatMessageType.VIDEO) {
    return {
      paddingHorizontal: undefined,
      paddingVertical: undefined,
    };
  } else if (msg.body.type === ChatMessageType.CUSTOM) {
    const body = msg.body as ChatCustomMessageBody;
    if (body.event === gCustomMessageCardEventType) {
      return {
        paddingHorizontal: undefined,
        paddingVertical: undefined,
      };
    }
  }
  return {
    paddingHorizontal: 12,
    paddingVertical: 7,
  };
}

export function isQuoteMessage(msg: ChatMessage, _msgQuote?: ChatMessage) {
  const quote = msg.attributes?.[gMessageAttributeQuote];
  return quote !== undefined;
}

export function getQuoteAttribute(msg: ChatMessage, _msgQuote?: ChatMessage) {
  const quoteAttributes = msg.attributes?.[gMessageAttributeQuote] as
    | {
        msgID: string;
        msgPreview: string;
        msgSender: string;
        msgType: ChatMessageType;
      }
    | undefined;
  return quoteAttributes;
}

export function getSystemTip(
  msg: ChatMessage,
  tr: (key: string, ...args: any[]) => string
): string {
  if (msg.body.type !== ChatMessageType.CUSTOM) {
    return '';
  }
  const body = msg.body as ChatCustomMessageBody;
  if (body.event === gCustomMessageRecallEventType) {
    try {
      const content = JSON.parse(body.params?.recall as any) as {
        text: string;
        self: string;
        from: string;
        fromName: string;
      };
      return tr(
        content.text,
        content.self === content.from,
        content.fromName ?? content.from
      );
    } catch (error) {
      return tr('_uikit_msg_tip_recall');
    }
  } else if (body.event === gCustomMessageCreateGroupEventType) {
    try {
      const content = JSON.parse(body.params?.recall as any) as {
        text: string;
        self: string;
      };
      return tr(content.text);
    } catch (error) {
      return tr('_uikit_msg_tip_create_group_success');
    }
  }
  return '';
}
