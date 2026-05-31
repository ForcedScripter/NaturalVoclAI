/**
 * AudioWorklet processor for continuous microphone capture.
 * Streams Float32 audio frames to the main thread for WebSocket transport.
 *
 * Registered as 'audio-capture' — must match the AudioWorkletNode name in useVoiceAgent.
 */
class AudioCaptureProcessor extends AudioWorkletProcessor {
    process(inputs) {
        const input = inputs[0];
        if (input && input[0] && input[0].length > 0) {
            // Post a copy of the Float32Array to the main thread
            this.port.postMessage(input[0].slice());
        }
        return true;
    }
}

registerProcessor("audio-capture", AudioCaptureProcessor);
