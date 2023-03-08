import type { ExtraDataType } from './types';

export function handleDataEvent(params: {
  event: any;
  extra: ExtraDataType;
}): void {
  console.log('test:', params.event);
}
