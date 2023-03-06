import type { DialogContextType } from '../contexts';
import type { ExtraDataType } from './types';

export function handleSheetEvent(params: {
  sheet: Pick<DialogContextType, 'openSheet'>;
  event: any;
  extra: ExtraDataType;
}): void {
  console.log('test:', params.event);
}
