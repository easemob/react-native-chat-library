import type { CallListener } from './CallListener';
import { createManagerImpl } from './CallManagerImpl';

export interface CallManager {
  /**
   * Add event listeners.
   *
   * @param listener the listener. see {@link CallListener}
   */
  addListener(listener: CallListener): void;

  /**
   * Remove event listener.
   *
   * @param listener the listener.
   */
  removeListener(listener: CallListener): void;
}

/**
 * Create a signaling manager.
 *
 * Please initialize before use, and reset resources please de-initialize. {@link CallManager.init} {@link CallManager.unInit}
 *
 * @returns
 */
export function createManager(): CallManager {
  return createManagerImpl();
}
