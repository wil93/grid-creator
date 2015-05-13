'use strict'

function RandomGridCreatorJS(id) {
  this.id = id;

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
