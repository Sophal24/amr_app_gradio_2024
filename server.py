import joblib
import pandas as pd
from utils import set_label_encoding
from datetime import datetime
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import (
    create_activity,
    get_db,
    get_locations,
    seed_locations,
    seed_users,
    verify_user,
)
import jwt
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

target_labels = [
    "Amoxicilline",
    "Augmentin",
    "Oxacilline / cefazoline",
    "Tazocilline",
    "Cefotaxime / ceftriaxone",
    "Ceftazidime",
    "Cefepime",
    "Aztreonam",
    "Imipenem",
    "Meropenem",
    "Ertapenem",
    "Amikacine",
    "Gentamicine",
    "Ciprofloxacine",
    "Levofloxacine",
    "Bactrim",
    "Vancomycine",
    "Rifampicine",
    "ClindamycineMacrolides",
]
# df = pd.read_excel('dataset/Calmette_data.xlsx')
df = pd.read_excel("antibiogram_dataset.xlsx")
# df = df.applymap(lambda x: x.replace('\u200b', '') if isinstance(x, str) else x)
df = df.replace(to_replace="\u200b", value="", regex=True)
# drop columns
df = df.drop(columns=["Hopital", "IDLabo", "IDPatient", "visittype"])
df = df.rename(columns={"new_age": "age"})
# Convert column names to lowercase
df.columns = df.columns.str.lower()
# Mapping Khmer to English using map()
df["sex"] = df["sex"].map({"ប្រុស": "Male", "ស្រី": "Female"})

# Set Label Encoding to convert features to number
age_dict = set_label_encoding(df, "age")
sex_dict = set_label_encoding(df, "sex")
address_dict = set_label_encoding(df, "address")
ward_dict = set_label_encoding(df, "ward_en")
service_type_dict = set_label_encoding(df, "service_type")
espece_requete_dict = set_label_encoding(df, "espece_requete")
direct_2_dict = set_label_encoding(df, "2_direct")
culture_3_dict = set_label_encoding(df, "3_culture")
genre_4_dict = set_label_encoding(df, "4_genre")
espece_5_training_dict = set_label_encoding(df, "5_espece_training")
contamination_dict = set_label_encoding(df, "contamination")
sample_dict = set_label_encoding(df, "prelevement_type")
diagnosis_dict = set_label_encoding(df, "new_diagnosis")  ## add diagnosis


