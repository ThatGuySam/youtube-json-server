// Local Test Urls
// http://localhost:3000/dQw4w9WgXcQ.mp4
// http://localhost:3000/358629078.mp4
// 50 second video: http://localhost:3000/672898525.mp4

import 'dotenv/config'
import process from 'node:process'
import path from 'node:path'
import axios from 'axios'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function ( request: VercelRequest, response: VercelResponse ) {
    try {
        if ( !request.url ) {
            throw new Error( 'No URL' )
        }

        const { base } = path.parse( request.url )
        const playlistApiUrl = new URL( `/api/info?query=https://www.youtube.com/playlist?list=PLaQokWZfgbynBbDjr4U1yMqvxOT8LhnPb`, process.env.VERCEL_URL )

        console.log( `Fetching playlist items from ${playlistApiUrl.href}` )
        
        return response.json( {
            message: 'Hello from the API',
            path: request.url,
            api: playlistApiUrl.href,
            base
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