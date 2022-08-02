class Assist {
    constructor() {
        this.name = 'Assist'
        this.orangeAssists= null
        this.blueAssists = null
        this.actor = null
        this.myAssists = null
    }

    handle(gameData, eventEmitter) {
        let team;
        if (this.orangeAssists === null || this.blueAssists === null) {
            this.blueAssists = gameData.blueTeam.assists
            this.orangeAssists = gameData.orangeTeam.assists
            return
        }
        if (this.orangeAssists != gameData.orangeTeam.assists || this.blueAssists != gameData.blueTeam.assists) {
            if(this.orangeAssists != gameData.orangeTeam.assists) {
                if(this.myteam !== 'orange') {
                    this.actor = 'notMyTeam'
                } else {
                    this.actor = 'myTeam'
                }
            }

            if(this.blueAssists != gameData.blueTeam.assists) {
                if(this.myteam !== 'blue') {
                    this.actor = 'notMyTeam'
                } else {
                    this.actor = 'myTeam'
                }
            }

            if(gameData.myteam === 'blue') {
                team = 0
            } else if(gameData.myteam === 'orange') {
                team = 1
            }

            this.data = {
                speed:Math.ceil(gameData.lastscore.disc_speed),
                dist:Math.ceil(gameData.distance_thrown),
            }

            gameData.teams[team].players.forEach(player => {
                if(player.name === gameData.me) {
                    if(this.myAssists !== null && player.stats.assists !== this.data) {
                        this.myAssists = player.stats.assists
                        this.actor = 'me'
                    }
                }
            });

            this.blueAssists = gameData.blueTeam.assists
            this.orangeAssists = gameData.orangeTeam.assists

            eventEmitter.send('game.assist', {name:this.name,actor:this.actor, data:this.data});
        }
    }
}

module.exports = Assist
