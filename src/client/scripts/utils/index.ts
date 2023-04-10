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

}