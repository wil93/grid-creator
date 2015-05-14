'use strict'

var TESTS = {
  "test-random": RandomGridCreatorJS,
  //"test-slow": SlowGridCreatorJS,
  //"test2": FastGridCreatorJS,   (?)
}

var run_test = function(test_id) {
  let test = document.getElementById(test_id)

  if (test === null) {
    return;
  }

  // Clear the table
  while (test.firstChild) {
    test.removeChild(test.firstChild)
  }

  // Start timer
  let start = new Date().getTime()

  // Create the test object and "run" it
  let Test = TESTS[test_id]
  let grid = new Test().create_grid()

  // Stop timer
  let stop = new Date().getTime()

  // Show the table
  for (let row in grid) {
    let tr = document.createElement("tr")
    for (let col in grid[row]) {
      let td = document.createElement("td")
      td.innerHTML = grid[row][col];
      tr.appendChild(td);
    }
    test.appendChild(tr)
  }

  // Show the time
  let new_time = document.createElement("li")
  new_time.innerHTML = (stop - start) + " ms"
  let times = document.getElementById(test_id + "-times")
  times.insertBefore(new_time, times.firstChild)
}

window.onload = function() {
  for (let t in TESTS) {
    let test = document.createElement("div")
    let table = document.createElement("table")
    let button = document.createElement("button")
    let times = document.createElement("ol")

    table.id = t
    times.id = t + "-times"
    button.id = t + "-button"

    times.reversed = true
    button.onclick = function() { run_test(t) }
    button.innerHTML = t

    test.appendChild(button)
    test.appendChild(table)
    test.appendChild(times)

    test.setAttribute("class", "test")
    document.body.appendChild(test)
  }
}
