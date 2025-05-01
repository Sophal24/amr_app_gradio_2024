NAME=registry.idri.edu.kh/amr
TAG=latest
IMAGE=$(NAME):$(TAG)

build_prod:
	docker build -t $(IMAGE) .

push_prod:
	docker push $(IMAGE)

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
