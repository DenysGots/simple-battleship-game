/* TASK 12 */

const shipBattleGame = function(): void {
    let model: any = {};
    let controller: any = {};
    let view: any = {};

    controller.randCoordinate = function() {
        return Math.round(Math.abs(Math.random() * model.boardSize - 1));
    };

    controller.checkCoordinateValidity = function(x, y) {
        return (model.possibleShipsLocations.some(obj => {
            return (obj === ([x, y].join('')));
        }));
    };

    controller.generateShipsPositions = function() {
        for (let i = 0; i < model.boardSize; i += 1) {
            for (let j = 0; j < model.boardSize; j += 1) {
                model.possibleShipsLocations.push([i, j].join(''));
            };
        };

        for (let i = 0; i < model.numShips; i += 1) {
            let randPositionX: number = controller.randCoordinate();
            let randPositionY: number = controller.randCoordinate();
            let possibleMinX: number;
            let possibleMaxX: number;
            let possibleMinY: number;
            let possibleMaxY: number;

            model.ships.push([]);

            if (model.boardSize === 3 && randPositionX === 1 && randPositionY === 1) {
                randPositionX = controller.randCoordinate();
                randPositionY = controller.randCoordinate();
            };

            for (; !controller.checkCoordinateValidity(randPositionX, randPositionY);) {
                randPositionX = controller.randCoordinate();
                randPositionY = controller.randCoordinate();
            };

            model.ships[i] = [randPositionX, randPositionY];

            possibleMinX = ((model.ships[i][0] - 1) > 0) ? (model.ships[i][0] - 1) : 0;
            possibleMaxX = ((model.ships[i][0] + 1) > (model.boardSize - 1)) ? (model.ships[i][0]) : (model.ships[i][0] + 1);
            possibleMinY = ((model.ships[i][1] - 1) > 0) ? (model.ships[i][1] - 1) : 0;
            possibleMaxY = ((model.ships[i][1] + 1) > (model.boardSize - 1)) ? (model.ships[i][1]) : (model.ships[i][1] + 1);

            for (let i = possibleMinX; i <= possibleMaxX; i += 1) {
                for (let j = possibleMinY; j <= possibleMaxY; j += 1) {
                    model.inaccessibleLocations.push([i, j].join(''));
                };
            };

            for (let i = 0, length = model.possibleShipsLocations.length; i < length; i += 1) {
                for (let j = 0, length = model.inaccessibleLocations.length; j < length; j += 1) {
                    if (model.possibleShipsLocations[i] === model.inaccessibleLocations[j]) {
                        model.possibleShipsLocations.splice(i, 1);
                    };
                };
            };
        };
    };

    controller.setHandlers = function() {
        controller.listener = function(e) {
            let cellCoordinate: string = e.target.getAttribute("data-coordinate");

            controller.currentCoordinate = cellCoordinate.split('');

            model.attempts += 1;

            model.ships.forEach(obj => {
                if (obj.join('') !== controller.currentCoordinate.join('')) {
                    view.message.innerHTML = `Miss!`;

                    e.target.classList.add("missCell", "inactiveCell");
                    e.target.removeAttribute("data-has-listener");
                    e.target.removeEventListener("click", controller.listener, false);
                } else {
                    view.message.innerHTML = `Hit!`;

                    model.hits -= 1;

                    model.ships.splice(model.ships.indexOf(obj), 1);

                    e.target.classList.add("hitCell", "inactiveCell");
                    e.target.removeAttribute("data-has-listener");
                    e.target.removeEventListener("click", controller.listener, false);
                };
            });

            if (model.hits === 0) {
                controller.endGame();
            };

            e.preventDefault();
            e.stopPropagation();
        };

        view.cells.forEach(obj => {
            obj.addEventListener("click", controller.listener, false);
            obj.setAttribute("data-has-listener", "true");
        });

        view.restartGameButton.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            return location.reload();
        }, false);
    };

    controller.createBoard = function () {
        view.createBoardButton.addEventListener("click", function (e) {
            let boardSize: number = parseInt(view.createBoardSize.value);

            if (isNaN(boardSize) || boardSize < 2 || boardSize > 9) {
                alert(`You've entered wrong input. Please try again!`);

                return location.reload();
            };

            model.boardSize = boardSize;

            controller.startGame();

            e.preventDefault();
            e.stopPropagation();
        }, false);
    };

    controller.startGame = function() {
        controller.createBoard();

        model.numShips = model.boardSize - 1;
        model.possibleShipsLocations = [];
        model.inaccessibleLocations = [];
        model.ships = [];
        model.hits = model.numShips;
        model.attempts = 0;

        view.generateBoard();

        view.createBoardSection.classList.add("hidden");
        view.gameDescriptionSection.classList.add("hidden");

        view.mainSection.classList.remove("hidden");
        view.messageField.classList.remove("hidden");

        controller.generateShipsPositions();
        controller.setHandlers();
    };

    controller.endGame = function() {
        view.message.innerHTML = `You won! <br> Number of attempts = ${model.attempts}`;

        view.cells.forEach(obj => {
            if (obj.hasAttribute("data-has-listener")) {
                obj.removeEventListener("click", controller.listener, false);
            };

            if (!obj.classList.contains("inactiveCell")) {
                obj.classList.add("inactiveCell");
            };
        });

        view.restartGameSection.classList.remove("hidden");
    };

    view.createBoardSize = document.getElementsByClassName("create-board_text-field")[0];

    view.createBoardButton = document.getElementsByClassName("create-board_button")[0];

    view.restartGameButton = document.getElementsByClassName("restart-button")[0];

    view.generateBoard = function () {
        let fragment = document.createDocumentFragment();
        let emptyCell = document.createElement("div");
        let gridColumns: string = "";

        view.board = document.getElementsByClassName("board")[0];
        view.message = document.getElementsByClassName("message")[0];
        view.gameDescriptionSection = document.getElementsByClassName("game-description")[0];
        view.mainSection = document.getElementsByClassName("main")[0];
        view.messageField = document.getElementsByClassName("message-field")[0];
        view.createBoardSection = document.getElementsByClassName("create-board")[0];
        view.restartGameSection = document.getElementsByClassName("restart-button-container")[0];

        view.gridSize = model.boardSize + 1;

        emptyCell.classList.add("emptyCell");
        fragment.appendChild(emptyCell);

        for (let i = 0; i < view.gridSize; i += 1) {
            gridColumns += "max-content ";
        };

        for (let i = 0; i < (view.gridSize - 1); i += 1) {
            let coordinateCell = document.createElement("div");
            let coordinateCellContent = document.createElement("p");
            let coordinateCellNumber: number = i + 1;

            coordinateCell.classList.add("coordinateCell");
            coordinateCellContent.classList.add("coordinateCellContent");
            coordinateCellContent.innerHTML = coordinateCellNumber;

            coordinateCell.appendChild(coordinateCellContent);
            fragment.appendChild(coordinateCell);
        };

        for (let i = 0; i < (view.gridSize - 1); i += 1) {
            let coordinateCell = document.createElement("div");
            let coordinateCellContent = document.createElement("p");
            let coordinateCellNumber: number = i + 1;

            coordinateCell.classList.add("coordinateCell");
            coordinateCellContent.classList.add("coordinateCellContent");
            coordinateCellContent.innerHTML = coordinateCellNumber;

            coordinateCell.appendChild(coordinateCellContent);
            fragment.appendChild(coordinateCell);

            for (let j = 0; j < (view.gridSize - 1); j += 1) {
                let boardCell = document.createElement("div");
                boardCell.classList.add("cell");
                boardCell.setAttribute("data-coordinate", `${i}${j}`)
                fragment.appendChild(boardCell);
            };
        };

        view.board.appendChild(fragment);

        view.board.style.gridTemplateColumns = gridColumns;

        view.cells = Array.from(document.getElementsByClassName("cell"));

        view.message.innerHTML = `Choose a cell and click on it`;
    };

    controller.createBoard();
};

shipBattleGame();