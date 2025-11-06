export class Holder {
    constructor(id = 0, game = null, image = null, position = null) {
        this.id = id;
        this.game = game;
        this.image = image;
        this.position = position;
    }

    draw() {
        this.game.context.save();
        this.game.context.drawImage(this.image, this.position.x, this.position.y);
        this.game.context.restore();
    }
}
