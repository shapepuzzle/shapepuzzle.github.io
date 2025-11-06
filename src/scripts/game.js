import { AssetManager } from './asset-manager';
import { Pointer } from './pointer';
import { Puzzle } from './puzzle';
import { Point2D } from './point2D';


export class Game {
    constructor(canvas) {
        this.started = false;
        this.paused = false;
        this.stage = 1;
        this.scale = 1;
        this.alpha = 1;
        this.fade1 = 0;
        this.fade2 = 0;
        this.debug = false;
        this.interval = null;
        this.maxElapsedTime = 0;
        this.startTime = 0;

        //canvas
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");

        //canvas resize
        this.canvas.width = Math.round(window.innerWidth);
        this.canvas.height = Math.round(window.innerHeight);
        console.log("canvas: " + this.canvas.width + ", " + this.canvas.height)
        this.originalWidth = this.canvas.width;
        this.originalHeight = this.canvas.height;

        //size  
        this.fontSize = Math.round(this.canvas.width / 20);
        this.scaledWidth = (this.canvas.width / this.scale) / 2;
        this.scaledHeight = (this.canvas.height / this.scale) / 2;
        console.log('scaled_width: ' + this.scaledWidth);
        console.log('scaled_height: ' + this.scaledHeight);
    }

    init() {
        this.assetManager = new AssetManager();

        // callbacks
        this.assetManager.onProgress(progress => {
            console.log(`Loading: ${(progress * 100).toFixed(1)}%`);
        });

        this.assetManager.onError(error => {
            console.error('Asset loading error:', error);
        });

        // base assets
        this.assetManager.register("drip", "/game/audio/drip.mp3", "audio");
        this.assetManager.register("twang", "/game/audio/twang.mp3", "audio");
        this.assetManager.register("bgm", "/game/audio/bgm.mp3", "audio");
        this.assetManager.register("chimes", "/game/audio/chimes.mp3", "audio");
        // this.assetManager.loadAll();

        // here ?
        this.autoSnap = true;
        this.moving = true;
        this.selected = null;
        this.isOver = false;
        this.clockInterval = null;
        this.pointer = new Pointer(this);

        this.puzzles = [
            new Puzzle("001", this, "/game/stages/001/001.png", new Array("/game/stages/001/p01.png", "/game/stages/001/p02.png", "/game/stages/001/p03.png", "/game/stages/001/p04.png", "/game/stages/001/p05.png", "/game/stages/001/p06.png", "/game/stages/001/p07.png"), new Array("/game/stages/001/h01.png", "/game/stages/001/h02.png", "/game/stages/001/h03.png", "/game/stages/001/h04.png", "/game/stages/001/h05.png", "/game/stages/001/h06.png", "/game/stages/001/h07.png"), { has_voice: true, has_sound: false }, { width: 298, height: 400 }, new Array(
                new Point2D(-8, 40),
                new Point2D(81, 26),
                new Point2D(83, 60),
                new Point2D(76, 110),
                new Point2D(48, 190),
                new Point2D(165, 187),
                new Point2D(12, 260))),
            new Puzzle("002", this, "/game/stages/002/002.png", new Array("/game/stages/002/p01.png", "/game/stages/002/p02.png", "/game/stages/002/p03.png", "/game/stages/002/p04.png", "/game/stages/002/p05.png", "/game/stages/002/p06.png", "/game/stages/002/p07.png", "/game/stages/002/p08.png", "/game/stages/002/p09.png"), new Array("/game/stages/002/h01.png", "/game/stages/002/h02.png", "/game/stages/002/h03.png", "/game/stages/002/h04.png", "/game/stages/002/h05.png", "/game/stages/002/h06.png", "/game/stages/002/h07.png", "/game/stages/002/h08.png", "/game/stages/002/h09.png"), { has_voice: true, has_sound: false }, { width: 298, height: 400 }, new Array(
                new Point2D(-35, 68),
                new Point2D(-65, 131),
                new Point2D(127, 55),
                new Point2D(206, 50),
                new Point2D(206, 138),
                new Point2D(255, 214),
                new Point2D(194, 222),
                new Point2D(119, 202),
                new Point2D(55, 188))),
            new Puzzle("003", this, "/game/stages/003/003.png", new Array("/game/stages/003/p01.png", "/game/stages/003/p02.png", "/game/stages/003/p03.png", "/game/stages/003/p04.png", "/game/stages/003/p05.png", "/game/stages/003/p06.png", "/game/stages/003/p07.png", "/game/stages/003/p08.png", "/game/stages/003/p09.png", "/game/stages/003/p10.png"), new Array("/game/stages/003/h01.png", "/game/stages/003/h02.png", "/game/stages/003/h03.png", "/game/stages/003/h04.png", "/game/stages/003/h05.png", "/game/stages/003/h06.png", "/game/stages/003/h07.png", "/game/stages/003/h08.png", "/game/stages/003/h09.png", "/game/stages/003/h10.png"), { has_voice: true, has_sound: false }, { width: 298, height: 400 }, new Array(
                new Point2D(91, 20),
                new Point2D(11, 43),
                new Point2D(92, 107),
                new Point2D(-4, 165),
                new Point2D(-5, 223),
                new Point2D(50, 216),
                new Point2D(140, 229),
                new Point2D(190, 301),
                new Point2D(137, 300),
                new Point2D(35, 297))),
            new Puzzle("006", this, "/game/stages/006/006.png", new Array("/game/stages/006/p01.png", "/game/stages/006/p02.png", "/game/stages/006/p03.png", "/game/stages/006/p04.png"), new Array("/game/stages/006/h01.png", "/game/stages/006/h02.png", "/game/stages/006/h03.png", "/game/stages/006/h04.png"), { has_voice: true, has_sound: true }, { width: 298, height: 400 }, new Array(
                new Point2D(82, 0),
                new Point2D(0, 193),
                new Point2D(166, 283),
                new Point2D(65, 127))),
            new Puzzle("008", this, "/game/stages/008/008.png", new Array("/game/stages/008/p01.png", "/game/stages/008/p02.png", "/game/stages/008/p03.png", "/game/stages/008/p04.png"), new Array("/game/stages/008/h01.png", "/game/stages/008/h02.png", "/game/stages/008/h03.png", "/game/stages/008/h04.png"), { has_voice: true, has_sound: false }, { width: 298, height: 400 }, new Array(
                new Point2D(28, 0),
                new Point2D(0, 257),
                new Point2D(58, 109),
                new Point2D(185, 0))),
            new Puzzle("005", this, "/game/stages/005/005.png", new Array("/game/stages/005/p01.png", "/game/stages/005/p02.png", "/game/stages/005/p03.png", "/game/stages/005/p04.png", "/game/stages/005/p05.png"), new Array("/game/stages/005/h01.png", "/game/stages/005/h02.png", "/game/stages/005/h03.png", "/game/stages/005/h04.png", "/game/stages/005/h05.png"), { has_voice: true, has_sound: true }, { width: 298, height: 400 }, new Array(
                new Point2D(40, 0),
                new Point2D(28, 37),
                new Point2D(176, 37),
                new Point2D(0, 186),
                new Point2D(175, 179))),
            new Puzzle("016", this, "/game/stages/016/016.png", new Array("/game/stages/016/p01.png", "/game/stages/016/p02.png", "/game/stages/016/p03.png", "/game/stages/016/p04.png"), new Array("/game/stages/016/h01.png", "/game/stages/016/h02.png", "/game/stages/016/h03.png", "/game/stages/016/h04.png"), { has_voice: true, has_sound: true }, { width: 298, height: 400 }, new Array(
                new Point2D(73, 0),
                new Point2D(98, 157),
                new Point2D(0, 268),
                new Point2D(169, 329))),
            new Puzzle("011", this, "/game/stages/011/011.png", new Array("/game/stages/011/p01.png", "/game/stages/011/p02.png", "/game/stages/011/p03.png", "/game/stages/011/p04.png", "/game/stages/011/p05.png"), new Array("/game/stages/011/h01.png", "/game/stages/011/h02.png", "/game/stages/011/h03.png", "/game/stages/011/h04.png", "/game/stages/011/h05.png"), { has_voice: true, has_sound: false }, { width: 298, height: 400 }, new Array(
                new Point2D(0, 0),
                new Point2D(49, 46),
                new Point2D(0, 227),
                new Point2D(174, 227),
                new Point2D(84, 373))),
            new Puzzle("012", this, "/game/stages/012/012.png", new Array("/game/stages/012/p01.png", "/game/stages/012/p02.png", "/game/stages/012/p03.png", "/game/stages/012/p04.png", "/game/stages/012/p05.png"), new Array("/game/stages/012/h01.png", "/game/stages/012/h02.png", "/game/stages/012/h03.png", "/game/stages/012/h04.png", "/game/stages/012/h05.png"), { has_voice: true, has_sound: false }, { width: 298, height: 400 }, new Array(
                new Point2D(54, 0),
                new Point2D(0, 101),
                new Point2D(287, 75),
                new Point2D(59, 242),
                new Point2D(287, 242))),
            new Puzzle("015", this, "/game/stages/015/015.png", new Array("/game/stages/015/p01.png", "/game/stages/015/p02.png", "/game/stages/015/p03.png", "/game/stages/015/p04.png", "/game/stages/015/p05.png"), new Array("/game/stages/015/h01.png", "/game/stages/015/h02.png", "/game/stages/015/h03.png", "/game/stages/015/h04.png", "/game/stages/015/h05.png"), { has_voice: true, has_sound: false }, { width: 298, height: 400 }, new Array(
                new Point2D(365, 0),
                new Point2D(238, 184),
                new Point2D(115, 105),
                new Point2D(-200, 50),
                new Point2D(-62, 157))),
            new Puzzle("004", this, "/game/stages/004/004.png", new Array("/game/stages/004/p01.png", "/game/stages/004/p02.png", "/game/stages/004/p03.png", "/game/stages/004/p04.png", "/game/stages/004/p05.png", "/game/stages/004/p06.png"), new Array("/game/stages/004/h01.png", "/game/stages/004/h02.png", "/game/stages/004/h03.png", "/game/stages/004/h04.png", "/game/stages/004/h05.png", "/game/stages/004/h06.png"), { has_voice: true, has_sound: true }, { width: 298, height: 400 }, new Array(
                new Point2D(0, 173),
                new Point2D(49, 66),
                new Point2D(207, 0),
                new Point2D(286, 24),
                new Point2D(115, 120),
                new Point2D(170, 115))),
            new Puzzle("007", this, "/game/stages/007/007.png", new Array("/game/stages/007/p01.png", "/game/stages/007/p02.png", "/game/stages/007/p03.png", "/game/stages/007/p04.png", "/game/stages/007/p05.png", "/game/stages/007/p06.png"), new Array("/game/stages/007/h01.png", "/game/stages/007/h02.png", "/game/stages/007/h03.png", "/game/stages/007/h04.png", "/game/stages/007/h05.png", "/game/stages/007/h06.png"), { has_voice: true, has_sound: false }, { width: 298, height: 400 }, new Array(
                new Point2D(0, 61),
                new Point2D(144, 0),
                new Point2D(27, 38),
                new Point2D(26, 58),
                new Point2D(95, 226),
                new Point2D(193, 215))),
            new Puzzle("009", this, "/game/stages/009/009.png", new Array("/game/stages/009/p01.png", "/game/stages/009/p02.png", "/game/stages/009/p03.png", "/game/stages/009/p04.png", "/game/stages/009/p05.png", "/game/stages/009/p06.png"), new Array("/game/stages/009/h01.png", "/game/stages/009/h02.png", "/game/stages/009/h03.png", "/game/stages/009/h04.png", "/game/stages/009/h05.png", "/game/stages/009/h06.png"), { has_voice: true, has_sound: true }, { width: 298, height: 400 }, new Array(
                new Point2D(79, 0),
                new Point2D(0, 118),
                new Point2D(54, 512),
                new Point2D(294, 538),
                new Point2D(102, 346),
                new Point2D(247, 341))),
            new Puzzle("010", this, "/game/stages/010/010.png", new Array("/game/stages/010/p01.png", "/game/stages/010/p02.png", "/game/stages/010/p03.png", "/game/stages/010/p04.png", "/game/stages/010/p05.png", "/game/stages/010/p06.png"), new Array("/game/stages/010/h01.png", "/game/stages/010/h02.png", "/game/stages/010/h03.png", "/game/stages/010/h04.png", "/game/stages/010/h05.png", "/game/stages/010/h06.png"), { has_voice: true, has_sound: true }, { width: 298, height: 400 }, new Array(
                new Point2D(4, 0),
                new Point2D(12, 90),
                new Point2D(0, 276),
                new Point2D(162, 272),
                new Point2D(12, 363),
                new Point2D(162, 363))),
            new Puzzle("013", this, "/game/stages/013/013.png", new Array("/game/stages/013/p01.png", "/game/stages/013/p02.png", "/game/stages/013/p03.png", "/game/stages/013/p04.png", "/game/stages/013/p05.png", "/game/stages/013/p06.png"), new Array("/game/stages/013/h01.png", "/game/stages/013/h02.png", "/game/stages/013/h03.png", "/game/stages/013/h04.png", "/game/stages/013/h05.png", "/game/stages/013/h06.png"), { has_voice: true, has_sound: true }, { width: 298, height: 400 }, new Array(
                new Point2D(-200, 112),
                new Point2D(175, 0),
                new Point2D(-119, 0),
                new Point2D(73, 212),
                new Point2D(164, 212),
                new Point2D(308, 212))),
            new Puzzle("014", this, "/game/stages/014/014.png", new Array("/game/stages/014/p01.png", "/game/stages/014/p02.png", "/game/stages/014/p03.png", "/game/stages/014/p04.png", "/game/stages/014/p05.png", "/game/stages/014/p06.png"), new Array("/game/stages/014/h01.png", "/game/stages/014/h02.png", "/game/stages/014/h03.png", "/game/stages/014/h04.png", "/game/stages/014/h05.png", "/game/stages/014/h06.png"), { has_voice: true, has_sound: false }, { width: 298, height: 400 }, new Array(
                new Point2D(0, 0),
                new Point2D(37, 58),
                new Point2D(191, 264),
                new Point2D(286, 315),
                new Point2D(391, 309),
                new Point2D(339, 188))),
            new Puzzle("017", this, "/game/stages/017/017.png", new Array("/game/stages/017/p01.png", "/game/stages/017/p02.png", "/game/stages/017/p03.png", "/game/stages/017/p04.png", "/game/stages/017/p05.png", "/game/stages/017/p06.png"), new Array("/game/stages/017/h01.png", "/game/stages/017/h02.png", "/game/stages/017/h03.png", "/game/stages/017/h04.png", "/game/stages/017/h05.png", "/game/stages/017/h06.png"), { has_voice: true, has_sound: true }, { width: 298, height: 400 }, new Array(
                new Point2D(0, 0),
                new Point2D(125, 223),
                new Point2D(292, 223),
                new Point2D(203, 26),
                new Point2D(291, 24),
                new Point2D(444, 72))),
            new Puzzle("018", this, "/game/stages/018/018.png", new Array("/game/stages/018/p01.png", "/game/stages/018/p02.png", "/game/stages/018/p03.png", "/game/stages/018/p04.png", "/game/stages/018/p05.png", "/game/stages/018/p06.png"), new Array("/game/stages/018/h01.png", "/game/stages/018/h02.png", "/game/stages/018/h03.png", "/game/stages/018/h04.png", "/game/stages/018/h05.png", "/game/stages/018/h06.png"), { has_voice: true, has_sound: false }, { width: 298, height: 400 }, new Array(
                new Point2D(0, 225),
                new Point2D(274, 225),
                new Point2D(435, 186),
                new Point2D(206, 0),
                new Point2D(206, 186),
                new Point2D(87, 47))),
            new Puzzle("019", this, "/game/stages/019/019.png", new Array("/game/stages/019/p01.png", "/game/stages/019/p02.png", "/game/stages/019/p03.png", "/game/stages/019/p04.png", "/game/stages/019/p05.png", "/game/stages/019/p06.png", "/game/stages/019/p07.png"), new Array("/game/stages/019/h01.png", "/game/stages/019/h02.png", "/game/stages/019/h03.png", "/game/stages/019/h04.png", "/game/stages/019/h05.png", "/game/stages/019/h06.png", "/game/stages/019/h07.png"), { has_voice: true, has_sound: true }, { width: 298, height: 400 }, new Array(
                new Point2D(0, 3),
                new Point2D(205, 0),
                new Point2D(13, 235),
                new Point2D(229, 235),
                new Point2D(159, 404),
                new Point2D(297, 404),
                new Point2D(374, 263))),
            new Puzzle("020", this, "/game/stages/020/020.png", new Array("/game/stages/020/p01.png", "/game/stages/020/p02.png", "/game/stages/020/p03.png", "/game/stages/020/p04.png", "/game/stages/020/p05.png", "/game/stages/020/p06.png", "/game/stages/020/p07.png", "/game/stages/020/p08.png"), new Array("/game/stages/020/h01.png", "/game/stages/020/h02.png", "/game/stages/020/h03.png", "/game/stages/020/h04.png", "/game/stages/020/h05.png", "/game/stages/020/h06.png", "/game/stages/020/h07.png", "/game/stages/020/h08.png"), { has_voice: false, has_sound: false }, { width: 298, height: 400 }, new Array(
                new Point2D(0, 73),
                new Point2D(70, 8),
                new Point2D(92, 105),
                new Point2D(258, 172),
                new Point2D(234, 278),
                new Point2D(52, 273),
                new Point2D(204, 215),
                new Point2D(121, 214)))
        ];

        this.puzzle = this.puzzles[this.stage-1];
        this.puzzle.init();
        this.applyScale();
    }

