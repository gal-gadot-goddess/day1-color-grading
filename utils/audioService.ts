
class AudioService {
  public ctx: AudioContext | null = null;
  public masterGain: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private feedbackGain: GainNode | null = null;
  private soundEnabled: boolean = false;

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Master Chain: Gain -> Delay/Feedback -> Destination
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.25;

      this.delayNode = this.ctx.createDelay();
      this.delayNode.delayTime.value = 0.15; // 150ms echo

      this.feedbackGain = this.ctx.createGain();
      this.feedbackGain.gain.value = 0.3; // 30% feedback

      // Connect Delay Loop
      this.delayNode.connect(this.feedbackGain);
      this.feedbackGain.connect(this.delayNode);

      // Connect Master to Destination AND Delay
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.connect(this.delayNode);
      this.delayNode.connect(this.ctx.destination);

      this.soundEnabled = true;
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public soundMode: 'CRYSTAL' | 'MARIMBA' | 'RETRO_8BIT' | 'SYNTH_CHORD' = 'CRYSTAL';

  public setSoundMode(mode: 'CRYSTAL' | 'MARIMBA' | 'RETRO_8BIT' | 'SYNTH_CHORD') {
    this.soundMode = mode;
  }

  public playNote(normalizedValue: number, type: 'compare' | 'swap' | 'complete', index: number = 0, total: number = 24) {
    if (!this.ctx) this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const val = Math.max(0, Math.min(1, normalizedValue));
      
      // Panning for ASMR Stereo Effect
      const panValue = (index / total) * 2 - 1;
      const panner = this.ctx.createStereoPanner();
      panner.pan.value = panValue;
      panner.connect(this.masterGain);

      if (type === 'complete') {
        const chord = [1.0, 1.25, 1.5, 2.0]; // Major Root, Third, Fifth, Octave
        const baseFreq = 261.63; // C4
        chord.forEach((level, i) => {
          const osc = this.ctx!.createOscillator();
          const g = this.ctx!.createGain();
          osc.type = this.soundMode === 'RETRO_8BIT' ? 'square' : (this.soundMode === 'SYNTH_CHORD' ? 'triangle' : 'sine');
          osc.frequency.setValueAtTime(baseFreq * level, now + i * 0.05);
          g.gain.setValueAtTime(0, now + i * 0.05);
          g.gain.linearRampToValueAtTime(0.18, now + (i * 0.05) + 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.05) + 2.0);
          osc.connect(g);
          g.connect(panner);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 2.2);
        });
        return;
      }

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      let freq = 180 + (val * 1050);
      let oscType: OscillatorType = 'sine';
      let attack = 0.015;
      let decay = type === 'swap' ? 0.15 : 0.08;
      let volume = type === 'swap' ? 0.28 : 0.14;

      switch (this.soundMode) {
        case 'MARIMBA':
          // Warm wooden marimba tone with fast percussive attack
          oscType = 'triangle';
          freq = 130 + (val * 880);
          attack = 0.005;
          decay = type === 'swap' ? 0.18 : 0.09;
          volume = type === 'swap' ? 0.32 : 0.16;
          break;
        case 'RETRO_8BIT':
          // Authentic retro arcade chiptune square wave
          oscType = 'square';
          // Quantize to pentatonic / 8-bit scale
          freq = 160 + Math.floor(val * 16) * 55;
          attack = 0.003;
          decay = type === 'swap' ? 0.11 : 0.06;
          volume = type === 'swap' ? 0.16 : 0.09;
          break;
        case 'SYNTH_CHORD':
          // Warm analog sawtooth with soft filtering
          oscType = 'sawtooth';
          freq = 140 + (val * 700);
          attack = 0.02;
          decay = type === 'swap' ? 0.22 : 0.12;
          volume = type === 'swap' ? 0.18 : 0.10;
          break;
        case 'CRYSTAL':
        default:
          // Brilliant bell chime
          oscType = 'sine';
          freq = 220 + (val * 1100);
          attack = 0.01;
          decay = type === 'swap' ? 0.16 : 0.08;
          volume = type === 'swap' ? 0.28 : 0.14;
          break;
      }

      osc.type = oscType;
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(volume, now + attack);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + attack + decay);

      osc.connect(gainNode);
      gainNode.connect(panner);

      osc.start(now);
      osc.stop(now + attack + decay + 0.05);
    } catch (e) {
      console.error("Audio error:", e);
    }
  }
}
export const audioService = new AudioService();
