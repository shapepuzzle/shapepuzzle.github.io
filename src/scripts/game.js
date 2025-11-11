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
        
        // assets
        this.assetManager = new AssetManager();
        // callbacks
        this.assetManager.onProgress(progress => {
            console.log(`Loading: ${(progress * 100).toFixed(1)}%`);
        });
        this.assetManager.onError(error => {
            console.error('Asset loading error:', error);
        });
        this.assetManager.onComplete(() => {
            if (!this.started){
                this.startGame();
            }
        });
        this.assetManager.register("drip", "/audio/drip.mp3", "audio");
        this.assetManager.register("twang", "/audio/twang.mp3", "audio");
        this.assetManager.register("bgm", "/audio/bgm.mp3", "audio");
        this.assetManager.register("chimes", "/audio/chimes.mp3", "audio");
        this.assetManager.loadAll();

        this.autoSnap = true;
        this.moving = true;
        this.selected = null;
        this.isOver = false;
        this.clockInterval = null;
        this.pointer = new Pointer(this);
    }

    init() {
        this.puzzles = [
            new Puzzle(
                "001",
                this,
                "/stages/001/001.png",
                ["/stages/001/p01.png", "/stages/001/p02.png", "/stages/001/p03.png", "/stages/001/p04.png", "/stages/001/p05.png", "/stages/001/p06.png", "/stages/001/p07.png"],
                ["/stages/001/h01.png", "/stages/001/h02.png", "/stages/001/h03.png", "/stages/001/h04.png", "/stages/001/h05.png", "/stages/001/h06.png", "/stages/001/h07.png"],
                {has_voice: true, has_sound: false},
                {width: 306, height: 347},
                [new Point2D(0, 14), new Point2D(89, 0), new Point2D(90, 34), new Point2D(84, 84), new Point2D(56, 164), new Point2D(173, 161), new Point2D(20, 234)]
            ),
            new Puzzle(
                "002",
                this,
                "/stages/002/002.png",
                ["/stages/002/p01.png", "/stages/002/p02.png", "/stages/002/p03.png", "/stages/002/p04.png", "/stages/002/p05.png", "/stages/002/p06.png", "/stages/002/p07.png", "/stages/002/p08.png", "/stages/002/p09.png"],
                ["/stages/002/h01.png", "/stages/002/h02.png", "/stages/002/h03.png", "/stages/002/h04.png", "/stages/002/h05.png", "/stages/002/h06.png", "/stages/002/h07.png", "/stages/002/h08.png", "/stages/002/h09.png"],
                {has_voice: true, has_sound: false},
                {width: 434, height: 300 },
                [new Point2D(30, 18), new Point2D(0, 81), new Point2D(192, 5), new Point2D(271, 0), new Point2D(271, 88), new Point2D(320, 164), new Point2D(259, 172), new Point2D(184, 152), new Point2D(120, 138)]
            ),
            new Puzzle(
                "003",
                this,
                "/stages/003/003.png",
                ["/stages/003/p01.png", "/stages/003/p02.png", "/stages/003/p03.png", "/stages/003/p04.png", "/stages/003/p05.png", "/stages/003/p06.png", "/stages/003/p07.png", "/stages/003/p08.png", "/stages/003/p09.png", "/stages/003/p10.png"],
                ["/stages/003/h01.png", "/stages/003/h02.png", "/stages/003/h03.png", "/stages/003/h04.png", "/stages/003/h05.png", "/stages/003/h06.png", "/stages/003/h07.png", "/stages/003/h08.png", "/stages/003/h09.png", "/stages/003/h10.png"],
                {has_voice: true, has_sound: false},
                {width: 303, height: 355},
                [new Point2D(96, 0), new Point2D(16, 23), new Point2D(97, 87), new Point2D(1, 145), new Point2D(0, 203), new Point2D(55, 196), new Point2D(144, 209), new Point2D(195, 281), new Point2D(142, 280), new Point2D(40, 277)]
            ),
            new Puzzle(
                "006",
                this,
                "/stages/006/006.png",
                ["/stages/006/p01.png", "/stages/006/p02.png", "/stages/006/p03.png", "/stages/006/p04.png"],
                ["/stages/006/h01.png", "/stages/006/h02.png", "/stages/006/h03.png", "/stages/006/h04.png"],
                {has_voice: true, has_sound: true},
                {width: 290, height: 385},
                [new Point2D(83, 0), new Point2D(0, 193), new Point2D(168, 284), new Point2D(65, 127)]
            ),
            new Puzzle(
                "008",
                this,
                "/stages/008/008.png",
                ["/stages/008/p01.png", "/stages/008/p02.png", "/stages/008/p03.png", "/stages/008/p04.png"],
                ["/stages/008/h01.png", "/stages/008/h02.png", "/stages/008/h03.png", "/stages/008/h04.png"],
                {has_voice: true, has_sound: true},
                {width: 418, height: 423},
                [new Point2D(28, 0), new Point2D(0, 257), new Point2D(58, 109), new Point2D(185, 0)]
            ),
            new Puzzle(
                "005",
                this,
                "/stages/005/005.png",
                ["/stages/005/p01.png", "/stages/005/p02.png", "/stages/005/p03.png", "/stages/005/p04.png", "/stages/005/p05.png"],
                ["/stages/005/h01.png", "/stages/005/h02.png", "/stages/005/h03.png", "/stages/005/h04.png", "/stages/005/h05.png"],
                {has_voice: true, has_sound: true},
                {width: 341, height: 416},
                [new Point2D(40, 0), new Point2D(28, 37), new Point2D(176, 37), new Point2D(0, 186), new Point2D(175, 179)]
            ),
            new Puzzle(
                "016",
                this,
                "/stages/016/016.png",
                ["/stages/016/p01.png", "/stages/016/p02.png", "/stages/016/p03.png", "/stages/016/p04.png"],
                ["/stages/016/h01.png", "/stages/016/h02.png", "/stages/016/h03.png", "/stages/016/h04.png"],
                {has_voice: true, has_sound: true},
                {width: 486, height: 489},
                [new Point2D(73, 0), new Point2D(98, 157), new Point2D(0, 268), new Point2D(169, 329)]
            ),
            new Puzzle(
                "011",
                this,
                "/stages/011/011.png",
                ["/stages/011/p01.png", "/stages/011/p02.png", "/stages/011/p03.png", "/stages/011/p04.png", "/stages/011/p05.png"],
                ["/stages/011/h01.png", "/stages/011/h02.png", "/stages/011/h03.png", "/stages/011/h04.png", "/stages/011/h05.png"],
                {has_voice: true, has_sound: false},
                {width: 376, height: 457},
                [new Point2D(4, 0), new Point2D(53, 46), new Point2D(4, 227), new Point2D(178, 227), new Point2D(88, 373)]
            ),
            new Puzzle(
                "012",
                this,
                "/stages/012/012.png",
                ["/stages/012/p01.png", "/stages/012/p02.png", "/stages/012/p03.png", "/stages/012/p04.png", "/stages/012/p05.png"],
                ["/stages/012/h01.png", "/stages/012/h02.png", "/stages/012/h03.png", "/stages/012/h04.png", "/stages/012/h05.png"],
                {has_voice: true, has_sound: true},
                {width: 480, height: 420},
                [new Point2D(54, 0), new Point2D(0, 101), new Point2D(287, 75), new Point2D(59, 242), new Point2D(287, 242)]
            ),
            new Puzzle(
                "015",
                this,
                "/stages/015/015.png",
                ["/stages/015/p01.png", "/stages/015/p02.png", "/stages/015/p03.png", "/stages/015/p04.png", "/stages/015/p05.png"],
                ["/stages/015/h01.png", "/stages/015/h02.png", "/stages/015/h03.png", "/stages/015/h04.png", "/stages/015/h05.png"],
                {has_voice: true, has_sound: false},
                {width: 720, height: 455},
                [new Point2D(565, 0), new Point2D(438, 184), new Point2D(315, 105), new Point2D(0, 50), new Point2D(138, 157)]
            ),
            new Puzzle(
                "004",
                this,
                "/stages/004/004.png",
                ["/stages/004/p01.png", "/stages/004/p02.png", "/stages/004/p03.png", "/stages/004/p04.png", "/stages/004/p05.png", "/stages/004/p06.png"],
                ["/stages/004/h01.png", "/stages/004/h02.png", "/stages/004/h03.png", "/stages/004/h04.png", "/stages/004/h05.png", "/stages/004/h06.png"],
                {has_voice: true, has_sound: true},
                {width: 467, height: 333},
                [new Point2D(0, 173), new Point2D(49, 66), new Point2D(207, 0), new Point2D(286, 24), new Point2D(115, 120), new Point2D(170, 115)]
            ),
            new Puzzle(
                "007",
                this,
                "/stages/007/007.png",
                ["/stages/007/p01.png", "/stages/007/p02.png", "/stages/007/p03.png", "/stages/007/p04.png", "/stages/007/p05.png", "/stages/007/p06.png"],
                ["/stages/007/h01.png", "/stages/007/h02.png", "/stages/007/h03.png", "/stages/007/h04.png", "/stages/007/h05.png", "/stages/007/h06.png"],
                {has_voice: true, has_sound: true},
                {width: 332, height: 425},
                [new Point2D(0, 61), new Point2D(144, 0), new Point2D(27, 38), new Point2D(26, 58), new Point2D(95, 226), new Point2D(193, 215)]
            ),
            new Puzzle(
                "009",
                this,
                "/stages/009/009.png",
                ["/stages/009/p01.png", "/stages/009/p02.png", "/stages/009/p03.png", "/stages/009/p04.png", "/stages/009/p05.png", "/stages/009/p06.png"],
                ["/stages/009/h01.png", "/stages/009/h02.png", "/stages/009/h03.png", "/stages/009/h04.png", "/stages/009/h05.png", "/stages/009/h06.png"],
                {has_voice: true, has_sound: true},
                {width: 418, height: 651},
                [new Point2D(79, 0), new Point2D(0, 118), new Point2D(54, 512), new Point2D(294, 538), new Point2D(102, 346), new Point2D(247, 341)]
            ),
            new Puzzle(
                "010",
                this,
                "/stages/010/010.png",
                ["/stages/010/p01.png", "/stages/010/p02.png", "/stages/010/p03.png", "/stages/010/p04.png", "/stages/010/p05.png", "/stages/010/p06.png"],
                ["/stages/010/h01.png", "/stages/010/h02.png", "/stages/010/h03.png", "/stages/010/h04.png", "/stages/010/h05.png", "/stages/010/h06.png"],
                {has_voice: true, has_sound: true},
                {width: 316, height: 445},
                [new Point2D(4, 0), new Point2D(12, 90), new Point2D(0, 276), new Point2D(162, 272), new Point2D(12, 363), new Point2D(162, 363)]
            ),
            new Puzzle(
                "013",
                this,
                "/stages/013/013.png",
                ["/stages/013/p01.png", "/stages/013/p02.png", "/stages/013/p03.png", "/stages/013/p04.png", "/stages/013/p05.png", "/stages/013/p06.png"],
                ["/stages/013/h01.png", "/stages/013/h02.png", "/stages/013/h03.png", "/stages/013/h04.png", "/stages/013/h05.png", "/stages/013/h06.png"],
                {has_voice: true, has_sound: true},
                {width: 641, height: 425},
                [new Point2D(0, 112), new Point2D(375, 0), new Point2D(81, 0), new Point2D(273, 212), new Point2D(364, 212), new Point2D(508, 212)]
            ),
            new Puzzle(
                "014",
                this,
                "/stages/014/014.png",
                ["/stages/014/p01.png", "/stages/014/p02.png", "/stages/014/p03.png", "/stages/014/p04.png", "/stages/014/p05.png", "/stages/014/p06.png"],
                ["/stages/014/h01.png", "/stages/014/h02.png", "/stages/014/h03.png", "/stages/014/h04.png", "/stages/014/h05.png", "/stages/014/h06.png"],
                {has_voice: true, has_sound: true},
                {width: 505, height: 491},
                [new Point2D(0, 0), new Point2D(37, 58), new Point2D(191, 264), new Point2D(286, 315), new Point2D(391, 309), new Point2D(339, 188)]
            ),
            new Puzzle(
                "017",
                this,
                "/stages/017/017.png",
                ["/stages/017/p01.png", "/stages/017/p02.png", "/stages/017/p03.png", "/stages/017/p04.png", "/stages/017/p05.png", "/stages/017/p06.png"],
                ["/stages/017/h01.png", "/stages/017/h02.png", "/stages/017/h03.png", "/stages/017/h04.png", "/stages/017/h05.png", "/stages/017/h06.png"],
                {has_voice: true, has_sound: true},
                {width: 539, height: 348},
                [new Point2D(0, 0), new Point2D(125, 223), new Point2D(292, 223), new Point2D(203, 26), new Point2D(291, 24), new Point2D(444, 72)]
            ),
            new Puzzle(
                "018",
                this,
                "/stages/018/018.png",
                ["/stages/018/p01.png", "/stages/018/p02.png", "/stages/018/p03.png", "/stages/018/p04.png", "/stages/018/p05.png", "/stages/018/p06.png"],
                ["/stages/018/h01.png", "/stages/018/h02.png", "/stages/018/h03.png", "/stages/018/h04.png", "/stages/018/h05.png", "/stages/018/h06.png"],
                {has_voice: true, has_sound: false},
                {width: 671, height: 456},
                [new Point2D(0, 225), new Point2D(274, 225), new Point2D(435, 186), new Point2D(206, 0), new Point2D(206, 186), new Point2D(87, 47)]
            ),
            new Puzzle(
                "019",
                this,
                "/stages/019/019.png",
                ["/stages/019/p01.png", "/stages/019/p02.png", "/stages/019/p03.png", "/stages/019/p04.png", "/stages/019/p05.png", "/stages/019/p06.png", "/stages/019/p07.png"],
                ["/stages/019/h01.png", "/stages/019/h02.png", "/stages/019/h03.png", "/stages/019/h04.png", "/stages/019/h05.png", "/stages/019/h06.png", "/stages/019/h07.png"],
                {has_voice: true, has_sound: true},
                {width: 453, height: 488},
                [new Point2D(0, 3), new Point2D(205, 0), new Point2D(13, 235), new Point2D(229, 235), new Point2D(159, 404), new Point2D(297, 404), new Point2D(374, 263)]
            ),
            new Puzzle(
                "020",
                this,
                "/stages/020/020.png",
                ["/stages/020/p01.png", "/stages/020/p02.png", "/stages/020/p03.png", "/stages/020/p04.png", "/stages/020/p05.png", "/stages/020/p06.png", "/stages/020/p07.png", "/stages/020/p08.png"],
                ["/stages/020/h01.png", "/stages/020/h02.png", "/stages/020/h03.png", "/stages/020/h04.png", "/stages/020/h05.png", "/stages/020/h06.png", "/stages/020/h07.png", "/stages/020/h08.png"],
                {has_voice: true, has_sound: true},
                {width: 330, height: 380},
                [new Point2D(0, 73), new Point2D(70, 8), new Point2D(92, 105), new Point2D(258, 172), new Point2D(234, 278), new Point2D(52, 273), new Point2D(204, 215), new Point2D(121, 214)]
            )
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
        if (this.debug && this.assetManager.isLoaded && this.puzzle.assetManager.isLoaded) {
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
            this.stopGame();
        } else {
            this.isOver = false;
            this.stage++;
            this.puzzle = this.puzzles[this.stage-1];
            this.puzzle.init();
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
            stage_modal.close();
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
            console.log('Pause');
            this.selected = null;
            clearInterval(this.gameInterval);
            this.paused = true;
            cancelAnimationFrame(this.animationFrameRequestID);
            if (settings_bgm.checked) {
                this.assetManager.get("bgm").pause();
            }
        }
    }

    resumeGame() {
        if (this.paused) {
            console.log('Resume');
            this.paused = false;
            this.gameInterval = setInterval(() => { this.puzzle.remainingTime--; }, 1000);
            this.animationFrameRequestID = requestAnimationFrame(() => {this.loop()});
            if (settings_bgm.checked) {
                this.assetManager.get("bgm").play();
            }
        }
    }

    stopSFX() {
        window.game.assetManager.get("drip").volume = 0.0;
        window.game.assetManager.get("twang").volume = 0.0;
        window.game.assetManager.get("drip").pause();
        window.game.assetManager.get("twang").pause();
    }

    startSFX() {
        window.game.assetManager.get("drip").volume = 1.0;
        window.game.assetManager.get("twang").volume = 1.0;
    }

    stopBGM() {
        window.game.assetManager.get("bgm").volume = 0.0;
        window.game.assetManager.get("bgm").pause();
    }

    startBGM() {
        window.game.assetManager.get("bgm").volume = 1.0;
        window.game.assetManager.get("bgm").loop = true;
        window.game.assetManager.get("bgm").play();
    }

    autoSnapOn() {
        window.game.autoSnap = true;
    }

    autoSnapOff() {
        window.game.autoSnap = false;
    }

    fullscreen() {
        window.game.canvas.requestFullscreen();
    }

    exitfullscreen() {
        document.exitFullscreen();
    }

    resizeGame() {
        console.log(`window: ${window.innerWidth}x${window.innerHeight}`);
        if (window.game.started) {
            window.game.applyScale();
            window.game.puzzle.placeHolderAndPiecesAgain();
        }
    }

    work4me() {
        this.puzzle.pieces.forEach((piece) => {
            piece.position.x = piece.holder.position.x;
            piece.position.y = piece.holder.position.y;
            this.selected = piece;
            this.selected.placed = true;
            this.selected.movable = false;
            this.puzzle.placedPieces.push(this.selected);
        });
    }

}
