import Button from "../../gui/button";
import Layout from "../../gui/layout";
import Screen from "../screen";
import ScreenManager, { GameMode } from "../screenManager";

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
    button.setPos(40, 30);
    button.setSize(20, 10);
    button.setText("Start Game")
    button.onClick = () => {
      ScreenManager.screen = GameMode.IN_GAME;
    };

    this.layout.addElement(button);
  }
}
