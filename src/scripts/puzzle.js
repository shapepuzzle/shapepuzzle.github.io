import { AssetManager } from './asset-manager';
import { Holder } from "./holder";
import { Point2D } from "./point2D";
import { Piece } from "./piece";


export class Puzzle {
    constructor(id, game, image, piecesImages, holdersImages, sound, size, positions) {
        console.log(`creating puzzle ${id}...`);
        this.id = id;
        this.game = game;
        this.image = image;
        this.piecesImages = piecesImages;
        this.holdersImages = holdersImages;
        if (sound) {
            this.hasVoice = sound.has_voice;
            this.hasSound = sound.has_sound;
        }
        if (size) {
            this.width = size.width;
            this.height = size.height;
        }
        this.positions = positions;
        this.numberOfPieces = positions.length;
        this.timeToComplete = this.numberOfPieces * 30;
        this.remainingTime = this.numberOfPieces * 30;
        this.pieces = [];
        this.holders = [];
        this.placedPieces = [];
        this.position = null;
        this.loaded = false;
        this.solved = false;
        this.assetManager = new AssetManager();
    }

    init() {
        console.log(`initing puzzle ${this.id}...`);
        this.loaded = false;
        this.solved = false;
        this.loadAssets();
    }

    loadAssets() {
        this.assetManager.register(`puzzle_${this.id}_image`, `/stages/${this.id}/${this.id}.png`, "image");

        //PIECES & HOLDERS
        for (var i = 0; i < this.numberOfPieces; i++) {
            //HODLER IMAGE
            this.assetManager.register(`puzzle_${this.id}_holder_${i}`, this.holdersImages[i], "image");

            //PIECE IMAGE
            this.assetManager.register(`puzzle_${this.id}_piece_${i}`, this.piecesImages[i], "image");
        }

        // VOICE
        // if (this.hasVoice) {
        //     document.getElementById("stage_voice").removeAttribute("disabled");
        //     this.assetManager.register(`puzzle_${this.id}_voice`, `/stages/${this.id}/voice.mp3`, "audio");
        // }
        // else {
        //     document.getElementById("stage_voice").setAttribute("disabled", true);
        // }
        stage_voice.setAttribute("disabled", true);
        if (this.hasVoice) {
            this.assetManager.register(`puzzle_${this.id}_voice`, `/stages/${this.id}/voice.mp3`, "audio");
        }

        // SOUNDS
        // if (this.hasSound) {
        //     document.getElementById("stage_sound").removeAttribute("disabled");
        //     this.assetManager.register(`puzzle_${this.id}_sound`, `/stages/${this.id}/sound.mp3`, "audio");
        // }
        // else {
        //     document.getElementById("stage_sound").setAttribute("disabled", true);
        // }
        stage_sound.setAttribute("disabled", true);
        if (this.hasSound) {
            this.assetManager.register(`puzzle_${this.id}_sound`, `/stages/${this.id}/sound.mp3`, "audio");
        }

        this.assetManager.onComplete(() => {
            console.log(`All assets loaded (puzzle ${this.id})!`);
            this.placeHolderAndPieces();
        });
        this.assetManager.loadAll();
    }

    placeHolderAndPieces() {
        //PIECES & HOLDERS
        for (var i = 0; i < this.numberOfPieces; i++) {
            //HODLER IMAGE
            var h = this.assetManager.get(`puzzle_${this.id}_holder_${i}`);
            var holder = this.placeHolder(i, h);

            //PIECE IMAGE
            var p = this.assetManager.get(`puzzle_${this.id}_piece_${i}`);
            this.placePiece(i, p, holder);
        }
        // if (!this.game.started){
        //     this.game.startGame();
        // }
    }

    placeHolderAndPiecesAgain() {
        this.holders = [];
        this.pieces = [];
        this.placedPieces = [];
        this.placeHolderAndPieces();
    }

