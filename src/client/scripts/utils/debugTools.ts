import ScreenEventManager from "../core/events";
import ScreenManager, { ScreenNames } from "../core/screens/screenManager";
import { MODE, main } from "../main";

export default class DebugTools {

    public static init() {
        if (MODE !== "development") return;

        ScreenEventManager.instance.on("draw", () => {
            this.highlightSelectedTile();
            this.renderDebugInfo();
        }, 100)
    }

    public static renderDebugInfo() {
        main.ctx.fillStyle = "white";
        main.ctx.font = "20px monospace";
        main.ctx.fillText(`FPS: ${main.fps.toFixed(2)} | F: ${main.frameTime.toFixed(2)}ms | U: ${main.updateTime.toFixed(2)}ms | D: ${main.drawTime.toFixed(2)}ms`, 10, 30);
        main.ctx.fillText(`Camera: ${main.cameraX.toFixed(2)}, ${main.cameraY.toFixed(2)} | Zoom: ${main.zoomLevel.toFixed(2)}`, 10, 60);
        main.ctx.fillText(`Mouse: ${main.mouseX}, ${main.mouseY} | World: ${main.mouseWorld.x.toFixed(2)}, ${main.mouseWorld.y.toFixed(2)} | Tile: ${main.selectedTile.tile.x}, ${main.selectedTile.tile.y}`, 10, 90);
        main.ctx.fillText(`Mode: ${ScreenNames.get(main.screen)} (${main.screen})`, 10, 120)
    }

    public static highlightSelectedTile() {
        const size = 16 * main.zoomLevel;
        const location = main.selectedTile.screen;

        main.ctx.fillStyle = "rgba(0, 255, 0, 0.4)";
        main.ctx.fillRect(location.x, location.y, size, size);
    }
}
