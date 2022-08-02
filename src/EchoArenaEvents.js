const Assist = require("./echo-arena-events/Assist");
const Save = require("./echo-arena-events/Save");
const ScoreChanged = require("./echo-arena-events/ScoreChanged");

module.exports = [
    new Assist(),
    new Save(),
    new ScoreChanged()
]
