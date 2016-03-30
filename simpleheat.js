'use strict';

var Rainbow = require('rainbowvis.js');
var myRainbow = new Rainbow();
var Color = require('color');


if (typeof module !== 'undefined') module.exports = simpleheat;

function simpleheat(canvas) {
    if (!(this instanceof simpleheat)) return new simpleheat(canvas);

    this._canvas = canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;

    this._ctx = canvas.getContext('2d');
    this._width = canvas.width;
    this._height = canvas.height;

    this._max = 1;
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

    max: function (max) {
        this._max = max;
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

    draw: function (data, radius) {
        var calcColor = this._calcColor;
        var grad = this._grad === undefined ? this.defaultGradient : this._grad;

        var gradient = Object.keys(grad).map(function (value) {
            return grad[value];
        });

        var ctx = this._ctx;

        ctx.clearRect(0, 0, this._width, this._height);
        data.forEach(function (dataPoint) {
            ctx.beginPath();
            ctx.arc(dataPoint[0], dataPoint[1], radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = calcColor(dataPoint[2], gradient, dataPoint[3], 8); // TODO: maxValue skal ikke være 8
            ctx.fill();
        });

        return this;
    },

    _calcColor: function (value, gradient, opacity, maxValue) {
      //console.log("calcColor:" + value)
        myRainbow.setSpectrum.apply(this, gradient);
      //myRainbow.setSpectrum('red', 'yellow', 'white');
        myRainbow.setNumberRange(0, maxValue);
        var h = myRainbow.colourAt(value);
        return Color('#' + h).alpha(opacity).rgbaString();
    },

    _createCanvas: function () {
        if (typeof document !== 'undefined') {
            return document.createElement('canvas');
        } else {
            // create a new canvas instance in node.js
            // the canvas class needs to have a default constructor without any parameter
            return new this._canvas.constructor();
        }
    }
};
