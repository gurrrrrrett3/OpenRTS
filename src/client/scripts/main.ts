import AssetManager from "./core/assets/assetManager";
import CameraControls from "./core/controls/cameraControls";
import DragControls from "./core/controls/dragControls";
import ScrollControls from "./core/controls/zoomControls";
import EventManager from "./core/events";
import ScreenManager, { GameMode } from "./core/screens/screenManager";
import "./core/socket/socket";
import Env from "./game/env/envRender";
import { Tilemap } from "./game/env/tilemap";
import DebugTools from "./utils/debugTools";
import CLogger from "./utils/logger";
import Utils from "./utils/utils";

/**
 * Change this to "production" when building for production
 */
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

  public cameraSubX = 0;
  public cameraSubY = 0;

  public get cameraX() {
    return Math.floor(this.cameraSubX);
  }

  public get cameraY() {
    return Math.floor(this.cameraSubY);
  }

  public zoomLevel = 1;

  public get mouseWorld() {
    return Utils.screenToWorld(this.mouseX, this.mouseY);
  }

  public get selectedTile() {

    const tile = {
      x: Math.floor(this.mouseWorld.x / 16),
      y: Math.floor(this.mouseWorld.y / 16),
    }

    return {
      tile,
      world: {
        x: tile.x * 16,
        y: tile.y * 16,
      },
      screen: {
        x: Utils.worldToScreen(tile.x * 16, tile.y * 16).x,
        y: Utils.worldToScreen(tile.x * 16, tile.y * 16).y,
      },
    }
  }

  public screen: GameMode = GameMode.LOADING;

  public tilemap = new Tilemap(100, 100)

  public set cursor(cursor: string) {
    this.canvas.style.cursor = cursor;
  }

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

      EventManager.instance.emit("load");

      AssetManager.loadAssets()
    });

    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      EventManager.instance.emit("resize", {
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

      EventManager.instance.emit("click", {
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
          EventManager.instance.emit("release", {
            x: this.mouseX,
            y: this.mouseY,
          });
        }
    })

    window.addEventListener("wheel", (event) => {
      EventManager.instance.emit("scroll", {
        dx: event.deltaX,
        dy: event.deltaY,
      });
    })

    // disable right click context menu
    window.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    // Misc Managers
    DebugTools.init()
    ScreenManager.init();  

    // Controls
    DragControls.init();
    ScrollControls.init();
    CameraControls.init();

    // stuff to start after assets
    EventManager.instance.once("assetsLoaded", () => {
      Env.init();
      ScreenManager.screen = GameMode.MAIN_MENU;
    });

    // start loop
    this.loop();
    
  }

  public update(): void {
    EventManager.instance.emit("update");
  }

  public draw(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
    EventManager.instance.emit("draw");
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
