import Layout from "../../gui/layout";
import Screen from "../screen";
import { GameMode } from "../screenManager";

export default class InGame extends Screen {
    public id = GameMode.IN_GAME

    public onEnter(): void {
        console.log("entering in game");
    }

    public onExit(): void {
        console.log("exiting in game");
    }

    public layout: Layout;

    constructor() {
        super();

        this.layout = new Layout();
    }

    public override draw(): void {
        this.layout.draw();
    }
}