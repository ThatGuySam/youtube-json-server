import assert from 'node:assert'
import fs from 'node:fs/promises'


const expectedPlaylists = new Set([
    'PL0F6082F6621B5706',
    'PLcPeQJgLYpuTP10p6ejeBT__kKIBuGpyn',
    'PLcPeQJgLYpuRtwFM_XhrXmmOt2q0nR_wI',
    // Seems to be deleted
    // 'PLcPeQJgLYpuShK8GSmUpUo9Uhc3-ZTiBA',
    'PLcPeQJgLYpuTK_eFg59zj17VieqyrMWjd',
    'PLcPeQJgLYpuQaWwLwTfl6HSjTDvjosxb-',
    'PLcPeQJgLYpuQ9sE0PlN5tHlHoQJtm9EMu',
    'PLcPeQJgLYpuSXUSkHQvdJi9pJkddf6zZa',
    'PLcPeQJgLYpuT_CtvokS-Q0OaXHx5KWm73',
    'PLcPeQJgLYpuTs9P1WJ_snrHE0MagFaFEv',
    'PLcPeQJgLYpuRdDTJxVB9o7YL1ykijnkOn',
    'PLcPeQJgLYpuRACm4jA8XfuPBZ0eIqjcRx',
    'PLcPeQJgLYpuSmlpEaoXJMEiTCZel3YBli',
])

const playlistPath = 'https://osborn-youtube-json.vercel.app/playlist-items'

function makePlaylistUrl ( playlistId: string ) {
    return `${ playlistPath }/${playlistId}`
}

console.log({ playlistPath })

;(async () => {
    // Loop through each playlist and check if the playlist returns an ok status
    for ( const playlistId of expectedPlaylists ) {
        const playlistUrl = makePlaylistUrl(playlistId)
        const response = await fetch(playlistUrl)       
        
        assert(response.ok, `Playlist ${playlistId} did not return an ok status`)

        // Assert that the playlist has items
        const playlist = await response.json()

        assert(playlist.length > 0, `Playlist ${playlistId} has no items`)

        console.log(`Playlist ${playlistId} has ${playlist.length} items`)

        // Write the playlist to a file
        const playlistPathFolder = `./public/playlist-items/${playlistId}`

        await fs.mkdir(playlistPathFolder, { recursive: true })
        await fs.writeFile(`${playlistPathFolder}/index.json`, JSON.stringify(playlist, null, 4))
    }

    process.exit(0)
})()
