'use strict'

function SmarterGridCreatorJS(grid_side, word_list, timeout_ms) {
  var word_list = word_list;
  var grid_side = grid_side;
  var result = [];
  var candidate = null
  var usati_candidate = null
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

    for (let i=0; i<grid_side; i++)
      for (let j=0; j<grid_side; j++)
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
    let old_result = clone(result)  // backup
    let best_result = null
    let best = word.length + 1  // any candidate will surely be better

    // try every splitting point
    for (let idx in word) {
      let left = ""
      let right = ""
      for (let j in word) {
        if (j <= idx) left += word[idx - j]  // not word[j], because we want left reversed
        if (j >= idx) right += word[j]
      }

      // find starting positions
      var pos = []
      for (let i=0; i<grid_side; i++) {
        for (let j=0; j<grid_side; j++) {
          if (result[i][j] === "-" || result[i][j] === word[idx]) {
            pos.push({"i": i, "j": j})
          }
        }
      }

      //shuffle(pos)

      for (let k in pos) {
        let i = pos[k].i
        let j = pos[k].j

        let func = function() {
          // try to put the first half
          candidate = null
          insertLetter(i, j, 0, left)
          // check if a solution was found
          if (candidate !== null) {
            result = clone(candidate)
            usati = new Set(usati_candidate)
            candidate = null
            // try to put the other half
            insertLetter(i, j, 0, right)
            if (candidate !== null) {
              let diff = differences(old_result, candidate)
              if (diff < best) {
                best = diff
                best_result = clone(candidate)
              }
            }
            result = clone(old_result)
            usati.clear()
          }
        }

        // first try: left, then right
        func()
        // swap
        let tmp = left
        left = right
        right = tmp
        // second try: right, then left
        func()
      }
    }

    if (best_result !== null) {
      result = clone(best_result)
      return true
    } else {
      return false
    }
  }

  var insertLetter = function(x, y, count, word) {
    let old = result[x][y]
    result[x][y] = word[count]
    usati.add(x * grid_side + y)

    if (count === word.length - 1) {
      // a candidate was found, let's clone it
      candidate = clone(result)
      usati_candidate = new Set(usati)
    } else {
      // list all the positions ("promising" ones first)
      let good_ones = []
      let bad_ones = []
      for (let i=-1; i<=1; i++) {
        for (let j=-1; j<=1; j++) {
          if (x+i>=0 && y+j>=0 && x+i<grid_side && y+j<grid_side) {
            let ci = x+i
            let cj = y+j
            if (result[ci][cj] === word[count + 1] && !usati.has(ci * grid_side + cj)) {
              good_ones.push({"i": ci, "j": cj})
            } else if (result[ci][cj] === "-") {
              bad_ones.push({"i": ci, "j": cj})
            }
          }
        }
      }

      shuffle(good_ones)
      shuffle(bad_ones)
      let pos = good_ones.concat(bad_ones)

      // try the positions
      for (let k in pos) {
        let i = pos[k].i
        let j = pos[k].j
        insertLetter(i, j, count + 1, word)
        if (candidate !== null) {
          break
        }
      }
    }

    result[x][y] = old
    usati.delete(x * grid_side + y)
  }
}
