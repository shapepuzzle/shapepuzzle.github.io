export class Point2D {
    constructor(x, y) {
        if (arguments.length > 0) {
            this.x = x;
            this.y = y;
        }
    }
    clone() {
        return new Point2D(this.x, this.y);
    }
    add(that) {
        return new Point2D(this.x + that.x, this.y + that.y);
    }
    addEquals(that) {
        this.x += that.x;
        this.y += that.y;
        return this;
    }
    /*****
     *
     *   offset - used in dom_graph
     *
     *   This method is based on code written by Walter Korman
     *      http://www.go2net.com/internet/deep/1997/05/07/body.html
     *   which is in turn based on an algorithm by Sven Moen
     *
     *****/
    offset(a, b) {
        var result = 0;

        if (!(b.x <= this.x || this.x + a.x <= 0)) {
            var t = b.x * a.y - a.x * b.y;
            var s;
            var d;

            if (t > 0) {
                if (this.x < 0) {
                    s = this.x * a.y;
                    d = s / a.x - this.y;
                } else if (this.x > 0) {
                    s = this.x * b.y;
                    d = s / b.x - this.y;
                } else {
                    d = -this.y;
                }
            } else {
                if (b.x < this.x + a.x) {
                    s = (b.x - this.x) * a.y;
                    d = b.y - (this.y + s / a.x);
                } else if (b.x > this.x + a.x) {
                    s = (a.x + this.x) * b.y;
                    d = s / b.x - (this.y + a.y);
                } else {
                    d = b.y - (this.y + a.y);
                }
            }

            if (d > 0) {
                result = d;
            }
        }
        return result;
    }
    rmoveto(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    scalarAdd(scalar) {
        return new Point2D(this.x + scalar, this.y + scalar);
    }
    scalarAddEquals(scalar) {
        this.x += scalar;
        this.y += scalar;
        return this;
    }
    subtract(that) {
        return new Point2D(this.x - that.x, this.y - that.y);
    }
    subtractEquals(that) {
        this.x -= that.x;
        this.y -= that.y;
        return this;
    }
    scalarSubtract(scalar) {
        return new Point2D(this.x - scalar, this.y - scalar);
    }
    scalarSubtractEquals(scalar) {
        this.x -= scalar;
        this.y -= scalar;
        return this;
    }
    multiply(scalar) {
        return new Point2D(this.x * scalar, this.y * scalar);
    }
    multiplyEquals(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    divide(scalar) {
        return new Point2D(this.x / scalar, this.y / scalar);
    }
    divideEquals(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }
    /*****
     *
     *   comparison methods
     *
     *   these were a nice idea, but ...  It would be better to define these names
     *   in two parts so that the first part is the x comparison and the second is
     *   the y.  For example, to test p1.x < p2.x and p1.y >= p2.y, you would call
     *   p1.lt_gte(p2).  Honestly, I only did these types of comparisons in one
     *   Intersection routine, so these probably could be removed.
     *
     *****/
    compare(that) {
        return (this.x - that.x || this.y - that.y);
    }
    eq(that) {
        return (this.x == that.x && this.y == that.y);
    }
    lt(that) {
        return (this.x < that.x && this.y < that.y);
    }
    lte(that) {
        return (this.x <= that.x && this.y <= that.y);
    }
    gt(that) {
        return (this.x > that.x && this.y > that.y);
    }
    gte(that) {
        return (this.x >= that.x && this.y >= that.y);
    }
    lerp(that, t) {
        return new Point2D(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
    }
    distanceFrom(that) {
        var dx = this.x - that.x;
        var dy = this.y - that.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    min(that) {
        return new Point2D(Math.min(this.x, that.x), Math.min(this.y, that.y));
    }
    max(that) {
        return new Point2D(Math.max(this.x, that.x), Math.max(this.y, that.y));
    }
    toString() {
        return this.x + "," + this.y;
    }
    setXY(x, y) {
        this.x = x;
        this.y = y;
    }
    setFromPoint(that) {
        this.x = that.x;
        this.y = that.y;
    }
    swap(that) {
        var x = this.x;
        var y = this.y;

        this.x = that.x;
        this.y = that.y;

        that.x = x;
        that.y = y;
    }
}
