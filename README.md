# AMR Project Application

### Please download the model here

1. Download the model and unzip it from [Download Link](https://cadtedu-my.sharepoint.com/:f:/g/personal/sophal_thear_cadt_edu_kh/Ejs-4-kZpA9HqHu6aGnCT_YBinA9iDM1v8CfF9l97kFcjQ?e=xdv6Cp).
2. Move all the model files to the root directory of the project.
3. The model files should be in the same directory as the `server.py` file.
4. The model files should be in the following format:
   - `random_forest_stage_1.joblib`
   - `random_forest_stage_2.joblib`
   - `random_forest_stage_3.joblib`
   - `random_forest_stage_4.joblib`
   - `random_forest_stage_5.joblib`

## How to Run the Application

#### Building and Running the Docker Container

1. Build the Docker image:
   ```bash
   docker build -t amr_app .
   ```
2. Run the Docker container:
   ```bash
   docker run -p 8000:80 amr_app
   ```
3. Access the Web Application at `http://localhost:8000`.

### Using Docker Compose

1. Build and run the Docker containers:
   ```bash
   docker-compose up --build
   ```
2. Access the Web Application at `http://localhost:8000`.

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
