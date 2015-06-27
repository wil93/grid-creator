'use strict'

function RandomGridCreatorJS(grid_side, word_list, timeout_ms) {
  this.grid_side = grid_side
  this.word_list = word_list
  this.timeout_ms = timeout_ms
  this.distribution = {
    "E": 0.1199, "A": 0.1102, "I": 0.1029,
    "O": 0.1010, "N": 0.0704, "T": 0.0699,
    "R": 0.0621, "L": 0.0572, "S": 0.0550,
    "C": 0.0432, "D": 0.0341, "U": 0.0330,
    "P": 0.0297, "M": 0.0288, "V": 0.0176,
    "G": 0.0166, "H": 0.0144, "B": 0.0106,
    "F": 0.0102, "Z": 0.0086, "Q": 0.0046,
  }

  /**
     Return a random grid (assumes that 0 words were inserted).

     @return: {grid, amount of words inserted}
    */
  this.run = function() {
    var res = []

    for (let i = 0; i < this.grid_side * this.grid_side; i++) {
      if (i % this.grid_side == 0) {
        res.push([])
      }

      res[res.length - 1].push(this.get_rand_char())
    }

    return {
      "grid": res,
      "total": 0
    }
  }

  this.get_rand_char = function() {
    let rnd = Math.random()

    for (let letter in this.distribution) {
      rnd -= this.distribution[letter]

      if (rnd < 0) {
        return letter
      }
    }

    throw "Error: the random distribution is not consistent"
  }
}
