import "pixi-spine";
import "./style.css";
import { Graphics, Application, Assets } from "pixi.js";
import { getSpine } from "./utils/spine-example";
import { createBird } from "./utils/create-bird";
import { Bullet } from "./utils/create-bullet";
import { attachConsole } from "./utils/attach-console";

const gameWidth = 800;
const gameHeight = 800;
const app = new Application<HTMLCanvasElement>({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});

window.onload = async (): Promise<void> => {
    await loadGameAssets();

    document.body.appendChild(app.view);

    // resizeCanvas();

    const birdFromSprite = createBird();
    birdFromSprite.anchor.set(0.5, 0.5);
    birdFromSprite.position.set(gameWidth / 2, gameHeight / 4);

    const spineExample = await getSpine();

    app.stage.addChild(birdFromSprite);
    // app.stage.addChild(spineExample);
    app.stage.interactive = true;

    // 创建一个小方块
    let square = new Graphics();
    square.beginFill(0xff0000);
    square.drawRect(0, 0, 50, 50);
    square.endFill();

    // 设置小方块初始位置
    square.x = app.renderer.width / 2;
    square.y = app.renderer.height / 2;

    // 将小方块添加到舞台
    app.stage.addChild(square);
    bindKeyboard(app, square);

    // 创建子弹并添加到舞台
    // @typescript-eslint/no-explicit-any
    let bullets: any = [];
    function createBullet() {
        let x = 0;
        let y = 0;
        let dirX = 0;
        let dirY = 0;

        // 随机选择子弹起始位置和方向
        let side = Math.floor(Math.random() * 4);
        switch (side) {
            case 0: // 上边界
                x = Math.random() * app.renderer.width;
                y = 0;
                dirX = (Math.random() - 0.5) * 2;
                dirY = 1;
                break;
            case 1: // 下边界
                x = Math.random() * app.renderer.width;
                y = app.renderer.height;
                dirX = (Math.random() - 0.5) * 2;
                dirY = -1;
                break;
            case 2: // 左边界
                x = 0;
                y = Math.random() * app.renderer.height;
                dirX = 1;
                dirY = (Math.random() - 0.5) * 2;
                break;
            case 3: // 右边界
                x = app.renderer.width;
                y = Math.random() * app.renderer.height;
                dirX = -1;
                dirY = (Math.random() - 0.5) * 2;
                break;
        }

        let bullet = new Bullet(x, y, dirX * 5, dirY * 5, app);
        bullet.addToStage(app.stage);
        bullets.push(bullet);
    }
    // 碰撞检测
    // @typescript-eslint/no-explicit-any
    function checkCollision(bullet: any, obstacle: any) {
        return bullet.bullet.x > obstacle.x && bullet.bullet.x < obstacle.x + obstacle.width &&
               bullet.bullet.y > obstacle.y && bullet.bullet.y < obstacle.y + obstacle.height;
    }

    // 定期生成子弹
    setInterval(createBullet, 1000);

    // 更新循环
    app.ticker.add(() => {
        // @typescript-eslint/no-explicit-any
        bullets.forEach((bullet: any, index: any) => {
            bullet.update();

            if (checkCollision(bullet, square) || bullet.isOutOfBounds()) {
                bullet.removeFromStage(app.stage);
                bullets.splice(index, 1);
            }
        });
    });

    if (VERSION.includes("d")) {
        // if development version
        attachConsole(app.stage, gameWidth, gameHeight);
    }
};

async function loadGameAssets(): Promise<void> {
    const manifest = {
        bundles: [
            {
                name: "bird",
                assets: [
                    {
                        name: "bird",
                        srcs: "./assets/simpleSpriteSheet.json",
                    },
                ],
            },
            {
                name: "pixie",
                assets: [
                    {
                        name: "pixie",
                        srcs: "./assets/spine-assets/pixie.json",
                    },
                ],
            },
        ],
    };

    await Assets.init({ manifest });
    await Assets.loadBundle(["bird", "pixie"]);
}

function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.stage.scale.x = window.innerWidth / gameWidth;
        app.stage.scale.y = window.innerHeight / gameHeight;
    };

    resize();

    window.addEventListener("resize", resize);
}


function bindKeyboard(app: any, square: any): void {
     // 键盘事件处理
     let keys: any = {};

     window.addEventListener('keydown', (e) => {
         keys[e.code] = true;
     });

     window.addEventListener('keyup', (e) => {
         keys[e.code] = false;
     });

     // 更新小方块位置
     app.ticker.add(() => {
         if (keys['ArrowUp']) {
             square.y -= 5;
         }
         if (keys['ArrowDown']) {
             square.y += 5;
         }
         if (keys['ArrowLeft']) {
             square.x -= 5;
         }
         if (keys['ArrowRight']) {
             square.x += 5;
         }
     });
}
