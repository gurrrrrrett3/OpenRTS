export default class ScreenManager {

    private static _instance: ScreenManager;

    public static get instance(): ScreenManager {
        if (!this._instance) {
            this._instance = new ScreenManager();
        }
        return this._instance;
    }

    public screen = "mainmenu"
    public screens: Map<string, any> = new Map();

}