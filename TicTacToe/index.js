
window.onload = function () {
    const board = document.querySelector('.board')
    const scoreBoard = document.querySelector('.score-board')

    const onFirstLoad = () => {
        let i = localStorage.length > 10 ? localStorage.length - 10 : 0

        for (i; i <  localStorage.length; i++) {
            const row = document.createElement('tr')
            const winner = document.createElement('td')
            const turns = document.createElement('td')
            const player = localStorage.getItem(i)

            winner.innerText = player[0]
            turns.innerText = player[1]
            
            row.append(winner, turns)
            scoreBoard.append(row)
        }

        for (let e = 0; e < 9; e++) {
            const boardCell = document.createElement('button')
            boardCell.classList.add('cell')

            board.append(boardCell)
        }
    }

    onFirstLoad()

    const cells = document.querySelectorAll('.cell')
    const icon = document.querySelectorAll('#icon')
    const winnerPanel = document.querySelector('.winner')
    const reset = document.querySelector('.reset')
    const score = document.querySelector('.score')
    const click = document.createElement('audio')

    click.src = './assets/sounds/click.mp3'

    let xTurn = true
    let turnsCount = 0
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const addPlayerTurn = (button, player) => button.classList.add(player)

    const changeCellState = (button) => {
        turnsCount += 1

        if (xTurn) {
            addPlayerTurn(button, 'xEvent')
            xTurn = false
        } else {
            addPlayerTurn(button, 'oEvent')
            xTurn = true
        }
    }
    
    const setWinner = (player) => {
        const winnerLine = document.createElement('p')
        winnerLine.innerText = `'${player.toUpperCase()}' won! It took ${turnsCount} steps to win!`
        winnerPanel.append(winnerLine)

        localStorage.setItem(localStorage.length, player + `${turnsCount}`)
        insertWinnerToScoreList()
    }
    
    const checkWin = (player) => {
        return winningCombinations.some((combination) => {
            return combination.every((i) => {
                return cells[i].classList.contains(player);
            });
        });
    };

    const drawOutput = () => {
        const winnerLine = document.createElement('p')
        winnerLine.innerText = 'Draw!'
        winnerPanel.append(winnerLine)
    }

    const resetGame = () => {
        turnsCount = 0
        xTurn = true

        cells.forEach(elem => {
            elem.disabled = false
            elem.classList.contains('xEvent') ? elem.classList.remove('xEvent') : elem.classList.remove('oEvent')
        })

        if (winnerPanel.firstChild) winnerPanel.firstChild.remove()

    }

    const isDraw = () => {
        return [...cells].every((cell) => {
            return (
            cell.classList.contains("xEvent") || cell.classList.contains("oEvent")
            );
        });
    };

    const insertWinnerToScoreList = () => {
        const row = document.createElement('tr')
        const winner = document.createElement('td')
        const turns = document.createElement('td')
        let i = localStorage.length > 10 ? localStorage.length - 10 : 0

        for (i; i <  localStorage.length; i++) {
            const player = localStorage.getItem(i)
            winner.innerText = player[0]
            turns.innerText = player[1]

            row.append(winner, turns)
        }

        scoreBoard.append(row)
    }

    const scoreShow = () => {
        scoreBoard.classList.toggle('disabled')
    }

    const disableButtons = () => cells.forEach(elem => elem.disabled = true)

    cells.forEach(elem => elem.addEventListener('click', () => {
        const currentPlayer = xTurn ? 'xEvent' : 'oEvent';
        const formatPlayer = xTurn ? 'x' : 'o'
        click.pause()
        click.currentTime = 0
        click.play()

        changeCellState(elem)

        if (checkWin(currentPlayer)) {
            setWinner(formatPlayer)
            disableButtons()
        } else if (isDraw()) {
            drawOutput()
            disableButtons()
        }
    }))

    reset.addEventListener('click', () => resetGame())

    score.addEventListener('click', () => scoreShow())

}