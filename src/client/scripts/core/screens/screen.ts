export default abstract class Screen {

    public assets: {
        textures: string[],
    } = {
        textures: [],
    };

    public abstract load(): void;
    public abstract unload(): void;  

}