'use strict'

function SlowGridCreatorJS(id) {
  this.id = id;

  this.create_grid = function() {
    let conta = 0

    for (let i = 0; i < 500000000; i++) {
      if (i % 8753) {
        conta++
      }
    }

    return [
      ["A", "B", "C", "D"],
      ["E", "F", "G", "H"],
      ["I", "J", "K", "L"],
      ["M", "N", "O", "P"],
    ]
  }
}