    placePiece(id, img, holder) {
        var x = Math.floor(Math.random() * (this.game.canvas.width / this.game.scale - img.width));
        var y = Math.floor(Math.random() * (this.game.canvas.height / this.game.scale - img.height));
        if (y < 80) y += 80;
        if (y > this.game.canvas.height - 20) y -= 80;
        if (x < 80) x += 80;
        if (x > this.game.canvas.width - 80) x -= 80;
        this.pieces.push(new Piece(
            id,
            this.game,
            img,
            holder,
            new Point2D(x, y),
            new Point2D(x, y),
            true,
            false
        ));
    }

    placeHolder(id, img) {
        this.xx = (this.game.canvas.width / this.game.scale) / 2 - this.width / 2;
        this.yy = (this.game.canvas.height / this.game.scale) / 2 - this.height / 2;
        var x = this.positions[id].x + this.xx;
        var y = this.positions[id].y + this.yy;
        var temp = new Holder(
            id,
            this.game,
            img,
            new Point2D(x, y),
            false
        );
        this.holders.push(temp);
        return temp;
    }

    draw() {
        if (this.solved) {
            var img = this.assetManager.get(`puzzle_${this.id}_image`);
            this.game.context.drawImage(img, (this.game.canvas.width / this.game.scale / 2) - (img.width / 2), (this.game.canvas.height / this.game.scale / 2) - (img.height / 2));
        }
        else {
            if (this.numberOfPieces > this.placedPieces.length) {
                // HOLDERS
                for (var i = 0; i < this.holders.length; i++) {
                    this.holders[i].draw();
                }

                // PIECES
                var notPlaced = new Array();
                var over = false;
                for (var i = 0; i < this.pieces.length; i++) {
                    var piece = this.pieces[i];
                    if (!piece.placed){
                        notPlaced.push(piece);
                    }
                    else if (piece != this.game.selected) {
                        piece.draw();
                    }
                }
                if (!over) {
                    this.game.over = null;
                }

                // MOVE
                if ((this.game.selected != null) && (this.game.selected.movable)) {
                    this.game.selected.x = this.game.pointer.x;
                    this.game.selected.y = this.game.pointer.y;
                }

                // NOT PLACED PIECES  
                for (var i = 0; i < notPlaced.length; i++) {
                    notPlaced[i].draw();
                }
                if (this.game.selected){
                    this.game.selected.draw();
                }

                // MOVE
                if ((this.game.selected != null) && (this.game.selected.movable)) {
                    this.game.selected.position.x = this.game.pointer.x - this.game.selected.image.width / 2;
                    this.game.selected.position.y = this.game.pointer.y - this.game.selected.image.height / 2;
                }

                // GAME OVER
                if (this.remainingTime <= 0) {
                    this.game.stopGame();
                    if (confirm('Timeup! Lets try again?')) {
                        this.game.isOver = false;
                        this.game.init();
                        this.game.startGame();
                    }
                }
            }
            else {
                if (!this.game.isOver) {
                    this.game.isOver = true;
                    this.solved = true;
                    this.playAudio();
                }
            }
        }
    }

    playAudio() {
        this.game.pauseGame();
        document.getElementById("stage_text").textContent = `Stage ${this.game.stage} completed!`;
        document.getElementById("stage_score").textContent = `${this.numberOfPieces} pieces placed in ${this.timeToComplete - this.remainingTime} seconds.`;

        this.game.assetManager.get("chimes").play();
        if (this.hasVoice) {
            var voice = this.assetManager.get(`puzzle_${this.id}_voice`);
            voice.addEventListener("ended", () => {
                stage_voice.removeAttribute("disabled");
            });
            voice.play();
        }
        if (this.hasSound) {
            var sound = this.assetManager.get(`puzzle_${this.id}_sound`);
            sound.addEventListener("ended", () => {
                stage_sound.removeAttribute("disabled");
            });
            sound.play();
        }
        stage_modal.showModal();
        // var chimes = this.game.assetManager.get("chimes");
        // chimes.addEventListener("ended", () => {
        //     if (this.hasVoice) {
        //         var voice = this.assetManager.get(`puzzle_${this.id}_voice`);
        //         voice.play();
        //     }
        //     if (this.hasSound) {
        //         var sound = this.assetManager.get(`puzzle_${this.id}_sound`);
        //         sound.play();
        //     }
        //     stage_modal.showModal();
        // });
        // chimes.play()
    }
}