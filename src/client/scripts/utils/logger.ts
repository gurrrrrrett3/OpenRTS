/**
 * My Logger, built for the browser
 */
export default class CLogger {

  public static debugMode: boolean = true;

  public static disableDebugLogging(): void {
    this.debugMode = false;
  }

  public static log(method: string, message: string): void {
    console.log(`%c[${method}]`, `color: ${this.getColor(method)}`, message);
  }

  public static warn(method: string, message: string): void {
    console.warn(`%c[${method}]`, `color: ${this.getColor(method)}`, message);
  }

  public static error(method: string, message: string): void {
    console.error(`%c[${method}]`, `color: ${this.getColor(method)}`, message);
  }

  public static debug(method: string, message: string): void {
    if (!this.debugMode) return;
    console.debug(`%c[DEBUG] [${method}]`, `color: ${this.getColor(method)}`, `${message}`);
  }
  
  public static info = (method: string, message: string) => CLogger.log(method, message);

  public static trace(method: string, message: string): void {
    console.trace(`%c[VERBOSE] [${method}]`, `color: ${this.getColor(method)}`, `${message}`);
  }

  private static getColor(str: string): string {
    // calculate hash
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // convert to hex
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  }
}
