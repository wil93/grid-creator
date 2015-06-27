'use strict'

function SlowGridCreatorJS(grid_side, word_list, timeout_ms) {
  this.grid_side = grid_side
  this.word_list = word_list
  this.timeout_ms = timeout_ms

  this.added = 0
  this.grid = []
  for (let i = 0; i < this.grid_side * this.grid_side; i++) {
    if (i % this.grid_side == 0) {
      this.grid.push([])
    }

    this.grid[this.grid.length - 1].push(".")
  }

  /**
     Find the max number of words that can be inserted.

     @return: {grid, amount of words inserted}
    */
  this.run = function() {
    for (let i in this.word_list) {
      if (this.add_word(this.word_list[i])) {
        this.added += 1;
      } else {
        break
      }
    }

    return {
      "grid": this.grid,
      "total": this.added
    }
  }

  /**
     Try to add the given word to this.grid.

     @param word: the string to add to the grid.
     @return: a boolean indicating whether the addition was successful.
    */
  this.add_word = function(word) {
    // add
    console.log("Adding " + word)
    return true
  }
}
