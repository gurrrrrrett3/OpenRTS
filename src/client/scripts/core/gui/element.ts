import { main } from "../../main";

export default abstract class Element {
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;
  public cursor: string = "default";

  public get realX(): number {
    return (this.x / 100) * main.width;
  }

  public get realY(): number {
    return (this.y / 100) * main.height;
  }

  public get realWidth(): number {
    return (this.width / 100) * main.width;
  }

  public get realHeight(): number {
    return (this.height / 100) * main.height;
  }

  /**
   * Set the position of the element
   * @param x The percentage of the screen width
   * @param y The percentage of the screen height
   */
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

  public abstract onClick(): void;

  public isHovered(): boolean {
    return (
      main.mouseX >= this.realX &&
      main.mouseX <= this.realX + this.realWidth &&
      main.mouseY >= this.realY &&
      main.mouseY <= this.realY + this.realHeight
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
