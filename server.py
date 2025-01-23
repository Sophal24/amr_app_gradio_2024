import sqlite3
import joblib
import pandas as pd
from utils2 import set_label_encoding
from datetime import datetime
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import create_activity, seed_users, verify_user
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
df = pd.read_excel("Calmette_data_v2.xlsx")
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
prelevement_type_dict = set_label_encoding(df, "prelevement_type")
germe_dict = set_label_encoding(df, "germe")
espece_requete_dict = set_label_encoding(df, "espece_requete")
direct_2_dict = set_label_encoding(df, "2_direct")
culture_3_dict = set_label_encoding(df, "3_culture")
genre_4_dict = set_label_encoding(df, "4_genre")
espece_5_training_dict = set_label_encoding(df, "5_espece_training")
contamination_dict = set_label_encoding(df, "contamination")


def amr_project(
    age,
    sex,
    address,
    ward_en,
    service_type,
    date,
    prelevement_type,
    germe,
    contamination,
    direct_2,
    culture_3,
    genre_4,
    species_training_5,
):
    # print(sex, sex_dict[sex])
    # print(service_code, service_code_dict[service_code])
    # print(ward_dict, ward_dict[ward_en])
    # print(service_type, service_type_dict[service_type])

    # Convert timestamp to a datetime object
    date_time = datetime.fromtimestamp(date)
    # Extract the month
    month = date_time.month
    # print(date, month)

    # print(prelevement_type, prelevement_type_dict[prelevement_type])
    # print(germe, germe_dict[germe])

    contamination = (
        0 if contamination == "No" else 1
    )  # Convert contamination to 0 and 1
    # print(contamination)

    # print(direct_2, direct_2_dict[direct_2])
    # print(culture_3, culture_3_dict[culture_3])
    # print(genre_4, genre_4_dict[genre_4])
    # print(species_training_5, espece_5_training_dict[species_training_5])
    # print()
    # print(
    #     age,
    #     sex,
    #     ward_en,
    #     service_type,
    #     date,
    #     prelevement_type,
    #     germe,
    #     contamination,
    #     direct_2,
    #     culture_3,
    #     genre_4,
    #     species_training_5,
    # )

    # Sample data
    input_data = {
        "month": [month],
        "age": [age],
        "sex": [sex_dict[sex]],
        "address": [address_dict[address]],
        "ward_en": [ward_dict[ward_en]],
        "service_type": [service_type_dict[service_type]],
        "prelevement_type": [prelevement_type_dict[prelevement_type]],
        "espece_requete": [espece_requete_dict[germe]],
        "2_direct": [direct_2_dict[direct_2]],
        "3_culture": [culture_3_dict[culture_3]],
        "4_genre": [genre_4_dict[genre_4]],
        "5_espece_training": [espece_5_training_dict[species_training_5]],
        "contamination": [contamination],
    }

    # Create the DataFrame
    df = pd.DataFrame(input_data)
    # print(tabulate(df, headers="keys", tablefmt="fancy_grid"))
    # print(df)

    # Load the model back from the file
    rf_model_loaded = joblib.load("testing_random_forest_model_v2.joblib")
    one_row_test = df

    # Now you can use the loaded model to make predictions
    y_pred_loaded = rf_model_loaded.predict(one_row_test)
    # print(len(y_pred_loaded[0]), np.array(y_pred_loaded))

    y_pred_prob = rf_model_loaded.predict_proba(one_row_test)
    # print(len(y_pred_prob), np.array(y_pred_prob))

    result_class_dict = dict()
    result_probab_dict = dict()

    for i in range(len(target_labels)):
        message = "Sensible" if y_pred_loaded[0][i] == 1 else "Resistance"
        # print(
        #     target_labels[i],
        #     ": class - ",
        #     y_pred_loaded[0][i],
        #     message,
        #     " - Probab:",
        #     y_pred_prob[i][0][1],
        # )
        result_class_dict[target_labels[i]] = message
        result_probab_dict[target_labels[i]] = y_pred_prob[i][0][1]

    # print()
    # print(result_class_dict)
    # print(result_probab_dict)

    # Sample data
    data = {"Model": ["Randome Forest"]}
    # Create the DataFrame
    df_info = pd.DataFrame(data)
    # print(tabulate(df_info, headers="keys", tablefmt="fancy_grid"))

    return df_info, result_probab_dict
    # return df_info, {'Amoxicilline': 0.74, 'Augmentin': 0.22, 'Oxacilline / cefazoline': 0.62, 'Tazocilline': 0.11, 'Cefotaxime / ceftriaxone': 0.94, 'Ceftazidime': 0.38, 'Cefepime': 0.6, 'Aztreonam': 0.5, 'Imipenem': 0.71, 'Meropenem': 0.12, 'Ertapenem': 0.58, 'Amikacine': 0.22, 'Gentamicine': 0.87, 'Ciprofloxacine': 0.18, 'Levofloxacine': 0.85, 'Bactrim': 0.96, 'Vancomycine': 0.7, 'Rifampicine': 0.16, 'Clindamycine': 0.85, 'Macrolides': 0.89}


