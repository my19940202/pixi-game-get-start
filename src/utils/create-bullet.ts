import { Graphics } from "pixi.js";

export class Bullet {
    public bullet: Graphics;
    private trail: Graphics;
    private directionX: number;
    private directionY: number;
    // @typescript-eslint/no-explicit-any
    private app: any;

    constructor(x, y, directionX, directionY, app) {
        this.bullet = new Graphics();
        this.bullet.beginFill(0xffff00);
        this.bullet.drawCircle(0, 0, 5);
        this.bullet.endFill();
        this.bullet.x = x;
        this.bullet.y = y;
        this.app = app;

        this.trail = new Graphics();
        this.trail.lineStyle(2, 0xffff00, 0.5);

        this.directionX = directionX;
        this.directionY = directionY;
    }

    update() {
        this.trail.moveTo(this.bullet.x, this.bullet.y);
        this.bullet.x += this.directionX;
        this.bullet.y += this.directionY;
        this.trail.lineTo(this.bullet.x, this.bullet.y);
    }

    isOutOfBounds() {
        return this.bullet.x < 0
            || this.bullet.x > this.app.renderer.width
            || this.bullet.y < 0
            || this.bullet.y > this.app.renderer.height;
    }

    addToStage(stage) {
        stage.addChild(this.trail);
        stage.addChild(this.bullet);
    }

    removeFromStage(stage) {
        stage.removeChild(this.trail);
        stage.removeChild(this.bullet);
    }
}

