import AssetManager from "./assetManager";

export default class AssetRandom {
  public static randomAssetCache: { [key: string]: string[] } = {};

  public static randomAssetFromFolder(folder: string) {
    if (!AssetRandom.randomAssetCache[folder]) {
      AssetRandom.randomAssetCache[folder] = Array.from(AssetManager.getAllAssetsFromFolder(folder).keys());
    }

    const assets = AssetRandom.randomAssetCache[folder];
    return assets[Math.floor(Math.random() * assets.length)];
  }
}