def process_input(input_text):
    if not input_text.strip():
        return "Error: Input is required. Please provide a value."
    return f"You entered: {input_text}"


options = {
    "gender": ["Male", "Female"],
    "address": [
        "Kandal",
        "Kampong Cham",
        "Takeo",
        "Phnom Penh",
        "Svay Rieng",
        "Unknown",
        "Kampot",
        "Battambang",
        "Kampong Thom",
        "Kampong Speu",
        "Koh Kong",
        "Prey Veng",
        "Preah Sihanouk",
        "Kampong Chhnang",
        "Tbong Khmum",
        "Pursat",
        "Mondulkiri",
        "Kratie",
        "Banteay Meanchey",
        "Preah Vihear",
        "Oddar Meanchey",
        "Ratanakiri",
        "Siem Reap",
        "Kep",
        "Stung Treng",
        "Pailin",
    ],
    "ward": [
        "Maternity",
        "Surgery B",
        "Medicine B",
        "Medicine A4",
        "Cancer/blood disorders",
        "Emergency",
        "Surgery A",
        "Medicine A",
        "Medicine A5",
        "Gyn",
        "Neuro-surgery",
        "Neurology",
        "Surgery A2",
        "Cardio Pediatric",
        "Cardio-Rea",
        "Medicine A6",
        "Cardio B",
        "Rea-neuro",
        "Hepatogastroenterology",
        "Rea B",
        "Medicine A7",
        "Cardio C",
        "Cardio A",
        "Rea A",
        "Rea C",
    ],
    "service_type": ["Pediatrie", "Chirurgie", "Medecine", "SAU", "Gyneco/Obs", "Rea"],
    "prelevement_type": [
        "Collection/Abces",
        "Hemoc/KT",
        "Urine",
        "Genital",
        "Respiratoire",
        "LCR",
        "Sereuse",
        "Osteoarticulaire",
        "Biopsie",
        "Digestif",
        "Peau",
        "Materiel",
    ],
    "germe": [
        "Streptococcus anginosus",
        "Staphylococcus aureus",
        "Enterobacter cloacae",
        "Pantoea agglomerans",
        "Burkholderia cepacia",
        "Acinetobacter baumannii",
        "Acinetobacter sp.",
        "Stenotrophomonas maltophilia",
        "Pseudomonas aeruginosa",
        "Streptococcus uberis",
        "Staphylococcus hominis",
        "Staphylococcus epidermidis",
        "Enterococcus faecalis",
        "Enterobacter sakazakii",
        "Streptococcus constellatus",
        "Streptococcus intermedius",
        "Staphylococcus saprophyticus",
        "Enterococcus faecium",
        "Klebsiella pneumoniae",
        "Proteus mirabilis",
        "Raoultella ornithinolytica",
        "Candida albicans",
        "Streptococcus agalactiae/B",
        "Streptococcus mitis",
        "Streptococcus acidominimus",
        "Streptococcus gordonii",
        "Streptococcus gallolyticus",
        "Lactococcus garvieae",
        "Streptococcus oralis",
        "Streptococcus group C/G",
        "Streptococcus sp.",
        "Streptococcus sanguinis",
        "Staphylococcus haemolyticus",
        "Salmonella Typhi",
        "Salmonella Paratyphi A",
        "Salmonella sp.",
        "Salmonella choleraesuis",
        "Salmonella enterica",
        "Enterococcus casseliflavus",
        "Enterococcus casseliflavus/gallinarum",
        "Enterococcus avium",
        "Citrobacter koseri",
        "Klebsiella aerogenes",
        "Citrobacter freundii",
        "Klebsiella ozaenae",
        "Proteus vulgaris",
        "Klebsiella oxytoca",
        "Providencia stuartii",
        "Morganella morganii",
        "Citrobacter youngae",
        "Enterococcus durans",
        "Burkholderia pseudomallei",
        "Streptococcus suis",
        "Streptococcus pyogenes/A",
        "Aeromonas hydrophila",
        "Aeromonas caviae",
        "Aeromonas veronii",
        "Acinetobacter lwoffii",
        "Acinetobacter haemolyticus",
        "Streptococcus dysgalactiae",
        "Streptococcus parasanguinis",
        "Staphylococcus lugdunensis",
        "Staphylococcus caprae",
        "Streptococcus pneumoniae",
        "Enterococcus gallinarum",
        "Enterococcus hirae",
        "Enterococcus sp.",
        "Candida glabrata",
        "Candida tropicalis",
        "Candida melibiosica",
        "Aeromonas sobria",
        "Aerococcus viridans",
        "Pseudomonas putida",
        "Enterococcus raffinosus",
        "Serratia liquefaciens",
        "Edwardsiella tarda",
        "Plesiomonas shigelloides",
        "Listeria monocytogenes",
        "Streptococcus C",
        "Candida sp.",
        "Candida parapsilosis",
        "Gemella morbillorum",
        "Streptococcus vestibularis",
        "Streptococcus porcinus",
        "Staphylocoque a coagulase negative",
        "Enterobacter aerogenes",
        "Citrobacter farmeri",
        "Raoultella terrigena",
        "Serratia marcescens",
        "Acinetobacter lwoffii/haemolyticus",
        "Providencia rettgeri",
        "Shigella sonnei",
        "Cronobacter sakazakii",
    ],
    "contamination": ["Yes", "No"],
    "direct_2": ["Cocci Gram Pos", "Bacille Gram Neg", "Levure", "Bacille Gram Pos"],
    "culture_3": [
        "Cocci Gram Pos type streptocoque",
        "Cocci Gram Pos type staphylocoque",
        "Bacille Gram Neg type enterobacterie",
        "Bacille Gram Neg non fermentant",
        "Cocci Gram Pos type enterocoque",
        "Levure",
        "Cocci Gram Pos non specifie",
        "Bacille Gram Neg non specifie",
        "Bacille Gram Pos",
    ],
    "genre_4": [
        "Streptococcus",
        "Staphylococcus",
        "Enterobacter",
        "Pantoea",
        "Burkholderia",
        "Acinetobacter",
        "Stenotrophomonas",
        "Pseudomonas",
        "Enterococcus",
        "Klebsiella",
        "Proteus",
        "Candida",
        "Lactococcus",
        "Salmonella",
        "Citrobacter",
        "Providencia",
        "Morganella",
        "Aeromonas",
        "Aerococcus",
        "Serratia",
        "Edwardsiella",
        "Plesiomonas",
        "Listeria",
        "Gemella",
        "Shigella",
        "Cronobacter",
    ],
    "species_training_5": [
        "Streptococcus anginosus/constellatus/intermedius/milleri",
        "Staphylococcus aureus",
        "Enterobacter cloacae complex",
        "Pantoea agglomerans",
        "Burkholderia cepacia complex",
        "Acinetobacter baumannii-calcoaceticus complex",
        "Acinetobacter sp.",
        "Stenotrophomonas maltophilia",
        "Pseudomonas aeruginosa",
        "Streptococcus uberis",
        "Staphylococcus hominis",
        "Staphylococcus epidermidis",
        "Enterococcus faecalis",
        "Cronobacter sakazakii",
        "Staphylococcus saprophyticus",
        "Enterococcus faecium",
        "Klebsiella pneumoniae",
        "Proteus mirabilis",
        "Klebsiella ornithinolytica",
        "Candida albicans",
        "Streptococcus agalactiae/B",
        "Streptococcus mitis/australis/cristatus/infantis/massiliensis/oligofermentans/oralis/peroris/pseudopneumoniae/sinensis",
        "Streptococcus acidominimus",
        "Streptococcus sanguinis/parasanguinis/gordonii",
        "Streptococcus equinus(bovis)/gallolyticus(caprinus)/infantarius/lutetiensis/alactolyticus/pasteurianus/D(hors enterococoques)",
        "Lactococcus garvieae",
        "Streptococcus dysgalactiae/equi/equisimilis/C/canis/G",
        "Streptococcus sp.",
        "Staphylococcus haemolyticus",
        "Salmonella Typhi",
        "Salmonella Paratyphi",
        "Salmonella sp.",
        "Salmonella enterica",
        "Enterococcus casseliflavus/gallinarum",
        "Enterococcus avium",
        "Citrobacter koseri",
        "Klebsiella aerogenes",
        "Citrobacter freundii complex",
        "Klebsiella ozaenae",
        "Proteus vulgaris",
        "Klebsiella oxytoca",
        "Providencia stuartii",
        "Morganella morganii",
        "Enterococcus durans",
        "Burkholderia pseudomallei",
        "Streptococcus suis",
        "Streptococcus pyogenes/A",
        "Aeromonas caviae/dhakensis/eucrenophila/hydrophila/punctata/sobria/veronii",
        "Acinetobacter lwoffii/haemolyticus",
        "Staphylococcus lugdunensis",
        "Staphylococcus caprae",
        "Streptococcus pneumoniae",
        "Enterococcus gallinarum",
        "Enterococcus hirae",
        "Enterococcus sp.",
        "Candida glabrata",
        "Candida tropicalis",
        "Candida melibiosica",
        "Aerococcus viridans",
        "Pseudomonas putida",
        "Enterococcus raffinosus",
        "Serratia liquefaciens",
        "Edwardsiella tarda",
        "Plesiomonas shigelloides",
        "Listeria monocytogenes",
        "Candida sp.",
        "Candida parapsilosis",
        "Gemella morbillorum",
        "Streptococcus salivarius/thermophilus/vestibularis",
        "Streptococcus porcinus",
        "Staphylocoque a coagulase negative",
        "Citrobacter amalonaticus group",
        "Klebsiella terrigena",
        "Serratia marcescens",
        "Providencia rettgeri",
        "Shigella sonnei",
        "Cronobacter malonaticus",
    ],
}

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
            credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
            if credentials:
                if not self.verify_jwt(credentials.credentials):
                    raise HTTPException(status_code=403, detail="Invalid token or expired token.")
                return credentials.credentials
            else:
                raise HTTPException(status_code=403, detail="Invalid authorization code.")
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

