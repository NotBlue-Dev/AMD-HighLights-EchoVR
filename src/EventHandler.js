const robot = require("robotjs");
robot.setKeyboardDelay(0)
const fs = require("fs");
const path = require("path");

class EventHandler {
    
    constructor(eventEmitter, config) {
        this.eventEmitter = eventEmitter
        this.config = config
        this.listenGameEvents()
    }

    getMostRecentFile = (dir) => {
        const files = this.orderReccentFiles(dir);
        return files.length ? files[0] : undefined;
    };

    orderReccentFiles = (dir) => {
        return fs.readdirSync(dir)
        .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
        .map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    };

    checkForScopeAndSave(args, scope, event) {
        console.log(args,scope,event)
        setTimeout(() => {
            if(args.actor === 'me' && scope == 2) {
                this.config.shortcut.forEach(key => {
                    robot.keyToggle(key, 'down')
                });
                setTimeout(() => {
                    this.config.shortcut.forEach(key => {
                        robot.keyToggle(key, 'up')
                    });
                }, 100);
            }
            if(args.actor === 'myTeam' && scope == 1) {
                this.config.shortcut.forEach(key => {
                    robot.keyToggle(key, 'down')
                });
                setTimeout(() => {
                    this.config.shortcut.forEach(key => {
                        robot.keyToggle(key, 'up')
                    });
                }, 100);
            }
            if(args.actor === 'notMyTeam' && scope == 0 || args.actor === 'myTeam' && scope == 0) {
                this.config.shortcut.forEach(key => {
                    robot.keyToggle(key, 'down')
                });
                setTimeout(() => {
                    this.config.shortcut.forEach(key => {
                        robot.keyToggle(key, 'up')
                    });
                }, 100);
            }
            setTimeout(() => {
                let json = this.getMostRecentFile(this.config.path)
                
                if(args.name !== 'Save') {
                    fs.rename(path.join(this.config.path, json.file), path.join(this.config.path, `${args.name} ${args.data.dist}m ${args.data.speed}ms ${new Date().toLocaleString('en-US',{year: "numeric", month: "short", second:"numeric"})}.mp4`), function(err) {
                        if ( err ) console.log('ERROR: ' + err);
                    });
                } else {
                    fs.rename(path.join(this.config.path, json.file), path.join(this.config.path, `${args.name} ${args.data} ${new Date().toLocaleString('en-US',{year: "numeric", month: "short", second:"numeric"})}.mp4`), function(err) {
                        if ( err ) console.log('ERROR: ' + err);
                    });
                }
            }, 2000);
        }, event.delay * 1000);
    }

    listenGameEvents() {
        console.log('listen')
        this.eventEmitter.on('game.scoreChanged', (args, event) => {
            console.log('scoreChanged')
            let index = this.config.game.events.findIndex(x => x.event === args.name)
            let gameEvent = this.config.game.events[index]
            let scope = this.config.scope
            if(gameEvent.used) {
                this.checkForScopeAndSave(args, scope, gameEvent)
            }
        })

        this.eventEmitter.on('game.save', (args, event) => {
            console.log('save')
            let index = this.config.game.events.findIndex(x => x.event === args.name)
            let gameEvent = this.config.game.events[index]
            let scope = this.config.scope
            if(gameEvent.used) {
                this.checkForScopeAndSave(args, scope, gameEvent)
            }
        })

        this.eventEmitter.on('game.assist', (args, event) => {
            console.log('assist')
            let index = this.config.game.events.findIndex(x => x.event === args.name)
            let gameEvent = this.config.game.events[index]
            let scope = this.config.scope
            if(gameEvent.used) {
                this.checkForScopeAndSave(args, scope, gameEvent)
            }
        })
    }

}

module.exports = EventHandler