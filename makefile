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
	curl -X POST https://portainer.vishnu.samdy.pro/api/webhooks/4bef9314-39e8-4ef3-84fd-694e9ba785d2