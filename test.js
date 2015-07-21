'use strict'

var Repeated = function(Test) {
  return function(grid_side, word_list, timeout_ms) {
    let start_time = new Date().getTime()

    this.run = function() {
      let best = 0
      let grid = []
      let runs = 0
      let remaining = timeout_ms

      while (remaining > 0) {
        let start = new Date().getTime()

        let candidate = new Test(grid_side, word_list, remaining).run()
        if (candidate.total > best) {
          best = candidate.total
          grid = candidate.grid
        }
        runs += 1

        // subtract elapsed time for this run
        remaining -= (new Date().getTime() - start)
      }

      return {
        "grid": grid,
        "total": best,
        "runs": runs
      }
    }
  }
}

var TESTS = {
  "test-random": [
    RandomGridCreatorJS,
    `Questo algoritmo non prova ad inserire le parole, limitandosi invece a
generare una matrice seguendo la distribuzione delle lettere nella lingua
italiana. È quindi solo un algoritmo di prova per testare il "framework".`
  ],
  "test-bt": [
    SlowGridCreatorJS,
    `Questo algoritmo è un semplice backtracking che inserisce una parola dopo
l'altra, fermandosi quando non riesce più ad inserire una nuova parola.`
  ],
  "repeated-test-bt": [
    Repeated(SlowGridCreatorJS),
    `Questo algoritmo è un'estensione di "test-bt" che esegue tante volte lo
stesso algoritmo, tenendo traccia della migliore soluzione trovata, e si ferma
quando esaurisce il tempo a sua disposizione.`
  ],
  "test-bt-smart": [
    SmartGridCreatorJS,
    `Questo algoritmo è un miglioramento di "test-bt" che, invece di fermarsi
appena trova un punto dove inserire una parola, continua a cercare nuovi punti
e alla fine sceglie il candidato migliore (che introduce il minor numero di
nuove lettere nella griglia).`
  ],
  "repeated-test-bt-smart": [
    Repeated(SmartGridCreatorJS),
    `Questo algoritmo è un'estensione di "test-bt-smart" che esegue tante volte
lo stesso algoritmo, tenendo traccia della migliore soluzione trovata, e si
ferma quando esaurisce il tempo a sua disposizione.`
  ],
  "test-bt-smarter": [
    SmarterGridCreatorJS,
    `Questo algoritmo è un miglioramento di "test-bt-smart" che, oltre che
provare a partire da tutti i possibili punti di partenza, prova anche a dividere
la parola da inserire in due parti (inserendo poi le due parti separatamente).`
  ],
  "repeated-test-bt-smarter": [
    Repeated(SmarterGridCreatorJS),
    `Questo algoritmo è un'estensione di "test-bt-smarter" che esegue tante
volte lo stesso algoritmo, tenendo traccia della migliore soluzione trovata, e
si ferma quando esaurisce il tempo a sua disposizione.`
  ],
  "test-lookback": [
    LookbackCreatorJS,
    `Questo algoritmo cerca, tra le parole già inserite, una sovrapposizione di
lettere. La sovrapposizione trovata viene data per inserita, mentre le restanti
lettere vengono inserite a parte (prima e/o dopo la sovrapposizione).`
  ],
  "repeated-test-lookback": [
    Repeated(LookbackCreatorJS),
    `Questo algoritmo è un'estensione di "test-lookback" che esegue tante volte
lo stesso algoritmo, tenendo traccia della migliore soluzione trovata, e si
ferma quando esaurisce il tempo a sua disposizione.`
  ],
}

var clear_containers = function(containers_array) {
  for (let i in containers_array) {
    let c = containers_array[i]
    while (c.firstChild) {
      c.removeChild(c.firstChild)
    }
  }
}

var clear_all = function() {
  if (confirm('Are you sure?')) {
    clear_containers(document.getElementsByTagName("ol"))
    clear_containers(document.getElementsByTagName("table"))
  }
}

