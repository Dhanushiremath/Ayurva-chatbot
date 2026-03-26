import os
from dotenv import load_dotenv
from kaggle.api.kaggle_api_extended import KaggleApi

# Load environment variables
load_dotenv()

print('🏥 Downloading Medical Datasets from Kaggle...\n')

# Initialize Kaggle API
api = KaggleApi()

# Set credentials from environment
username = os.getenv('KAGGLE_USERNAME')
key = os.getenv('KAGGLE_KEY')

if username and key:
    # Set credentials manually
    os.environ['KAGGLE_USERNAME'] = username
    os.environ['KAGGLE_KEY'] = key
    
    try:
        api.authenticate()
        print('✅ Kaggle API authenticated\n')
        print(f'   Username: {username}\n')
    except Exception as e:
        print(f'❌ Authentication failed: {e}')
        print('\nPlease verify your Kaggle credentials in .env file')
        exit(1)
else:
    print('❌ KAGGLE_USERNAME or KAGGLE_KEY not found in .env')
    exit(1)

# Datasets to download
datasets = [
    {
        'name': 'Disease Symptoms',
        'id': 'itachi9604/disease-symptom-description-dataset'
    },
    {
        'name': 'Medical Q&A',
        'id': 'thedevastator/medical-question-answer-datasets'
    },
    {
        'name': 'Drug Information',
        'id': 'prathamtripathi/drug-classification'
    }
]

data_dir = 'data/kaggle'
os.makedirs(data_dir, exist_ok=True)

# Download datasets
for dataset in datasets:
    try:
        print(f"⬇️  Downloading: {dataset['name']}")
        print(f"   Dataset ID: {dataset['id']}")
        
        api.dataset_download_files(
            dataset['id'],
            path=data_dir,
            unzip=True
        )
        
        print(f"✅ Downloaded: {dataset['name']}\n")
    except Exception as e:
        print(f"❌ Failed: {e}\n")

print('\n🎉 Download complete!')
print(f'📊 Data saved in: {data_dir}')
