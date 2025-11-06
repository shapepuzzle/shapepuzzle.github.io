export class Piece {
    constructor(id = 0, game = null, image = null, holder = null, position = null, initial = null) {
        this.id = id;
        this.game = game;
        this.image = image;
        this.position = position;
        this.initial = initial;
        this.holder = holder;
        this.movable = true;
        this.placed = false;
        this.moving = false;

        // for animation
        this.m = (holder.position.y - this.y) / (holder.position.x - this.x);
        this.b = holder.position.y - (this.m * holder.position.x);
        if (Math.random() >= 0.5)
            this.p = 0.1;
        else
            this.p = -0.1;
        this.tolerance = 200;
    }

    draw() {
        if (!this.movable && !this.placed) {
            this.position.x = this.initial.x;
            this.position.y = this.initial.y;
            this.movable = true;
            this.game.context.save();
            this.game.context.globalAlpha = 1;
            this.game.context.beginPath();
            this.game.context.drawImage(this.image, this.position.x / this.game.scale, this.position.y / this.game.scale);
        }
        else {
            this.game.context.save();
            if (this.placed){
                this.game.context.globalAlpha = 1
            }
            else if (!this.game.is_over){
                this.game.context.globalAlpha = 0.8
            }
            else{
                this.game.context.globalAlpha = 1
            }
            this.game.context.fillStyle = "rgba(255, 255, 255, 0.5)";
            if (this.game.selected == this) {
                this.game.context.fillStyle = "rgba(0, 0, 255, 0.1)";
            }

            //target distance
            if (this.near() && this == this.game.selected) {
                this.game.context.fillStyle = "rgba(0, 255, 0, 0.1)";
                if ((this.game.autoSnap == true) && (!this.placed)) {
                    // place
                    this.game.selected.position.x = this.game.selected.holder.position.x;
                    this.game.selected.position.y = this.game.selected.holder.position.y;
                    this.game.selected.placed = true;
                    this.game.selected.movable = false;
                    this.game.puzzle.placedPieces.push(this.game.selected);

                    // sfx
                    this.game.assetManager.get("drip").play();
                }
            }

            //draw
            this.game.context.beginPath();
            this.game.context.drawImage(this.image, this.position.x, this.position.y);

            this.game.context.closePath();
            this.game.context.restore();
        }
    }

    near() {
        //target distance
        var r = false
        var dx = this.position.x - this.holder.position.x;
        var dy = this.position.y - this.holder.position.y;
        var distance = (dx * dx + dy * dy);
        if (distance <= this.tolerance) {
            r = true;
        }
        return r;
    }
}
