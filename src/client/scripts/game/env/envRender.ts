import AssetManager from "../../core/assets/assetManager";
import ScreenEventManager from "../../core/events";
import { GameMode } from "../../core/screens/screenManager";
import { main } from "../../main";
import Utils from "../../utils/utils";
import { Tilemap } from "./tilemap";

export default class Env {

  public static init() {
    ScreenEventManager.instance.on(
      "draw",
      () => {
        if (main.screen == GameMode.IN_GAME)
        this.render();
      },
      -100
    );
  }

  public static render() {
    const topLeft = Utils.getTileAtScreenPosition(0, 0) 
    const bottomRight = Utils.getTileAtScreenPosition(main.canvas.width, main.canvas.height);

    const startx = topLeft.x < 0 ? 0 : topLeft.x;
    const starty = topLeft.y < 0 ? 0 : topLeft.y;

    const endx = bottomRight.x > main.tilemap.width ? main.tilemap.width : bottomRight.x;
    const endy = bottomRight.y > main.tilemap.height ? main.tilemap.height : bottomRight.y;

    // draw tiles
    for (let x = startx - 1; x < endx + 1; x++) {
        for (let y = starty - 1; y < endy + 1; y ++) {

            const tile = main.tilemap.getTile(x, y);
            if (!tile) continue;

            const screenPos = Utils.worldToScreen(x * Tilemap.TILE_SIZE, y * Tilemap.TILE_SIZE);

            main.ctx.drawImage(
                AssetManager.getAsset(tile.texture),
                screenPos.x,
                screenPos.y,
                Tilemap.TILE_SIZE * main.zoomLevel,
                Tilemap.TILE_SIZE * main.zoomLevel,
            )
        }
    }
  }
}
