// Local Test Urls
// http://localhost:3000/dQw4w9WgXcQ.mp4
// http://localhost:3000/358629078.mp4
// 50 second video: http://localhost:3000/672898525.mp4

import 'dotenv/config'
import process from 'node:process'
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
        let playlistId = ''

        for ( let i = playlistIdIndex; i < url.length; i++ ) {
            if ( PLAYLIST_ID_CHARS.includes( url[ i ] ) ) {
                playlistId += url[ i ]
            } else {
                break
            }
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

        // Vercel URL doesn't include the protocol by default
        const pythonServerHost = `https://${process.env.PYTHON_SERVER_HOST || process.env.VERCEL_URL}`
        const playlistId = getPlaylistId( request.url )
        const playlistUrl = `https://www.youtube.com/playlist?list=${ playlistId }`
        const playlistApiUrl = new URL( `/api/info?query=${ playlistUrl }`, pythonServerHost )

        console.log( `Fetching playlist items from ${playlistApiUrl}` )
        const apiResponse = await fetch( playlistApiUrl.href )

        if ( !apiResponse.ok || !apiResponse.body ) {
            console.error( `Failed to fetch playlist items from ${playlistUrl}` )
            console.error( { apiResponse } )
            throw new Error( `Failed to fetch playlist items from ${playlistUrl}` )
        }

        // Set headers for streaming response
        response.setHeader('Content-Type', 'application/json')
        
        // Create a reader from the response body
        const reader = apiResponse.body.getReader()
        const decoder = new TextDecoder()
        const encoder = new TextEncoder()

        // Function to read from the stream and write to the response
        async function streamResponse() {
            while (true) {
                const { done, value } = await reader.read()
                if (done) {
                    break
                }
                const chunk = decoder.decode(value)
                response.write(encoder.encode(chunk))
            }
            response.end()
        }

        // Stream the response directly to the client
        streamResponse().catch(err => {
            console.error('Stream error:', err);
            response.status(500).json({ message: 'Error', path: request.url });
        })
    }
    catch ( error ) {
        console.error( error )

        return response
            .status( 500 )
            .json( {
                message: 'Error',
                path: request.url,
            } )
    }
}