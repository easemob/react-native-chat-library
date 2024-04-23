import {
  NavigationAction,
  NavigationState,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as React from 'react';
import { BackHandler, DeviceEventEmitter, Platform } from 'react-native';
import { CallType, CallUser } from 'react-native-chat-callkit';
import {
  ChatGroup,
  ChatMultiDeviceEvent,
  ChatPushConfig,
  ChatPushRemindType,
  ChatSilentModeParamType,
} from 'react-native-chat-sdk';
import {
  ChatOptionsType,
  ChatServiceListener,
  createDefaultStringSet,
  DataModel,
  DataModelType,
  DataProfileProvider,
  DisconnectReasonType,
  generateNeutralColor,
  generateNeutralSpecialColor,
  generatePrimaryColor,
  getChatService,
  getReleaseArea,
  LanguageCode,
  StringSet,
  UIGroupListListener,
  UIKitError,
  UIListenerType,
  useDarkTheme,
  useForceUpdate,
  useLightTheme,
  usePermissions,
  usePresetPalette,
} from 'react-native-chat-uikit';

import { createStringSetCn, createStringSetEn } from '../common';
import { boloo_da_ttf, twemoji_ttf } from '../common/assets';
import {
  appKey as gAppKey,
  boloo_da_ttf_name,
  enableDNSConfig,
  fcmSenderId,
  imPort,
  imServer,
  isDevMode,
  restServer,
  twemoji_ttf_name,
  useSendBox,
} from '../common/const';
import {
  checkFCMPermission,
  requestFCMPermission,
  requestFcmToken,
  setBackgroundMessageHandler,
} from '../common/fcm';
import { RestApi } from '../common/rest.api';
import type { RootParamsList, RootParamsName } from '../routes';
import { formatNavigationState } from '../utils/utils';
import { useUserInfo } from './useUserInfo';

export function useApp() {
  const im = getChatService();
  // const list = React.useRef<Map<string, DataModel>>(new Map());
  const permissionsRef = React.useRef(false);
  const { getPermission } = usePermissions();
  const initialRouteName = React.useRef('Splash' as RootParamsName).current;
  const autoLogin = React.useRef(true).current;
  const palette = usePresetPalette();
  const paletteRef = React.useRef(palette);
  const ra = getReleaseArea();
  const releaseAreaRef = React.useRef(ra);
  const dark = useDarkTheme(paletteRef.current, releaseAreaRef.current);
  const light = useLightTheme(paletteRef.current, releaseAreaRef.current);
  const isLightRef = React.useRef<boolean>(true);
  const languageRef = React.useRef<LanguageCode>('zh-Hans');
  const translateLanguageRef = React.useRef<LanguageCode>('zh-Hans');
  const isNavigationReadyRef = React.useRef(false);
  const isContainerReadyRef = React.useRef(false);
  const isFontReadyRef = React.useRef(false);
  const isReadyRef = React.useRef(false);
  const enablePresenceRef = React.useRef(false);
  const enableReactionRef = React.useRef(false);
  const enableThreadRef = React.useRef(false);
  const enableTranslateRef = React.useRef(false);
  const enableAVMeetingRef = React.useRef(false);
  const enableOfflinePushRef = React.useRef(false);
  const pageDeepRef = React.useRef(0);
  const [fontsLoaded] = useFonts({
    [twemoji_ttf_name]: twemoji_ttf,
    [boloo_da_ttf_name]: boloo_da_ttf,
  });
  const rootRef = useNavigationContainerRef<RootParamsList>();
  const imServerRef = React.useRef(imServer);
  const imPortRef = React.useRef(imPort);
  const enableDNSConfigRef = React.useRef(enableDNSConfig);
  const [_initParams, setInitParams] = React.useState(false);
  const {
    getDataFromStorage,
    updateDataFromServer,
    updateDataToStorage,
    users,
  } = useUserInfo();

  const { updater } = useForceUpdate();

  const getOptions = React.useCallback(() => {
    return {
      appKey: gAppKey,
      debugModel: isDevMode,
      autoLogin: autoLogin,
      autoAcceptGroupInvitation: true,
      requireAck: true,
      requireDeliveryAck: true,
      restServer: useSendBox ? restServer : undefined,
      imServer: useSendBox ? imServerRef.current : undefined,
      imPort: useSendBox ? imPortRef.current : undefined,
      enableDNSConfig: useSendBox ? enableDNSConfigRef.current : undefined,
      pushConfig:
        fcmSenderId && fcmSenderId.length > 0
          ? new ChatPushConfig({
              deviceId: fcmSenderId,
              deviceToken: '',
            })
          : undefined,
    } as ChatOptionsType;
  }, [autoLogin]);

  const onRequestMultiData = React.useCallback(
    (params: {
      ids: Map<DataModelType, string[]>;
      result: (
        data?: Map<DataModelType, DataModel[]>,
        error?: UIKitError
      ) => void;
    }) => {
      const userIds = params.ids.get('user') ?? [];
      const noExistedIds = [] as string[];
      userIds.forEach((id) => {
        const isExisted = users.current.get(id);
        if (
          isExisted &&
          isExisted.avatarURL &&
          isExisted.avatarURL.length > 0 &&
          isExisted.userName &&
          isExisted.userName.length > 0
        )
          return;
        noExistedIds.push(id);
      });
      if (noExistedIds.length === 0) {
        const finalUsers = userIds
          .map<DataModel | undefined>((id) => {
            const ret = users.current.get(id);
            if (ret) {
              return {
                id: ret.userId,
                name: ret.userName,
                avatar: ret.avatarURL,
                type: 'user',
              } as DataModel;
            }
            return undefined;
          })
          .filter((item) => item !== undefined) as DataModel[];
        params?.result(
          new Map([
            ['user', finalUsers ?? []],
            ['group', []],
          ])
        );
      } else {
        if (userIds.length === 0) {
          params?.result();
          return;
        }
        im.getUsersInfo({
          userIds: userIds,
          onResult: (res) => {
            if (res.isOk && res.value) {
              const u = res.value;
              updateDataFromServer(u);
              const finalUsers = userIds
                .map<DataModel | undefined>((id) => {
                  const ret = users.current.get(id);
                  if (ret) {
                    return {
                      id: ret.userId,
                      name: ret.userName,
                      avatar: ret.avatarURL,
                      type: 'user',
                    } as DataModel;
                  }
                  return undefined;
                })
                .filter((item) => item !== undefined) as DataModel[];
              params?.result(
                new Map([
                  ['user', finalUsers ?? []],
                  ['group', []],
                ])
              );
              updateDataToStorage();
            } else {
              params?.result(undefined, res.error);
            }
          },
        });
      }
    },
    [im, users, updateDataFromServer, updateDataToStorage]
  );

  const onUsersProvider = React.useCallback(
    (params: {
      ids: string[];
      result: (params: { data?: DataModel[]; error?: UIKitError }) => void;
    }) => {
      const userIds = params.ids;
      const noExistedIds = [] as string[];
      userIds.forEach((id) => {
        const isExisted = users.current.get(id);
        if (
          isExisted &&
          isExisted.avatarURL &&
          isExisted.avatarURL.length > 0 &&
          isExisted.userName &&
          isExisted.userName.length > 0
        )
          return;
        noExistedIds.push(id);
      });
      if (noExistedIds.length === 0) {
        const finalUsers = userIds
          .map<DataModel | undefined>((id) => {
            const ret = users.current.get(id);
            if (ret) {
              return {
                id: ret.userId,
                name: ret.userName,
                avatar: ret.avatarURL,
                type: 'user',
              } as DataModel;
            }
            return undefined;
          })
          .filter((item) => item !== undefined) as DataModel[];
        params?.result({ data: finalUsers ?? [] });
      } else {
        if (userIds.length === 0) {
          params?.result({ data: [] });
          return;
        }
        im.getUsersInfo({
          userIds: userIds,
          onResult: (res) => {
            if (res.isOk && res.value) {
              const u = res.value;
              updateDataFromServer(u);
              const finalUsers = userIds
                .map<DataModel | undefined>((id) => {
                  const ret = users.current.get(id);
                  if (ret) {
                    return {
                      id: ret.userId,
                      name: ret.userName,
                      avatar: ret.avatarURL,
                      type: 'user',
                    } as DataModel;
                  }
                  return undefined;
                })
                .filter((item) => item !== undefined) as DataModel[];
              params?.result({ data: finalUsers ?? [] });
              updateDataToStorage();
            } else {
              params?.result({ error: res.error });
            }
          },
        });
      }
    },
    [im, users, updateDataFromServer, updateDataToStorage]
  );
  const onGroupsProvider = React.useCallback(
    (params: {
      ids: string[];
      result: (params: { data?: DataModel[]; error?: UIKitError }) => void;
    }) => {
      params.result({ data: [] });
    },
    []
  );

  const onUsersHandler = React.useCallback(
    async (data: Map<string, DataModel>) => {
      if (data.size === 0) return data;
      const userIds = Array.from(data.keys());
      const ret = new Promise<Map<string, DataModel>>((resolve, reject) => {
        im.getUsersInfo({
          userIds: userIds,
          onResult: (res) => {
            if (res.isOk && res.value) {
              const finalUsers = [] as DataModel[];
              for (const user of res.value) {
                finalUsers.push({
                  id: user.userId,
                  type: 'user',
                  name: user.userName,
                  avatar: user.avatarURL,
                  remark: user.remark,
                } as DataModel);
              }
              resolve(DataProfileProvider.toMap(finalUsers));
            } else {
              reject(data);
            }
          },
        });
      });
      return ret;
    },
    [im]
  );
  const onGroupsHandler = React.useCallback(
    async (data: Map<string, DataModel>) => {
      if (data.size === 0) return data;
      const ret = new Promise<Map<string, DataModel>>((resolve, reject) => {
        im.getJoinedGroups({
          onResult: (res) => {
            if (res.isOk && res.value) {
              const finalGroups = res.value.map<DataModel>((v) => {
                // !!! Not recommended: only for demo
                const g = v as ChatGroup;
                const avatar = g.options?.ext?.includes('http')
                  ? g.options.ext
                  : undefined;
                return {
                  id: v.groupId,
                  name: v.groupName,
                  avatar: v.groupAvatar ?? avatar,
                  type: 'group',
                } as DataModel;
              });
              resolve(DataProfileProvider.toMap(finalGroups));
            } else {
              reject(data);
            }
          },
        });
      });
      return ret;
    },
    [im]
  );

  const initPush = React.useCallback(async () => {
    try {
      do {
        if ((await checkFCMPermission()) === false) {
          const ret = await requestFCMPermission();
          if (ret === false) {
            console.warn('Firebase Cloud Message Permission request failed.');
            break;
          }
        }

        requestFcmToken()
          .then((fcmToken) => {
            im.client
              .updatePushConfig(
                new ChatPushConfig({
                  deviceId: fcmSenderId,
                  deviceToken: fcmToken,
                })
              )
              .then()
              .catch((e) => {
                console.warn('dev:updatePushConfig:error:', e);
              });
          })
          .catch((e) => {
            console.warn('dev:requestFcmToken:error:', e);
          });

        setBackgroundMessageHandler();
      } while (false);
    } catch (error) {
      console.warn('dev:app:onReady:error:', error);
    }
  }, [im.client]);

  const updatePush = React.useCallback(async () => {
    try {
      do {
        if (enableOfflinePushRef.current === true) {
          im.client.pushManager
            .setSilentModeForAll({
              paramType: ChatSilentModeParamType.REMIND_TYPE,
              remindType: ChatPushRemindType.ALL,
            })
            .then()
            .catch((e) => {
              console.warn('dev:updatePushConfig:error:', e);
            });
        } else {
          im.client.pushManager
            .setSilentModeForAll({
              paramType: ChatSilentModeParamType.SILENT_MODE_DURATION,
              remindType: ChatPushRemindType.NONE,
            })
            .then()
            .catch((e) => {
              console.warn('dev:updatePushConfig:error:', e);
            });
        }
      } while (false);
    } catch (error) {
      console.warn('dev:app:onReady:error:', error);
    }
  }, [im.client]);

  const requestInviteContent = React.useCallback((callType: CallType) => {
    if (languageRef.current === 'zh-Hans') {
      if (callType === CallType.Audio1v1) {
        return '邀请您进入语音通话';
      } else if (callType === CallType.AudioMulti) {
        return '邀请您进行多人语音通话';
      } else if (callType === CallType.Video1v1) {
        return '邀请您进入视频通话';
      } else if (callType === CallType.VideoMulti) {
        return '邀请您进行多人视频通话';
      }
    } else {
      if (callType === CallType.Audio1v1) {
        return 'You are invited to a voice call';
      } else if (callType === CallType.AudioMulti) {
        return 'You are invited to a multi-party voice call';
      } else if (callType === CallType.Video1v1) {
        return 'You are invited to a video call';
      } else if (callType === CallType.VideoMulti) {
        return 'You are invited to a multi-party video call';
      }
    }
    return '';
  }, []);

  const requestRTCToken = React.useCallback(
    (params: {
      appKey: string;
      channelId: string;
      userId: string;
      userChannelId?: number | undefined;
      type?: 'easemob' | 'agora' | undefined;
      onResult: (params: { data?: any; error?: any }) => void;
    }) => {
      console.log('dev:requestRTCToken:', params);
      RestApi.requestRtcToken({
        userId: params.userId,
        channelId: params.channelId,
      })
        .then((res) => {
          params.onResult({
            error: res.isOk !== true ? res.error : undefined,
            data: {
              uid: res.value?.agoraUid !== undefined ? +res.value.agoraUid : 0,
              token: res.value?.accessToken,
            },
          });
        })
        .catch((e) => {
          console.warn('dev:requestRtcToken:error:', e);
        });
    },
    []
  );

  const requestUserMap = React.useCallback(
    (params: {
      appKey: string;
      channelId: string;
      userId: string;
      onResult: (params: { data?: any; error?: any }) => void;
    }) => {
      console.log('dev:requestUserMap:', params);
      RestApi.requestRtcMap({
        channelId: params.channelId,
      })
        .then((res) => {
          params.onResult({
            error: res.isOk !== true ? res.error : undefined,
            data: {
              result: res.value?.result,
            },
          });
        })
        .catch((e) => {
          console.warn('dev:requestRtcToken:error:', e);
        });
    },
    []
  );

  const requestCurrentUser = React.useCallback(
    (params: {
      onResult: (params: { user: CallUser; error?: any }) => void;
    }) => {
      console.log('dev:requestCurrentUser:', params);
      im.client
        .getCurrentUsername()
        .then(async (result) => {
          let userName = result;
          let userAvatarUrl;
          if (im.userId) {
            const ret = await im.getUserInfoSync({
              userId: im.userId,
            });
            userName = ret.value?.userName ?? ret.value?.userId ?? result;
            userAvatarUrl = ret.value?.avatarURL;
          }

          params.onResult({
            user: {
              userId: result,
              userName: userName,
              userAvatarUrl: userAvatarUrl,
            },
          });
        })
        .catch((error) => {
          console.warn('dev:getCurrentUsername:error:', error);
        });
    },
    [im]
  );

  const requestUserInfo = React.useCallback(
    async (params: {
      userId: string;
      onResult: (params: { user: CallUser; error?: any }) => void;
    }) => {
      console.log('dev:requestCurrentUser:', params);
      let userName = params.userId;
      let userAvatarUrl;
      if (im.userId) {
        const ret = await im.getUserInfoSync({
          userId: params.userId,
        });
        userName =
          ret.value?.remark ??
          ret.value?.userName ??
          ret.value?.userId ??
          params.userId;
        userAvatarUrl = ret.value?.avatarURL;
      }

      params.onResult({
        user: {
          userId: params.userId,
          userName: userName,
          userAvatarUrl: userAvatarUrl,
        },
      });
    },
    [im]
  );

  const onInitLanguageSet = React.useCallback(() => {
    const ret = (language: LanguageCode, _defaultSet: StringSet): StringSet => {
      const d = createDefaultStringSet(language);
      if (language === 'zh-Hans') {
        return {
          ...d,
          ...createStringSetCn(),
        };
      } else if (language === 'en') {
        return {
          ...d,
          ...createStringSetEn(),
        };
      }
      return d;
    };
    return ret;
  }, []);

  const onStateChange = React.useCallback(
    (state: NavigationState | undefined) => {
      pageDeepRef.current = state?.routes.length ?? 0;
      const rr: string[] & string[][] = [];
      formatNavigationState(state, rr);
      console.log('dev:onStateChange:', JSON.stringify(rr, undefined, '  '));
    },
    []
  );

  const onUnhandledAction = React.useCallback((action: NavigationAction) => {
    console.log('dev:onUnhandledAction:', action);
  }, []);

  React.useEffect(() => {
    const uiListener: UIGroupListListener = {
      onUpdatedEvent: (_data) => {
        // const isExisted = list.current.get(data.groupId);
        // if (isExisted) {
        //   if (data.groupName) {
        //     isExisted.name = data.groupName;
        //   }
        // }
      },
      onAddedEvent: (_data) => {
        // const isExisted = list.current.get(data.groupId);
        // if (isExisted) {
        //   if (data.groupName) {
        //     isExisted.name = data.groupName;
        //   }
        // }
      },
      type: UIListenerType.Group,
    };
    im.addUIListener(uiListener);
    return () => {
      im.removeUIListener(uiListener);
    };
  }, [im]);

  const listenerRef = React.useRef<ChatServiceListener>({
    onDetailChanged: (_group) => {
      // const isExisted = list.current.get(group.groupId);
      // if (isExisted) {
      //   if (group.groupName) {
      //     isExisted.name = group.groupName;
      //   }
      // }
    },
    onGroupEvent: (
      _event?: ChatMultiDeviceEvent,
      _target?: string,
      _usernames?: Array<string>
    ): void => {},
    onConnected: () => {
      console.log('dev:onConnected:');
    },
    onDisconnected: (reason) => {
      if (reason !== DisconnectReasonType.others) {
        rootRef.navigate('LoginV2', {});
      }
    },
    onFinished: (params) => {
      if (params.event === 'login') {
        if (im.userId) getDataFromStorage(im.userId);
      } else if (params.event === 'autoLogin') {
        if (im.userId) getDataFromStorage(im.userId);
      }
    },
  });

  React.useEffect(() => {
    const listener = listenerRef.current;
    im.addListener(listener);
    return () => {
      im.removeListener(listener);
    };
  }, [im]);

  React.useEffect(() => {
    getPermission({
      onResult: (isSuccess: boolean) => {
        console.log('dev:permissions:', isSuccess);
        permissionsRef.current = isSuccess;
        updater();
      },
    });
  }, [getPermission, updater]);

  // for test
  // React.useEffect(() => {
  //   im.getDataFileProvider().registerUserProfile((list) => {
  //     console.log('test:zuoyu:registerUserProfile:', list);
  //     list.forEach((v, k) => {
  //       console.log('test:zuoyu:registerUserProfile:v', k, v);
  //       v.name = v.id + 'name';
  //     });
  //     return list;
  //   });
  //   im.getDataFileProvider().registerGroupProfile((list) => {
  //     console.log('test:zuoyu:registerGroupProfile:', list);
  //     list.forEach((v, k) => {
  //       console.log('test:zuoyu:registerGroupProfile:v', k, v);
  //       v.name = v.id + 'group';
  //     });
  //     return list;
  //   });
  // }, [im]);

  React.useEffect(() => {
    const ret = DeviceEventEmitter.addListener('_demo_emit_app_theme', (e) => {
      console.log('dev:emit:app:theme:', e);
      if (e === 'dark') {
        isLightRef.current = false;
      } else {
        isLightRef.current = true;
      }
      updater();
    });
    const ret2 = DeviceEventEmitter.addListener(
      '_demo_emit_app_language',
      (e) => {
        console.log('dev:emit:app:language:', e);
        if (e === 'en') {
          languageRef.current = 'en';
        } else if (e === 'zh-Hans') {
          languageRef.current = 'zh-Hans';
        }
        updater();
      }
    );
    const ret3 = DeviceEventEmitter.addListener(
      '_demo_emit_app_primary_color',
      (e) => {
        console.log('dev:emit:app:primary:', e);
        paletteRef.current.colors.primary = generatePrimaryColor(e);
        updater();
      }
    );
    const ret4 = DeviceEventEmitter.addListener(
      '_demo_emit_app_neutral_s_color',
      (e) => {
        console.log('dev:emit:app:neutral:s:', e);
        paletteRef.current.colors.neutralSpecial =
          generateNeutralSpecialColor(e);
        updater();
      }
    );
    const ret5 = DeviceEventEmitter.addListener(
      '_demo_emit_app_neutral_color',
      (e) => {
        console.log('dev:emit:app:neutral:', e);
        paletteRef.current.colors.neutral = generateNeutralColor(e);
        updater();
      }
    );
    const ret6 = DeviceEventEmitter.addListener(
      '_demo_emit_app_error_color',
      (e) => {
        console.log('dev:emit:app:error:', e);
        paletteRef.current.colors.error = generatePrimaryColor(e);
        updater();
      }
    );
    const ret7 = DeviceEventEmitter.addListener(
      '_demo_emit_app_second_color',
      (e) => {
        console.log('dev:emit:app:second:', e);
        paletteRef.current.colors.secondary = generatePrimaryColor(e);
        updater();
      }
    );
    const ret8 = DeviceEventEmitter.addListener('_demo_emit_app_style', (e) => {
      console.log('dev:emit:app:style:', e);
      releaseAreaRef.current = e === 'classic' ? 'china' : 'global';
      updater();
    });
    const ret9 = DeviceEventEmitter.addListener(
      '_demo_emit_app_translate',
      (e) => {
        console.log('dev:emit:app:translate:', e);
        enableTranslateRef.current = e === 'enable';
        updater();
      }
    );
    const ret10 = DeviceEventEmitter.addListener(
      '_demo_emit_app_thread',
      (e) => {
        console.log('dev:emit:app:thread:', e);
        enableThreadRef.current = e === 'enable';
        updater();
      }
    );
    const ret11 = DeviceEventEmitter.addListener(
      '_demo_emit_app_reaction',
      (e) => {
        console.log('dev:emit:app:reaction:', e);
        enableReactionRef.current = e === 'enable';
        updater();
      }
    );
    const ret12 = DeviceEventEmitter.addListener(
      '_demo_emit_app_presence',
      (e) => {
        console.log('dev:emit:app:presence:', e);
        enablePresenceRef.current = e === 'enable';
        updater();
      }
    );
    const ret13 = DeviceEventEmitter.addListener('_demo_emit_app_av', (e) => {
      console.log('dev:emit:app:av:', e);
      enableAVMeetingRef.current = e === 'enable';
      updater();
    });
    const ret14 = DeviceEventEmitter.addListener(
      '_demo_emit_app_notification',
      (e) => {
        console.log('dev:emit:app:notification:', e);
        enableOfflinePushRef.current = e === 'enable';
        updatePush();
      }
    );
    const ret15 = DeviceEventEmitter.addListener(
      '_demo_emit_app_translate_language',
      (e) => {
        console.log('dev:emit:app:tl:', e);
        if (e === 'en') {
          translateLanguageRef.current = 'en';
        } else if (e === 'zh-Hans') {
          translateLanguageRef.current = 'zh-Hans';
        }
        updater();
      }
    );
    return () => {
      ret.remove();
      ret2.remove();
      ret3.remove();
      ret4.remove();
      ret5.remove();
      ret6.remove();
      ret7.remove();
      ret8.remove();
      ret9.remove();
      ret10.remove();
      ret11.remove();
      ret12.remove();
      ret13.remove();
      ret14.remove();
      ret15.remove();
    };
  }, [dark, light, updatePush, updater]);

  // !!! Customize the android platform return button operation.
  React.useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (pageDeepRef.current <= 1) {
          return false;
        }
        return true;
      }
    );
    return () => {
      if (Platform.OS !== 'android') {
        return;
      }
      backHandler.remove();
    };
  }, []);

  return {
    onRequestMultiData,
    im,
    permissionsRef,
    initialRouteName,
    paletteRef,
    dark,
    light,
    isLightRef,
    languageRef,
    translateLanguageRef,
    isNavigationReadyRef,
    isContainerReadyRef,
    isFontReadyRef,
    isReadyRef,
    enablePresenceRef,
    enableReactionRef,
    enableThreadRef,
    enableTranslateRef,
    enableAVMeetingRef,
    enableOfflinePushRef,
    fontsLoaded,
    rootRef,
    imServerRef,
    imPortRef,
    enableDNSConfigRef,
    _initParams,
    setInitParams,
    releaseAreaRef,
    getOptions,
    updatePush,
    initPush,
    requestInviteContent,
    requestRTCToken,
    requestUserMap,
    requestCurrentUser,
    requestUserInfo,
    onInitLanguageSet,
    onUsersProvider,
    onGroupsProvider,
    onStateChange,
    onUnhandledAction,
    onGroupsHandler,
    onUsersHandler,
  };
}
