
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

  public playNote(normalizedValue: number, type: 'compare' | 'swap' | 'complete', index: number = 0, total: number = 24) {
    if (!this.ctx) this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const val = Math.max(0, Math.min(1, normalizedValue));
      // Re-map to a brilliant, crystalline frequency range
      const freq = 180 + (val * 1000);

      // Panning for ASMR Stereo Effect
      const panValue = (index / total) * 2 - 1;
      const panner = this.ctx.createStereoPanner();
      panner.pan.value = panValue;
      panner.connect(this.masterGain);

      if (type === 'complete') {
        const chord = [1.0, 1.25, 1.5, 2.0]; // Major Root, Third, Fifth, Octave
        chord.forEach((level, i) => {
          const osc = this.ctx!.createOscillator();
          const g = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq * level, now + i * 0.05);
          g.gain.setValueAtTime(0, now + i * 0.05);
          g.gain.linearRampToValueAtTime(0.18, now + (i * 0.05) + 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.05) + 1.8);
          osc.connect(g);
          g.connect(panner);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 2.0);
        });
        return;
      }

      // CRYSTAL "DING" SORTING SOUND
      // Using the exact texture and envelope as the final complete sound
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = 'sine'; // Matches the 'Ding' texture
      osc.frequency.setValueAtTime(freq, now);

      // Envelope: Resonant 20ms attack + musical decay
      const attack = 0.015;
      const decay = type === 'swap' ? 0.15 : 0.08;
      const volume = type === 'swap' ? 0.25 : 0.12;

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
