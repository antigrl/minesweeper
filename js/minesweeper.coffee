

generateBoard = (size) ->
  _.times(size, () ->
    _.times(size, () ->
      {
        marked: false
        bomb: false
      }
    )
  )

placeBombs = (board,bombs) ->
  bombCount = 0
  while bombCount < bombs
    x = _.random(0,board.length-1)
    y = _.random(0,board.length-1)

    unless board[x][y].bomb
      board[x][y].bomb = true
      bombCount += 1

addNumbers = (board) ->
  for x in [0..(board.length-1)]
    for y in [0..(board.length-1)]
      numBombs = 0

      if board[x-1]?[y]?.bomb
        numBombs += 1

      if board[x+1]?[y]?.bomb
        numBombs +=1

      if board[x]?[y-1]?.bomb
        numBombs += 1

      if board[x]?[y+1]?.bomb
        numBombs +=1

      if board[x-1]?[y-1]?.bomb
        numBombs += 1

      if board[x+1]?[y+1]?.bomb
        numBombs +=1

      if board[x+1]?[y-1]?.bomb
        numBombs += 1

      if board[x-1]?[y+1]?.bomb
        numBombs +=1

      board[x][y].number = numBombs

class Minesweeper
  constructor: (size,bombs) ->
    @callbacks = {}

    @sploded = false

    @size = parseInt(size)
    @bombs = parseInt(bombs)

    @board = generateBoard(@size)

    placeBombs(@board,bombs)
    addNumbers(@board)
    addNumbers(@board)

  callback: (name,args...) ->
    if _.isArray(@callbacks[name])
      _.forEach(@callbacks[name], (callback) ->
        callback(args...)
      )

  on: (name,callback) ->
    @callbacks[name] ?= []
    @callbacks[name].push callback

    # Immediately draw the screen when a callback is registered
    callback() if name == 'redraw'

  gameWon: () ->
      tiles = _.chain(@board).flatten()
      marked = tiles.filter((tile) -> tile.marked).value().length
      revealed = tiles.filter((tile) -> tile.revealed).value().length

      console.log("Marked Tiles: #{marked}");
      console.log("Revealed Tiles: #{revealed}");

      console.log(marked)
      console.log(@bombs)

      allBombsMarked = marked == @bombs
      allSquaresRevealed = (revealed + marked) == (@size * @size)

      console.log("All bombs marked: #{allBombsMarked}")
      console.log("All squares revealed: #{allSquaresRevealed}")

      allBombsMarked and allSquaresRevealed

  winOrRedraw: () ->
    if @gameWon()
      @callback('win')
    else
      @callback('redraw')

  getBoard: () ->
    spaceToChar = (space) ->
      if space.revealed
        ''+space.number
      else if space.marked
        'X'
      else
        '?'

    _.map(@board,(row) -> _.map(row, spaceToChar))

  getBoardXray: () ->
    spaceToChar = (space) ->
      if space.bomb
        '@'
      else
        ''+space.number

    _.map(@board,(row) -> _.map(row, spaceToChar))

  mark: (x,y) ->
    console.log("Mark #{x},#{y}")
    x=parseInt(x)
    y=parseInt(y)
    @board[x][y].marked = true
    @winOrRedraw()

  unmark: (x,y) ->
    console.log("UnMark #{x},#{y}")
    x=parseInt(x)
    y=parseInt(y)
    @board[x][y].marked = false
    @winOrRedraw()

  toggleMark: (x,y) ->
    console.log("ToggleMark #{x},#{y}")
    x=parseInt(x)
    y=parseInt(y)
    if @board[x][y].marked
      @board[x][y].marked = false
    else
      @board[x][y].marked = true
    @winOrRedraw()

  reveal: (x,y,noRedraw) ->
    console.log("Revealing #{x},#{y}")
    x=parseInt(x)
    y=parseInt(y)
    if @board[x]?[y]?
      unless @board[x]?[y]?.marked or @board[x]?[y]?.revealed
        if @board[x][y].bomb
          @callback('splode',x,y)
        else
          @board[x][y].revealed = true

          if @board[x][y].number == 0
            @reveal(x-1,y,true)
            @reveal(x+1,y,true)
            @reveal(x,y-1,true)
            @reveal(x,y+1,true)
            @reveal(x-1,y-1,true)
            @reveal(x-1,y+1,true)
            @reveal(x+1,y-1,true)
            @reveal(x+1,y+1,true)

      @winOrRedraw() unless noRedraw

