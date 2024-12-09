let audioContext = null;
let oscillator = null;
let gainNode = null;

const initializeAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
};

const createNewOscillator = () => {
    const context = initializeAudioContext();
    
    // Clean up previous oscillator and gain node
    if (oscillator) {
        oscillator.disconnect();
    }
    if (gainNode) {
        gainNode.disconnect();
    }

    // Create new nodes
    oscillator = context.createOscillator();
    gainNode = context.createGain();

    // Configure oscillator
    oscillator.type = 'sine';
    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.1;

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    return { oscillator, gainNode };
};

export const createBeep = () => {
    let isPlaying = false;

    return {
        play: async () => {
            if (isPlaying) return; // Prevent multiple simultaneous plays
            
            try {
                const context = initializeAudioContext();
                
                // Resume context if suspended (needed for Chrome's autoplay policy)
                if (context.state === 'suspended') {
                    await context.resume();
                }

                // Create new oscillator for each play
                const { oscillator, gainNode } = createNewOscillator();
                
                isPlaying = true;
                oscillator.start();

                // Stop and cleanup after beep duration
                setTimeout(() => {
                    oscillator.stop();
                    oscillator.disconnect();
                    gainNode.disconnect();
                    isPlaying = false;
                }, 200);
            } catch (error) {
                console.warn('Audio playback failed:', error);
                isPlaying = false;
            }
        }
    };
};

// Function to resume audio context on user interaction
export const resumeAudioContext = () => {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}; 