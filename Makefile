install:
	chmod 777 ./tasks/*
	npm install

client:
	webpack

client-watch:
	webpack --watch

run:
	make client
	nodemon index.js 8013 ./templates