// URL utility
import url from 'url'
// The universal version of Fetch so we can use it on both the server and browser
import 'isomorphic-unfetch'

module.exports = async function (req, res) {
    const { query: { slug } } = url.parse(req.url, true)

    // Fetch the subreddit as JSON
    const apiResponse = await fetch(`https://www.reddit.com/r/${slug}/top.json`)
    // Convert data to json
    const json = await apiResponse.json()

    // Set Cors Headers to allow all origins so data can be requested by a browser
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Set JSON Header so requesting applications know how to handle the data
    res.setHeader('Content-Type', 'application/json')

    // Send the response body as JSON
    res.json(json)
}
