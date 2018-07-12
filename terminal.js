console.log("terminal.js connected.");

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return JSON.stringify(this);
    }

    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }
}

class Hex {
    // Take in an array of strings ex. [ul,l,dl]
    constructor(linePositions) {
        const validLinePositions = ["ul", "ur", "l", "r", "dl", "dr"];
        this.linePositions = []; // Not to be confused with the passed array
        this.position;

        function validateLinePositions() {
            let linePositionIsValid;

            for (let i = 0; i < linePositions.length; i++) {
                linePositionIsValid = false;
                for (let j = 0; j < validLinePositions.length; j++) {
                    if (linePositions[i] == validLinePositions[j])
                        linePositionIsValid = true;
                }

                if (!linePositionIsValid)
                    throw new Error("Line position is invalid.");
            }
        }

        try {
            validateLinePositions();
            this.linePositions = linePositions;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // Ughhh hardcoded stuff. Maybe rethink how you label linePositions. Use numbers?
    // Try to dynamically turn the Hex. Add or subtract numbers?
    turnClockwise() {
        for (let i = 0; i < this.linePositions.length; i++) {
            switch (this.linePositions[i]) {
                case "ul":
                    this.linePositions[i] = "ur";
                    break;
                case "ur":
                    this.linePositions[i] = "r";
                    break;
                case "l":
                    this.linePositions[i] = "ul";
                    break;
                case "r":
                    this.linePositions[i] = "dr";
                    break;
                case "dl":
                    this.linePositions[i] = "l";
                    break;
                case "dr":
                    this.linePositions[i] = "dl";
            }
        }
    }

    // Merge with TurnClockwise() into single turn function?
    // Determine what feels nicer to work with later. 
    turnCounterClockwise() {
        for (let i = 0; i < this.linePositions.length; i++) {
            switch (this.linePositions[i]) {
                case "ul":
                    this.linePositions[i] = "l";
                    break;
                case "ur":
                    this.linePositions[i] = "ul";
                    break;
                case "l":
                    this.linePositions[i] = "dl";
                    break;
                case "r":
                    this.linePositions[i] = "ur";
                    break;
                case "dl":
                    this.linePositions[i] = "dr";
                    break;
                case "dr":
                    this.linePositions[i] = "r";
            }
        }
    }
}

// Code is quick and dirty right now. Validate stuff later.
class HackPattern {
    // Takes in a pattern
    // Validate the arrayOfHexes?
    constructor(arrayOfHexes) {
        let rows = 3;
        let minHexCount = 2;
        let maxHexCount = 7;
        let columns = minHexCount;
        let middleRow = Math.floor(rows / 2);

        this.hexes = [];

        if (!arrayOfHexes || arrayOfHexes.length > maxHexCount || arrayOfHexes < minHexCount)
            throw new Error("Invalid number of Hexes allowed in a HackPattern.");

        // Build the hex matrix
        for (let i = 0; i < rows; i++) {
            if (i < middleRow)
                this.hexes.push(new Array(columns++));
            else if (i == middleRow)
                this.hexes.push(new Array(columns));
            else
                this.hexes.push(new Array(--columns));
        }

        // Populate the hex matrix
        let i = 0;
        for (let y = 0; y < this.hexes.length; y++) {
            for (let x = 0; x < this.hexes[y].length; x++) {
                this.hexes[y][x] = arrayOfHexes[i];
                this.hexes[y][x].position = new Vector(x, y);
                i++;
            }
        }

        //console.log(this);
    }

    getHex(vector) {
        try {
            this.checkIfHexExists(vector);
            return this.hexes[vector.y][vector.x];
        } catch (error) {
            console.log(error);
            throw new Error("Couldn't get Hex.");
        }
    }

    checkIfHexExists(vector) {
        if (this.hexes[vector.y][vector.x])
            return true;
        else
            throw new Error("Hex does not exist at " + vector.toString() + ".");
    }

    forEach(cb, mode) {
        if (typeof cb != "function")
            return false;

        for (let y = 0; y < this.hexes.length; y++) {
            for (let x = 0; x < this.hexes[y].length; x++) {
                // End immediately if cb returns false
                if (mode == "position")
                    cb(x, y);
                else
                    cb(this.getHex(new Vector(x, y)));
            }
        }
    }

    checkIfSolved() {
        let result;
        let middleRow = Math.floor(this.hexes.length / 2);

        let answerSheet;

        // return T/F value for forEach()?
        try {
            this.forEach((x, y) => {
                // Find way to end function immediately.
                if (y < middleRow) {
                    answerSheet = {
                        // currentHex: neighboringHex
                        "ul": { target: "dr", vector: new Vector(-1, -1) },
                        "ur": { target: "dl", vector: new Vector(0, -1) },
                        "l": { target: "r", vector: new Vector(-1, 0) },
                        "r": { target: "l", vector: new Vector(1, 0) },
                        "dl": { target: "ur", vector: new Vector(0, 1) },
                        "dr": { target: "ul", vector: new Vector(1, 1) },
                    }
                } else if (y == middleRow) {
                    answerSheet = {
                        // currentHex: neighboringHex
                        "ul": { target: "dr", vector: new Vector(-1, -1) },
                        "ur": { target: "dl", vector: new Vector(0, -1) },
                        "l": { target: "r", vector: new Vector(-1, 0) },
                        "r": { target: "l", vector: new Vector(1, 0) },
                        "dl": { target: "ur", vector: new Vector(-1, 1) },
                        "dr": { target: "ul", vector: new Vector(0, 1) },
                    }
                } else {
                    answerSheet = {
                        // currentHex: neighboringHex
                        "ul": { target: "dr", vector: new Vector(0, -1) },
                        "ur": { target: "dl", vector: new Vector(1, -1) },
                        "l": { target: "r", vector: new Vector(-1, 0) },
                        "r": { target: "l", vector: new Vector(1, 0) },
                        "dl": { target: "ur", vector: new Vector(-1, 1) },
                        "dr": { target: "ul", vector: new Vector(0, 1) },
                    }
                }

                if (!this.checkConnections(this.getHex(new Vector(x, y)), answerSheet)) {
                    throw false;
                }
                result = true;
            }, "position");
        } catch {
            result = false;
        }

        console.log("Solved:", result);
        return result;
    }

    checkConnections(hex, answerSheet) {
        let neighboringHex;
        let line;
        let connectionsEstablished = 0;
        let isConnected = false;

        //connectionsEstablished = 0;
        for (let i = 0; i < hex.linePositions.length; i++) {
            line = hex.linePositions[i];
            //console.log("line:", line);
            try {
                neighboringHex = this.getHex(hex.position.add(answerSheet[line].vector));
                for (let j = 0; j < neighboringHex.linePositions.length; j++) {
                    if (neighboringHex.linePositions[j] == answerSheet[line].target)
                        connectionsEstablished++;
                }
            } catch (error) {
                console.log(error);
                return false;
            }
            if (connectionsEstablished == hex.linePositions.length) {
                //console.log(hex, "is connected.");
                //console.log(connectionsEstablished + "/" + hex.linePositions.length);
                isConnected = true;
            }
        }

        return isConnected;
    }

    turnHex(vector, direction){
        if(direction == "counter-clockwise" || direction == "ccw"){
            this.getHex(vector).turnCounterClockwise();
        } else {
            this.getHex(vector).turnClockwise();
        }
        this.checkIfSolved();
    }
}