    applyScale() {
        var w = this.originalWidth;
        var h = this.originalHeight;
        if (this.puzzle.width != undefined) {
            w = this.puzzle.width * 2;
            h = this.puzzle.height * 2;
        }
        document.getElementById("canvas").width = window.innerWidth;
        document.getElementById("canvas").height = window.innerHeight;
        var rw = window.innerWidth / w;
        var rh = window.innerHeight / h;
        this.scale = Math.min(rw, rh);
        this.context.scale(this.scale, this.scale);
        console.log(`scale: ${this.scale}`);
    }

    render() {
        this.drawBackground();

        // LOADING
        if (!this.assetManager.isLoaded) {
            this.drawLoading();
        }
        else {
            //DRAW PUZZLE
            this.puzzle.draw();
            //REMAINING TIME
            this.drawRemaining();
        }

        //DEBUG
        if (this.debug && this.assetManager.isLoaded) {
            document.getElementById("debug_x").value = this.pointer.x;
            document.getElementById("debug_y").value = this.pointer.y;

            document.getElementById("debug_width").value = this.puzzle.width;
            document.getElementById("debug_height").value = this.puzzle.height;

            document.getElementById("debug_moving").value = this.pointer.moving;

            document.getElementById("debug_pieces").value = this.puzzle.numberOfPieces;
            document.getElementById("debug_placed").value = this.puzzle.placedPieces.length;

            if (this.selected) {
                document.getElementById("debug_selected").value = this.selected.id;
                document.getElementById("debug_px").value = this.selected.position.x;
                document.getElementById("debug_py").value = this.selected.position.y;
                document.getElementById("debug_hx").value = this.puzzle.holders[this.selected.id].position.x;
                document.getElementById("debug_hy").value = this.puzzle.holders[this.selected.id].position.y;
            }
            else {
                document.getElementById("debug_selected").value = "";
            }
        }
    }

