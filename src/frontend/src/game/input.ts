// Keyboard and mouse input handling for game controls

export interface InputState {
  keys: Set<string>;
  mouse: {
    x: number;
    y: number;
    isDown: boolean;
  };
}

export class InputHandler {
  private state: InputState = {
    keys: new Set(),
    mouse: { x: 0, y: 0, isDown: false },
  };

  private canvas: HTMLCanvasElement;
  private onPause?: () => void;
  private onRestart?: () => void;

  constructor(canvas: HTMLCanvasElement, callbacks?: { onPause?: () => void; onRestart?: () => void }) {
    this.canvas = canvas;
    this.onPause = callbacks?.onPause;
    this.onRestart = callbacks?.onRestart;
    this.attach();
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.state.keys.add(e.key.toLowerCase());
    
    if (e.key === 'p' || e.key === 'Escape') {
      e.preventDefault();
      this.onPause?.();
    }
    if (e.key === 'r') {
      this.onRestart?.();
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.state.keys.delete(e.key.toLowerCase());
  };

  private handleMouseMove = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.state.mouse.x = e.clientX - rect.left;
    this.state.mouse.y = e.clientY - rect.top;
  };

  private handleMouseDown = (e: MouseEvent) => {
    if (e.button === 0) {
      this.state.mouse.isDown = true;
    }
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (e.button === 0) {
      this.state.mouse.isDown = false;
    }
  };

  attach() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
  }

  detach() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
  }

  getState(): InputState {
    return this.state;
  }

  isKeyPressed(key: string): boolean {
    return this.state.keys.has(key.toLowerCase());
  }
}
