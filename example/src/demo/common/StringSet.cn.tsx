import type { StringSet } from 'react-native-chat-uikit';

export function createStringSetCn(): StringSet {
  return {
    'this is test.': 'this is test.',
    'This is test with ${0} and ${1}': (a: string, b: number) => {
      return `This is test with ${a} and ${b}`;
    },
    '_demo_tab_conv_list': '会话',
    '_demo_tab_contact_list': '联系人',
    '_demo_tab_mine': '我的',
    '_demo_navigation_common_setting_back': '通用',

    '_demo_info_state_set': '设置',
    '_demo_info_state_account': '账号',
    '_demo_info_online_state': '用户状态',
    '_demo_info_person_info': '个人信息',
    '_demo_info_common_setting': '通用',
    '_demo_info_message_notification': '消息通知',
    '_demo_info_show_privacy': '隐私',
    '_demo_info_input_state': '显示输入状态',
    '_demo_info_input_state_tail': '开启后，对方将看见你的输入状态',
    '_demo_info_auto_accept_group_invite': '自动接受群组邀请',
    '_demo_info_auto_accept_group_invite_tail':
      '关闭后，被加入新群聊时将需要你的同意',
    '_demo_info_theme': '明暗模式',
    '_demo_info_language': '语言设置',

    '_demo_splash_title': '环信即时通讯云',

    '_demo_login_title': '环信IM',
    '_demo_login_title_version': (v) => `V${v}`,
    '_demo_login_input_phone_number_tip': '手机号',
    '_demo_login_input_phone_number_captcha_tip': '验证码',
    '_demo_login_input_phone_number_captcha_button_1': '获取验证码',
    '_demo_login_input_phone_number_captcha_button_2': (second) =>
      `重新获取(${second}s)`,
    '_demo_login_input_phone_number_captcha_button_3': '重新获取',
    '_demo_login_button': '登录',
    '_demo_login_tip_1': '请选择同意',
    '_demo_login_tip_2': '《环信服务条款》',
    '_demo_login_tip_3': '与',
    '_demo_login_tip_4': '《环信隐私协议》',
    '_demo_login_server_setting_button': '服务器设置',
    '_demo_login_tip_reason_1': '请输入正确的手机号',
    '_demo_login_tip_reason_2': '请先同意《环信条款》与《环信协议》',
    '_demo_login_tip_reason_3': '请输入验证码',
    '_demo_login_loading_tip': '登录中...',

    '_demo_server_setting_navi_title': '服务器设置',
    '_demo_server_setting_navi_save': '保存',
    '_demo_server_setting_input_appkey_tip': '输入 App key',
    '_demo_server_setting_private_setting': '使用私有服务器',
    '_demo_server_setting_input_im_server_tip': '输入IM服务器地址',
    '_demo_server_setting_input_port_tip': '输入端口号',
    '_demo_server_setting_input_rest_server_tip': '输入Rest服务器地址',

    '_demo_alert_server_setting_save_title': '重启客户端',
    '_demo_alert_server_setting_save_message':
      '当前服务器设置需重启客户端生效。',

    '_demo_info_logout': '退出登录',

    '_demo_edit_group_name': '群名称',
    '_demo_edit_group_description': '群描述',
    '_demo_edit_group_my_remark': '我在本群的昵称',

    '_demo_edit_thread_name': '编辑话题名称',
    '_demo_edit_contact_remark': '备注',

    '_demo_person_info_navi_title': '个人信息',
    '_demo_person_info_avatar': '头像',
    '_demo_person_info_remark': '昵称',
    '_demo_person_edit_person_remark': '昵称',

    '_demo_general_setting_navi_title': '通用',
    '_demo_general_setting_theme': '暗黑模式',
    '_demo_general_setting_style': '主题',
    '_demo_general_setting_color': '主题色',
    '_demo_general_setting_feature': '特性开关',
    '_demo_general_setting_language': '系统语言',
    '_demo_general_setting_translation_language': '翻译目标语言',

    '_demo_language_setting_navi_title': '系统语言',
    '_demo_language_setting_navi_confim': '完成',
    '_demo_language_setting_language_cn': '中文',
    '_demo_language_setting_language_en': 'English',

    '_demo_style_setting_navi_title': '主题',
    '_demo_about_title': '环信 IM',
    '_demo_style_setting_navi_confim': '完成',
    '_demo_style_setting_language_classic': '经典',
    '_demo_style_setting_language_modern': '现代',

    '_demo_about_setting_navi_title': '关于',
    '_demo_about_setting_site': '官方网站',
    '_demo_about_setting_site_url': 'www.huanxin.com',
    '_demo_about_setting_phone': '服务热线',
    '_demo_about_setting_phone_number': '400-622-1776',
    '_demo_about_setting_partner': '商务合作',
    '_demo_about_setting_partner_email': 'bd@easemob.com',
    '_demo_about_setting_channel': '渠道合作',
    '_demo_about_setting_channel_email': 'qudao@easemob.com',
    '_demo_about_setting_advise': '投诉建议',
    '_demo_about_setting_advise_email': 'issues@easemob.com',

    '_demo_color_setting_navi_title': '主题色',
    '_demo_color_setting_navi_confirm': '完成',
    '_demo_color_setting_primary': '主题色色相',
    '_demo_color_setting_second': '成功色色相',
    '_demo_color_setting_error': '警告色色相',
    '_demo_color_setting_neutral': '一般中性色色相',
    '_demo_color_setting_neutralS': '特殊中性色色相',

    '_demo_feature_setting_navi_title': '特性开关',
    '_demo_feature_setting_translate': '消息翻译',
    '_demo_feature_setting_translate_tip': '长按消息将其翻译为手机系统语言',
    '_demo_feature_setting_thread': '群组话题',
    '_demo_feature_setting_thread_tip': '长按消息创建话题',
    '_demo_feature_setting_reaction': '表情回复',
    '_demo_feature_setting_reaction_tip': '长按消息添加表情回应',
    '_demo_feature_setting_presence': '订阅状态',
    '_demo_feature_setting_presence_tip': ' ',
    '_demo_feature_setting_av': '音视频通话',
    '_demo_feature_setting_av_tip': ' ',

    '_demo_notification_setting_navi_title': '消息通知',
    '_demo_notification_setting_offline_push': '消息离线推送',
    '_demo_notification_setting_offline_push_tip':
      '关闭后，除群组内被@的消息，将不再接收任何消息推送',

    '_demo_logout_title': '退出登录',
    '_demo_alert_title_share_contact_title': '分享联系人？',
    '_demo_alert_title_share_contact_message': (a, b) => `分享联系人${a}给${b}`,

    '_demo_copyGroupId': '复制成功',
    '_demo_copyUserId': '复制成功',

    'save': '保存',
    'done': '完成',
    'en': 'English',
    'zh-Hans': '中文',
    'classic': '经典',
    'modern': '现代',
  };
}
