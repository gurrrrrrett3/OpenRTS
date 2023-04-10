import { MODE, main } from "../../main";
import ScreenEventManager from "../screenEvents";

export default class DragManager {
  public static mouseDownPosition: { x: number; y: number } = { x: 0, y: 0 };
  public static dragging: boolean = false;

  public static init() {
    ScreenEventManager.instance.on("click", (event) => {
      this.mouseDownPosition = { x: event.x, y: event.y };
      this.dragging = true;
    });

    window.addEventListener("mousemove", (event) => {
      if (main.mouseButtons.left) {
        ScreenEventManager.instance.emit("dragFrame", {
          start: this.mouseDownPosition,
          end: { x: event.clientX, y: event.clientY },
        });
      }
    });

    ScreenEventManager.instance.on("release", (event) => {
        this.dragging = false;
      ScreenEventManager.instance.emit("endDrag", {
        start: this.mouseDownPosition,
        end: { x: event.x, y: event.y },
        clickStatus: main.mouseButtons,
        distance: Math.sqrt(
          Math.pow(this.mouseDownPosition.x - event.x, 2) + Math.pow(this.mouseDownPosition.y - event.y, 2)
        ),
      });
    });

    if (MODE === "development") {

     ScreenEventManager.instance.on("draw", () => {

        if (!this.dragging) return;

        main.ctx.strokeStyle = "red";
        main.ctx.lineWidth = 1;
        main.ctx.beginPath();
        main.ctx.rect(this.mouseDownPosition.x, this.mouseDownPosition.y, main.mouseX - this.mouseDownPosition.x, main.mouseY - this.mouseDownPosition.y);
        main.ctx.stroke();
        main.ctx.closePath();

     })

    }

  }
}
