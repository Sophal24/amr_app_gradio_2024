# syntax=docker/dockerfile:1

FROM node:22 AS web-build
WORKDIR /web

COPY web/package*.json ./
COPY web/yarn.lock ./
RUN yarn install

COPY web/ ./

ENV VITE_HOST_API=""

RUN yarn build

FROM python:3.9.13 AS base

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Create a non-privileged user that the app will run under.
# See https://docs.docker.com/go/dockerfile-user-best-practices/
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.cache/pip to speed up subsequent builds.
# Leverage a bind mount to requirements.txt to avoid having to copy them into
# into this layer.
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt

# Copy the built web files to the server
COPY --from=web-build /web/dist /app/web/dist

# Copy the source code into the container.
COPY server.py server.py
COPY dataset dataset
COPY database.py database.py
COPY Calmette_data_v2.xlsx Calmette_data_v2.xlsx
COPY antibiogram_dataset.xlsx antibiogram_dataset.xlsx
COPY utils.py utils.py
COPY random_forest_stage_1.joblib random_forest_stage_1.joblib
COPY random_forest_stage_2.joblib random_forest_stage_2.joblib
COPY random_forest_stage_3.joblib random_forest_stage_3.joblib
COPY random_forest_stage_4.joblib random_forest_stage_4.joblib
COPY random_forest_stage_5.joblib random_forest_stage_5.joblib

# Expose the port that the application listens on.
EXPOSE 80

ENV PORT=80

# Run the application.
CMD ["python", "server.py"]