    loop() {
        // console.log(this);
        this.render();
        this.animationFrameRequestID = requestAnimationFrame(() => {this.loop()});
    }

    drawBackground() {
        if (!this.scale) {
            this.scale = 1;
        }
        this.context.fillStyle = "rgba(125, 125, 125, 1)";
        this.context.fillRect(0, 0, this.canvas.width / this.scale, this.canvas.height / this.scale);

        if (this.puzzle.placedPieces) {
            this.context.save();
            var grad = this.context.createRadialGradient(this.canvas.width / this.scale / 2, this.canvas.height / this.scale / 2, 0, this.canvas.width / this.scale / 2, this.canvas.height / this.scale / 2, this.canvas.width / this.scale);
            if (this.puzzle.num_pieces > this.puzzle.placedPieces.length) {
                grad.addColorStop(1, ['rgb(', 256, ', ', 256, ', ', 256, ')'].join(''));
                grad.addColorStop(0, ['rgb(', 100, ', ', 100, ', ', 100, ')'].join(''));
            } else {
                grad.addColorStop(0, ['rgb(', 256, ', ', 256, ', ', 256, ')'].join(''));
                grad.addColorStop(1, ['rgb(', 100, ', ', 100, ', ', 100, ')'].join(''));
            }
            this.context.fillStyle = grad;
            this.context.fillRect(0, 0, this.canvas.width / this.scale, this.canvas.height / this.scale);
            this.context.restore();
        }
    }

