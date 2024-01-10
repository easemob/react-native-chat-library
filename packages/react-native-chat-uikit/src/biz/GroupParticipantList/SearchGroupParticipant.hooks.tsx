import { useChatContext } from '../../chat';
import { useFlatList } from '../List';
import type { ListItemActions, UseFlatListReturn } from '../types';
import type {
  GroupParticipantSearchModel,
  UseSearchGroupParticipantProps,
} from './types';

export function UseSearchGroupParticipant(
  props: UseSearchGroupParticipantProps
): UseFlatListReturn<GroupParticipantSearchModel> &
  Omit<
    ListItemActions<GroupParticipantSearchModel>,
    'onToRightSlide' | 'onToLeftSlide' | 'onLongPressed'
  > {
  const { groupId, onClicked, testMode } = props;
  const flatListProps = useFlatList<GroupParticipantSearchModel>({
    onInit: () => init(),
  });
  const { dataRef } = flatListProps;

  const im = useChatContext();
  const init = () => {
    if (testMode === 'only-ui') {
    } else {
      im.getGroupAllMembers({
        groupId: groupId,
        onResult: (result) => {
          const { isOk, value, error } = result;
          if (isOk === true && value) {
            dataRef.current = value.map((item) => {
              return {
                ...item,
                memberId: item.memberId,
                memberName: item.memberName ?? item.memberId,
              } as GroupParticipantSearchModel;
            });
          } else {
            if (error) {
              im.sendError({ error });
            }
          }
        },
      });
    }
  };

  return {
    ...flatListProps,
    onClicked,
  };
}
