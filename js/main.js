board = undefined;

function handleWin() {
  $('.result-container').show().delay(3000);
  $('.winner').show().delay(3000);
}

function handleSplode(x,y) {
  var children = $(".blank");
  var index = 0;

  var bombTile = $('a[tilex="'+x+'"][tiley="'+y+'"]');

  function addClassToNextChild() {
    if (index == children.length) return;
    children.eq(index++).removeClass('icon-flag').addClass('empty icon-bomb');
    $('span').remove();
    window.setTimeout(addClassToNextChild, 10);
  }

  $('.result-container').show();
  $('.loser').show();

  addClassToNextChild();
}

function handleRedraw() {
  var board = game.getBoard();
  var boardSize = board.length;

  for (var x = 0; x < boardSize; x++) {
    for (var  y = 0; y < boardSize;  y++) {
      var tile = board[x][y];
      var screenTile = $('a[tilex="'+x+'"][tiley="'+y+'"]');

      if(tile == 'X' ) {
        screenTile.find('.blank').addClass('icon-flag');
      }
      else if (tile == '?') {
        screenTile.find('.blank').removeClass('icon-flag');

      }
      else if (tile !== '?') {
        screenTile.find('.blank').addClass('empty');
        screenTile.find('.blank > span').show();
      }
    }
  }
}

function startGame(numBombs) {
  document.oncontextmenu = function() {return false;};

  $('#mine-grid').empty();

  $('.winner').hide();
  $('.loser').hide();

  var boardSize = 8;
  var numBombs = $('#num-bombs-input').val();
  if(numBombs > 63) { numBombs = 63; }

  game = new Minesweeper(boardSize,numBombs);

  game.on("win",    handleWin);
  game.on("splode", handleSplode);
  game.on("redraw", handleRedraw);

  var board = game.getBoardXray();

  for(var x = 0; x < boardSize; x++) {
    for(var y = 0; y < boardSize; y++) {

      var tile = board[x][y];
      var square = $('<a href="#"><article class="blank fall"><span style="display: none;">'+ tile +'</span></article></a>');

      square.attr('tilex',x);
      square.attr('tiley',y);

      square.on('mousedown', function(event) {
        var x = $(this).attr('tilex');
        var y = $(this).attr('tiley');

        if (event.which == 1) {
          game.reveal(x,y);
        }
        if (event.which == 3) {
          game.toggleMark(x,y);
        };

      });
      $('#mine-grid').append(square);
    }
  }
}

// Control button actions
$(function() {
  $('.num-bombs-preset').click(function() {
    $('#num-bombs-input').val($(this).attr('number'));
    $('#num-bombs-input').trigger('change');
  });

  $('#num-bombs-input').change(function() {
    $('#start-game').addClass('active').prop('disabled',false);
  });

  $('#start-game').click(function() {
    $(this).removeClass('active');
    startGame();
  });
});