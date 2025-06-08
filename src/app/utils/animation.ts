export class AnimationLoop {
  private animationId: number | null = null;
  private animationTime: number | null = null;
  private resolve: ((value?: unknown) => void) | null = null;
  private loop: (delta: number) => void;
  private duration: number;

  constructor(loop: (delta: number) => void, duration: number) {
    this.loop = loop;
    this.duration = duration;
  }

  public async start(): Promise<void> {
    this.animationId = requestAnimationFrame(this.animation.bind(this));
    await new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  private animation(time: number): void {
    if (this.animationTime == null) {
      this.animationTime = time;
    }

    const delta = time - this.animationTime;

    if (delta >= 0) {
      let endAnimation = false;
      let valDelta = delta;
      if (delta > this.duration) {
        valDelta = this.duration;
        endAnimation = true;
      }

      this.loop(valDelta);

      if (endAnimation) {
        if (this.animationId != null) {
          this.animationTime = null;
          cancelAnimationFrame(this.animationId);
          if (this.resolve != null) {
            this.resolve();
          }
        }
      } else {
        this.animationId = requestAnimationFrame(this.animation.bind(this));
      }
    }
  }
}
