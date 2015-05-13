'use strict'

function RandomGridCreatorJS(id) {
  this.id = id;
  this.distribution = [
    {"E": 0.1199}, {"A": 0.1102}, {"I": 0.1029},
    {"O": 0.1010}, {"N": 0.0704}, {"T": 0.0699},
    {"R": 0.0621}, {"L": 0.0572}, {"S": 0.0550},
    {"C": 0.0432}, {"D": 0.0341}, {"U": 0.0330},
    {"P": 0.0297}, {"M": 0.0288}, {"V": 0.0176},
    {"G": 0.0166}, {"H": 0.0144}, {"B": 0.0106},
    {"F": 0.0102}, {"Z": 0.0086}, {"Q": 0.0046},
  ]

  this.create_grid = function() {
    var res = []

    for (let i = 0; i < 16; i++) {
      if (i % 4 == 0) {
        res.push([])
      }

      let rnd = String.fromCharCode(65 + Math.floor(Math.random() * 26))
      res[res.length - 1].push(rnd)
    }

    return res
  }
}
