// URL utility
import url from 'url'
// Google API (Which contains the Youtube API)
import { google } from 'googleapis'

module.exports = async function (req, res) {
    // Break out the id param from our request's query string
    const { query: { id } } = url.parse(req.url, true)

    // Setup Youtube API V3 Service instance
    const service = google.youtube('v3')

    // Fetch data from the Youtube API
    const { errors = null, data = null } = await service.playlistItems.list({
        // auth: auth,
        key: process.env.GOOGLE_API_KEY,
        part: 'snippet,contentDetails',
        playlistId: id,
        maxResults: 50,
        // forUsername: 'GoogleDevelopers'
    }).catch(({ errors }) => {

        console.log('Error fetching playlist', errors)

        return {
            errors
        }
    })

    // Set Cors Headers to allow all origins so data can be requested by a browser
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

    // Send an error response if something went wrong
    if (errors !== null) {
        res.json({
            errors: 'Error fetching playlist'
        })

        return
    }

    res.json(data.items)
}
