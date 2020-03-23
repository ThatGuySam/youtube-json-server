import { createServer } from 'zeit-now-node-server'
import test from 'ava'
import axios from 'axios'
import listen from 'test-listen'

// import withPage from './_withPage'

// Pull in dotenv variables
require('dotenv').config()


const playlistItems = require('../playlist-items')

const channelBroadcasts = require('../channel-broadcasts')


const buildZeitTestServer = async (serverlessFunction) => {
	// https://github.com/ctrlplusb/zeit-now-node-server#unit-testing-your-lambdas
	const server = createServer(serverlessFunction)

	const url = await listen(server)

	return {
		server,
		url
	}
}

// const TEN_SECONDS = 10 * 1000

// test.before(async t => {
// 	// This runs before all tests
// 	server = createServer(routeUnderTest)
//   	url = await listen(server)
// })


test('Can not get invalid playlist', async t => {

	const { server, url } = await buildZeitTestServer(playlistItems)

	const { data } = await axios.get(url, {
		params: {
			id: 'bad_playlist_id_1234'
		}
	})

	// console.log('data', data)

	const hasErrorsKey = data.hasOwnProperty('errors')
	const givesFetchingError = (data.errors === 'Error fetching playlist')

	t.true(hasErrorsKey && givesFetchingError)

	server.close()
})

test('Can get playlist items', async t => {

	const monkeyIslandPlayistID = 'PL5m2E4NlwhJa_SJ4dcAZNxtr50PSkIAMI'

	const { server, url } = await buildZeitTestServer(playlistItems)
	
	// console.log('Playlists test url', url)

	const response = await axios.get(url, {
		params: {
			id: monkeyIslandPlayistID
		}
	})

	t.snapshot(response.data)

	await server.close()
})


test('Shows no events for not live channel', async t => {

	const samCarltonChannelID = 'UCB3jOb5QVjX7lYecvyCoTqQ'

	const { server, url } = await buildZeitTestServer(channelBroadcasts)

	// console.log('Broadcasts test url', url)

	const { data } = await axios.get(url, {
		params: {
			id: samCarltonChannelID
		}
	})

	console.log('Broadcasts data', data)

	const hasZeroLiveBroadcasts = (data.length === 0)
	
	t.true(hasZeroLiveBroadcasts)

	server.close()
})


test('Shows events for currently live channel', async t => {

	const flareTVChannelID = 'UCmrlqFIK_QQCsr3FRHa3OKw'

	const { server, url } = await buildZeitTestServer(channelBroadcasts)

	// console.log('Broadcasts test url', url)

	const { data } = await axios.get(url, {
		params: {
			id: flareTVChannelID
		}
	})

	// console.log('Broadcasts data', data)

	const hasAnyLiveBroadcasts = (data.length !== 0)
	
	t.true(hasAnyLiveBroadcasts)

	server.close()
})




// const url = 'https://google.com';


// test('page title should contain "Google"', withPage, async (t, page) => {

// 	await page.goto(url);
// 	t.true((await page.title()).includes('Google'));
// });

// test('page should contain an element with `#hplogo` selector', withPage, async (t, page) => {
// 	await page.goto(url);
// 	t.not(await page.$('#hplogo'), null);
// });

// test('search form should match the snapshot', withPage, async (t, page) => {
// 	await page.goto(url);
// 	const innerHTML = await page.evaluate(form => form.innerHTML, await page.$('#searchform'));
// 	t.snapshot(innerHTML);
// });