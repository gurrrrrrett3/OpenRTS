import { Tile } from "./tile";

export class Tilemap {
  public static readonly TILE_SIZE = 16;

  public tiles: Tile[][];
  public width: number;
  public height: number;

  private _borderTile = new Tile("textures/env/tile/grid/border.png", -1, -1, false);

  public constructor(mapWidth: number, mapHeight: number) {
    this.tiles = [];

    for (let x = 0; x < mapWidth; x++) {
      this.tiles[x] = [];

      for (let y = 0; y < mapHeight; y++) {
        this.tiles[x][y] = new Tile("textures/env/tile/stone/stone1.png", x, y);
      }
    }

    this.width = mapWidth;
    this.height = mapHeight;
  }

  public getTile(x: number, y: number): Tile | null {
    try {
      if (x == -1 || y == -1 || x == this.width || y == this.height) {
        return this._borderTile.atCoords(x, y);
      }

      return this.tiles[x][y];
    } catch (e) {
      return null;
    }
  }

  public setTile(x: number, y: number, tile: Tile): void {
    this.tiles[x][y] = tile;
  }

  public getTileAt(x: number, y: number): Tile | null {
    try {
      return this.tiles[Math.floor(x / Tilemap.TILE_SIZE)][Math.floor(y / Tilemap.TILE_SIZE)];
    } catch (e) {
      return null;
    }
  }
}
