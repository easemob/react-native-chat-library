import type { ToastContextType } from '../contexts';
import type { ExtraDataType } from './types';

export function handleToastEvent(params: {
  toast: ToastContextType;
  event: any;
  extra: ExtraDataType;
}): void {
  console.log('test:', params.event);
}
