NAME=registry.gitlab.com/vin.samdy.dev/idri-registry
TAG=amr
IMAGE=$(NAME):$(TAG)

build_prod:
	docker build -t $(IMAGE)_prod .

push_prod:
	docker push $(IMAGE)_prod

release_prod:
	make build_prod
	make push_prod

build_staging:
	docker build -t $(IMAGE)_staging .

push_staging:
	docker push $(IMAGE)_staging

release_staging:
	make build_staging
	make push_staging
