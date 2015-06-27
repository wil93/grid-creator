'use strict'

function TrieGridCreatorJS(grid_side, word_list, timeout_ms) {
  this.grid_side = grid_side
  this.word_list = word_list
  this.timeout_ms = timeout_ms
  this.trie_list = []

  /**
     Find the max number of words that can be inserted.

     @return: {grid, amount of words inserted}
    */
  this.run = function() {
    for (let i in this.word_list) {
      // Add a word to an existing trie, or create a new one
      this.add_word(this.word_list[i])

      // Try to insert all the words added
      let grid = this.try_insert()

      // Check if we succeeded
      if (this.all_inserted) {
        this.best = {
          'grid': grid,
          'total': i+1,
        }
      } else {
        break
      }
    }

    return this.best
  }

  /**
     Try to convert a "list of tries" to a grid.

     @return: the grid (or null, if no grid was found)
    */
  this.try_insert = function(limit) {
    // Create the grid
    let grid = []
    for (let i=0; i<this.DIM; i++) {
      grid[i] = new Array(DIM)
    }

    // Add all tries
    for (let i in this.trie_list) {
      let trie = this.trie_list[i]

      // Find the best starting points
      let pts = this.best_points(trie)

      let ok = false
      for (var j in pts) {
        if (this.backtrack(pts[j].i, pts[j].j, trie/*, */)) {
          // We can stop here
          ok = true
          break
        }
      }

      if (!ok) {
        // Failed
        return null
      }
    }

    // Succeeded
    return grid
  }
}

function Trie() {
  this.root = {}

  this.insert(word, ptr) = function() {

  }
}
