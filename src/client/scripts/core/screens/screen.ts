import Layout from "../gui/layout";
import { GameMode } from "./screenManager";

export default abstract class Screen {
  public abstract id: GameMode;
  public abstract layout: Layout;

  public abstract onEnter(): void;
  public abstract onExit(): void;

  public draw(): void {
    this.layout.draw();
  }

  public update(): void {
    this.layout.update();
  }
}