app.add_middleware(JWTBearer)

@app.get("/api/options")
def read_options():
    return options


@app.post("/api/amr")
def amr_api(data: dict, token: str = Depends(JWTBearer())):
    age = data.get("age")
    sex = data.get("sex")
    address = data.get("address")
    ward_en = data.get("ward_en")
    service_type = data.get("service_type")
    date = data.get("date")
    prelevement_type = data.get("prelevement_type")
    germe = data.get("germe")
    contamination = data.get("contamination")
    direct_2 = data.get("direct_2")
    culture_3 = data.get("culture_3")
    genre_4 = data.get("genre_4")
    species_training_5 = data.get("species_training_5")

    # Convert date to timestamp
    date = datetime.strptime(date, "%Y-%m-%dT%H:%M:%S.%fZ").timestamp()

    # Decode the token to get the user information
    payload = jwt.decode(token, "secret", algorithms=["HS256"])
    user_id = payload.get("user_id")

    # Store user input 
    create_activity(user_id, data)

    df_info, result_probab_dict = amr_project(
        age,
        sex,
        address,
        ward_en,
        service_type,
        date,
        prelevement_type,
        germe,
        contamination,
        direct_2,
        culture_3,
        genre_4,
        species_training_5,
    )

    return {"df_info": df_info.to_dict(), "result_probab_dict": result_probab_dict}

@app.post("/api/login")
def login(data: dict):
    username = data.get("username")
    password = data.get("password")
    
    user = verify_user(username, password)

    if user:
        token = jwt.encode({"user_id": user._id},"secret", algorithm="HS256")
        return {"message": "Login successful", "token": token}
    else:
        return {"message": "Invalid Credential", "token": None}

app.mount("/", StaticFiles(directory="web/dist", html=True), name="web")

if __name__ == "__main__":
    import uvicorn
    import os


    seed_users()

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)), reload=True if os.environ.get("DEBUG") == "True" else False)