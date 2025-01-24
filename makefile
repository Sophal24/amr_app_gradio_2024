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
	curl -X POST https://portainer.vishnu.samdy.pro/api/webhooks/4e697ca9-a479-454c-a432-e26fd604cf4b