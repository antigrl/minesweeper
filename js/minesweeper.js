var Minesweeper, addNumbers, generateBoard, placeBombs,
  slice = [].slice;

generateBoard = function(size) {
  return _.times(size, function() {
    return _.times(size, function() {
      return {
        marked: false,
        bomb: false
      };
    });
  });
};

placeBombs = function(board, bombs) {
  var bombCount, results, x, y;
  bombCount = 0;
  results = [];
  while (bombCount < bombs) {
    x = _.random(0, board.length - 1);
    y = _.random(0, board.length - 1);
    if (!board[x][y].bomb) {
      board[x][y].bomb = true;
      results.push(bombCount += 1);
    } else {
      results.push(void 0);
    }
  }
  return results;
};

addNumbers = function(board) {
  var i, numBombs, ref, results, x, y;
  results = [];
  for (x = i = 0, ref = board.length - 1; 0 <= ref ? i <= ref : i >= ref; x = 0 <= ref ? ++i : --i) {
    results.push((function() {
      var j, ref1, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, results1;
      results1 = [];
      for (y = j = 0, ref1 = board.length - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; y = 0 <= ref1 ? ++j : --j) {
        numBombs = 0;
        if ((ref2 = board[x - 1]) != null ? (ref3 = ref2[y]) != null ? ref3.bomb : void 0 : void 0) {
          numBombs += 1;
        }
        if ((ref4 = board[x + 1]) != null ? (ref5 = ref4[y]) != null ? ref5.bomb : void 0 : void 0) {
          numBombs += 1;
        }
        if ((ref6 = board[x]) != null ? (ref7 = ref6[y - 1]) != null ? ref7.bomb : void 0 : void 0) {
          numBombs += 1;
        }
        if ((ref8 = board[x]) != null ? (ref9 = ref8[y + 1]) != null ? ref9.bomb : void 0 : void 0) {
          numBombs += 1;
        }
        if ((ref10 = board[x - 1]) != null ? (ref11 = ref10[y - 1]) != null ? ref11.bomb : void 0 : void 0) {
          numBombs += 1;
        }
        if ((ref12 = board[x + 1]) != null ? (ref13 = ref12[y + 1]) != null ? ref13.bomb : void 0 : void 0) {
          numBombs += 1;
        }
        if ((ref14 = board[x + 1]) != null ? (ref15 = ref14[y - 1]) != null ? ref15.bomb : void 0 : void 0) {
          numBombs += 1;
        }
        if ((ref16 = board[x - 1]) != null ? (ref17 = ref16[y + 1]) != null ? ref17.bomb : void 0 : void 0) {
          numBombs += 1;
        }
        results1.push(board[x][y].number = numBombs);
      }
      return results1;
    })());
  }
  return results;
};

Minesweeper = (function() {
  function Minesweeper(size, bombs) {
    this.callbacks = {};
    this.sploded = false;
    this.size = parseInt(size);
    this.bombs = parseInt(bombs);
    this.board = generateBoard(this.size);
    placeBombs(this.board, bombs);
    addNumbers(this.board);
    addNumbers(this.board);
  }

  Minesweeper.prototype.callback = function() {
    var args, name;
    name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (_.isArray(this.callbacks[name])) {
      return _.forEach(this.callbacks[name], function(callback) {
        return callback.apply(null, args);
      });
    }
  };

  Minesweeper.prototype.on = function(name, callback) {
    var base;
    if ((base = this.callbacks)[name] == null) {
      base[name] = [];
    }
    this.callbacks[name].push(callback);
    if (name === 'redraw') {
      return callback();
    }
  };

  Minesweeper.prototype.gameWon = function() {
    var allBombsMarked, allSquaresRevealed, marked, revealed, tiles;
    tiles = _.chain(this.board).flatten();
    marked = tiles.filter(function(tile) {
      return tile.marked;
    }).value().length;
    revealed = tiles.filter(function(tile) {
      return tile.revealed;
    }).value().length;
    console.log("Marked Tiles: " + marked);
    console.log("Revealed Tiles: " + revealed);
    console.log(marked);
    console.log(this.bombs);
    allBombsMarked = marked === this.bombs;
    allSquaresRevealed = (revealed + marked) === (this.size * this.size);
    console.log("All bombs marked: " + allBombsMarked);
    console.log("All squares revealed: " + allSquaresRevealed);
    return allBombsMarked && allSquaresRevealed;
  };

  Minesweeper.prototype.winOrRedraw = function() {
    if (this.gameWon()) {
      return this.callback('win');
    } else {
      return this.callback('redraw');
    }
  };

  Minesweeper.prototype.getBoard = function() {
    var spaceToChar;
    spaceToChar = function(space) {
      if (space.revealed) {
        return '' + space.number;
      } else if (space.marked) {
        return 'X';
      } else {
        return '?';
      }
    };
    return _.map(this.board, function(row) {
      return _.map(row, spaceToChar);
    });
  };

  Minesweeper.prototype.getBoardXray = function() {
    var spaceToChar;
    spaceToChar = function(space) {
      if (space.bomb) {
        return '@';
      } else {
        return '' + space.number;
      }
    };
    return _.map(this.board, function(row) {
      return _.map(row, spaceToChar);
    });
  };

  Minesweeper.prototype.mark = function(x, y) {
    console.log("Mark " + x + "," + y);
    x = parseInt(x);
    y = parseInt(y);
    this.board[x][y].marked = true;
    return this.winOrRedraw();
  };

  Minesweeper.prototype.unmark = function(x, y) {
    console.log("UnMark " + x + "," + y);
    x = parseInt(x);
    y = parseInt(y);
    this.board[x][y].marked = false;
    return this.winOrRedraw();
  };

  Minesweeper.prototype.toggleMark = function(x, y) {
    console.log("ToggleMark " + x + "," + y);
    x = parseInt(x);
    y = parseInt(y);
    if (this.board[x][y].marked) {
      this.board[x][y].marked = false;
    } else {
      this.board[x][y].marked = true;
    }
    return this.winOrRedraw();
  };

  Minesweeper.prototype.reveal = function(x, y, noRedraw) {
    var ref, ref1, ref2, ref3, ref4;
    console.log("Revealing " + x + "," + y);
    x = parseInt(x);
    y = parseInt(y);
    if (((ref = this.board[x]) != null ? ref[y] : void 0) != null) {
      if (!(((ref1 = this.board[x]) != null ? (ref2 = ref1[y]) != null ? ref2.marked : void 0 : void 0) || ((ref3 = this.board[x]) != null ? (ref4 = ref3[y]) != null ? ref4.revealed : void 0 : void 0))) {
        if (this.board[x][y].bomb) {
          this.callback('splode', x, y);
        } else {
          this.board[x][y].revealed = true;
          if (this.board[x][y].number === 0) {
            this.reveal(x - 1, y, true);
            this.reveal(x + 1, y, true);
            this.reveal(x, y - 1, true);
            this.reveal(x, y + 1, true);
            this.reveal(x - 1, y - 1, true);
            this.reveal(x - 1, y + 1, true);
            this.reveal(x + 1, y - 1, true);
            this.reveal(x + 1, y + 1, true);
          }
        }
      }
      if (!noRedraw) {
        return this.winOrRedraw();
      }
    }
  };

  return Minesweeper;

})();
