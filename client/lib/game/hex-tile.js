'use strict';

var _ = require('underscore'),
    Kinetic = require('kinetic'),
    common = require('./../../../common/index'),
    HexTile = common.HexTile,
    NumberToken = require('./number-token'),
    theme = require('./../theme');

function UiHexTile(factory, options) {
  HexTile.apply(this, arguments);
  this.addToBoard = this.addToBoard.bind(this);
  this.render(options);
}

common.util.inherits(UiHexTile, HexTile);

UiHexTile.prototype.render = function(options) {
  var tileStyle = theme.tiles[options.type],
      tileSpacing = theme.board.tilespacing || 8,
      hexagonOpts = this.getHexOptions(tileStyle, tileSpacing, options.hexInfo);

  this.numberToken = null;

  this.hexagon = new Kinetic.RegularPolygon(hexagonOpts);
  this.group = new Kinetic.Group({
    x: options.center.x,
    y: options.center.y
  });

  this.group.add(this.hexagon);

  if (tileStyle.stroke) {
    this.hexagon2 = new Kinetic.RegularPolygon({
      x: 0,
      y: 0,
      sides: 6,
      radius: options.hexInfo.circumradius - tileSpacing,
      rotation: 270,
      stroke: tileStyle.stroke,
      strokeWidth: tileStyle.strokeWidth || 1
    });
    this.group.add(this.hexagon2);
  }

  if (theme.board && theme.board.bgcolor) {
    this.bgHexagon = new Kinetic.RegularPolygon({
      x: options.center.x,
      y: options.center.y,
      sides: 6,
      radius: options.hexInfo.circumradius + tileSpacing,
      rotation: 270,
      fill: theme.board.bgcolor
    });
  }
  this.group.add(this.hexagon2);

  if (options.value > 0) {
    this.addNumberToken(options.value);
  }
};

UiHexTile.prototype.getHexOptions = function(tileStyle, tileSpacing, hexInfo) {
  var patternScale = hexInfo.circumradius * 2 / tileStyle.bgimage.width,
      options = {
        x: 0,
        y: 0,
        sides: 6,
        radius: hexInfo.circumradius - tileSpacing,
        rotation: 270,
        fill: tileStyle.bgcolor,
        opacity: tileStyle.opacity || 1
      };

  if (tileStyle.bgimage) {
    options = _.extend(options, {
      fillPriority: 'pattern',
      fillPatternImage: tileStyle.bgimage,
      fillPatternScaleX: patternScale,
      fillPatternScaleY: patternScale,
      fillPatternRotation: 90,
      fillPatternY: -hexInfo.circumradius,
      fillPatternX: -hexInfo.apothem
    });
  }
  return options;
};

UiHexTile.prototype.addNumberToken = function(value) {
  this.numberToken = new NumberToken(value);
  return this.group.add(this.numberToken.group);
};

UiHexTile.prototype.addToBoard = function(board) {
  HexTile.prototype.addToBoard.call(this, board);
  if (this.numberToken) {
    return board.on('board:rotate', this.numberToken.onBoardRotate);
  }
};

module.exports = UiHexTile;
