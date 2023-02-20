import React from 'react';
import { Image, View } from 'react-native';

import { ICON_ASSETS } from '../../assets/icons';
import { timestamp } from '../utils/generator';
import Avatar from './Avatar';
import type { LocalIconName } from './Icon';

const AVATAR_ASSETS = [
  'agora_avatar_1',
  'agora_avatar_2',
  'agora_avatar_3',
  'agora_avatar_4',
  'agora_avatar_5',
  'agora_avatar_6',
  'agora_avatar_7',
  'agora_avatar_8',
  'agora_avatar_9',
  'agora_avatar_10',
  'agora_avatar_11',
  'agora_avatar_12',
];

type AvatarProps = {
  size: number;
  radius: number;
};

export function getDefaultAvatar({ size, radius }: AvatarProps): JSX.Element {
  const index: number = timestamp('second') % AVATAR_ASSETS.length;
  const key = AVATAR_ASSETS[index] as LocalIconName;
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={ICON_ASSETS[key]('')}
        resizeMode="cover"
        style={{ height: size, width: size, borderRadius: radius }}
        onLoad={(_) => {
          // console.log('test:getDefaultAvatar:', e);
        }}
        onError={(e) => {
          console.warn('test:getDefaultAvatar:', e);
        }}
      />
    </View>
  );
}

export function DefaultAvatarF({ size, radius }: AvatarProps): JSX.Element {
  const index: number = timestamp('second') % AVATAR_ASSETS.length;
  const key = AVATAR_ASSETS[index] as LocalIconName;
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Avatar uri={ICON_ASSETS[key]('')} size={size} radius={radius} />
    </View>
  );
}

export const DefaultAvatar = React.memo(DefaultAvatarF);
