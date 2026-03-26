require('dotenv').config();
const mongoose = require('mongoose');
const Disease = require('./models/Disease');
const Vaccination = require('./models/Vaccination');

const diseases = [
  {
    disease_id: 'malaria_01',
    name: 'Malaria',
    symptoms: ['fever', 'chills', 'headache', 'sweating'],
    causes: 'Plasmodium parasites transmitted via Anopheles mosquitoes.',
    prevention: 'Use mosquito nets, wear long sleeves, use repellents.',
    treatment: 'Coartem, Chloroquine, or other antimalarials.',
    language: 'en'
  },
  {
    disease_id: 'dengue_01',
    name: 'Dengue',
    symptoms: ['high fever', 'severe headache', 'joint pain', 'rash'],
    causes: 'Dengue virus transmitted by Aedes mosquitoes.',
    prevention: 'Eliminate stagnant water, use mosquito nets.',
    treatment: 'Hydration, paracetamol (avoid aspirin); seek medical care.',
    language: 'en'
  },
  {
    disease_id: 'cholera_01',
    name: 'Cholera',
    symptoms: ['diarrhea', 'nausea', 'dehydration'],
    causes: 'Vibrio cholerae bacteria in contaminated water or food.',
    prevention: 'Drink safe water, maintain hygiene, wash hands.',
    treatment: 'Oral Rehydration Salts (ORS), antibiotics in severe cases.',
    language: 'en'
  }
];

const vaccinations = [
  {
    age_group: 'infant',
    vaccines: [
      { name: 'BCG', doses: 1, description: 'Protects against Tuberculosis' },
      { name: 'OPV', doses: 3, description: 'Oral Polio Vaccine' },
      { name: 'Hepatitis B', doses: 3, description: 'Protects against Hepatitis B' }
    ]
  },
  {
    age_group: 'toddler',
    vaccines: [
      { name: 'MMR', doses: 2, description: 'Measles, Mumps, Rubella' },
      { name: 'DTP', doses: 2, description: 'Diphtheria, Tetanus, Pertussis' }
    ]
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected for seeding...');
    await Disease.deleteMany({});
    await Disease.insertMany(diseases);
    
    await Vaccination.deleteMany({});
    await Vaccination.insertMany(vaccinations);
    
    console.log('Seeding complete!');
    process.exit();
  })
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
