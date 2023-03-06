export * from './types';
export * from './UikitEvents';
export * from './UikitModals';

// Send event specification:
// function EmitEventExample(): void {
//   DeviceEventEmitter.emit('SheetEvent' as SheetEventType, {
//     _internal: 'uikit', // Internal use only to prevent event conflicts.
//     type: 'contact' as UikitBizEventType,
//     action: 'your_custom_action', // Custom behavior. For example, add contacts and create groups.
//     senderId: 'xxx', // Generally, it is the page name or component name to facilitate subsequent search.
//     timestamp: 0, // The timestamp at which the event occurred.
//     params: 'your_custom_params', // Custom data.
//   });
// }
