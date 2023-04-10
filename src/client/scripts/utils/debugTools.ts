import ScreenEventManager from "../core/screenEvents";
import { MODE, main } from "../main";

export default class DebugTools {

    public static init() {
        if (MODE !== "development") return;

        ScreenEventManager.instance.on("draw", () => {
            this.renderFps();
        })
    }

    public static renderFps() {
        main.ctx.fillStyle = "white";
        main.ctx.font = "20px Arial";
        main.ctx.fillText(`FPS: ${main.fps.toFixed(2)} | F: ${main.frameTime.toFixed(2)}ms | U: ${main.updateTime.toFixed(2)}ms | D: ${main.drawTime.toFixed(2)}ms`, 10, 30);
    }

}