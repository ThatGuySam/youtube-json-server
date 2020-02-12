[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/ThatGuySam/zeit-now-stale-example)

# Zeit Now Stale-While-Revalidate Caching Example


A simple example of how to cache requests via Zeit Now to reduce server and database loads while still delivering fast response time by using Stale-While-Revalidate to update the cached data in the background. 

Caches for 5 minutes(set as 300 seconds) which can be updated from /now.json in the root directory. 


[About Stale-While-Revalidate on Zeit](https://zeit.co/docs/v2/network/caching#stale-while-revalidate)


