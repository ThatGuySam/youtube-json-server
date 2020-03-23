import { createServer } from 'zeit-now-node-server'
import test from 'ava'
import axios from 'axios'
import listen from 'test-listen'

import withPage from './_withPage'

// Pull in dotenv variables
require('dotenv').config()


// import playlistItems from '../playlist-items'
const playlistItems = require('../playlist-items')

const TEN_SECONDS = 10 * 1000

let server
let url

// test.before(async t => {
// 	// This runs before all tests
// 	server = createServer(routeUnderTest)
//   	url = await listen(server)
// })


test('Can not get invalid playlist', async t => {

	// https://github.com/ctrlplusb/zeit-now-node-server#unit-testing-your-lambdas
	server = createServer(playlistItems)

	url = await listen(server)

	const { data } = await axios.get(url, {
		params: {
			id: 'bad_playlist_id_1234'
		}
	})

	// console.log('data', data)

	const hasErrorsKey = data.hasOwnProperty('errors')
	const givesFetchingError = (data.errors === 'Error fetching playlist')

	t.true(hasErrorsKey && givesFetchingError)
})

test('Can get playlist items', async t => {

	const monkeyIslandPlayistID = 'PL5m2E4NlwhJa_SJ4dcAZNxtr50PSkIAMI'

	// https://github.com/ctrlplusb/zeit-now-node-server#unit-testing-your-lambdas
	server = createServer(playlistItems)

	url = await listen(server)

	const response = await axios.get(url, {
		params: {
			id: monkeyIslandPlayistID
		}
	})

	t.snapshot(response.data)
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