    drawRemaining() {
        this.context.save();
        this.fade1 = this.fade1 + (0.010 * this.alpha);
        if (this.fade1 >= 0.6)
            this.alpha = -1;
        else if (this.fade1 <= 0.2)
            this.alpha = 1;
        this.context.fillStyle = "rgba(255, 255, 255, " + this.fade1 + ")";
        this.context.strokeStyle = "rgba(0, 0, 0, 0.5)";
        this.context.lineWidth = 2;
        this.context.font = "bold " + this.fontSize + "px Arial";
        this.context.textBaseline = 'top';
        this.context.textAlign = 'left';
        this.context.strokeText(this.puzzle.remainingTime, 10, 40);
        this.context.fillText(this.puzzle.remainingTime, 10, 40);
        var metrics = this.context.measureText(this.stage + "/" + this.puzzles.length + " ");
        this.context.strokeText(this.stage + "/" + this.puzzles.length, this.canvas.width / this.scale - metrics.width, 40);
        this.context.fillText(this.stage + "/" + this.puzzles.length, this.canvas.width / this.scale - metrics.width, 40);
        this.context.restore();
    }

    drawLoading() {
        this.fade1 = this.fade1 + 0.025;
        if (this.fade1 >= 1)
            this.fade1 = 0;
        this.fade2 = 1 - this.fade1;
        this.context.fillStyle = "rgba(255, 255, 255, " + this.fade2 + ")";
        this.context.strokeStyle = "rgba(255, 255, 255, " + this.fade1 + ")";
        this.context.font = "bold " + this.fontSize + "px Arial";
        this.context.textBaseline = 'middle';
        this.context.textAlign = 'center';
        this.context.lineWidth = 5;
        this.context.strokeText("LOADING", (this.canvas.width / this.scale) / 2, (this.canvas.height / this.scale) / 2);
        this.context.fillText("LOADING", (this.canvas.width / this.scale) / 2, (this.canvas.height / this.scale) / 2);
    }

