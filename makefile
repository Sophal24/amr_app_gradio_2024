NAME=vinsamdydev/amr
TAG=latest
IMAGE=$(NAME):$(TAG)

build:
	docker build -t $(IMAGE) .

push:
	docker push $(IMAGE)

deploy:
	make build
	make push
	curl -X POST https://portainer.vishnu.samdy.pro/api/webhooks/2c1ce0d2-5ca2-4a19-9fa2-5f5986c09f5b