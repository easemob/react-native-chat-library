import * as React from 'react';

import { ContactList, ContactListProps } from '../ContactList';

export type NewConversationProps = Pick<
  ContactListProps,
  'containerStyle' | 'onClicked' | 'onClickedSearch' | 'onBack'
>;
export function NewConversation(props: NewConversationProps) {
  return <ContactList contactType={'new-conversation'} {...props} />;
}
