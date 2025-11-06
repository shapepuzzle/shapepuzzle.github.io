import { Point2D } from './point2D';


export class Pointer {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.down = false;
        this.up = false;
        this.moving = false;
        this.interval = null;
        this.touches = [];
        this.element = this.game.canvas;

        this.element.onpointermove = (event) => {
            event.preventDefault();
            this.onPointerMove(event);
        };
        this.element.onpointerdown = (event) => {
            event.preventDefault();
            this.onPointerDown(event);
        };
        this.element.onpointerup = (event) => {
            event.preventDefault();
            this.onPointerUp(event);
        };
    }

    isOverPiece(piece) {
        var poly = [
            new Point2D(piece.position.x, piece.position.y),
            new Point2D(piece.position.x + piece.image.width, piece.position.y),
            new Point2D(piece.position.x + piece.image.width, piece.position.y + piece.image.height),
            new Point2D(piece.position.x, piece.position.y + piece.image.height)
        ]
        var pt = new Point2D(this.x, this.y);
        for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
            ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
                && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
                && (c = !c);
        return c;
    }

    onPointerMove(e) {
        this.x = e.x / this.game.scale;
        this.y = e.y / this.game.scale;
        this.moving = true;
        this.movingInterval();
        this.event = e;
    }

    movingInterval() {
        this.interval = setTimeout(() => {this.moving = false; debug_moving.value = false; this.movingClearInterval();}, 1000);
    }

    movingClearInterval() {
        clearInterval(this.interval);
    }

    onPointerDown(e) {
        this.x = e.x / this.game.scale;
        this.y = e.y / this.game.scale;
        this.down = true;
        this.up = false;
        this.event = e;

        //test
        var over = false;
        for (var i = 0; i < this.game.puzzle.pieces.length; i++) {
            var piece = this.game.puzzle.pieces[i];
            if (!piece.placed) {
                if (!over && this.isOverPiece(piece))
                    over = true;
                if (over && !this.game.selected) {
                    this.game.over = piece;
                    this.game.selected = this.game.over;
                }
            }
        }
    }

    onPointerUp(e) {
        this.x = e.x / this.game.scale;
        this.y = e.y / this.game.scale;
        this.up = true;
        this.down = false;
        this.event = e;
        //place
        if ((this.game.selected) && (this.game.selected.near()) && (!this.game.selected.placed)) {
            this.game.selected.position.x = this.game.selected.holder.position.x;
            this.game.selected.position.y = this.game.selected.holder.position.y;
            this.game.selected.placed = true;
            this.game.selected.moveble = false;
            this.game.puzzle.placedPieces.push(this.game.selected);
            
            //sfx
            var drip = this.game.assetManager.get("drip");
            if (drip.currentTime != 0){
                drip.currentTime = 0;
            }
            drip.play();
        } else if ((this.game.selected) && (!this.game.selected.near())) {
            this.game.selected.p = 0;
            this.game.selected.moveble = false;
            this.game.selected.placed = false;

            //sfx
            var twang = this.game.assetManager.get("twang");
            if (twang.currentTime != 0){
                twang.currentTime = 0;
            }
            twang.play();
        }

        //unselect
        this.game.selected = null;
    }
}
