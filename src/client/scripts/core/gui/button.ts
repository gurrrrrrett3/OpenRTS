import { main } from "../../main";
import Utils from "../../utils/utils";
import Element from "./element";

export default class Button extends Element {
  public text: string = "Test Button";
  public action: () => void = () => {};
  public hasBeenClicked: boolean = false;

  public color = {
    bg: "#000",
    text: "#fff",
  };

  public hoverColor = {
    bg: "#333",
    text: "#fff",
  };

  public clickColor = {
    bg: "#000",
    text: "#fff",
  };

  public setText(text: string): Button {
    this.text = text;
    return this;
  }

  public setAction(action: () => void): Button {
    this.action = action;
    return this;
  }

  public draw(): void {
    main.ctx.save();
    main.ctx.fillStyle = this.getColorForClickStatus(this.color.bg, this.hoverColor.bg, this.clickColor.bg);
    main.ctx.fillRect(this.realX, this.realY, this.realWidth, this.realHeight);

    main.ctx.fillStyle = this.getColorForClickStatus(
      this.color.text,
      this.hoverColor.text,
      this.clickColor.text
    );

    main.ctx.textAlign = "center";
    main.ctx.textBaseline = "middle";

    const textLines = Utils.fitText(main.ctx, this.text, this.realWidth - 10, "monospace", 10);

    textLines.forEach((line, index) => {
      main.ctx.fillText(
        line,
        this.realX + this.realWidth / 2,
        this.realY + this.realHeight / 2 - (textLines.length - 1) * 5 + index * 10
      );
    });

    main.ctx.fillText(this.text, this.realX + this.realWidth / 2, this.realY + this.realHeight / 2);

    main.ctx.strokeStyle = "white";

    main.ctx.beginPath();
    main.ctx.moveTo(this.realX, this.realY);
    main.ctx.lineTo(this.realX + this.realWidth, this.realY);
    main.ctx.lineTo(this.realX + this.realWidth, this.realY + this.realHeight);
    main.ctx.lineTo(this.realX, this.realY + this.realHeight);
    main.ctx.lineTo(this.realX, this.realY);
    main.ctx.stroke();

    main.ctx.closePath();
    main.ctx.restore();
  }

  public update(): void {
    if (this.clickStatus().left && !this.hasBeenClicked) {
      this.hasBeenClicked = true;
      this.onClick();
    } else if (!this.clickStatus().left) {
      this.hasBeenClicked = false;
    }
  }

  public onClick(): void {
    this.action();
  }

  private getColorForClickStatus(regular: string, hover: string, click: string) {
    if (this.isHovered()) {
      if (main.mouseButtons.left) {
        return click;
      } else {
        return hover;
      }
    } else {
      return regular;
    }
  }
}
