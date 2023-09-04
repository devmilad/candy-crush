import { useState } from "react";
import { candyColors, notValid, notValidFour, widthBoard } from "./Constants";
import { useEffect } from "react";

import blank from "./assets/blank.png"
import ScoreBoard from "./ScoreBoard";




const App = () => {
  const [currentColor, setCurrentColor] = useState([])
  const [dragged, setDragged] = useState(null)
  const [replaced, setReplaced] = useState(null)
  const [score, setScore] = useState(0)

  //!  checking column possibility
  const checkColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const column = [i, i + widthBoard, i + widthBoard * 2]
      const decidedColor = currentColor[i]
      const isBlank = currentColor[i] === blank


      if (column.every(number => currentColor[number] === decidedColor && !isBlank)) {
        setScore((perv) => perv + 3)
        column.forEach(number => currentColor[number] = blank)
        return true
      }

    }
  }

  const checkColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const column = [i, i + widthBoard, i + widthBoard * 2, i + widthBoard * 3]
      const decidedColor = currentColor[i]
      const isBlank = currentColor[i] === blank

      if (column.every(number => currentColor[number] === decidedColor && !isBlank)) {
        setScore((perv) => perv + 4)
        column.forEach(number => currentColor[number] = blank)
        return true
      }

    }
  }
  //!  checking row possibility
  const checkRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const row = [i, i + 1, i + 2]
      const decidedColor = currentColor[i]
      const isBlank = currentColor[i] === blank

      if (notValid.includes(i)) continue

      if (row.every(number => currentColor[number] === decidedColor && !isBlank)) {
        setScore((perv) => perv + 3)
        row.forEach(number => currentColor[number] = blank)
        return true
      }

    }
  }

  const checkRowOfFour = () => {
    for (let i = 0; i < 39; i++) {
      const row = [i, i + 1, i + 2, i + 3]
      const decidedColor = currentColor[i]
      const isBlank = currentColor[i] === blank

      if (notValidFour.includes(i)) continue

      if (row.every(number => currentColor[number] === decidedColor && !isBlank)) {
        setScore((perv) => perv + 4)
        row.forEach(number => currentColor[number] = blank)
        return true
      }
    }
  }

  // ! check for empty cel and fill it with above color
  const moveIntoBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]

      if (firstRow.includes(i) && currentColor[i] === blank) {
        let randomNumber = Math.floor(Math.random() * candyColors.length)
        currentColor[i] = candyColors[randomNumber]
      }

      if ((currentColor[i + widthBoard]) === blank) {
        currentColor[i + widthBoard] = currentColor[i]
        currentColor[i] = blank
      }

    }
  }

  // ! drag and drop functions

  const dragStart = (e) => {
    setDragged(e.target)
  }

  const dragDrop = (e) => {
    setReplaced(e.target)
  }

  const dragEnd = (e) => {

    const replaceId = replaced.getAttribute('data-id')
    const draggedId = dragged.getAttribute('data-id')




    currentColor[replaceId] = dragged.getAttribute('src')
    currentColor[draggedId] = replaced.getAttribute('src')

    const validMoves = [
      draggedId - 1,
      draggedId - widthBoard,
      Number(draggedId) + 1,
      Number(draggedId) + widthBoard,
    ]

    const validMove = validMoves.includes(Number(replaceId))



    if (Number(replaceId) &&
      validMove &&
      (checkColumnOfFour() || checkRowOfFour() || checkColumnOfThree() || checkRowOfThree())
    ) {

      setDragged(null)
      setReplaced(null)
    } else {
      currentColor[replaceId] = replaced.getAttribute('src')
      currentColor[draggedId] = dragged.getAttribute('src')
      setCurrentColor([...currentColor])

    }

  }


  // !create board
  const createBoard = () => {
    const randomColorArrangement = []
    for (let i = 0; i < widthBoard * widthBoard; i++) {
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArrangement.push(randomColor)
    }
    setCurrentColor(randomColorArrangement)
    setScore(0)
  } 

  useEffect(() => {
    createBoard()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      checkColumnOfFour()
      checkRowOfFour()
      checkColumnOfThree()
      checkRowOfThree()
      moveIntoBelow()
      setCurrentColor([...currentColor])
    }, 200);

    return () => clearInterval(timer)

  }, [checkColumnOfFour, checkRowOfFour, checkColumnOfThree, checkRowOfThree, moveIntoBelow, currentColor])


  return (
    <div className="app">
      <div className="game">
        {currentColor.map((candy, index) => (
          <img
            src={candy}
            alt={index}
            key={index}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={score} />
    </div>
  )
}

export default App
