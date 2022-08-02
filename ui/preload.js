const { ipcRenderer } = require('electron')
let events;
let shortcut = []

window.addEventListener('DOMContentLoaded', () => {
  const body = document.getElementById('body')
  const dashboard = document.getElementById('dashboard')
  const loader = document.getElementById('loader')

  body.style.overflow = "hidden"
  loader.style.display = "flex"

  ipcRenderer.on('echoArena.eventsLoaded', () => {
    loader.style.display = "none"
    body.style.overflow = "auto"
  })

  initAutoStream(document)

})

let initAuto = false

const initAutoStream = (document) => {


  ipcRenderer.on('config.configLoaded', (event, data) => {
    events = data.game.events
    scope.selectedIndex = data.scope;
    path.value = data.path
    keys.value = data.shortcut.join('+')
  })

  ipcRenderer.on('echoArena.eventsLoaded', (event, data) => {
    
    if(!initAuto) {
      const event = document.getElementById('event[0]')
      const dur = document.getElementById('duration[0]')
      const state = document.getElementById('event')
      const scope = document.getElementById('scope')
      const path = document.getElementById('path')
      const keys = document.getElementById('keys')
      const record = document.getElementById('record')
      data.events.map((eventName) => {    
        const opt = document.createElement('option');
        opt.value = eventName;
        opt.innerHTML = eventName;
        event.appendChild(opt);
      })

      

      const sendEvent = () => {
        events = events.filter(function( obj ) {
          return obj.event !== event.value;
        })

        let obj = {event:event.value,delay:dur.value, used:state.checked}

        events.push(obj)

        ipcRenderer.send('config.events', {
          events:events
        })
      }

      const switchEvent = (event) => {
        let data = events.find(element => element.event === event)
        state.checked = data.used
        dur.value = data.delay
      }

      event.addEventListener('change', (event) => {
        switchEvent(event.target.value)
      })
    
      state.addEventListener('change', sendEvent)
      dur.oninput = () => {sendEvent()}
      event.addEventListener('change', sendEvent)
      record.addEventListener('click', (event) => {
        shortcut = []
        keys.value = 'Press a key'
        function handleKeyPress (event) {
          shortcut.push(event.key.toLowerCase())
          keys.value = shortcut.join('+')
          setTimeout(() => {
            window.removeEventListener('keyup', handleKeyPress, true)
            keys.value = shortcut.join('+')
            ipcRenderer.send('config.shortcut', {shortcut:shortcut})
          }, 3000);
        }
        window.addEventListener('keyup', handleKeyPress, true)
      })
      scope.addEventListener('change', (event) => {
        ipcRenderer.send('config.scope', {scope:scope.value})
      })
      path.addEventListener('change', (event) => {
        ipcRenderer.send('config.path', {path:path.value})
      })
      initAuto = true

    }
  })
}