export class Tile {
  public texture: string;

  public x: number;
  public y: number;

  public solid: boolean;

  public constructor(texture: string, x: number, y: number, solid: boolean = true) {
    this.texture = texture;
    this.x = x;
    this.y = y;
    this.solid = solid;
  }

  /**
   * Return this tile at the given coordinates. Useful for stuff like the border tile.
   * @param x 
   * @param y 
   * @returns  This tile
   */
  public atCoords(x: number, y: number): Tile {
    this.x = x;
    this.y = y;
    return this;
  }
}
