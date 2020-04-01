// console.log('Log Works')

// document.write('Write works <br />')

// console.log('document.currentScript.src', document.currentScript.src)

const {
    embedType,
    channelId,
    liveHref = null,
    liveLabel = 'Join Live'
} = document.currentScript.dataset

const elementId = `${embedType}-${channelId}`

document.write(`<div class="yjs-area" id="${elementId}-area"></div>`)

const areaElement = document.getElementById(`${elementId}-area`)


const createLiveButton = () => {
    return `
        <a
            id="${elementId}-button"
            class="yjs-live-button"
            href="${liveHref}"
            style="
                text-decoration: none;
                color: white;
                background: red;
                padding: 0.7rem 2rem;
                font-weight: bold;
            "
        >${liveLabel}</a>
    `
}


const render = async function () {

    
    const liveBroadcasts = await fetch(`/channel-broadcasts/${channelId}`)
        .then((response) => {
            return response.json()
        })

    console.log('liveBroadcasts', liveBroadcasts)

    if (liveBroadcasts.length !== 0) {
        areaElement.innerHTML = createLiveButton()
    } else {
        areaElement.innerHTML = ''
    }    
}

render()

setInterval(render, 10000)

// const channelId = scriptUrl.searchParams.get('channel-id')
// const type = scriptUrl.searchParams.get('type')


