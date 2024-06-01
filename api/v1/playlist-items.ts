// Local Test Urls
// http://localhost:3000/dQw4w9WgXcQ.mp4
// http://localhost:3000/358629078.mp4
// 50 second video: http://localhost:3000/672898525.mp4

import 'dotenv/config'
import process from 'node:process'
import path from 'node:path'
import axios from 'axios'
import type { VercelRequest, VercelResponse } from '@vercel/node'


const PLAYLIST_ID_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'

/**
 * Get the Playlist ID a URL path+query
 * Either from withing the path or from the query string
 */
function getPlaylistId ( url: string ): string {
    const playlistIdPrefix = 'PL'
    const playlistIdIndex = url.indexOf( playlistIdPrefix )

    if ( playlistIdIndex === -1 ) {
        throw new Error( 'Playlist ID not found' )
    }

    if ( playlistIdIndex !== -1 ) {
        let playlistId = url.slice( playlistIdIndex + playlistIdPrefix.length )
        const playlistIdChars = playlistId.split( '' )

        for ( const char of playlistIdChars ) {
            if ( !PLAYLIST_ID_CHARS.includes( char ) ) {
                break
            }

            playlistId += char
        }

        return playlistId
    }

    throw new Error( 'Playlist ID not found' )
}

export default async function ( request: VercelRequest, response: VercelResponse ) {
    try {
        if ( !request.url ) {
            throw new Error( 'No URL' )
        }

        const pythonServerHost = process.env.PYTHON_SERVER_HOST || process.env.VERCEL_URL
        const playlistId = getPlaylistId( request.url )
        const playlistUrl = `https://www.youtube.com/playlist?list=${ playlistId }`
        const playlistApiUrl = new URL( `/api/info?query=https://www.youtube.com/playlist?list=${ playlistUrl }`, pythonServerHost )

        console.log( `Fetching playlist items from ${playlistUrl}` )
        
        return response.json( {
            message: 'Hello from the API',
            path: request.url,
            api: playlistApiUrl.href,
        } )

        throw new Error( 'Not implemented' )
    }
    catch ( error ) {
        return response
            .status( 500 )
            .json( {
                message: 'Error',
                path: request.url,
            } )
    }
}