def amr_project(
    age,
    sex,
    address,
    ward_en,
    service_type,
    date,
    sample,
    diagnosis,
    direct_2,
    culture_3,
    genre_4,
    species_5,
):
    # Convert timestamp to a datetime object
    date_time = datetime.fromtimestamp(date)
    # Extract the month
    month = date_time.month

    result_probab_dict = dict()
    result_class_dict = dict()
    df_info = pd.DataFrame()

    # Stage 5
    if (
        age
        and sex
        and address
        and ward_en
        and service_type
        and sample
        and direct_2
        and culture_3
        and genre_4
        and species_5
    ):

        # Sample data
        input_data = {
            "month": [month],
            "age": [age],
            "sex": [sex_dict[sex]],
            "address": [address_dict[address]],
            "ward_en": [ward_dict[ward_en]],
            "service_type": [service_type_dict[service_type]],
            "sample": [sample_dict[sample]],
            "new_diagnosis": [diagnosis_dict[diagnosis]],
            "2_direct": [direct_2_dict[direct_2]],
            "3_culture": [culture_3_dict[culture_3]],
            "4_genre": [genre_4_dict[genre_4]],
            "5_species": [espece_5_training_dict[species_5]],
        }
        # Create the DataFrame
        df = pd.DataFrame(input_data)

        # Load the model back from the file
        rf_model_loaded = joblib.load("random_forest_stage_5.joblib")
        one_row_test = df

        # Now you can use the loaded model to make predictions
        y_pred_loaded = rf_model_loaded.predict(one_row_test)

        y_pred_prob = rf_model_loaded.predict_proba(one_row_test)

        result_class_dict = dict()
        result_probab_dict = dict()

        for i in range(len(target_labels)):
            message = "Sensible" if y_pred_loaded[0][i] == 1 else "Resistance"
            result_class_dict[target_labels[i]] = message
            result_probab_dict[target_labels[i]] = y_pred_prob[i][0][1]

        # Sample data
        data = {"Model": ["Random Forest - Stage 5"]}
        # Create the DataFrame
        df_info = pd.DataFrame(data)

    # Stage 4
    elif (
        age
        and sex
        and address
        and ward_en
        and service_type
        and sample
        and direct_2
        and culture_3
        and genre_4
    ):
        # Sample data
        input_data = {
            "month": [month],
            "age": [age],
            "sex": [sex_dict[sex]],
            "address": [address_dict[address]],
            "ward_en": [ward_dict[ward_en]],
            "service_type": [service_type_dict[service_type]],
            "sample": [sample_dict[sample]],
            "new_diagnosis": [diagnosis_dict[diagnosis]],
            "2_direct": [direct_2_dict[direct_2]],
            "3_culture": [culture_3_dict[culture_3]],
            "4_genre": [genre_4_dict[genre_4]],
        }
        # Create the DataFrame
        df = pd.DataFrame(input_data)
        # Load the model back from the file
        rf_model_loaded = joblib.load("random_forest_stage_4.joblib")
        one_row_test = df

        # Now you can use the loaded model to make predictions
        y_pred_loaded = rf_model_loaded.predict(one_row_test)

        y_pred_prob = rf_model_loaded.predict_proba(one_row_test)

        result_class_dict = dict()
        result_probab_dict = dict()

        for i in range(len(target_labels)):
            message = "Sensible" if y_pred_loaded[0][i] == 1 else "Resistance"
            result_class_dict[target_labels[i]] = message
            result_probab_dict[target_labels[i]] = y_pred_prob[i][0][1]

        # Sample data
        data = {"Model": ["Random Forest - Stage 4"]}
        # Create the DataFrame
        df_info = pd.DataFrame(data)

    # Stage 3
    elif (
        age
        and sex
        and address
        and ward_en
        and service_type
        and sample
        and direct_2
        and culture_3
    ):
        # Sample data
        input_data = {
            "month": [month],
            "age": [age],
            "sex": [sex_dict[sex]],
            "address": [address_dict[address]],
            "ward_en": [ward_dict[ward_en]],
            "service_type": [service_type_dict[service_type]],
            "sample": [sample_dict[sample]],
            "new_diagnosis": [diagnosis_dict[diagnosis]],
            "2_direct": [direct_2_dict[direct_2]],
            "3_culture": [culture_3_dict[culture_3]],
        }
        # Create the DataFrame
        df = pd.DataFrame(input_data)
        # Load the model back from the file
        rf_model_loaded = joblib.load("random_forest_stage_3.joblib")
        one_row_test = df

        # Now you can use the loaded model to make predictions
        y_pred_loaded = rf_model_loaded.predict(one_row_test)

        y_pred_prob = rf_model_loaded.predict_proba(one_row_test)

        result_class_dict = dict()
        result_probab_dict = dict()

        for i in range(len(target_labels)):
            message = "Sensible" if y_pred_loaded[0][i] == 1 else "Resistance"
            result_class_dict[target_labels[i]] = message
            result_probab_dict[target_labels[i]] = y_pred_prob[i][0][1]

        # Sample data
        data = {"Model": ["Random Forest - Stage 3"]}
        # Create the DataFrame
        df_info = pd.DataFrame(data)

    # Stage 2
    elif age and sex and address and ward_en and service_type and sample and direct_2:
        # Sample data
        input_data = {
            "month": [month],
            "age": [age],
            "sex": [sex_dict[sex]],
            "address": [address_dict[address]],
            "ward_en": [ward_dict[ward_en]],
            "service_type": [service_type_dict[service_type]],
            "sample": [sample_dict[sample]],
            "new_diagnosis": [diagnosis_dict[diagnosis]],
            "2_direct": [direct_2_dict[direct_2]],
        }
        # Create the DataFrame
        df = pd.DataFrame(input_data)
        # Load the model back from the file
        rf_model_loaded = joblib.load("random_forest_stage_2.joblib")
        one_row_test = df

        # Now you can use the loaded model to make predictions
        y_pred_loaded = rf_model_loaded.predict(one_row_test)

        y_pred_prob = rf_model_loaded.predict_proba(one_row_test)

        result_class_dict = dict()
        result_probab_dict = dict()

        for i in range(len(target_labels)):
            message = "Sensible" if y_pred_loaded[0][i] == 1 else "Resistance"
            result_class_dict[target_labels[i]] = message
            result_probab_dict[target_labels[i]] = y_pred_prob[i][0][1]

        # Sample data
        data = {"Model": ["Random Forest -  Stage 2"]}
        # Create the DataFrame
        df_info = pd.DataFrame(data)

    # Stage 1
    elif age and sex and address and ward_en and service_type and sample:
        # Sample data
        input_data = {
            "month": [month],
            "age": [age],
            "sex": [sex_dict[sex]],
            "address": [address_dict[address]],
            "ward_en": [ward_dict[ward_en]],
            "service_type": [service_type_dict[service_type]],
            "sample": [sample_dict[sample]],
            "new_diagnosis": [diagnosis_dict[diagnosis]],
        }
        # Create the DataFrame
        df = pd.DataFrame(input_data)

        # Load the model back from the file
        rf_model_loaded = joblib.load("random_forest_stage_1.joblib")
        one_row_test = df

        # Now you can use the loaded model to make predictions
        y_pred_loaded = rf_model_loaded.predict(one_row_test)

        y_pred_prob = rf_model_loaded.predict_proba(one_row_test)

        result_class_dict = dict()
        result_probab_dict = dict()

        for i in range(len(target_labels)):
            message = "Sensible" if y_pred_loaded[0][i] == 1 else "Resistance"
            result_class_dict[target_labels[i]] = message
            result_probab_dict[target_labels[i]] = y_pred_prob[i][0][1]

        # Model used and stage information
        data = {"Model": ["Random Forest - Stage 1"]}
        # Create the DataFrame
        df_info = pd.DataFrame(data)

    return df_info, result_probab_dict

