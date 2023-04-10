import Pack from "../../../../common/assets/pack/pack-client";
import Utils from "../../utils";
import CLogger from "../../utils/logger";
import ScreenEventManager from "../screenEvents";

export default class AssetManager {
  public static assets: Map<string, ArrayBuffer> = new Map();
  public static dataUrlCache: Map<string, string> = new Map();
  public static imgCache: Map<string, HTMLImageElement> = new Map();

  public static loadAssets() {
    fetch("/assets")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const assets = Pack.unpack(buffer);

        for (const key in assets) {
          const asset = assets[key];
          AssetManager.assets.set(key, asset);

            const dataUrl = Utils.arrayBufferToDataUrl(asset, "image/png");
            AssetManager.dataUrlCache.set(key, dataUrl);

            const img = new Image();
            img.src = dataUrl;
            AssetManager.imgCache.set(key, img);
        }

        CLogger.debug("AssetManager", `Loaded ${AssetManager.assets.size} assets`);
        ScreenEventManager.instance.emit("assetsLoaded");
      });
  }

  public static getAsset(key: string) {
    if (!AssetManager.imgCache.has(key)) {
      const img = new Image();
      img.src = AssetManager.getAssetURL(key);
      AssetManager.imgCache.set(key, img);
    }

    return AssetManager.imgCache.get(key) as HTMLImageElement;
  }

  public static getAssetURL(key: string) {
    if (AssetManager.dataUrlCache.has(key)) return AssetManager.dataUrlCache.get(key) as string;
    const asset = AssetManager.assets.get(key);

    if (!asset) {
      throw new Error(`Asset ${key} not found`);
    }

    const dataUrl = Utils.arrayBufferToDataUrl(asset, "image/png");
    AssetManager.dataUrlCache.set(key, dataUrl);
    return dataUrl;
  }
}
