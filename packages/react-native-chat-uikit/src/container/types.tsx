import type { StatusType } from '../biz/types';
import type { ChatOptionsType, ChatService, DataModel } from '../chat';
import type { ConversationDetailType } from '../config';
import type { CreateStringSet, LanguageCode, StringSet } from '../i18n';
import type { CornerRadiusPaletteType, Palette, Theme } from '../theme';
import type { ReleaseArea } from '../types';

/**
 * Properties of the Container.
 */
export type ContainerProps = React.PropsWithChildren<{
  /**
   * Initialization parameters, the parameters that must be filled in include `appKey`, `debugModel`, `autoLogin`.
   */
  options: ChatOptionsType;
  /**
   * The language code.
   *
   * Default value is system language.
   */
  language?: LanguageCode;
  /**
   * The target language code for the translation function.
   *
   * Default value is system language.
   */
  translateLanguage?: LanguageCode;
  /**
   * Whether to enable translation.
   *
   * Default value is `true`.
   */
  enableTranslate?: boolean;
  /**
   * The palette.
   */
  palette?: Palette;
  /**
   * The theme.
   */
  theme?: Theme;
  /**
   * The font family name.
   */
  fontFamily?: string;
  /**
   * The emoji font family name.
   */
  emojiFontFamily?: string;
  /**
   * The header font family name.
   */
  headerFontFamily?: string;
  /**
   * The release area.
   */
  releaseArea?: ReleaseArea;

  /**
   * Format timestamp. Users can provide a timestamp format string callback interface for session lists and session details.
   */
  formatTime?: {
    /**
     * The locale.
     */
    locale?: Locale;
    /**
     * The conversation list format timestamp callback.
     * @param timestamp The timestamp.
     * @param locale The locale.
     * @returns The format timestamp string.
     */
    conversationListCallback?: (timestamp: number, locale?: Locale) => string;
    /**
     * The conversation detail format timestamp callback.
     * @param timestamp The timestamp.
     * @param locale The locale.
     * @returns The format timestamp string.
     */
    conversationDetailCallback?: (timestamp: number, locale?: Locale) => string;
  };
  /**
   * The recall timeout.
   *
   * Default value is `120000`. (2 minutes)
   */
  recallTimeout?: number;
  /**
   * The conversation detail config.
   */
  conversationDetail?: ConversationDetailType;
  /**
   * The group config.
   */
  group?: {
    /**
     * The group member limit.
     *
     * Default value is `1000`.
     */
    createGroupMemberLimit?: number;
  };
  /**
   * Default avatar option.
   */
  avatar?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
    personAvatar?: number | undefined;
    groupAvatar?: number | undefined;
  };
  /**
   * Input component option.
   */
  input?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
  };
  /**
   * Alert component option.
   */
  alert?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
  };
  /**
   * Initialize language pack. When {@link ContainerProps.language} is modified, this callback will be called again.
   *
   * UIKit has built-in Chinese and English language packs. If the user sets other languages, corresponding language packs need to be provided. See {@link createStringSetCn} or {@link createStringSetEn} for details
   *
   * If no language code is set, the default `language` code is used. When this callback is called, the default language code will be returned to the user.
   *
   * @returns UIKit calls this method. Provide user-set `language` and default UIKit language pack. This method is defined by the user and returns the new language pack.
   */
  onInitLanguageSet?: () => (
    language: LanguageCode,
    defaultSet: StringSet
  ) => CreateStringSet | StringSet;
  /**
   * IM initialization is completed.
   */
  onInitialized?: (im: ChatService) => void;

  /**
   * @description Registered user information callback. The avatar and nickname of the contact, group member and group are obtained through the callback of this registration. If not provided, the default value will be used.
   *
   * @param data The user information list. The default value is provided by UIKit. Their values can be customized.
   * @returns Returns the modified value.
   */
  onUsersHandler?:
    | ((data: Map<string, DataModel>) => Map<string, DataModel>)
    | ((data: Map<string, DataModel>) => Promise<Map<string, DataModel>>);

  /**
   * @description Registered group information callback. The avatar and nickname of the contact, group member and group are obtained through the callback of this registration. If not provided, the default value will be used.
   *
   * @param data The group information list. The default value is provided by UIKit. Their values can be customized.
   * @returns Returns the modified value.
   */
  onGroupsHandler?:
    | ((data: Map<string, DataModel>) => Map<string, DataModel>)
    | ((data: Map<string, DataModel>) => Promise<Map<string, DataModel>>);

  /**
   * Returns the custom state component.
   * @param status current status.
   * @returns component.
   */
  onChangeStatus?: (status: StatusType) => React.ReactElement;

  /**
   * Whether to activate the thread function. If you do not activate it, you will not be able to actively use thread-related functions, if there are still problems after activation, check whether the relevant settings of the console are enabled.
   *
   * Default is `false`.
   */
  enableThread?: boolean;

  /**
   * Whether to activate the reaction function. If you do not activate it, you will not be able to actively use reaction-related functions, if there are still problems after activation, check whether the relevant settings of the console are enabled.
   *
   * Default is `false`.
   */
  enableReaction?: boolean;

  /**
   * Whether to activate the presence function. If you do not enable the presence-related feature, check whether the settings are enabled in the console.
   *
   * Default is `false`.
   */
  enablePresence?: boolean;

  /**
   * Whether to activate the AV meeting function. If you do not enable the AV meeting-related feature, check whether the settings are enabled in the console.
   *
   * Default is `true`.
   */
  enableAVMeeting?: boolean;

  enableForward?: boolean;
}>;
