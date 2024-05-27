// Local Test Urls
// http://localhost:3000/dQw4w9WgXcQ.mp4
// http://localhost:3000/358629078.mp4
// 50 second video: http://localhost:3000/672898525.mp4

import 'dotenv/config'
// import axios from 'axios'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function ( request: VercelRequest, response: VercelResponse ) {

    try {
        
        return response.json( {
            message: 'Hello from the API',
            path: request.url,
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