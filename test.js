'use strict'

var TESTS = {
  "test-random": RandomGridCreatorJS,
  "test-trie": TrieGridCreatorJS,
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

  // Compute word list
  let word_list = "amico,amica,amici,amiche,madre,padre,marito,moglie,papa,babbo,mamma,genitori,figlio,figlia,figli,figlie,fratello,fratelli,sorelle,sorella,zii,zie,zio,zia,cugino,cugini,cugine,cugina,nonno,nonni,nonne,nonna,nipote,nipoti,prozio,prozia,sorella,fratello".split(",");

  // Start timer
  let start = new Date().getTime()

  // Create the test object and "run" it
  let Test = TESTS[test_id]
  let result = new Test(word_list).run()

  // Stop timer
  let stop = new Date().getTime()

  // Show the table
  for (let row in result.grid) {
    let tr = document.createElement("tr")
    for (let col in result.grid[row]) {
      let td = document.createElement("td")
      td.innerHTML = result.grid[row][col];
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
