const ConfigLoader = require('./ConfigLoader')
const EchoArena = require('./EchoArena')
const events = require('./EchoArenaEvents.js')
const EventHandler = require('./EventHandler')

class reLivePlayer {
    constructor(rootPath, eventEmitter) {
        this.configLoader = new ConfigLoader(rootPath)
        this.globalConfig = this.configLoader.load();
        this.eventEmitter = eventEmitter
        this.eventEmitter.send('config.loaded', this.globalConfig)
        this.eventHandler = null
        this.echoArena = null
        this.config = this.globalConfig.echoArena
    }

    async start() {
        this.initializeListeners()
    }

    initializeListeners() {
        
        this.eventEmitter.send('config.configLoaded', this.globalConfig)

        this.eventEmitter.on('echoArena.connected', (args, event) => {
            console.log('connect') 
        }) 

        this.eventEmitter.on('echoArena.connectionFailed', (args, event) => {
            console.log(args) 
        }) 

        this.connectEchoArena().then(() => {
            this.eventEmitter.send('echoArena.connected', args)
        }).catch((error) => {
            this.eventEmitter.send('echoArena.connectionFailed', {
                error
            })
            
        })

        this.eventEmitter.on('config.events', (args, event) => {
            this.globalConfig.game = {
                ...this.globalConfig.game,
                ...args
            }
            console.log(args)
            this.configLoader.save(this.globalConfig)
        })

        this.eventEmitter.send('echoArena.eventsLoaded', {
            events: events.map(event => event.name)
        }) 

        this.eventEmitter.on('config.scope', (args, event) => {
            this.globalConfig.scope = args.scope
            this.configLoader.save(this.globalConfig)
        })

        this.eventEmitter.on('config.path', (args, event) => {
            this.globalConfig.path = args.path
            this.configLoader.save(this.globalConfig)
        })

        this.eventEmitter.on('config.shortcut', (args, event) => {
            this.globalConfig.shortcut = args.shortcut
            this.configLoader.save(this.globalConfig)
        })
    }

    connectEchoArena() {
        return new Promise((resolve,reject) => {
            this.eventHandler = new EventHandler(this.eventEmitter, this.globalConfig)
            this.echoArena = new EchoArena(this.eventEmitter)
            this.echoArena.listen()
        })
    }

}

module.exports = reLivePlayer