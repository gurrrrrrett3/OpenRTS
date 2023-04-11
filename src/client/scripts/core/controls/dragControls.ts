import { MODE, main } from "../../main";
import EventManager from "../events";

export default class DragManager {
  public static mouseDownPosition: { x: number; y: number } = { x: 0, y: 0 };
  public static dragging: boolean = false;

  public static init() {
    EventManager.instance.on("click", (event) => {
      this.mouseDownPosition = { x: event.x, y: event.y };
      this.dragging = true;
      EventManager.instance.emit("startDrag", {
        clickStatus: main.mouseButtons,
        x: this.mouseDownPosition.x,
        y: this.mouseDownPosition.y,
      });
    });

    window.addEventListener("mousemove", (event) => {
      EventManager.instance.emit("dragFrame", {
        start: this.mouseDownPosition,
        end: { x: event.clientX, y: event.clientY },
        delta: { x: event.movementX, y: event.movementY },
      });
    });

    EventManager.instance.on("release", (event) => {
      this.dragging = false;
      EventManager.instance.emit("endDrag", {
        start: this.mouseDownPosition,
        end: { x: event.x, y: event.y },
        clickStatus: main.mouseButtons,
        distance: Math.sqrt(
          Math.pow(this.mouseDownPosition.x - event.x, 2) + Math.pow(this.mouseDownPosition.y - event.y, 2)
        ),
      });
    });

    if (MODE === "development") {
      EventManager.instance.on("draw", () => {
        if (!this.dragging) return;
        if (main.mouseButtons.middle) return;

        main.ctx.strokeStyle = "red";
        main.ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
        main.ctx.lineWidth = 1;
        main.ctx.beginPath();
        main.ctx.rect(
          this.mouseDownPosition.x,
          this.mouseDownPosition.y,
          main.mouseX - this.mouseDownPosition.x,
          main.mouseY - this.mouseDownPosition.y
        );
        main.ctx.stroke();
        main.ctx.fill();
        main.ctx.closePath();
      });
    }
  }
}
