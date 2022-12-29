//cuando se cargue la pagina
document.addEventListener("DOMContentLoaded", () => {
  const userGrid = document.querySelector(".grid-user")
  const cpuGrid = document.querySelector("grid-cpu")
  const displayGrid = document.querySelector(".grid-display")

  const ships = document.querySelector(".ship")
  const destroyer = document.querySelector(".destroyer-container")
  const submarine = document.querySelector(".submarine-container")
  const crusier = document.querySelector(".crusier-container")
  const battleship = document.querySelector(".battleship-container")
  const carrier = document.querySelector(".carrier-container")
  const startButton = document.querySelector("#start")
  const rotateButton = document.querySelector("#rotate")
  const turnDisplay = document.querySelector("#turn")
  const infoDisplay = document.querySelector("#info")
  const setupButtons = document.querySelector("setup-buttons")

  let width = 10
  const userSquares = []
  const cpuSquares = []

  let isGameOver = false
  let ready = false
  let enemyReady = false
  let allShipsPaced = false
  let playerNum = 0
  let shotsFired = -1
  let currenPlayer = "user"
  let isHorizontal = true
  const shipsArray = [
    {
      name: "destroyer",
      directions: [
        [0, 1],
        [0, width],
      ],
    },
    {
      name: "submarine",
      directions: [
        [0, 1, 2],
        [0, width, width * 2],
      ],
    },
    {
      name: "crusier",
      directions: [
        [0, 1, 2],
        [0, width, width * 2],
      ],
    },
    ,
    {
      name: "battleship",
      directions: [
        [0, 1, 3],
        [0, width, width * 2, width * 3],
      ],
    },
    ,
    {
      name: "carrier",
      directions: [
        [0, 1, 2, 3, 4],
        [0, width, width * 2, width * 3, width * 4],
      ],
    },
  ]

  createBoard(userGrid, userSquares)
  createBoard(cpuGrid, cpuSquares)
  if (gameMode === "singlePlayer") {
    startSingleplayer()
  } else {
    startMultiplayer()
  }
  //creando la cuadrilla
  function createBoard(grid, squares) {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div")
      square.dataset.id = i
      grid.appendChild(square)
      squares.push(square)
    }
  }
  function startSingleplayer() {}
  //generando el posicionamiento random y evitanto que se desborde de la cuadrilla y verificando si esta tomada la casilla
  function generar(ship) {
    let randomDirection = Math.floor(Math.random() * ship.directions.length)
    let current = ship.directions[randomDirection]
    if (randomDirection === 0) directions = 1
    if (randomDirection === 1) directions = 10
    const isTaken = current.some((index) =>
      cpuSquares[index].classList.contains("taken")
    )
    const isAtRigthEdge = current.some((index) => index % width === width - 1)
    const isAtLeftEdge = current.some((index) => index % width === width - 0)
  }
})
