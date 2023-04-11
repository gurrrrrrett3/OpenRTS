import Element from "./element";

/**
 * Layout
 * Main parent of gui elements
 */
export default class Layout {

    public elements: Element[] = [];

    constructor() {
        
    }

    public addElement(element: Element): void {
        this.elements.push(element);
    }

    public removeElement(element: Element): void {
        this.elements.splice(this.elements.indexOf(element), 1);
    }

    public draw(): void {
        this.elements.forEach((element) => {
            element.draw();
        });
    }

    public update(): void {
        this.elements.forEach((element) => {
            element.update();
        });
    }

}