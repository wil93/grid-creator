'use strict'

function SlowGridCreatorJS(grid_side, word_list, timeout_ms) {
  var word_list = word_list;
  var grid_side = grid_side;

  var result = [];
  var usati = new Set()


  this.run = function() {
    let conta = 0
    let insert = false

    //create the raw output
    for (let i = 0; i < grid_side ; i++) {
      let row = []
      for (let i = 0; i < grid_side ; i++) {
        row.push("-")
      }
      result.push(row)
    }

    while (conta < word_list.length) {
      if (insertWord(word_list[conta])) {
        conta += 1
      } else {
        break
      }
    }

    return {
      "grid": result,
      "total": conta,
    }
  }

  function shuffle(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }

  var insertWord = function(word) {
    usati.clear()
    var pos = []
    for (let i=0; i< grid_side ; i++){
      for (let j=0; j< grid_side ; j++){
        pos.push({"i": i, "j": j})
      }
    }

    shuffle(pos)

    for (let k in pos) {
      let i = pos[k].i
      let j = pos[k].j
      if (insertLetter(i, j, 0, word)) return true
    }
    return false
  }

  var insertLetter = function(x,y,count,word) {
    if (result[x][y] == "-" || (result[x][y] == word[count] && !usati.has(x * grid_side + y))) {
      let old = result[x][y]
      result[x][y] = word[count]
      usati.add(x * grid_side + y)

      if (count === word.length - 1) {
        return true
      } else {
        // list all the positions
        let pos = []
        for (let i=-1; i<=1; i++) {
          for (let j=-1; j<=1; j++) {
            if (x+i>=0 && y+j>=0 && x+i<grid_side && y+j<grid_side) {
              pos.push({"i": x+i, "j": y+j})
            }
          }
        }

        shuffle(pos)

        // try the positions
        for (let k in pos) {
          let i = pos[k].i
          let j = pos[k].j
          if (insertLetter(i, j, count+1, word)) {
            return true
          }
        }
      }

      result[x][y] = old
      usati.delete(x * grid_side + y)
    }
    return false
  }
}
