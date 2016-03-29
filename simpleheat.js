'use strict';

//var Rainbow = require('rainbowvis.js');
var myRainbow = new Rainbow();


if (typeof module !== 'undefined') module.exports = simpleheat;

function simpleheat(canvas) {
    if (!(this instanceof simpleheat)) return new simpleheat(canvas);

    this._canvas = canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;

    this._ctx = canvas.getContext('2d');
    this._width = canvas.width;
    this._height = canvas.height;

    this._max = 1;
    this._data = [];
}

simpleheat.prototype = {

    defaultRadius: 25,

    defaultGradient: [
        'blue',
        'cyan',
        'lime',
        'yellow',
        'red'
    ],

    data: function (data) {
        this._data = data;
        return this;
    },

    max: function (max) {
        this._max = max;
        return this;
    },

    add: function (point) {
        this._data.push(point);
        return this;
    },

    clear: function () {
        this._data = [];
        return this;
    },

    radius: function (r, blur) {
        blur = blur === undefined ? 15 : blur;

        // create a grayscale blurred circle image that we'll use for drawing points
        var circle = this._circle = this._createCanvas(),
            ctx = circle.getContext('2d'),
            r2 = this._r = r + blur;

        circle.width = circle.height = r2 * 2;

        ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
        ctx.shadowBlur = blur;
        ctx.shadowColor = 'black';

        ctx.beginPath();
        ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        return this;
    },

    resize: function () {
        this._width = this._canvas.width;
        this._height = this._canvas.height;
    },

    gradient: function (grad) {
        this._grad = grad;
        return this;
    },

    draw: function (minOpacity) {

        if (!this._circle) this.radius(this.defaultRadius);
        //if (!this._grad) this.gradient(this.defaultGradient);

        var grad = this._grad === undefined ? this.defaultGradient : this._grad;
        //console.log(this._grad)
        //
        var gradient = Object.keys(grad).map(function (value,_) {
          return grad[value];
        });

        //console.log(gradient)

        var ctx = this._ctx;

        ctx.clearRect(0, 0, this._width, this._height);

        for (var i = 0, len = this._data.length, p; i < len; i++) {
            p = this._data[i];
            ctx.beginPath();
            ctx.arc(p[0] - this._r, p[1] - this._r, this._r, 0, 2 * Math.PI, false);
            //console.log(p)
            ctx.fillStyle = this._calcColor(p[2], gradient, 0);
            //console.log(ctx.fillStyle)
            ctx.fill();
            //ctx.globalAlpha = Math.max(p[2] / this._max, minOpacity === undefined ? 0.05 : minOpacity);
            //ctx.drawImage(this._circle, p[0] - this._r, p[1] - this._r);
        };

        return this;
    },

    _calcColor: function (value, gradient, opacity) {
      //console.log("calcColor:" + value)
      myRainbow.setSpectrum.apply(this, gradient);
      //myRainbow.setSpectrum('red', 'yellow', 'white');
      myRainbow.setNumberRange(0, 8);
      var h = myRainbow.colourAt(value);
      //console.log(h)
      return "#" + h
    },

    _colorize: function (pixels, gradient) {
        for (var i = 0, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i + 3] * 4; // get gradient color from opacity value

            if (j) {
                pixels[i] = gradient[j];
                pixels[i + 1] = gradient[j + 1];
                pixels[i + 2] = gradient[j + 2];
            }
        }
    },

    _createCanvas:function() {
        if (typeof document !== 'undefined') {
            return document.createElement('canvas');
        } else {
            // create a new canvas instance in node.js
            // the canvas class needs to have a default constructor without any parameter
            return new this._canvas.constructor();
        }
    }
};
