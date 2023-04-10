import { main } from "../../main";

export default abstract class Element {
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;

  public setPos(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  public abstract draw(): void;
  public abstract update(): void;

  public updateAndDraw(): void {
    this.update();
    this.draw();
  }

  public abstract onClick(): void;

  public isHovered(): boolean {
    return (
      main.mouseX >= this.x &&
      main.mouseX <= this.x + this.width &&
      main.mouseY >= this.y &&
      main.mouseY <= this.y + this.height
    );
  }

  public clickStatus(): {
    left: boolean;
    right: boolean;
    middle: boolean;
  } {
    if (this.isHovered()) {
      return main.mouseButtons;
    } else {
      return {
        left: false,
        right: false,
        middle: false,
      };
    }
  }
}
