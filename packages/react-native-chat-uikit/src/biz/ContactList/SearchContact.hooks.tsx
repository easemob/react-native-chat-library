import { useChatContext } from '../../chat';
import { useFlatList } from '../List';
import type { UseSearchReturn } from '../ListSearch';
import type { UseFlatListReturn } from '../types';
import type { ContactSearchModel, UseSearchContactProps } from './types';

export function useSearchContact(
  props: UseSearchContactProps
): UseFlatListReturn<ContactSearchModel> & UseSearchReturn<ContactSearchModel> {
  const { onClicked, testMode } = props;
  const flatListProps = useFlatList<ContactSearchModel>({
    isShowAfterLoaded: false,
    onInit: () => init(),
  });
  const { setData, isAutoLoad } = flatListProps;

  const im = useChatContext();
  const init = async () => {
    if (testMode === 'only-ui') {
      return;
    }
    if (isAutoLoad === true) {
      im.getAllContacts({
        onResult: (result) => {
          const { isOk, value, error } = result;
          if (isOk === true) {
            if (value) {
              const list = value.map((item) => {
                console.log(
                  'test:zuoyu:getAllContacts:item',
                  item,
                  item.nickName ??
                    (item.remark.length === 0 || item.remark === undefined)
                    ? item.userId
                    : item.remark
                );
                return {
                  ...item,
                  id: item.userId,
                  name: item.nickName
                    ? item.nickName
                    : item.remark.length === 0 || item.remark === undefined
                    ? item.userId
                    : item.remark,
                } as ContactSearchModel;
              });
              console.log('test:zuoyu:getAllContacts:list', list);
              setData(list);
            }
          } else {
            console.log('test:zuoyu:getAllContacts:error', error);
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
