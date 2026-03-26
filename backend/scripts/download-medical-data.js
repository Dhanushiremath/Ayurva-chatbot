require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏥 Downloading Medical Datasets from Kaggle...\n');

// Set Kaggle credentials
process.env.KAGGLE_API_TOKEN = process.env.KAGGLE_API_TOKEN;

const datasets = [
    {
        name: 'Disease Symptoms Dataset',
        id: 'itachi9604/disease-symptom-description-dataset',
        files: ['dataset.csv']
    },
    {
        name: 'Medical Q&A Dataset',
        id: 'thedevastator/medical-question-answer-datasets',
        files: ['medical_qa.csv']
    },
    {
        name: 'Drug Information',
        id: 'prathamtripathi/drug-classification',
        files: ['drug200.csv']
    }
];

const dataDir = path.join(__dirname, '../data/kaggle');

// Create data directory
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

console.log('📁 Data directory:', dataDir);
console.log('🔑 Using Kaggle token:', process.env.KAGGLE_API_TOKEN ? 'Found' : 'NOT FOUND');
console.log('');

// Download each dataset
for (const dataset of datasets) {
    try {
        console.log(`⬇️  Downloading: ${dataset.name}`);
        console.log(`   Dataset ID: ${dataset.id}`);
        
        const command = `kaggle datasets download -d ${dataset.id} -p ${dataDir} --unzip`;
        
        execSync(command, { 
            stdio: 'inherit',
            env: { ...process.env }
        });
        
        console.log(`✅ Downloaded: ${dataset.name}\n`);
    } catch (error) {
        console.error(`❌ Failed to download ${dataset.name}:`, error.message);
        console.log('');
    }
}

console.log('\n🎉 Dataset download complete!');
console.log('📊 Check the data in:', dataDir);
console.log('\nNext steps:');
console.log('1. Run: node scripts/process-medical-data.js');
console.log('2. This will convert datasets into chatbot knowledge base');
