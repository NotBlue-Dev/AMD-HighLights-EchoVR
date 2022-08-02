class ScoreChanged {
    constructor() {
        this.name = 'Score'
        this.orangePoints = null
        this.bluePoints = null
        this.actor = null
    }

    handle(gameData, eventEmitter) {
        if (this.orangePoints === null || this.bluePoints === null) {
            this.bluePoints = gameData.blueTeam.points
            this.orangePoints = gameData.orangeTeam.points
            return
        }
        if (this.orangePoints != gameData.orangeTeam.points || this.bluePoints != gameData.blueTeam.points) {
            this.bluePoints = gameData.blueTeam.points
            this.orangePoints = gameData.orangeTeam.points

            if(gameData.team === gameData.myteam) this.actor = 'myTeam'
            if(gameData.team !== gameData.myteam) this.actor = 'notMyTeam'
            if(gameData.person_scored === gameData.me) this.actor = 'me'

            this.data = {
                speed:Math.ceil(gameData.lastscore.disc_speed),
                dist:Math.ceil(gameData.distance_thrown),
            }

            gameData.scoreData = {blue: this.bluePoints, orange: this.orangePoints}
            eventEmitter.send('game.scoreChanged', {name:this.name,actor:this.actor, data:this.data});
        }
    }
}

module.exports = ScoreChanged
