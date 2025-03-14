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
	curl -X POST https://portainer.vishnu.samdy.pro/api/webhooks/48df5f90-661d-4075-8493-00f41de84615