    getTimer() {
        return (new Date().getTime() - this.start_time); //milliseconds
    }

    nextStage() {
        if (this.stage + 1 > this.puzzles.length) {
            this.isOver = true;
            stopGame();
        } else {
            this.isOver = false;
            this.stage++;
            
            this.init();
            this.startGame();
            this.resumeGame();
        }
    }

    stopGame() {
        clearInterval(this.gameInterval);
        this.started = false;
        this.stopSFX();
        this.stopBGM();
        cancelAnimationFrame(this.animationFrameRequestID);
        landing.classList.remove("hidden");
        app.classList.add("hidden");
    }

    startGame() {
        if (!this.started) {
            window.scrollTo(0, 0);
            stage_modal.close()
            landing.classList.add("hidden");
            app.classList.remove("hidden");
            this.gameInterval = setInterval(() => { this.puzzle.remainingTime--; }, 1000);
            this.started = true;
            this.startSFX();
            this.startBGM();
            this.assetManager.get("drip").play();
            console.log('Start');
            this.animationFrameRequestID = requestAnimationFrame(() => {this.loop()});
        }
    }

    pauseGame() {
        if (!this.paused) {
            console.log('Pause')
            clearInterval(this.gameInterval);
            this.paused = true;
            cancelAnimationFrame(this.animationFrameRequestID);
        }
    }

