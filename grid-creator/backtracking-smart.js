'use strict'

function SmartGridCreatorJS(grid_side, word_list, timeout_ms) {
  var word_list = word_list;
  var result = [
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
  ]
  var candidate = null
  var usati = new Set()
  var freecell = grid_side * grid_side


  this.run = function() {
    let conta = 0
    let insert = false

    do {
        insert = insertWord(word_list[conta])
        if (insert) conta++
    } while (insert == true)

    return {
      "grid": result,
      "total": conta,
    }
  }

  function clone(existingArray) {
     var newObj = (existingArray instanceof Array) ? [] : {};
     for (let i in existingArray) {
        if (i == 'clone') continue;
        if (existingArray[i] && typeof existingArray[i] == "object") {
           newObj[i] = clone(existingArray[i]);
        } else {
           newObj[i] = existingArray[i]
        }
     }
     return newObj;
  }

  function differences(a, b) {
    let result = 0

    for (let i=0; i<4; i++)
      for (let j=0; j<4; j++)
        if (a[i][j] !== b[i][j])
          result += 1

    return result
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
    let old_result = clone(result)  // backup
    let best = word.length + 1  // any candidate will surely be better

    var pos = []
    for (let i=0; i<4; i++){
      for (let j=0; j<4; j++){
        pos.push({"i": i, "j": j})
      }
    }

    shuffle(pos)

    for (let k in pos) {
      let i = pos[k].i
      let j = pos[k].j
      candidate = null
      insertLetter(i, j, 0, word)
      // check if a solution was found
      if (candidate !== null) {
        let diff = differences(old_result, candidate)
        if (diff < best) {
          best = diff
          result = clone(candidate)
        }
      }
    }

    // if something was inserted, then "best" must have decreased
    return (best < word.length + 1)
  }

  var insertLetter = function(x, y, count, word) {
    if (result[x][y] == "-" || (result[x][y] == word[count] && !usati.has(x * 4 + y))) {
      let old = result[x][y]
      result[x][y] = word[count]
      usati.add(x * 4 + y)

      if (count === word.length - 1) {
        // a candidate was found, let's clone it
        candidate = clone(result)
      } else {
        for (let i=-1; i<=1; i++) {
          for (let j=-1; j<=1; j++) {
            if (x+i>=0 && y+j>=0 && x+i<4 && y+j<4) {
              insertLetter(x+i,y+j,count+1,word)
            }
          }
        }
      }

      result[x][y] = old
      usati.delete(x * 4 + y)
    }
  }
}
