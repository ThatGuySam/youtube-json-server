// URL utility
import url from 'url'
// Google API (Which contains the Youtube API)
import { google } from 'googleapis'

module.exports = async function (req, res) {
    // Break out the id param from our request's query string
    const { query: { id } } = url.parse(req.url, true)
    const perPage = 50

    // Setup Youtube API V3 Service instance
    const service = google.youtube('v3')

    // Fetch data from the Youtube API
    const { errors = null, data = null } = await service.search.list({
        key: process.env.GOOGLE_API_KEY,
        part: 'snippet',
        channelId: id,
        type: 'video',
        eventType: 'live',
        order: 'date',
        maxResults: perPage
    }).catch(({ errors }) => {

        console.log('Error fetching broadcasts', errors)

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
            errors: 'Error fetching broadcasts'
        })

        return
    }

    const items = data.items

    // If there are more results then push them to our list of broadcasts
    if (data.nextPageToken !== null) {

        // Store the token for page #2 into our variable
        let pageToken = data.nextPageToken

        while (pageToken !== null) {
            // Fetch data from the Youtube API
            const youtubePageResponse = await service.search.list({
                key: process.env.GOOGLE_API_KEY,
                part: 'snippet',
                channelId: id,
                type: 'video',
                eventType: 'live',
                order: 'date',
                pageToken: pageToken
            })

            // Add the videos from this page on to our total items list
            youtubePageResponse.data.items.forEach(item => items.push(item))

            // Now that we're done set up the next page token or empty out the pageToken variable so our loop will stop
            pageToken = ('nextPageToken' in youtubePageResponse.data) ? youtubePageResponse.data.nextPageToken : null
        }
    }

    console.log(`Fetched ${items.length} broadcast${(items.length !== 1) ? '' : 's'} from https://www.youtube.com/channel/${id}`)

    res.json(items)
}