def process_input(input_text):
    if not input_text.strip():
        return "Error: Input is required. Please provide a value."
    return f"You entered: {input_text}"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        if request.url.path.startswith("/api") and request.url.path != "/api/login":
            credentials: HTTPAuthorizationCredentials = await super(
                JWTBearer, self
            ).__call__(request)
            if credentials:
                if not self.verify_jwt(credentials.credentials):
                    raise HTTPException(
                        status_code=403, detail="Invalid token or expired token."
                    )
                return credentials.credentials
            else:
                raise HTTPException(
                    status_code=403, detail="Invalid authorization code."
                )
        return await request.app(request.scope, request.receive, request.send)

    def verify_jwt(self, jwtoken: str) -> bool:
        is_token_valid: bool = False

        try:
            payload = jwt.decode(jwtoken, "secret", algorithms=["HS256"])
        except:
            payload = None
        if payload:
            is_token_valid = True
        return is_token_valid


@app.post("/api/amr")
def amr_api(data: dict, token: str = Depends(JWTBearer())):
    try:
        age = data.get("age")
        sex = data.get("sex")
        address = data.get("address")
        ward_en = data.get("ward_en")
        service_type = data.get("service_type")
        date = data.get("date")
        sample = data.get("sample")
        direct_2 = data.get("direct_2")
        culture_3 = data.get("culture_3")
        genre_4 = data.get("genre_4")
        species_training_5 = data.get("species_training_5")
        diagnosis = data.get("diagnosis")

        # Convert date to timestamp
        date = datetime.strptime(date, "%Y-%m-%dT%H:%M:%S.%fZ").timestamp()

        # Decode the token to get the user information
        payload = jwt.decode(token, "secret", algorithms=["HS256"])
        user_id = payload.get("user_id")

        # Store user input
        create_activity(user_id, data)
        df_info, result_probab_dict = amr_project(
            age=age,
            sex=sex,
            address=address,
            ward_en=ward_en,
            service_type=service_type,
            date=date,
            sample=sample,
            diagnosis=diagnosis,
            direct_2=direct_2,
            culture_3=culture_3,
            genre_4=genre_4,
            species_5=species_training_5,
        )

        return {"df_info": df_info.to_dict(), "result_probab_dict": result_probab_dict}
    except Exception as e:
        return {"error": str(e)}


@app.post("/api/login")
def login(data: dict):
    username = data.get("username")
    password = data.get("password")

    user = verify_user(username, password)

    user_id = user.get("_id").__str__()

    if user:
        token = jwt.encode({"user_id": user_id}, "secret", algorithm="HS256")
        return {"message": "Login successful", "token": token}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")


@app.get("/api/allowed-locations")
def allowed_locations():
    locations = get_locations()
    return locations

@app.post("/api/save-feedback")
def save_feedback(data: dict, token: str = Depends(JWTBearer())):
    try:
        feedback = {
            "agree": data.get("agree"),
            "comment": data.get("comment"),
            "inputs": data.get("inputs"),
            "results": data.get("results"),
        }

        # Decode the token to get the user information
        payload = jwt.decode(token, "secret", algorithms=["HS256"])
        user_id = payload.get("user_id")

        # Store feedback
        create_activity(user_id, feedback)

        return {"message": "Feedback saved successfully"}
    except Exception as e:
        return {"error": str(e)}


app.mount("/", StaticFiles(directory="./web/dist", html=True), name="web")

if __name__ == "__main__":
    import uvicorn
    import os

    seed_users()
    seed_locations()

    uvicorn.run(app, port=int(os.environ.get("PORT", 8000)), host="0.0.0.0")
