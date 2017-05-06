install:
	chmod 777 ./tasks/*
	npm install

run:
	nodemon index.js 8013 ./templates