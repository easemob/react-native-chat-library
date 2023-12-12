import type { SlideModalProps, SlideModalRef } from '../../ui/Modal';
import type { PropsWithError, PropsWithTest } from '../types';

export type VoiceBarState = 'idle' | 'recording' | 'playing' | 'stopping';
export type VoiceBarRef = {
  /**
   * You can specify the path to save the file. If not specified, the default path will be used.
   * @param voiceFilePath the voice file path.
   */
  startRecord: (voiceFilePath?: string) => void;
  stopRecord: () => void;
  replay: () => void;
};
export type VoiceBarProps = PropsWithError &
  PropsWithTest & {
    /**
     * The height of the voice bar.
     */
    height?: number;
    /**
     * Callback notification when the record button is clicked.
     *
     * Click this button to start recording voice, stop recording voice, and play voice operations. and returns status.
     *
     * If recording is in progress, clicking the button will trigger the recording to stop. Or automatically stop recording after 60 seconds.
     *
     * If it is playing, clicking the button will start playing again, and it will automatically stop when the playback is completed.
     *
     * @param state {@link VoiceBarState}
     * - 'idle' - The initial state, click to start recording. {@link VoiceBarRef.startRecord}
     * - 'recording' - Recording is in progress, click to stop recording. It will automatically stop after 60 seconds and change to `stopping` state. {@link VoiceBarRef.stopRecord}
     * - 'playing' - Playing is in progress, click to replaying. {@link VoiceBarRef.replay}
     * - 'stopping' - Stopping is in progress, click to playing. {@link VoiceBarRef.replay}
     */
    onClickedRecordButton?: (state: VoiceBarState) => void;
    /**
     * Callback notification when the clean button is clicked.
     *
     * Clean up the status and change it to `idle` status. {@link VoiceBarState}
     */
    onClickedClearButton?: () => void;
    /**
     * Callback notification when the send button is clicked. Returns the path of the recording file.
     */
    onClickedSendButton?: (voiceFilePath: string) => void;
    /**
     * Callback notification when the recording is failed.
     */
    onRecordFailed?: (error: { reason: string }) => void;
    /**
     * Callback notification when the state changes.
     */
    onState?: (state: VoiceBarState) => void;
  };

export type BottomVoiceBarRef = SlideModalRef & {};
export type BottomVoiceBarProps = VoiceBarProps &
  Pick<SlideModalProps, 'onRequestModalClose'> & {};
