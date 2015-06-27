'use strict'

var GRID_SIDE = 4
var TIMEOUT_MS = 5000

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
  ]
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
  let word_list = "amico,amica,amici,amiche,madre,padre,marito,moglie,papa,babbo,mamma,genitori,figlio,figlia,figli,figlie,fratello,fratelli,sorelle,sorella,zii,zie,zio,zia,cugino,cugini,cugine,cugina,nonno,nonni,nonne,nonna,nipote,nipoti,prozio,prozia,sorella,fratello".toUpperCase().split(",");

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
  new_time.innerHTML = result.total + " parole inserite in " + (stop - start) + " ms"
  if (result.runs !== undefined) {
    new_time.innerHTML += " (usando " + result.runs + " ripetizioni)"
  }
  let times = document.getElementById(test_id + "-times")
  times.insertBefore(new_time, times.firstChild)
}

window.onload = function() {
  let width = 0

  for (let t in TESTS) {
    let test = document.createElement("div")
    let table = document.createElement("table")
    let button = document.createElement("button")
    let description = document.createElement("div")
    let times = document.createElement("ol")

    table.id = t
    times.id = t + "-times"
    button.id = t + "-button"

    times.reversed = true
    button.onclick = function() { run_test(t) }
    button.innerHTML = t

    description.classList.add("description")
    description.innerHTML = TESTS[t][1]

    test.appendChild(description)
    test.appendChild(button)
    test.appendChild(table)
    test.appendChild(times)

    test.setAttribute("class", "test")
    document.body.appendChild(test)

    width += test.offsetWidth
  }

  document.body.style.width = width + "px"
}
