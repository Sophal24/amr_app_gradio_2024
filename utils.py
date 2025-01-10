import pandas as pd
from sklearn.preprocessing import LabelEncoder

df = pd.read_excel('dataset/Calmette_data.xlsx')

# df = df.applymap(lambda x: x.replace('\u200b', '') if isinstance(x, str) else x)
df = df.replace(to_replace='\u200b', value='', regex=True)

df = df.drop(columns=["Unnamed: 0", "Hopital", "IDLabo", "IDPatient", "visittype"])
df = df.rename(columns={"new_age": "age"})
# Convert column names to lowercase
df.columns = df.columns.str.lower()

# Mapping Khmer to English using map()
df['sex'] = df['sex'].map({'ប្រុស': 'Male', 'ស្រី': 'Female'})

def set_label_encoding(df, column_name):
    result_dict = dict()

    # Initialize LabelEncoder and fit-transform the column
    label_encoder = LabelEncoder()
    df[column_name] = label_encoder.fit_transform(df[column_name])

    # View the mapping of labels
    # print("\nMapping of categories to encoded values:")
    for category, encoded_value in zip(label_encoder.classes_, range(len(label_encoder.classes_))):
        # print(f"{category}: {encoded_value}")
        result_dict[category] = encoded_value
    
    return result_dict

# # month_dict = set_label_encoding(df, 'Service_code')
# age_dict = set_label_encoding(df, 'age')
# sex_dict = set_label_encoding(df, 'sex')
# service_code_dict = set_label_encoding(df, 'service_code')
# service_type_dict = set_label_encoding(df, 'service_type')
# prelevement_type_dict = set_label_encoding(df, 'prelevement_type')
# germe_dict = set_label_encoding(df, 'germe')
# espece_requete_dict = set_label_encoding(df, 'espece_requete')
# direct_2_dict = set_label_encoding(df, '2_direct')
# culture_3_dict = set_label_encoding(df, '3_culture')
# genre_4_dict = set_label_encoding(df, '4_genre')
# espece_5_training_dict = set_label_encoding(df, '5_espece_training')
# contamination_dict = set_label_encoding(df, 'contamination')