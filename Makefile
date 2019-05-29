.PHONY: build push

build:
	yarn build

push: build
	scp -r build/* icelab-mapequation:/var/www/mapequation/infomap