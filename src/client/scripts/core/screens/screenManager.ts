import { main } from "../../main";
import EventManager from "../events";
import InGame from "./modes/inGame";
import { MainMenu } from "./modes/mainMenu";
import Screen from "./screen";

export default class ScreenManager {

    private static _instance: ScreenManager;

    public static get instance(): ScreenManager {
        if (!this._instance) {
            this._instance = new ScreenManager();
        }
        return this._instance;
    }

    public screens: Map<GameMode, Screen> = new Map();

    public static init(): void {
        EventManager.instance.on("draw", () => {
            this.draw();
        }, 0);

        EventManager.instance.on("update", () => {
            this.update();
        }, 0);

        ScreenManager.instance.screens.set(GameMode.MAIN_MENU, new MainMenu());
        ScreenManager.instance.screens.set(GameMode.IN_GAME, new InGame());
    }
    
    public static draw(): void {
        this.instance.screens.get(main.screen)?.draw();
    }

    public static update(): void {
        this.instance.screens.get(main.screen)?.update();
    }

    public static set screen(id: GameMode) {
        this.instance.screens.get(main.screen)?.onExit();
        main.screen = id;
        this.instance.screens.get(main.screen)?.onEnter();
    }

}

export enum GameMode {
    MAIN_MENU = 0,
    IN_GAME = 1,
    PAUSED = 2,
    GAME_OVER = 3,
    SETTINGS = 4,
    CREDITS = 5,
    LOADING = 6,
    TUTORIAL = 7,
    GAME_OVER_WIN = 8,
    GAME_OVER_LOSE = 9,
    GAME_OVER_DRAW = 10,    
}

export const ScreenNames = new Map<GameMode, string>([
    [GameMode.MAIN_MENU, "Main Menu"],
    [GameMode.IN_GAME, "In Game"],
    [GameMode.PAUSED, "Paused"],
    [GameMode.GAME_OVER, "Game Over"],
    [GameMode.SETTINGS, "Settings"],
    [GameMode.CREDITS, "Credits"],
    [GameMode.LOADING, "Loading"],
    [GameMode.TUTORIAL, "Tutorial"],
    [GameMode.GAME_OVER_WIN, "Game Over Win"],
    [GameMode.GAME_OVER_LOSE, "Game Over Lose"],
    [GameMode.GAME_OVER_DRAW, "Game Over Draw"],
]);

export function getScreen(id: GameMode): Screen {
    if (!ScreenManager.instance.screens.has(id)) throw new Error(`Screen with id ${id} does not exist`);
    return ScreenManager.instance.screens.get(id) as Screen;
}
