import Button from "../../gui/button";
import Layout from "../../gui/layout";
import Screen from "../screen";
import { GameMode } from "../screenManager";

export class MainMenu extends Screen {
  public id = GameMode.MAIN_MENU;

  public onEnter(): void {
    console.log("entering main menu");
  }

  public onExit(): void {
    console.log("exiting main menu");
  }

  public layout: Layout;

  constructor() {
    super();

    this.layout = new Layout();

    const button = new Button();
    button.setPos(100, 100);
    button.setSize(100, 100);
    button.onClick = () => {
      console.log("button clicked");
    };

    this.layout.addElement(button);
  }
}
