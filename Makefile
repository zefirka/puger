REV_DATE = $(shell git show -s --format=%ct | perl -mPOSIX -pE 's/(\d+)/POSIX::strftime("%Y%m%d_%H%M", localtime($$1))/e')
REV_HASH = $(shell git show -s --format="%h")
REV_BRANCH = $(shell git rev-parse --abbrev-ref HEAD)
IMAGE_VERSION:=$(REV_DATE).$(REV_BRANCH).$(REV_HASH)

IMAGE_TAG_BASE:=zeffirsky/puger
IMAGE_TAG_VERSION:=$(IMAGE_TAG_BASE):$(IMAGE_VERSION)
IMAGE_TAG_LATEST:=$(IMAGE_TAG_BASE):latest


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

build:
	docker build --file Dockerfile -t $(IMAGE_TAG_LATEST) -t $(IMAGE_TAG_VERSION) $(NO_CACHE) .

push:
	docker push $(IMAGE_TAG_LATEST)
	docker push $(IMAGE_TAG_LATEST)