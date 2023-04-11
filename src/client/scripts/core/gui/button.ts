import { main } from "../../main";
import Element from "./element";

export default class Button extends Element {
  public text: string = "";
  public action: () => void = () => {};

  public color = "#000000";
  public hoverColor = "#000000";
  public textColor = "#000000";
  public hoverTextColor = "#000000";

  public setText(text: string): Button {
    this.text = text;
    return this;
  }

  public setAction(action: () => void): Button {
    this.action = action;
    return this;
  }

  public draw(): void {
    main.ctx.fillStyle = this.isHovered() ? this.hoverColor : this.color;
    main.ctx.fillRect(this.x, this.y, this.width, this.height);

    main.ctx.fillStyle = this.isHovered()
        ? this.hoverTextColor
        : this.textColor;
    main.ctx.font = "30px Arial";
    main.ctx.textAlign = "center";
    main.ctx.textBaseline = "middle";
    main.ctx.fillText(
        this.text,
        this.x + this.width / 2,
        this.y + this.height / 2
    );

    main.ctx.strokeStyle = "white";
    
    main.ctx.beginPath();
    main.ctx.moveTo(this.x, this.y);
    main.ctx.lineTo(this.x + this.width, this.y);
    main.ctx.lineTo(this.x + this.width, this.y + this.height);
    main.ctx.lineTo(this.x, this.y + this.height);
    main.ctx.lineTo(this.x, this.y);
    main.ctx.stroke();

    main.ctx.closePath();
  }

  public update(): void {}

  public onClick(): void {
    this.action();
  }
}
