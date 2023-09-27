const Gameboard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""];

    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            boardHTML += `<div class = "square" id="square-${index}">${square}</div>`;
        });
        document.querySelector("#gameboard").innerHTML = boardHTML;
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
        });
    }

    const update = (index, value) => {
        gameboard[index] = value;
        render();
    }

    const getGameboard = () => gameboard;

    const checkForWin = () => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i=0; i<winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (gameboard[a] && gameboard[a] === gameboard[b] && gameboard[a] === gameboard[c]){
                return true;
            }
        }
        return false;
    }

    const checkForTie = () => {
        return gameboard.every(element => element !== "");
    }

    return {
        render,
        update,
        getGameboard,
        checkForWin,
        checkForTie,
    }

})();


const createPlayer = (name, mark) => {
    return {
        name,
        mark
    }
}


const Game = (() => {
    let players =[];
    let currentPlayerIndex;
    let gameOver;
    const message = document.querySelector("#message");
    const result = document.querySelector("#result");

    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O")
        ];
        currentPlayerIndex = 0;
        result.textContent = `${players[currentPlayerIndex].name}'s turn`;
        gameOver = false;
        Gameboard.render();
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", handleClick);
        });
    }

    const handleClick = (event) => {
        let index = parseInt(event.target.id.split("-")[1]);

        if (Gameboard.getGameboard()[index] !== "" || gameOver === true) {
            return
        }

        Gameboard.update(index, players[currentPlayerIndex].mark);

        if (Gameboard.checkForWin()) {
            gameOver = true;
            message.textContent = `Congratulations! ${players[currentPlayerIndex].name} won!`;
            message.classList.add("win");
            result.textContent = `THE END`;
        }else if (Gameboard.checkForTie()) {
            gameOver = true;
            message.textContent = `It's a tie!`;
            message.classList.add("tie");
            result.textContent = `THE END`;
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        if (gameOver !== true) {
            result.textContent = `${players[currentPlayerIndex].name}'s turn`;
        }
        
    }

    const restart = () => {
        for (let i=0; i<9; i++) {
            Gameboard.update(i, "");
        }
        Gameboard.render();
        gameOver = false;
        currentPlayerIndex = 0;
        result.textContent = `${players[currentPlayerIndex].name}'s turn`;
        message.textContent = "";
        message.classList.remove("tie");
        message.classList.remove("win");
    }

    return {
        start,
        handleClick,
        restart,
    }

})();




const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
    Game.restart();
});


const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
    Game.start();
});