    resumeGame() {
        if (this.paused) {
            console.log('Resume')
            this.paused = false;
            this.gameInterval = setInterval(() => { this.puzzle.remainingTime--; }, 1000);
            this.animationFrameRequestID = requestAnimationFrame(() => {this.loop()});
        }
    }

    stopSFX() {
        this.assetManager.get("drip").volume = 0.0;
        this.assetManager.get("twang").volume = 0.0;
        this.assetManager.get("drip").pause();
        this.assetManager.get("twang").pause();
    }

    startSFX() {
        this.assetManager.get("drip").volume = 1.0;
        this.assetManager.get("twang").volume = 1.0;
    }

    stopBGM() {
        this.assetManager.get("bgm").volume = 0.0;
        this.assetManager.get("bgm").pause();
    }

    startBGM() {
        this.assetManager.get("bgm").volume = 1.0;
        this.assetManager.get("bgm").play();
    }

    autoSnapOn() {
        this.autoSnap = true;
    }

    autoSnapOff() {
        this.autoSnap = false;
    }

    fullscreen() {
        this.canvas.requestFullscreen();
    }

    exitfullscreen() {
        document.exitFullscreen();
    }

    resizeGame() {
        console.log(`window: ${window.innerWidth}x${window.innerHeight}`);
        if (this.started) {
            this.applyScale();
            this.puzzle.placeHolderAndPiecesAgain();
        }
    }
}
