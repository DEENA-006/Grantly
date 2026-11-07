"use client";

// Zero-dependency Web Audio API micro-synth for tactile UI feedback
class SoundController {
  private ctx: AudioContext | null = null;
  public enabled: boolean = false;

  private initCtx() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.initCtx();
      this.playChime(660, 0.08);
    }
    return this.enabled;
  }

  public playChime(freq: number = 520, duration: number = 0.1) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        freq * 1.5,
        this.ctx.currentTime + duration
      );

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // AudioContext unavailable or blocked by browser policy
    }
  }

  public playSave() {
    this.playChime(440, 0.12);
  }

  public playSuccess() {
    if (!this.enabled) return;
    this.playChime(587.33, 0.09);
    setTimeout(() => this.playChime(880, 0.16), 80);
  }
}

export const soundFx = new SoundController();

