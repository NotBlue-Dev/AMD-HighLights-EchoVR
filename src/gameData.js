class GameData {
    constructor(json) {
        // this.me = json.client_name
        this.me='Nxy-'
        this.myteam = 'blue'
        this.timestamp = Date.now()
        this.clock = json.game_clock
        this.teams = json.teams
        this.sessionID = json.sessionid
        this.roundData = []
        this.betweenRound = false
        this.blueTeam = {
            blueTeamPlayers: [],
            blueReset: (json.blue_team_restart_request > 0),
            teamData:[],
            playerStats:[],
            playerPosition:[],
            playerPing:[],
            points:json.blue_points,
            saves:null,
            assists:null
        }
        if(json.teams[0].players !== undefined) {
            this.blueTeam.saves = json.teams[0].stats.saves
            this.blueTeam.assists = json.teams[0].stats.assists
        }

        this.blueTeam.blueTeamPlayers = json.teams[0].players
        this.orangeTeam = {
            orangeTeamPlayers :[],
            orangeReset :(json.orange_team_restart_request > 0),
            teamData:[],
            playerStats:[],
            playerPosition:[],
            playerPing:[],
            points:json.orange_points,
            saves:null,
            assists:null
        }

        if(json.teams[1].players !== undefined) {
            this.orangeTeam.saves = json.teams[1].stats.saves
            this.orangeTeam.assists = json.teams[1].stats.assists
        }
        this.scoreData = {blue:this.blueTeam.points, orange:this.orangeTeam.points}
        this.orangeTeam.orangeTeamPlayers=json.teams[1].players
        this.discPosition = [json.disc.position[0], json.disc.position[2]]
        
        this.lastscore = json.last_score;
        this.point_amount = this.lastscore.point_amount
        this.person_scored = this.lastscore.person_scored
        this.assist_scored = this.lastscore.assist_scored
        this.team = this.lastscore.team
        
        
        this.distance_thrown = json.last_score.distance_thrown
        this.round = json.blue_round_score + json.orange_round_score + 1
        this.totalRound = json.total_round_count

        if (this.blueTeam.blueTeamPlayers === undefined && this.orangeTeam.orangeTeamPlayers === undefined) {
            return
        }

        if(this.blueTeam.blueTeamPlayers.length !== 0 && this.blueTeam.blueTeamPlayers !== undefined) {
            for (let player of this.blueTeam.blueTeamPlayers) {
                if(player.name === this.me) this.myteam = 'blue'
                player.stats.possession_time = Math.round(player.stats.possession_time)
                this.blueTeam.playerStats.push({name:player.name, stats:player.stats, stunned:player.stunned})
                this.blueTeam.teamData.push(player.name)
                this.blueTeam.playerPosition.push({name:player.name, position:[player.head.position[0],player.head.position[2]], nb:player.number})
                this.blueTeam.playerPing.push({name: player.name, ping: player.ping, handL: player.holding_left, handR: player.holding_right})
            }
        }
 
        if(this.orangeTeam.orangeTeamPlayers !== 0 && this.orangeTeam.orangeTeamPlayers !== undefined) {
            for (let player of this.orangeTeam.orangeTeamPlayers) {
                if(player.name === this.me) this.myteam = 'orange'
                player.stats.possession_time = Math.round(player.stats.possession_time)
                this.orangeTeam.playerStats.push({name:player.name, stats:player.stats, stunned:player.stunned})
                this.orangeTeam.teamData.push(player.name)
                this.orangeTeam.playerPosition.push({name:player.name, position:[player.head.position[0],player.head.position[2]], nb:player.number})
                this.orangeTeam.playerPing.push({name: player.name, ping: player.ping, handL: player.holding_left, handR: player.holding_right})
            }
        }

        this.status = json.game_status;
        this.clockDisplay = json.game_clock_display;
        this.matchType = json.match_type
        
    }

    isInMatch() {
        return this.matchType === 'Echo_Arena' || this.matchType === 'Echo_Arena_Private'
    }

    isPlaying() {
        return this.status === 'playing'
    }
}

module.exports = GameData
