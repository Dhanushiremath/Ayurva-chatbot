// Translation dictionary for all supported languages
export const translations = {
  en: {
    // Header
    appName: 'Ayurva',
    appSubtitle: 'YOUR PERSONAL HEALTH COMPANION',
    
    // Tabs
    chatbot: 'Chatbot',
    location: 'Location',
    healthInsights: 'Health Insights',
    
    // Initial greeting
    initialGreeting: 'Namaste! I am Ayurva. How can I assist with your wellness journey today?',
    
    // Quick tags
    quickTags: ['Fever', 'Cold', 'Acidity', 'Dengue', 'Malaria', 'Typhoid'],
    
    // Input placeholder
    inputPlaceholder: 'Type your query here...',
    
    // Footer disclaimer
    disclaimer: 'Non-emergency medical guide only. Consult a professional.',
    
    // Intent labels
    intents: {
      symptom_check: 'Symptom Analysis',
      medicine_info: 'Medicinal Guidance',
      first_aid: 'Holistic Care',
      hospital_locator: 'Facility Search',
      wellness_tips: 'Daily Wellness'
    },
    
    // Error messages
    errorMessage: 'I apologize, something went wrong. Let\'s try focusing on your wellness again.',
    
    // Analysis label
    analysisLabel: 'Wellness Insights',
    
    // Auth page
    authWelcome: 'Your personal AI health assistant',
    loginButton: 'Login',
    signupButton: 'Sign Up',
    phonePlaceholder: 'Phone Number',
    namePlaceholder: 'Full Name',
    locationPlaceholder: 'Location (Optional)',
    ageGroupPlaceholder: 'Select Age Group',
    ageGroup1: '0-5 years',
    ageGroup2: '6-17 years',
    ageGroup3: '18-40 years',
    ageGroup4: '41-60 years',
    ageGroup5: '60+ years',
    privacyNote: 'Your data is secure and private',
    
    // Notification Settings
    notificationSettings: 'Notification Settings',
    manageAlerts: 'Manage your health alerts',
    whatsappNotifications: 'WhatsApp Notifications',
    whatsappDescription: 'Get instant health alerts and reminders on WhatsApp',
    sendTestMessage: 'Send Test Message',
    sendTestAgain: 'Send Test Again',
    sending: 'Sending...',
    testWhatsAppMessage: 'Namaste! This is a test notification from Ayurva. Your health alerts are now active! 🌿',
    testWhatsAppSuccess: 'Test message sent! Check your WhatsApp.',
    testWhatsAppError: 'Failed to send. Make sure you joined the WhatsApp sandbox.',
    noPhoneNumber: 'No phone number found',
    alertPreferences: 'Alert Preferences',
    vaccinationReminders: 'Vaccination Reminders',
    vaccinationDesc: 'Get notified about upcoming vaccinations',
    healthAlerts: 'Health Alerts',
    healthAlertsDesc: 'Disease outbreaks and preventive tips',
    followUpMessages: 'Follow-up Messages',
    followUpDesc: 'Care instructions after consultations',
    emergencyAlerts: 'Emergency Alerts',
    emergencyDesc: 'Critical health warnings',
    note: 'Note',
    sandboxNote: 'WhatsApp notifications use Twilio Sandbox. Make sure you\'ve joined the sandbox by sending the join code to the Twilio WhatsApp number.',
    saveSettings: 'Save Settings',
    
    // Hospital Locator
    nearbyHospitals: 'Nearby Hospitals',
    findHospital: 'Find Hospital',
    locationPermissionMsg: 'Please allow location access to find facilities.',
    healthInsights: 'Health Insights',
    dailyHealthTip: 'Daily Health Tip',
    airQuality: 'Air Quality',
    localHealthAlerts: 'Local Health Alerts',
    history: 'History',
    emergencySos: 'Emergency SOS',
    quickActions: 'Quick Actions',
    essentialContacts: 'Essential Contacts',
    
    // HealthSidebar specific
    pristine: 'Pristine',
    pollenAlert: 'The pollen count is rising. Consider sipping on Tulsi tea for natural immunity.',
    viewAll: 'View All',
    yesterday: 'Yesterday',
    daysAgo: 'days ago',
    persistentFeverQuery: 'Persistent Fever Query',
    medicineDosageHelp: 'Medicine Dosage Help',
    
    // ActionHub specific
    ambulance: 'Ambulance',
    emergencyCenter: 'Emergency Center',
    bloodBank: 'Blood Bank',
    ayurvedicCentersNearby: 'Ayurvedic Centers Nearby',
    nearestVaidyashala: 'Nearest Vaidyashala',
    ayurVedaWellness: 'Ayur-Veda Wellness',
    kmAway: 'km',
    openUntilSunset: 'open until sunset',
    navigateNow: 'Navigate Now',
    immediateHolisticSupport: 'Immediate Holistic Support',
    
    // HospitalMap specific
    locating: 'Locating...',
    facilitiesFound: 'facilities found',
    findingLocation: 'Finding Location',
    searchingWithin: 'Searching healthcare within',
    expandingSearch: 'Expanding...',
    findMoreArea: 'Find more area within',
    call: 'Call',
    noPhone: 'No Phone',
    getRoute: 'Get Route',
    active: 'Active',
    routeLineActive: 'Route line active on map',
    startNavigation: 'Start Navigation in Google Maps',
    emergency: 'Emergency',
    emergencyOpen: 'Emergency Open'
  },
  
  hi: {
    // Header
    appName: 'आयुर्वा (Ayurva)',
    appSubtitle: 'आपका व्यक्तिगत स्वास्थ्य साथी',
    
    // Tabs
    chatbot: 'चैटबॉट',
    location: 'स्थान',
    healthInsights: 'स्वास्थ्य जानकारी',
    
    // Initial greeting
    initialGreeting: 'नमस्ते! मैं आयुर्वा हूँ। आज मैं आपकी स्वास्थ्य यात्रा में कैसे सहायता कर सकता हूँ?',
    
    // Quick tags
    quickTags: ['बुखार', 'सर्दी', 'एसिडिटी', 'डेंगू', 'मलेरिया', 'टाइफाइड'],
    
    // Input placeholder
    inputPlaceholder: 'अपनी समस्या यहाँ लिखें...',
    
    // Footer disclaimer
    disclaimer: 'केवल गैर-आपातकालीन चिकित्सा मार्गदर्शिका। किसी पेशेवर से परामर्श लें।',
    
    // Intent labels
    intents: {
      symptom_check: 'लक्षण जांच',
      disease_info: 'रोग जानकारी',
      vaccination_info: 'टीकाकरण जानकारी',
      general_health: 'सामान्य स्वास्थ्य',
      emergency: 'आपातकाल'
    },
    
    // Error messages
    errorMessage: 'क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया बाद में पुनः प्रयास करें।',
    
    // Analysis label
    analysisLabel: 'विश्लेषण',
    
    // Auth page
    authWelcome: 'आपका व्यक्तिगत एआई स्वास्थ्य सहायक',
    loginButton: 'लॉगिन',
    signupButton: 'साइन अप',
    phonePlaceholder: 'फोन नंबर',
    namePlaceholder: 'पूरा नाम',
    locationPlaceholder: 'स्थान (वैकल्पिक)',
    ageGroupPlaceholder: 'आयु वर्ग चुनें',
    ageGroup1: '0-5 वर्ष',
    ageGroup2: '6-17 वर्ष',
    ageGroup3: '18-40 वर्ष',
    ageGroup4: '41-60 वर्ष',
    ageGroup5: '60+ वर्ष',
    privacyNote: 'आपका डेटा सुरक्षित और निजी है',
    
    // Hospital Locator
    nearbyHospitals: 'निकटतम अस्पताल',
    findHospital: 'अस्पताल खोजें',
    locationPermissionMsg: 'अपने आस-पास के अस्पतालों को देखने के लिए कृपया स्थान एक्सेस की अनुमति दें।',
    healthInsights: 'स्वास्थ्य जानकारी',
    dailyHealthTip: 'दैनिक स्वास्थ्य सुझाव',
    airQuality: 'वायु गुणवत्ता',
    localHealthAlerts: 'स्थानीय स्वास्थ्य चेतावनी',
    history: 'इतिहास',
    emergencySos: 'आपातकालीन SOS',
    quickActions: 'त्वरित कार्य',
    essentialContacts: 'आवश्यक संपर्क',
    
    // HealthSidebar specific
    pristine: 'शुद्ध',
    pollenAlert: 'पराग की संख्या बढ़ रही है। प्राकृतिक प्रतिरक्षा के लिए तुलसी की चाय पीने पर विचार करें।',
    viewAll: 'सभी देखें',
    yesterday: 'कल',
    daysAgo: 'दिन पहले',
    persistentFeverQuery: 'लगातार बुखार की समस्या',
    medicineDosageHelp: 'दवा की खुराक सहायता',
    
    // ActionHub specific
    ambulance: 'एम्बुलेंस',
    emergencyCenter: 'आपातकालीन केंद्र',
    bloodBank: 'रक्त बैंक',
    ayurvedicCentersNearby: 'आस-पास आयुर्वेदिक केंद्र',
    nearestVaidyashala: 'निकटतम वैद्यशाला',
    ayurVedaWellness: 'आयुर-वेद वेलनेस',
    kmAway: 'किमी',
    openUntilSunset: 'सूर्यास्त तक खुला',
    navigateNow: 'अभी नेविगेट करें',
    immediateHolisticSupport: 'तत्काल समग्र सहायता',
    
    // HospitalMap specific
    locating: 'खोज रहे हैं...',
    facilitiesFound: 'सुविधाएं मिलीं',
    findingLocation: 'स्थान खोज रहे हैं',
    searchingWithin: 'के भीतर स्वास्थ्य सेवा खोज रहे हैं',
    expandingSearch: 'विस्तार कर रहे हैं...',
    findMoreArea: 'के भीतर अधिक क्षेत्र खोजें',
    call: 'कॉल करें',
    noPhone: 'फोन नहीं',
    getRoute: 'रास्ता प्राप्त करें',
    active: 'सक्रिय',
    routeLineActive: 'मानचित्र पर मार्ग रेखा सक्रिय',
    startNavigation: 'Google Maps में नेविगेशन शुरू करें',
    emergency: 'आपातकाल',
    emergencyOpen: 'आपातकालीन खुला'
  },
  
  ta: {
    // Header
    appName: 'ஆயுர்வா (Ayurva)',
    appSubtitle: 'உங்கள் தனிப்பட்ட சுகாதார துணை',
    
    // Tabs
    chatbot: 'சாட்பாட்',
    location: 'இடம்',
    healthInsights: 'சுகாதார நுண்ணறிவு',
    
    // Initial greeting
    initialGreeting: 'வணக்கம்! நான் ஆயுர்வா. இன்று உங்கள் சுகாதார கேள்விகளில் நான் எவ்வாறு உதவ முடியும்?',
    
    // Quick tags
    quickTags: ['காய்ச்சல்', 'சளி', 'அமிலத்தன்மை', 'டெங்கு', 'மலேரியா', 'டைபாய்டு'],
    
    // Input placeholder
    inputPlaceholder: 'உங்கள் அறிகுறிகளை விவரிக்கவும்...',
    
    // Footer disclaimer
    disclaimer: 'அவசரமற்ற மருத்துவ வழிகாட்டி மட்டுமே. ஒரு நிபுணரை அணுகவும்.',
    
    // Intent labels
    intents: {
      symptom_check: 'அறிகுறி சோதனை',
      disease_info: 'நோய் தகவல்',
      vaccination_info: 'தடுப்பூசி தகவல்',
      general_health: 'பொது சுகாதாரம்',
      emergency: 'அவசரநிலை'
    },
    
    // Error messages
    errorMessage: 'மன்னிக்கவும், நான் ஒரு பிழையை சந்தித்தேன். பிறகு மீண்டும் முயற்சிக்கவும்.',
    
    // Analysis label
    analysisLabel: 'பகுப்பாய்வு',
    
    // Auth page
    authWelcome: 'உங்கள் தனிப்பட்ட AI சுகாதார உதவியாளர்',
    loginButton: 'உள்நுழைய',
    signupButton: 'பதிவு செய்ய',
    phonePlaceholder: 'தொலைபேಸಿ எண்',
    namePlaceholder: 'முழு பெயர்',
    locationPlaceholder: 'இடம் (விருப்பமானது)',
    ageGroupPlaceholder: 'வயது குழுவைத் தேர்ந்தெடுக்கவும்',
    ageGroup1: '0-5 வயது',
    ageGroup2: '6-17 வயது',
    ageGroup3: '18-40 வயது',
    ageGroup4: '41-60 வயது',
    ageGroup5: '60+ வயது',
    privacyNote: 'உங்கள் தரவு பாதுகாப்பானது மற்றும் தனிப்பட்டது',
    
    // Hospital Locator
    nearbyHospitals: 'அருகிலுள்ள மருத்துவமனைகள்',
    findHospital: 'மருத்துவமனையைக் கண்டுபிடி',
    locationPermissionMsg: 'உங்களுக்கு அருகிலுள்ள மருத்துவமனைகளைப் பார்க்க இருப்பிட அணுகலை அனுமதிக்கவும்.',
    healthInsights: 'சுகாதார நுண்ணறிவு',
    dailyHealthTip: 'தினசரி சுகாதார குறிப்பு',
    airQuality: 'காற்று தரம்',
    localHealthAlerts: 'உள்ளூர் சுகாதார எச்சரிக்கைகள்',
    history: 'வரலாறு',
    emergencySos: 'அவசர SOS',
    quickActions: 'விரைவு செயல்கள்',
    essentialContacts: 'அத்தியாவசிய தொடர்புகள்',
    
    // HealthSidebar specific
    pristine: 'தூய்மையான',
    pollenAlert: 'மகரந்த எண்ணிக்கை அதிகரித்து வருகிறது. இயற்கை நோய் எதிர்ப்பு சக்திக்கு துளசி தேநீர் குடிக்கவும்.',
    viewAll: 'அனைத்தையும் காண்க',
    yesterday: 'நேற்று',
    daysAgo: 'நாட்களுக்கு முன்பு',
    persistentFeverQuery: 'தொடர்ச்சியான காய்ச்சல் கேள்வி',
    medicineDosageHelp: 'மருந்து அளவு உதவி',
    
    // ActionHub specific
    ambulance: 'ஆம்புலன்ஸ்',
    emergencyCenter: 'அவசர மையம்',
    bloodBank: 'இரத்த வங்கி',
    ayurvedicCentersNearby: 'அருகிலுள்ள ஆயுர்வேத மையங்கள்',
    nearestVaidyashala: 'அருகிலுள்ள வைத்யசாலை',
    ayurVedaWellness: 'ஆயுர்-வேதா வெல்னஸ்',
    kmAway: 'கி.மீ',
    openUntilSunset: 'சூரிய அஸ்தமனம் வரை திறந்திருக்கும்',
    navigateNow: 'இப்போது வழிகாட்டு',
    immediateHolisticSupport: 'உடனடி முழுமையான ஆதரவு',
    
    // HospitalMap specific
    locating: 'கண்டறிகிறது...',
    facilitiesFound: 'வசதிகள் கிடைத்தன',
    findingLocation: 'இருப்பிடத்தைக் கண்டறிகிறது',
    searchingWithin: 'க்குள் சுகாதார சேவையைத் தேடுகிறது',
    expandingSearch: 'விரிவாக்குகிறது...',
    findMoreArea: 'க்குள் மேலும் பகுதியைக் கண்டறியவும்',
    call: 'அழைக்கவும்',
    noPhone: 'தொலைபேசி இல்லை',
    getRoute: 'வழியைப் பெறவும்',
    active: 'செயலில்',
    routeLineActive: 'வரைபடத்தில் வழி கோடு செயலில் உள்ளது',
    startNavigation: 'Google Maps இல் வழிகாட்டலைத் தொடங்கவும்',
    emergency: 'அவசரநிலை',
    emergencyOpen: 'அவசர திறந்திருக்கும்'
  },
  
  te: {
    // Header
    appName: 'ఆయుర్వా (Ayurva)',
    appSubtitle: 'మీ వ్యక్తిగత ఆరోగ్య తోడు',
    
    // Tabs
    chatbot: 'చాట్‌బాట్',
    location: 'స్థానం',
    healthInsights: 'ఆరోగ్య అంతర్దృష్టులు',
    
    // Initial greeting
    initialGreeting: 'నమస్కారం! నేను ఆయుర్వా. ఈరోజు మీ ఆరోగ్య ప్రశ్నలలో నేను ఎలా సహాయం చేయగలను?',
    
    // Quick tags
    quickTags: ['జ్వరం', 'జలుబు', 'ఆమ్లత్వం', 'డెంగ్యూ', 'మలేరియా', 'టైఫాయిడ్'],
    
    // Input placeholder
    inputPlaceholder: 'మీ లక్షణాలను వివరించండి...',
    
    // Footer disclaimer
    disclaimer: 'అత్యవసరం కాని వైద్య మార్గదర్శకం మాత్రమే. నిపుణుడిని సంప్రదించండి.',
    
    // Intent labels
    intents: {
      symptom_check: 'లక్షణ తనిఖీ',
      disease_info: 'వ్యాధి సమాచారం',
      vaccination_info: 'టీకా సమాచారం',
      general_health: 'సాధారణ ఆరోగ్యం',
      emergency: 'అత్యవసరం'
    },
    
    // Error messages
    errorMessage: 'క్షమించండి, నేను ఒక లోపాన్ని ఎదుర్కొన్నాను. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.',
    
    // Analysis label
    analysisLabel: 'విశ్లేషణ',
    
    // Auth page
    authWelcome: 'మీ వ్యక్తిగత AI ఆరోగ్య సహాయకుడు',
    loginButton: 'లాగిన్',
    signupButton: 'సైన్ అప్',
    phonePlaceholder: 'ఫోన్ నంబర్',
    namePlaceholder: 'పూర్తి పేరు',
    locationPlaceholder: 'స్థానం (ఐచ్ఛికం)',
    ageGroupPlaceholder: 'వయస్సు సమూహాన్ని ఎంచుకోండి',
    ageGroup1: '0-5 సంవత్సరాలు',
    ageGroup2: '6-17 సంవత్సరాలు',
    ageGroup3: '18-40 సంవత్సరాలు',
    ageGroup4: '41-60 సంవత్సరాలు',
    ageGroup5: '60+ సంవత్సరాలు',
    privacyNote: 'మీ డేటా సురక్షితం మరియు ప్రైవేట్',
    
    // Hospital Locator
    nearbyHospitals: 'సమీప ఆసుపత్రులు',
    findHospital: 'ఆసుపత్రిని కనుగొనండి',
    locationPermissionMsg: 'మీకు సమీపంలోని ఆసుపత్రులను చూడటానికి దయచేసి స్థాన ప్రాప్యతను అనుమతించండి.',
    healthInsights: 'ఆరోగ్య అంతర్దృష్టులు',
    dailyHealthTip: 'రోజువారీ ఆరోగ్య చిట్కా',
    airQuality: 'గాలి నాణ్యత',
    localHealthAlerts: 'స్థానిక ఆరోగ్య హెచ్చరికలు',
    history: 'చరిత్ర',
    emergencySos: 'అత్యవసర SOS',
    quickActions: 'త్వరిత చర్యలు',
    essentialContacts: 'అవసరమైన పరిచయాలు',
    
    // HealthSidebar specific
    pristine: 'స్వచ్ఛమైన',
    pollenAlert: 'పుప్పొడి సంఖ్య పెరుగుతోంది. సహజ రోగనిరోధక శక్తి కోసం తులసి టీ తాగండి.',
    viewAll: 'అన్నీ చూడండి',
    yesterday: 'నిన్న',
    daysAgo: 'రోజుల క్రితం',
    persistentFeverQuery: 'నిరంతర జ్వరం ప్రశ్న',
    medicineDosageHelp: 'ఔషధ మోతాదు సహాయం',
    
    // ActionHub specific
    ambulance: 'అంబులెన్స్',
    emergencyCenter: 'అత్యవసర కేంద్రం',
    bloodBank: 'రక్త బ్యాంకు',
    ayurvedicCentersNearby: 'సమీపంలో ఆయుర్వేద కేంద్రాలు',
    nearestVaidyashala: 'సమీప వైద్యశాల',
    ayurVedaWellness: 'ఆయుర్-వేద వెల్నెస్',
    kmAway: 'కి.మీ',
    openUntilSunset: 'సూర్యాస్తమయం వరకు తెరిచి ఉంటుంది',
    navigateNow: 'ఇప్పుడు నావిగేట్ చేయండి',
    immediateHolisticSupport: 'తక్షణ సమగ్ర మద్దతు',
    
    // HospitalMap specific
    locating: 'గుర్తిస్తోంది...',
    facilitiesFound: 'సౌకర్యాలు దొరికాయి',
    findingLocation: 'స్థానాన్ని కనుగొంటోంది',
    searchingWithin: 'లోపల ఆరోగ్య సంరక్షణ కోసం శోధిస్తోంది',
    expandingSearch: 'విస్తరిస్తోంది...',
    findMoreArea: 'లోపల మరిన్ని ప్రాంతాన్ని కనుగొనండి',
    call: 'కాల్ చేయండి',
    noPhone: 'ఫోన్ లేదు',
    getRoute: 'మార్గాన్ని పొందండి',
    active: 'క్రియాశీలం',
    routeLineActive: 'మ్యాప్‌లో మార్గం రేఖ క్రియాశీలంగా ఉంది',
    startNavigation: 'Google Maps లో నావిగేషన్ ప్రారంభించండి',
    emergency: 'అత్యవసరం',
    emergencyOpen: 'అత్యవసర తెరిచి ఉంది'
  },
  
  bn: {
    // Header
    appName: 'আয়ুর্বা (Ayurva)',
    appSubtitle: 'আপনার ব্যক্তিগত স্বাস্থ্য সঙ্গী',
    
    // Tabs
    chatbot: 'চ্যাটবট',
    location: 'অবস্থান',
    healthInsights: 'স্বাস্থ্য অন্তর্দৃষ্টি',
    
    // Initial greeting
    initialGreeting: 'হ্যালো! আমি আয়ুর্বা। আজ আপনার স্বাস্থ্য সংক্রান্ত প্রশ্নে আমি কীভাবে সাহায্য করতে পারি?',
    
    // Quick tags
    quickTags: ['জ্বর', 'সর্দি', 'অম্লতা', 'ডেঙ্গু', 'ম্যালেরিয়া', 'টাইফয়েড'],
    
    // Input placeholder
    inputPlaceholder: 'আপনার লক্ষণগুলি বর্ণনা করুন...',
    
    // Footer disclaimer
    disclaimer: 'শুধুমাত্র অ-জরুরি চিকিৎসা নির্দেশিকা। একজন পেশাদারের সাথে পরামর্শ করুন।',
    
    // Intent labels
    intents: {
      symptom_check: 'লক্ষণ পরীক্ষা',
      disease_info: 'রোগের তথ্য',
      vaccination_info: 'টিকাকরণ তথ্য',
      general_health: 'সাধারণ স্বাস্থ্য',
      emergency: 'জরুরি অবস্থা'
    },
    
    // Error messages
    errorMessage: 'দুঃখিত, আমি একটি ত্রুটির সম্মুখীন হয়েছি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।',
    
    // Analysis label
    analysisLabel: 'বিশ্লেষণ',
    
    // Auth page
    authWelcome: 'আপনার ব্যক্তিগত AI স্বাস্থ্য সহায়ক',
    loginButton: 'লগইন',
    signupButton: 'সাইন আপ',
    phonePlaceholder: 'ফোন নম্বর',
    namePlaceholder: 'পুরো নাম',
    locationPlaceholder: 'অবস্থান (ঐচ্ছিক)',
    ageGroupPlaceholder: 'বয়স গ্রুপ নির্বাচন করুন',
    ageGroup1: '০-৫ বছর',
    ageGroup2: '৬-১৭ বছর',
    ageGroup3: '১৮-৪০ বছর',
    ageGroup4: '৪১-৬০ বছর',
    ageGroup5: '৬০+ বছর',
    privacyNote: 'আপনার ডেটা সুরক্ষিত এবং ব্যক্তিগত',
    
    // Hospital Locator
    nearbyHospitals: 'নিকটবর্তী হাসপাতাল',
    findHospital: 'হাসপাতাল খুঁজুন',
    locationPermissionMsg: 'আপনার চারপাশের হাসপাতাল দেখতে অনুগ্রহ করে লোকেশন অ্যাক্সেসের অনুমতি দিন।',
    healthInsights: 'স্বাস্থ্য অন্তর্দৃষ্টি',
    dailyHealthTip: 'দৈনিক স্বাস্থ্য টিপ',
    airQuality: 'বায়ুর গুণমান',
    localHealthAlerts: 'স্থানীয় স্বাস্থ্য সতর্কতা',
    history: 'ইতিহাস',
    emergencySos: 'জরুরি SOS',
    quickActions: 'দ্রুত কর্ম',
    essentialContacts: 'প্রয়োজনীয় যোগাযোগ',
    
    // HealthSidebar specific
    pristine: 'বিশুদ্ধ',
    pollenAlert: 'পরাগ সংখ্যা বৃদ্ধি পাচ্ছে। প্রাকৃতিক রোগ প্রতিরোধ ক্ষমতার জন্য তুলসী চা পান করুন।',
    viewAll: 'সব দেখুন',
    yesterday: 'গতকাল',
    daysAgo: 'দিন আগে',
    persistentFeverQuery: 'ক্রমাগত জ্বরের প্রশ্ন',
    medicineDosageHelp: 'ওষুধের ডোজ সাহায্য',
    
    // ActionHub specific
    ambulance: 'অ্যাম্বুলেন্স',
    emergencyCenter: 'জরুরি কেন্দ্র',
    bloodBank: 'রক্ত ব্যাংক',
    ayurvedicCentersNearby: 'কাছাকাছি আয়ুর্বেদিক কেন্দ্র',
    nearestVaidyashala: 'নিকটতম বৈদ্যশালা',
    ayurVedaWellness: 'আয়ুর-বেদ ওয়েলনেস',
    kmAway: 'কিমি',
    openUntilSunset: 'সূর্যাস্ত পর্যন্ত খোলা',
    navigateNow: 'এখন নেভিগেট করুন',
    immediateHolisticSupport: 'তাৎক্ষণিক সামগ্রিক সহায়তা',
    
    // HospitalMap specific
    locating: 'সনাক্ত করা হচ্ছে...',
    facilitiesFound: 'সুবিধা পাওয়া গেছে',
    findingLocation: 'অবস্থান খুঁজে পাওয়া',
    searchingWithin: 'এর মধ্যে স্বাস্থ্যসেবা খোঁজা হচ্ছে',
    expandingSearch: 'প্রসারিত করা হচ্ছে...',
    findMoreArea: 'এর মধ্যে আরও এলাকা খুঁজুন',
    call: 'কল করুন',
    noPhone: 'ফোন নেই',
    getRoute: 'রুট পান',
    active: 'সক্রিয়',
    routeLineActive: 'মানচিত্রে রুট লাইন সক্রিয়',
    startNavigation: 'Google Maps এ নেভিগেশন শুরু করুন',
    emergency: 'জরুরি',
    emergencyOpen: 'জরুরি খোলা'
  },
  
  mr: {
    // Header
    appName: 'आयुर्वा (Ayurva)',
    appSubtitle: 'तुमचा वैयक्तिक स्वास्थ्य साथी',
    
    // Tabs
    chatbot: 'चॅटबॉट',
    location: 'स्थान',
    healthInsights: 'आरोग्य अंतर्दृष्टी',
    
    // Initial greeting
    initialGreeting: 'नमस्कार! मी आयुर्वा आहे. आज मी तुमच्या आरोग्य प्रश्नांमध्ये कशी मदत करू शकतो?',
    
    // Quick tags
    quickTags: ['ताप', 'सर्दी', 'आम्लता', 'डेंग्यू', 'मलेरिया', 'टायफॉइड'],
    
    // Input placeholder
    inputPlaceholder: 'तुमच्या लक्षणांचे वर्णन करा...',
    
    // Footer disclaimer
    disclaimer: 'केवळ गैर-आपत्कालीन वैद्यकीय मार्गदर्शक. व्यावसायिकाचा सल्ला घ्या.',
    
    // Intent labels
    intents: {
      symptom_check: 'लक्षण तपासणी',
      disease_info: 'रोग माहिती',
      vaccination_info: 'लसीकरण माहिती',
      general_health: 'सामान्य आरोग्य',
      emergency: 'आपत्कालीन'
    },
    
    // Error messages
    errorMessage: 'माफ करा, मला एक त्रुटी आली. कृपया नंतर पुन्हा प्रयत्न करा.',
    
    // Analysis label
    analysisLabel: 'विश्लेषण',
    
    // Auth page
    authWelcome: 'तुमचा वैयक्तिक AI आरोग्य सहाय्यक',
    loginButton: 'लॉगिन',
    signupButton: 'साइन अप',
    phonePlaceholder: 'फोन नंबर',
    namePlaceholder: 'पूर्ण नाव',
    locationPlaceholder: 'स्थान (पर्यायी)',
    ageGroupPlaceholder: 'वयोगट निवडा',
    ageGroup1: '0-5 वर्षे',
    ageGroup2: '6-17 वर्षे',
    ageGroup3: '18-40 वर्षे',
    ageGroup4: '41-60 वर्षे',
    ageGroup5: '60+ वर्षे',
    privacyNote: 'तुमचा डेटा सुरक्षित आणि खाजगी आहे',
    
    // Hospital Locator
    nearbyHospitals: 'जवळपासची रुग्णालये',
    findHospital: 'रुग्णालय शोधा',
    locationPermissionMsg: 'तुमच्या जवळची रुग्णालये पाहण्यासाठी कृपया लोकेशन ऍक्सेसला अनुमती द्या.',
    healthInsights: 'आरोग्य अंतर्दृष्टी',
    dailyHealthTip: 'दैनिक आरोग्य टीप',
    airQuality: 'हवेची गुणवत्ता',
    localHealthAlerts: 'स्थानिक आरोग्य सूचना',
    history: 'इतिहास',
    emergencySos: 'आपत्कालीन SOS',
    quickActions: 'द्रुत क्रिया',
    essentialContacts: 'आवश्यक संपर्क',
    
    // HealthSidebar specific
    pristine: 'शुद्ध',
    pollenAlert: 'परागकण संख्या वाढत आहे. नैसर्गिक रोगप्रतिकारक शक्तीसाठी तुळशीचा चहा प्या.',
    viewAll: 'सर्व पहा',
    yesterday: 'काल',
    daysAgo: 'दिवसांपूर्वी',
    persistentFeverQuery: 'सतत ताप प्रश्न',
    medicineDosageHelp: 'औषध डोस मदत',
    
    // ActionHub specific
    ambulance: 'रुग्णवाहिका',
    emergencyCenter: 'आपत्कालीन केंद्र',
    bloodBank: 'रक्त बँक',
    ayurvedicCentersNearby: 'जवळपास आयुर्वेदिक केंद्रे',
    nearestVaidyashala: 'जवळची वैद्यशाळा',
    ayurVedaWellness: 'आयुर्-वेद वेलनेस',
    kmAway: 'किमी',
    openUntilSunset: 'सूर्यास्तापर्यंत उघडे',
    navigateNow: 'आता नेव्हिगेट करा',
    immediateHolisticSupport: 'तात्काळ सर्वांगीण समर्थन',
    
    // HospitalMap specific
    locating: 'शोधत आहे...',
    facilitiesFound: 'सुविधा सापडल्या',
    findingLocation: 'स्थान शोधत आहे',
    searchingWithin: 'मध्ये आरोग्य सेवा शोधत आहे',
    expandingSearch: 'विस्तार करत आहे...',
    findMoreArea: 'मध्ये अधिक क्षेत्र शोधा',
    call: 'कॉल करा',
    noPhone: 'फोन नाही',
    getRoute: 'मार्ग मिळवा',
    active: 'सक्रिय',
    routeLineActive: 'नकाशावर मार्ग रेषा सक्रिय',
    startNavigation: 'Google Maps मध्ये नेव्हिगेशन सुरू करा',
    emergency: 'आपत्कालीन',
    emergencyOpen: 'आपत्कालीन उघडे'
  },
  
  kn: {
    // Header
    appName: 'ಆಯುರ್ವಾ (Ayurva)',
    appSubtitle: 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಸಂಗಾತಿ',
    
    // Tabs
    chatbot: 'ಚಾಟ್‌ಬಾಟ್',
    location: 'ಸ್ಥಳ',
    healthInsights: 'ಆರೋಗ್ಯ ಒಳನೋಟಗಳು',
    
    // Initial greeting
    initialGreeting: 'ನಮಸ್ಕಾರ! ನಾನು ಆಯುರ್ವಾ. ಇಂದು ನಿಮ್ಮ ಆರೋಗ್ಯ ಪ್ರಶ್ನೆಗಳಲ್ಲಿ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
    
    // Quick tags
    quickTags: ['ಜ್ವರ', 'ಶೀತ', 'ಆಮ್ಲತೆ', 'ಡೆಂಗ್ಯೂ', 'ಮಲೇರಿಯಾ', 'ಟೈಫಾಯಿಡ್'],
    
    // Input placeholder
    inputPlaceholder: 'ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ...',
    
    // Footer disclaimer
    disclaimer: 'ತುರ್ತು-ಅಲ್ಲದ ವೈದ್ಯಕೀಯ ಮಾರ್ಗದರ್ಶಿ ಮಾತ್ರ. ವೃತ್ತಿಪರರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    
    // Intent labels
    intents: {
      symptom_check: 'ಲಕ್ಷಣ ಪರಿಶೀಲನೆ',
      disease_info: 'ರೋಗ ಮಾಹಿತಿ',
      vaccination_info: 'ಲಸಿಕೆ ಮಾಹಿತಿ',
      general_health: 'ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ',
      emergency: 'ತುರ್ತು'
    },
    
    // Error messages
    errorMessage: 'ಕ್ಷಮಿಸಿ, ನಾನು ದೋಷವನ್ನು ಎದುರಿಸಿದೆ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    
    // Analysis label
    analysisLabel: 'ವಿಶ್ಲೇಷಣೆ',
    
    // Auth page
    authWelcome: 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ AI ಆರೋಗ್ಯ ಸಹಾಯಕ',
    loginButton: 'ಲಾಗಿನ್',
    signupButton: 'ಸೈನ್ ಅಪ್',
    phonePlaceholder: 'ಫೋನ್ ಸಂಖ್ಯೆ',
    namePlaceholder: 'ಪೂರ್ಣ ಹೆಸರು',
    locationPlaceholder: 'ಸ್ಥಳ (ಐಚ್ಛಿಕ)',
    ageGroupPlaceholder: 'ವಯಸ್ಸಿನ ಗುಂಪು ಆಯ್ಕೆಮಾಡಿ',
    ageGroup1: '0-5 ವರ್ಷಗಳು',
    ageGroup2: '6-17 ವರ್ಷಗಳು',
    ageGroup3: '18-40 ವರ್ಷಗಳು',
    ageGroup4: '41-60 ವರ್ಷಗಳು',
    ageGroup5: '60+ ವರ್ಷಗಳು',
    privacyNote: 'ನಿಮ್ಮ ಡೇಟಾ ಸುರಕ್ಷಿತ ಮತ್ತು ಖಾಸಗಿಯಾಗಿದೆ',
    
    // Hospital Locator
    nearbyHospitals: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು',
    findHospital: 'ಆಸ್ಪತ್ರೆಯನ್ನು ಹುಡುಕಿ',
    locationPermissionMsg: 'ನಿಮ್ಮ ಹತ್ತಿರವಿರುವ ಆಸ್ಪತ್ರೆಗಳನ್ನು ನೋಡಲು ದಯವಿಟ್ಟು ಸ್ಥಳ ಪ್ರವೇಶವನ್ನು ಅನುಮತಿಸಿ.',
    healthInsights: 'ಆರೋಗ್ಯ ಒಳನೋಟಗಳು',
    dailyHealthTip: 'ದೈನಂದಿನ ಆರೋಗ್ಯ ಸಲಹೆ',
    airQuality: 'ಗಾಳಿಯ ಗುಣಮಟ್ಟ',
    localHealthAlerts: 'ಸ್ಥಳೀಯ ಆರೋಗ್ಯ ಎಚ್ಚರಿಕೆಗಳು',
    history: 'ಇತಿಹಾಸ',
    emergencySos: 'ತುರ್ತು SOS',
    quickActions: 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು',
    essentialContacts: 'ಅಗತ್ಯ ಸಂಪರ್ಕಗಳು',
    
    // HealthSidebar specific
    pristine: 'ಶುದ್ಧ',
    pollenAlert: 'ಪರಾಗ ಸಂಖ್ಯೆ ಹೆಚ್ಚುತ್ತಿದೆ. ನೈಸರ್ಗಿಕ ರೋಗನಿರೋಧಕ ಶಕ್ತಿಗಾಗಿ ತುಳಸಿ ಚಹಾ ಕುಡಿಯಿರಿ.',
    viewAll: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
    yesterday: 'ನಿನ್ನೆ',
    daysAgo: 'ದಿನಗಳ ಹಿಂದೆ',
    persistentFeverQuery: 'ನಿರಂತರ ಜ್ವರ ಪ್ರಶ್ನೆ',
    medicineDosageHelp: 'ಔಷಧ ಪ್ರಮಾಣ ಸಹಾಯ',
    
    // ActionHub specific
    ambulance: 'ಆಂಬ್ಯುಲೆನ್ಸ್',
    emergencyCenter: 'ತುರ್ತು ಕೇಂದ್ರ',
    bloodBank: 'ರಕ್ತ ಬ್ಯಾಂಕ್',
    ayurvedicCentersNearby: 'ಹತ್ತಿರದ ಆಯುರ್ವೇದ ಕೇಂದ್ರಗಳು',
    nearestVaidyashala: 'ಹತ್ತಿರದ ವೈದ್ಯಶಾಲೆ',
    ayurVedaWellness: 'ಆಯುರ್-ವೇದ ವೆಲ್ನೆಸ್',
    kmAway: 'ಕಿ.ಮೀ',
    openUntilSunset: 'ಸೂರ್ಯಾಸ್ತದವರೆಗೆ ತೆರೆದಿರುತ್ತದೆ',
    navigateNow: 'ಈಗ ನ್ಯಾವಿಗೇಟ್ ಮಾಡಿ',
    immediateHolisticSupport: 'ತಕ್ಷಣದ ಸಮಗ್ರ ಬೆಂಬಲ',
    
    // HospitalMap specific
    locating: 'ಗುರುತಿಸಲಾಗುತ್ತಿದೆ...',
    facilitiesFound: 'ಸೌಲಭ್ಯಗಳು ಕಂಡುಬಂದಿವೆ',
    findingLocation: 'ಸ್ಥಳವನ್ನು ಹುಡುಕುತ್ತಿದೆ',
    searchingWithin: 'ಒಳಗೆ ಆರೋಗ್ಯ ಸೇವೆಯನ್ನು ಹುಡುಕುತ್ತಿದೆ',
    expandingSearch: 'ವಿಸ್ತರಿಸುತ್ತಿದೆ...',
    findMoreArea: 'ಒಳಗೆ ಹೆಚ್ಚಿನ ಪ್ರದೇಶವನ್ನು ಹುಡುಕಿ',
    call: 'ಕರೆ ಮಾಡಿ',
    noPhone: 'ಫೋನ್ ಇಲ್ಲ',
    getRoute: 'ಮಾರ್ಗವನ್ನು ಪಡೆಯಿರಿ',
    active: 'ಸಕ್ರಿಯ',
    routeLineActive: 'ನಕ್ಷೆಯಲ್ಲಿ ಮಾರ್ಗ ರೇಖೆ ಸಕ್ರಿಯವಾಗಿದೆ',
    startNavigation: 'Google Maps ನಲ್ಲಿ ನ್ಯಾವಿಗೇಷನ್ ಪ್ರಾರಂಭಿಸಿ',
    emergency: 'ತುರ್ತು',
    emergencyOpen: 'ತುರ್ತು ತೆರೆದಿದೆ'
  }
};

// Hook to use translations
export const useTranslation = (language) => {
  return translations[language] || translations.en;
};
