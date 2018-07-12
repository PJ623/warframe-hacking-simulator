let container = document.getElementById("container");
let statusMessage = document.getElementById("status-message");
// TODO: randomly generate solvable HackPatterns.
let hp = new HackPattern([new Hex(["r", "dr"]), new Hex(["l", "dl", "dr"]),
new Hex(["r", "dr"]), new Hex(["ul", "ur", "l", "r", "dl"]), new Hex(["r", "dr"]),
new Hex(["ur", "r", "ul"]), new Hex(["r"])]);

function bindHackPatternToControls(hackPattern) {
    let prevY;

    hackPattern.forEach((x, y) => {
        if (prevY != y)
            container.appendChild(document.createElement("br"));

        let hexButton = document.createElement("button");
        hexButton.dataset.position = new Vector(x, y);
        hexButton.textContent = hackPattern.getHex(new Vector(x, y)).linePositions;

        hexButton.addEventListener("click", () => {
            let position = JSON.parse(hexButton.dataset.position);
            position = new Vector(position.x, position.y);
            hackPattern.turnHex(position);
            hexButton.textContent = hackPattern.getHex(new Vector(x, y)).linePositions;
            
            if (hp.checkIfSolved())
                statusMessage.textContent = "Puzzle is solved!";
            else
                statusMessage.textContent = "Puzzle is unsolved.";
        });

        container.appendChild(hexButton);
        prevY = y;
    }, "position");
}

// Check to see if already starts solved:
if (hp.checkIfSolved())
    statusMessage.textContent = "Puzzle is solved!";
else
    statusMessage.textContent = "Puzzle is unsolved.";

bindHackPatternToControls(hp);