import type { DialogContextType } from '../contexts';
import type { ExtraDataType } from './types';

export function handleAlertEvent(params: {
  alert: Pick<DialogContextType, 'openAlert'>;
  event: any;
  extra: ExtraDataType;
}): void {
  console.log('test:', params.event);
}
