const events = require('./EchoArenaEvents')
const fetch = require('node-fetch');
const GameData = require("./gameData");

class EchoArena {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter
        this.fails = 0
    }
    
    async listen() {
        return this.testConnection().then(this.request.bind(this)).catch(console.error)
    }

    async testConnection() {
        try {
            let data = await fetch(`http://127.0.0.1:6721/session`)
            this.eventEmitter.send('echoArena.connected')
            return true
        } catch(error) {
            if (error.response) {
                this.eventEmitter.send('echoArena.connected', {error})
                return true
            } else {
                this.eventEmitter.send('echoArena.failed', {error})
                throw new Error();
            }
        }
    }

    async request() {
        fetch(`http://127.0.0.1:6721/session`).then(resp => resp.json()).then(json => {
            const gameData = new GameData(json)
            events.forEach((event) => {
                
                event.handle(gameData, this.eventEmitter)
            })
            this.request()
        }).catch(error => {
            console.log(error)
            if (error.response) {
                if (error.response.status === 404) {
                    this.eventEmitter.send('echoArena.notFound')
                } else {
                    this.eventEmitter.send('echoArena.requestError', {
                        status: error.response.status
                    })
                }
            } else if (error.request) {
                this.eventEmitter.send('echoArena.refused')
                this.fails++
            } else {
                this.eventEmitter.send('echoArena.error', {error});
                this.fails++
            }
            if (this.fails < 5) {
                setTimeout(() => {
                    this.request()
                }, 500);
            } else {
                this.eventEmitter.send('echoArena.disconnected');
                setTimeout(() => {
                    this.request()
                }, 2000);
            }
        })
    }
}

module.exports = EchoArena
