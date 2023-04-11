import { Tilemap } from "../../game/env/tilemap";
import { main } from "../../main";
import CLogger from "../../utils/logger";
import EventManager from "../events";

export default class CameraControls {
  public static draggingCamera: boolean = false;

  public static init() {
    EventManager.instance.on("startDrag", (event) => {
      if (event.clickStatus.middle) {
        this.draggingCamera = true;

        CLogger.log("CameraControls", "Dragging camera");
      }
    });

    EventManager.instance.on("dragFrame", (event) => {
      if (this.draggingCamera) {
        main.cameraSubX -= event.delta.x / main.zoomLevel;
        main.cameraSubY -= event.delta.y / main.zoomLevel;

        CLogger.log("CameraControls", "Dragging camera");
      }
    });

    EventManager.instance.on("endDrag", (event) => {
      if (this.draggingCamera) {
        this.draggingCamera = false;

        CLogger.log("CameraControls", "Stopped dragging camera");
      }
    });
  }
}
