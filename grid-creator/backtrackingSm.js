'use strict'

function SlowGridCreatorJS(word_list) {
  var word_list = word_list;
  var result = [
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
  ]
  var temp = [
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
  ]
  var candidate = [
    ["Z", "Z", "Z", "Z"],
    ["Z", "Z", "Z", "Z"],
    ["Z", "Z", "Z", "Z"],
    ["Z", "Z", "Z", "Z"],
  ]
  var usati = new Set()
  var freecell = 16


  this.run = function() {
    let conta = 0
    let insert = false

    do {
        insert = insertWord(word_list[conta])
        result = candidate
        if (insert) conta++
    } while (insert == true)

    return {
      "grid": result,
      "total": conta,
    }
  }

  function comparison(){
    let differences = 0
    for(int i=0;i<4;i++){
      for(int j=0;j<4;j++){
        if(test[i][j]=='-') differences++
      }
    }
    if (differences < freecell){
        freecell = differences
        return true
    }
    return false
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
    var bho = freecell
    temp = result
    usati.clear()
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
      if (insertLetter(i, j, 0, word)) {
        if (comparison()){
          candidate = temp
        }
      }
      temp = result
      }
    }
    if (bho == freecell) return false
    return true
  }

  var insertLetter = function(x,y,count,word) {
    if (temp[x][y] == "-" || (temp[x][y] == word[count] && !usati.has(x * 4 + y))) {
      let old = temp[x][y]
      temp[x][y] = word[count]
      usati.add(x * 4 + y)

      if (count === word.length - 1) {
        return true
      } else {
        for (let i=-1; i<=1; i++){
          for (let j=-1; j<=1; j++){
            if (x+i>=0 && y+j>=0 && x+i<4 && y+j<4){
              if (insertLetter(x+i,y+j,count+1,word)){
                return true
              }
            }
          }
        }
      }

      temp[x][y] = old
      usati.delete(x * 4 + y)
    }
    return false
  }
}
