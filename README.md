# AMR Project - Web Applications
This system composes of Website, API, and Database that you can install in a single line of command.

## Technologies
1. **Website**
   - ReactJS
   - Typescript
   - Material UI
2. **API**
   - Python 3.9.13 (Prefered)
   - FastAPI framework
3. **Database**
   - Postgres 17

## Requirements
### 1. Machine Learning Model
You need to download the machine learning model and extract into the corresponding directory as follow:

1. Download the model and unzip it from [Download Link](https://cadtedu-my.sharepoint.com/:f:/g/personal/sophal_thear_cadt_edu_kh/Ejs-4-kZpA9HqHu6aGnCT_YBinA9iDM1v8CfF9l97kFcjQ?e=xdv6Cp). There are several machine learning model files such as: `random_forest_stage_1.joblib`, `random_forest_stage_2.joblib`,.. etc.
2. Move all the model files into the **root directory of the project** (they must be located in the same directory of root level `server.py`).

After the models downloaded and placed in the correct location, you can proceed building and run the web applications as below.

### 2. How to Build and Run the Applications
For the easiest way, we provide a docker compose's file that you can up all services by follow below:

1. Build and run the docker containers using docker-compose:
   ```bash
   docker-compose up -d --build
   ```
2. Access the website via at `http://localhost:8000`.

Please see the [docker-compose.yml](./docker-compose.yml) file for more detail.

## Alternative: Running Locally without Docker

#### Prerequisites

- Python 3.9.13
- Node.js 22

#### Set Up the Environment Variables

1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables to the `.env` file:
   ```env
   PORT=8000
   POSTGRES_URL=dbname=amr_app user=postgres password=postgres host=localhost
   ```
3. Make sure to have PostgreSQL running locally and create a database named `amr_app`.
4. If you want to use a different database, update the `POSTGRES_URL` variable accordingly.
5. If you want to use a different port, update the `PORT` variable accordingly.

#### Running the React App

1. Navigate to the React app directory:
   ```bash
   cd web
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Start the development server:
   ```bash
   yarn dev
   ```
4. Open your browser and go to `http://localhost:5173`.

#### Running the FastAPI Backend

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
2. Activate the virtual environment:
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   python server.py
   ```
5. Access the APIs at `http://localhost:8000`.
