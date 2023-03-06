import type { DialogContextType } from '../contexts';
import type { ExtraDataType } from './types';

export function handleMenuEvent(params: {
  menu: Pick<DialogContextType, 'openMenu'>;
  event: any;
  extra: ExtraDataType;
}): void {
  console.log('test:', params.event);
}
