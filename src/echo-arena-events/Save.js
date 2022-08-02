class Save {
    constructor() {
        this.name = 'Save'
        this.orangeSaves = null
        this.blueSaves= null
        this.mySaves = null
        this.actor = null
    }

    handle(gameData, eventEmitter) {
        let team;
        if (this.orangeSaves === null || this.blueSaves === null) {
            this.blueSaves = gameData.blueTeam.saves
            this.orangeSaves = gameData.orangeTeam.saves
            return
        }
        if (this.orangeSaves != gameData.orangeTeam.saves || this.blueSaves != gameData.blueTeam.saves) {
            if(this.orangeSaves != gameData.orangeTeam.saves) {
                if(this.myteam !== 'orange') {
                    this.actor = 'notMyTeam'
                } else {
                    this.actor = 'myTeam'
                }
            }

            if(this.blueSaves != gameData.blueTeam.saves) {
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

            gameData.teams[team].players.forEach(player => {
                if(player.name === gameData.me) {
                    if(this.mySaves !== null && player.stats.saves !== this.mySaves) {
                        this.mySaves = player.stats.saves
                        this.actor = 'me'
                    }
                }
            });

            this.blueSaves = gameData.blueTeam.saves
            this.orangeSaves = gameData.orangeTeam.saves
            
            eventEmitter.send('game.scoreChanged', {name:this.name,actor:this.actor, data:this.mySaves});
        }
    }
}

module.exports = Save
