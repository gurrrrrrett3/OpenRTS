import AssetManager from "../../core/assets/assetManager";
import ScreenEventManager from "../../core/screenEvents";
import { main } from "../../main";

export default class Env {

    public static init() {
        ScreenEventManager.instance.on("draw", () => {
            this.render();
        }, -100)
    }

  public static render() {

    const size = 16 * main.zoomLevel;

    // draw grid
    for (let x = 0; x < main.width; x += size) {
      for (let y = 0; y < main.height; y += size) {
        main.ctx.drawImage(AssetManager.getAsset("textures/env/tile/gridFloor1.png"), x, y, size, size);
      }
    }
  }
}