var run_test = function(test_id) {
  var GRID_SIDE = document.getElementById("grid_side").value
  var TIMEOUT_MS = document.getElementById("timeout").value

  let test = document.getElementById(test_id)

  if (test === null) {
    return;
  }

  // Clear the table
  clear_containers([test])

  // Compute word list
  let word_list = document.getElementById("wordlist").value.toUpperCase().split("\n")

  // Start timer
  let start = new Date().getTime()

  // Create the test object and "run" it
  let Test = TESTS[test_id][0]
  let result = new Test(GRID_SIDE, word_list, TIMEOUT_MS).run()

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
  new_time.innerHTML = result.total + "/" + word_list.length + " parole inserite in " + (stop - start) + " ms"
  if (result.runs !== undefined) {
    new_time.innerHTML += " (usando " + result.runs + " ripetizioni)"
  }
  let times = document.getElementById(test_id + "-times")
  times.insertBefore(new_time, times.firstChild)
}

var run_entire_list = function(test_id, start_at) {
  var GRID_SIDE = document.getElementById("grid_side").value
  var TIMEOUT_MS = document.getElementById("timeout").value

  let test = document.getElementById(test_id)

  if (test === null) {
    return;
  }

  // Compute word list
  let word_list = document.getElementById("wordlist").value.toUpperCase().split("\n")
  if (start_at < word_list.length) {
    word_list.splice(0, start_at)
  } else {
    // All words inserted
    return
  }

  // Clear the table
  clear_containers([test])

  // Clear the time (if it's the first series)
  if (start_at === 0) {
    clear_containers([document.getElementById(test_id + "-times")])
  }

  // Start timer
  let start = new Date().getTime()

  // Create the test object and "run" it
  let Test = TESTS[test_id][0]
  let result = new Test(GRID_SIDE, word_list, TIMEOUT_MS).run()

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
  new_time.innerHTML = ((start_at ? start_at : 0) + result.total) + "/" + (start_at + word_list.length) + " parole inserite in " + (stop - start) + " ms"
  if (result.runs !== undefined) {
    new_time.innerHTML += " (usando " + result.runs + " ripetizioni)"
  }
  let times = document.getElementById(test_id + "-times")
  times.insertBefore(new_time, times.firstChild)

  if (result.total == 0) {
    alert("Imprevisto: non si riesce a inserire una parola...")
  } else {
    // Call recursively (but wait, so the browser can redraw everything)
    setTimeout(function() {
      run_entire_list(test_id, start_at + result.total)
    }, 100)
  }
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

window.onload = function() {
  let show = getQueryVariable("show")
  if (show) {
    // only one test is requested, delete the others
    for (let t in TESTS) {
      if (t !== show) {
        delete TESTS[t]
      } else {
        TESTS[t][1] = '<a style="float:right" href="?">(show all tests)</a><br>' + TESTS[t][1]
      }
    }
  } else {
    // all tests are requested, create links to show single tests
    for (let t in TESTS) {
      TESTS[t][1] = '<a style="float:right" href="?show=' + t + '">(show only this test)</a><br>' + TESTS[t][1]
    }
  }

  let width = 0

  for (let t in TESTS) {
    let test = document.createElement("div")
    let test_wrapper = document.createElement("div")
    let table = document.createElement("table")
    let button = document.createElement("button")
    let button2 = document.createElement("button")
    let description = document.createElement("div")
    let times = document.createElement("ol")

    table.id = t
    times.id = t + "-times"
    button.id = t + "-button"

    times.reversed = true

    button.onclick = function(x) {
      return function() { run_test(x) }
    }(t);

    button2.onclick = function(x) {
      return function() { run_entire_list(x, 0) }
    }(t);

    button.classList.add("test")
    button.innerHTML = "<i class='fa fa-play'></i> " + t

    button2.classList.add("insert-all")
    button2.classList.add("test")
    button2.innerHTML = "<i class='fa fa-forward'></i> (insert entire list)"

    description.classList.add("description")
    description.innerHTML = TESTS[t][1]

    test.appendChild(description)
    test.appendChild(button)
    test.appendChild(button2)
    test.appendChild(table)
    test.appendChild(times)

    test_wrapper.appendChild(test)
    test_wrapper.classList.add("test")
    document.getElementById("test-container").appendChild(test_wrapper)

    width += test.offsetWidth
  }

  document.body.style.width = width + "px"
}
