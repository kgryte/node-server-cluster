TODO
====

1. allowing sending a graceful shutdown signal via `message`
	-	[pm2](https://keymetrics.io/2015/03/26/pm2-clustering-made-easy/)
	-	will want an additional timeout to kill hanging processes which were told to `shutdown`
2. allow workers to send messages to `master`
	-	e.g., equivalent of 'shut me down', 'send me a shutdown message', or 'reload me'
		-	e.g., could be exploited by a rest endpoint
3. 
