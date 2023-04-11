import { Tilemap } from "../game/env/tilemap";
import { main } from "../main";

export default class Utils {
  public static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  public static arrayBufferToDataUrl(buffer: ArrayBuffer, type: string): string {
    return `data:${type};base64,${Utils.arrayBufferToBase64(buffer)}`;
  }

  public static screenToWorld(x: number, y: number): { x: number; y: number } {
    return {
      x: x / main.zoomLevel + main.cameraX,
      y: y / main.zoomLevel + main.cameraY,
    };
  }

  public static worldToScreen(x: number, y: number): { x: number; y: number } {
    return {
      x: (x - main.cameraX) * main.zoomLevel,
      y: (y - main.cameraY) * main.zoomLevel,
    };
  }

  public static getTileAtScreenPosition(x: number, y: number): { x: number; y: number } {
    const worldPosition = Utils.screenToWorld(x, y);

    return {
      x: Math.floor(worldPosition.x / Tilemap.TILE_SIZE),
      y: Math.floor(worldPosition.y / Tilemap.TILE_SIZE),
    };
  }
}
