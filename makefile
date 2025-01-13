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