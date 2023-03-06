export const ConversationChatSdkEvent = 'ConversationChatSdkEvent';
export type ConversationChatSdkEventType = '';

export class ConversationEventDispatch {
  name: string;
  constructor() {
    console.log('test:', ConversationEventDispatch.name);
    this.name = ConversationEventDispatch.name;
  }
  init(): void {
    console.log('test:init:', ConversationEventDispatch.name);
  }
  unInit(): void {
    console.log('test:unInit:', ConversationEventDispatch.name);
  }
}
