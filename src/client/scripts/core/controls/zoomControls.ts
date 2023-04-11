import { main } from "../../main";
import EventManager from "../events";

export default class ZoomControls {
  public static init() {
    EventManager.instance.on("scroll", (event) => {
      if (event.dy > 0) {
        main.zoomLevel -= 0.5;
      } else {
        main.zoomLevel += 0.5;
      }
      if (main.zoomLevel < 1) {
        main.zoomLevel = 1;
      }
      if (main.zoomLevel > 3) {
        main.zoomLevel = 3;
      }
    });
  }
}
