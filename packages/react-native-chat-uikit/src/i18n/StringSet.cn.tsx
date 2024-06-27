import type { StringSet } from './types';

export function createStringSetCn(): StringSet {
  return {
    'this is test.': 'this is test.',
    'This is test with ${0} and ${1}': (a: string, b: number) => {
      return `This is test with ${a} and ${b}`;
    },

    // _uikit
    '_uikit_search': '搜索',
    '_uikit_search_placeholder': '搜索关键字',
    '_uikit_contact_title': '联系人',
    '_uikit_new_conv_title': '新会话',
    '_uikit_create_group_title': '创建群组',
    '_uikit_create_group_button': (count) => `创建(${count})`,
    '_uikit_add_group_member_title': '添加群成员',
    '_uikit_add_group_member_button': (count) => `添加(${count})`,
    '_uikit_share_card_title': '分享联系人',

    '_uikit_contact_new_request': '新请求',
    '_uikit_contact_group_list': '群组',
    '_uikit_contact_black_list': '黑名单',
    '_uikit_contact_menu_new_conv': '新会话',
    '_uikit_contact_menu_add_contact': '添加联系人',
    '_uikit_contact_menu_create_group': '创建群组',
    '_uikit_contact_alert_title': '添加联系人',
    '_uikit_contact_alert_content': '通过用户ID添加联系人',
    '_uikit_contact_alert_input_tip': '用户ID',
    '_uikit_contact_alert_button_add': '添加',
    '_uikit_contact_search_placeholder': '搜索联系人',

    '_uikit_conv_menu_read': '标记已读',
    '_uikit_conv_menu_delete': '删除',
    '_uikit_conv_alert_title': '删除该会话？',

    '_uikit_group_title': (count) => `群组(${count})`,
    '_uikit_group_search_placeholder': '搜索群组',
    '_uikit_group_del_member_title': '移除群成员',
    '_uikit_group_del_member_button': (count) => `移除(${count})`,
    '_uikit_group_change_owner_title': '转移群主',
    '_uikit_group_av_meeting': '选择成员',
    '_uikit_group_av_button': (count) => `呼叫(${count})`,
    '_uikit_group_member_list_title': (count) => `群成员(${count})`,
    '_uikit_group_alert_change_owner_title': (name) => `转让群主身份给${name}`,
    '_uikit_group_alert_del_member_title': (names) => `移除${names}？`,
    '_uikit_group_create_name': (key) => `${key}的群聊`,

    '_uikit_block_title': (count) => `黑名单(${count})`,
    '_uikit_black_list_title': (count) =>
      count !== undefined ? `黑名单(${count})` : '黑名单',
    '_uikit_block_search_placeholder': '搜索',

    '_uikit_chat_input_quote_file': '附件 ',
    '_uikit_chat_input_quote_title_1': ' 正在回复 ',
    '_uikit_chat_input_long_press_menu_picture': '相册',
    '_uikit_chat_input_long_press_menu_video': '视频',
    '_uikit_chat_input_long_press_menu_camera': '相机',
    '_uikit_chat_input_long_press_menu_file': '文件',
    '_uikit_chat_input_long_press_menu_card': '名片',
    '_uikit_chat_input_long_press_av_menu_video': '视频通话',
    '_uikit_chat_input_long_press_av_menu_audio': '音频通话',

    '_uikit_chat_list_long_press_menu_copy': '复制',
    '_uikit_chat_list_long_press_menu_replay': '回复',
    '_uikit_chat_list_long_press_menu_translate': (isTranslated) =>
      isTranslated === true ? '显示原文' : '翻译',
    '_uikit_chat_list_long_press_menu_thread': '创建话题',
    '_uikit_chat_list_long_press_menu_edit': '编辑',
    '_uikit_chat_list_long_press_menu_multi_select': '多选',
    '_uikit_chat_list_long_press_menu_message_pin': '置顶',
    '_uikit_chat_list_long_press_menu_forward_message': '转发',
    '_uikit_chat_list_long_press_menu_report': '举报',
    '_uikit_chat_list_long_press_menu_delete': '删除',
    '_uikit_chat_list_long_press_menu_recall': '撤回',
    '_uikit_chat_list_long_press_menu_delete_alert_title': '删除这条消息？',
    '_uikit_chat_list_long_press_menu_delete_alert_content':
      '删除本地消息后，对方仍可以看到这条消息',
    '_uikit_chat_list_long_press_menu_recall_alert_title': '撤回这条消息？',

    '_uikit_msg_tip_recall': (isSelf: boolean, name) =>
      isSelf === true ? `你撤回了一条消息` : `${name}撤回了一条消息`,
    '_uikit_msg_tip_not_support': '不支持的消息类型',
    '_uikit_msg_tip_msg_not_exist': '原消息不存在',
    '_uikit_msg_edit': '已编辑',
    '_uikit_msg_translate': '已翻译',
    '_uikit_msg_record': '聊天记录',
    '_uikit_msg_tip_create_group_success': '创建群聊成功',
    '_uikit_msg_tip_create_thread_finish': (id) =>
      id ? `${id} 创建了话题` : '创建了话题',
    '_uikit_msg_tip_create_group_success_with_params': (name) =>
      `群组${name}已创建`,

    '_uikit_info_send_msg': '发消息',
    '_uikit_info_send_audio': '音频通话',
    '_uikit_info_send_video': '视频通话',
    '_uikit_info_search_message': '搜索消息',
    '_uikit_info_search_msg': '搜索消息',
    '_uikit_info_not_disturb': '消息免打扰',
    '_uikit_info_block_list': '拉黑',
    '_uikit_info_clear_msg': '清空聊天记录',
    '_uikit_info_button_add_contact': '添加联系人',
    '_uikit_info_menu_del_contact': '删除联系人',
    '_uikit_info_alert_title_delete_contact': '删除联系人？',
    '_uikit_info_alert_content_delete_contact':
      '删除联系人将清空与该联系人的聊天记录',
    '_uikit_info_item_member': '群成员',
    '_uikit_info_item_contact_remark': '备注',
    '_uikit_info_item_contact_id': 'ID: ',
    '_uikit_info_item_my_remark': '我在本群的昵称',
    '_uikit_info_item_group_id': 'ID: ',
    '_uikit_info_item_group_name': '群名称',
    '_uikit_info_item_group_desc': '群描述',
    '_uikit_info_alert_clear_chat_title': '清空聊天记录？',
    '_uikit_info_alert_block_chat_title': '拉黑联系人',
    '_uikit_info_alert_block_chat_message': (name) => `确认拉黑联系人${name}`,
    '_uikit_info_alert_modify_group_name': '群名称',
    '_uikit_info_alert_modify_group_desc': '群描述',
    '_uikit_info_alert_modify_group_remark': '我在本群的昵称',
    '_uikit_info_menu_quit_group': '离开群组',
    '_uikit_info_menu_destroy_group': '解散群组',
    '_uikit_info_menu_change_group_owner': '转移群主',
    '_uikit_info_alert_quit_group_title': '离开群聊？',
    '_uikit_info_alert_quit_group_content': '离开群组将清空该群组的聊天记录',
    '_uikit_info_alert_destroy_group_title': '解散群组？',
    '_uikit_info_alert_destroy_group_content': '解散群组将清空该群组的聊天记录',
    '_uikit_info_toast_block_un_block_tip': '已解除拉黑',

    '_uikit_new_quest_title': '新请求',
    '_uikit_new_quest_list_item_tip': '请求添加您为好友。',

    '_uikit_thread_msg_count': (count) => `${count}回复`,
    '_uikit_thread_list': (count) => `所有话题(${count})`,

    '_uikit_thread_menu_edit_thread_name': '编辑话题',
    '_uikit_thread_menu_open_thread_member_list': '话题成员',
    '_uikit_thread_menu_leave_thread': '离开话题',
    '_uikit_thread_menu_destroy_thread': '删除话题',
    '_uikit_thread_member': '话题成员',
    '_uikit_thread_owner': '群主',
    '_uikit_thread_kick_member': '从话题中移除',
    '_uikit_thread_leave_confirm': (isOwner) =>
      isOwner === true ? '确定销毁话题吗？' : '确定离开话题吗？',

    '_uikit_tab_contact_list': '联系人',
    '_uikit_tab_group_list': '群聊',
    '_uikit_forward_to': '转发给',
    '_uikit_alert_remove_message': '移除消息？',
    '_uikit_history_record': '聊天记录',
    '_uikit_unread_count': (count) => `${count}条未读数`,
    '_uikit_alert_title_custom_status': '自定义在线状态',

    '_uikit_report_title': '消息举报',
    '_uikit_navi_title_chat': 'Chats',
    '_uikit_navi_title_contact': 'Contacts',
    '_uikit_navi_title_search': '搜索',
    '_uikit_navi_title_mine': '我的',
    '_uikit_error_placeholder_tip': '加载失败',
    '_uikit_msg_custom_card': '名片',

    '_uikit_message_typing': '正在输入中...',
    '_uikit_message_url_parsing': '解析中...',

    '_uikit_pin_message_title': (count) =>
      count !== undefined ? `${count}条置顶消息` : '置顶消息',
    '_uikit_pin_message_button_request_delete': '移除',
    '_uikit_pin_message_button_confirm_delete': '确认移除',
    '_uikit_pin_content': (a, b) => `${a}置顶了${b}的消息`,
    '_uikit_pin_content_1': `置顶了`,
    '_uikit_pin_content_2': `的消息`,

    'Unwelcome commercial content': '不受欢迎的商业内容',
    'Pornographic or explicit content': '色情或露骨内容',
    'Child abuse': '虐待儿童',
    'Hate speech or graphic violence': '仇恨言论或过于写实的暴力内容',
    'Promote terrorism': '宣扬恐怖主义',
    'Harassment or bullying': '骚扰或欺凌',
    'Suicide or self harm': '自杀或自残',
    'False information': '虚假信息',
    'Others': '其它',

    // common
    'search': '搜索',
    'cancel': '取消',
    'mute': '免打扰',
    'unmute': '取消免打扰',
    'pin': '置顶',
    'unpin': '取消置顶',
    'read': '已读',
    'remove': '删除',
    'add': '添加',
    'confirm': '确认',
    'state': '状态',
    'about': '关于',
    'login': '登录',
    'logout': '退出',
    'report': '举报',
    'forward': '转发',
    'forwarded': '已转发',
    'reload': '重新加载',

    'picture': '图片',
    'video': '视频',
    'voice': '语音',
    'file': '文件',
    'card': '联系人',
    'set': '设置',
    'you': '你',
    'save': '保存',
    'saved': '已保存',

    'contact': '联系人',

    'copy_success': '复制成功',
    'online_state': '在线状态',

    '@all': '[有人@你] ',
    '@me': '[有人@你] ',

    'voice_bar_remain': (v) => `${v}秒后结束录音`,
    'voice_bar_tip_click_record': '点击录音',
    'voice_bar_tip_recording': '正在录音',
    'voice_bar_tip_click_play': '点击播放',
    'voice_bar_tip_playing': '播放中',

    'online': '在线',
    'offline': '离线',
    'busy': '忙碌',
    'leave': '离开',
    'not disturb': '免打扰',
    'custom': '自定义',

    '[image]': '[图片]',
    '[video]': '[视频]',
    '[file]': (v) => (v ? `[文件]${v}` : '[文件]'),
    '[location]': '[定位]',
    '[voice]': (v) => (v ? `[语音]${v}'` : '[语音]'),
    '[contact]': (v) => (v ? `[联系人]${v}` : '[联系人]'),
    '[custom]': '[自定义]',
    '[combine]': '[聊天记录]',
    '[unknown]': '[未知类型]',
  };
}
