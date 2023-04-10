import AssetManager from "./core/assets/assetManager";
import DragManager from "./core/controls/dragManager";
import ScreenEventManager from "./core/screenEvents";
import "./core/socket/socket";
import Env from "./game/env/envRender";
import DebugTools from "./utils/debugTools";
import CLogger from "./utils/logger";

export const MODE = "development";

export default class Main {
  private static _main: Main;

  public static get main(): Main {
    if (!this._main) {
      this._main = new Main();
    }
    return this._main;
  }

  public canvas = document.getElementById("game") as HTMLCanvasElement;
  public ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

  public mouseX = 0;
  public mouseY = 0;
  public mouseButtons: {
    left: boolean;
    right: boolean;
    middle: boolean;
  } = {
    left: false,
    right: false,
    middle: false,
  };

  public width = 0;
  public height = 0;

  public lastFrameTime = 0;
  
  public fps = 0;
  public drawTime = 0;
  public updateTime = 0;
  public frameTime = 0;

  public cameraX = 0;
  public cameraY = 0;
  public zoomLevel = 1;

  constructor() {}

  public init(): void {

    if (MODE !== "development") {
      CLogger.disableDebugLogging();
    }

    this.ctx.imageSmoothingEnabled = false;
    
    // global events

    window.addEventListener("load", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.canvas.width = this.width;
      this.canvas.height = this.height;

      ScreenEventManager.instance.emit("load");

      AssetManager.loadAssets()
    });

    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      ScreenEventManager.instance.emit("resize", {
        width: this.width,
        height: this.height,
      });

      this.canvas.width = this.width;
      this.canvas.height = this.height;
    });

    window.addEventListener("mousemove", (event) => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    });

    window.addEventListener("mousedown", (event) => {
      switch (event.button) {
        case 0:
          this.mouseButtons.left = true;
          break;
        case 1:
          this.mouseButtons.middle = true;
          break;
        case 2:
          this.mouseButtons.right = true;
          break;
      }
      event.preventDefault();

      ScreenEventManager.instance.emit("click", {
        clickStatus: this.mouseButtons,
        x: this.mouseX,
        y: this.mouseY,
      });
    });

    window.addEventListener("mouseup", (event) => {
        switch (event.button) {
          case 0:
            this.mouseButtons.left = false;
            break;
          case 1:
            this.mouseButtons.middle = false;
            break;
          case 2:
            this.mouseButtons.right = false;
            break;
        }

        if (this.mouseButtons.left === false && this.mouseButtons.right === false && this.mouseButtons.middle === false) {
          ScreenEventManager.instance.emit("release", {
            x: this.mouseX,
            y: this.mouseY,
          });
        }
    })

    window.addEventListener("wheel", (event) => {
      if (event.deltaY > 0) {
        this.zoomLevel -= 0.1;
      } else {
        this.zoomLevel += 0.1;
      }
      if (this.zoomLevel < 0.1) {
        this.zoomLevel = 0.1;
      }
      if (this.zoomLevel > 10) {
        this.zoomLevel = 10;
      }
    })

    // disable right click context menu
    window.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    // Misc Managers
    DebugTools.init()
    DragManager.init();

    // stuff to start after assets
    ScreenEventManager.instance.once("assetsLoaded", () => {
      Env.init();
    });

    // start loop
    this.loop();
    
  }

  public update(): void {
    ScreenEventManager.instance.emit("update");
  }

  public draw(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
    ScreenEventManager.instance.emit("draw");
  }
  
  public loop(): void {

    let fameStartTime = performance.now();
    this.update();
    let updateEndTime = performance.now();
    this.draw();
    let drawEndTime = performance.now();
    
    requestAnimationFrame((frameTime) => {
      this.fps = 1000 / (frameTime - this.lastFrameTime);
      this.lastFrameTime = frameTime;

      this.drawTime = drawEndTime - updateEndTime;
      this.updateTime = updateEndTime - fameStartTime;
      this.frameTime = drawEndTime - fameStartTime;

      this.loop();
    });
  }

}

export const main = new Main();
main.init();
