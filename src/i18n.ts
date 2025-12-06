import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "dashboard": "Dashboard",
            "chat": "AI Mentor",
            "tools": "Tools",
            "profile": "Profile",
            "settings": "Settings",
            "login": "Log in",
            "start_chatting": "Start Chatting",
            "welcome": "Welcome to FinGenius",
            "sign_out": "Sign Out",
            "language": "Language",

            // Dashboard
            "financial_dashboard": "Financial Dashboard",
            "welcome_back": "Welcome back, Future Billionaire.",
            "finscore": "FinScore",
            "total_balance": "Total Balance",
            "monthly_expenses": "Monthly Expenses",
            "savings_goal": "Savings Goal",
            "investment_return": "Investment Return",
            "income_vs_expenses": "Income vs Expenses",
            "portfolio_allocation": "Portfolio Allocation",
            "recent_transactions": "Recent Transactions",

            // Chat
            "ai_mentors": "AI Mentors",
            "online_ready": "Online & Ready to Help",
            "type_message": "Ask {{name}} anything...",
            "ai_disclaimer": "AI can make mistakes. Consider checking important financial information.",
            "warren_intro": "Hello there! I'm Warren. I've spent a lifetime learning about value and patience. How can I help you build your fortune today?",
            "naval_intro": "Hello. I'm Naval. I believe wealth is a skill you can learn, just like reading or driving. What specific knowledge are you looking for?",
            "dalio_intro": "Hi, I'm Ray. I view the economy and life as a machine. If we understand the principles, we can handle anything. Let's look at your situation objectively.",

            // Chat Responses (Mock)
            "invest_response": "Well, the first rule is: Never lose money. The second rule is: Never forget rule number one! Look for wonderful businesses at fair prices.",
            "crypto_response": "I'll be honest with you—I prefer assets that produce something, like a farm or a factory. Be very careful with things that don't generate value on their own.",
            "default_response": "Price is what you pay. Value is what you get. If you're thinking long-term, you're already ahead of most people."
        }
    },
    hi: {
        translation: {
            "dashboard": "डैशबोर्ड",
            "chat": "एआई मेंटर",
            "tools": "टूल्स",
            "profile": "प्रोफाइल",
            "settings": "सेटिंग्स",
            "login": "लॉग इन करें",
            "start_chatting": "चैट शुरू करें",
            "welcome": "फिनजीनियस में आपका स्वागत है",
            "sign_out": "साइन आउट",
            "language": "भाषा",

            "financial_dashboard": "वित्तीय डैशबोर्ड",
            "welcome_back": "वापसी पर स्वागत है, भविष्य के अरबपति।",
            "finscore": "फिनस्कोर",
            "total_balance": "कुल शेष",
            "monthly_expenses": "मासिक खर्च",
            "savings_goal": "बचत लक्ष्य",
            "investment_return": "निवेश रिटर्न",
            "income_vs_expenses": "आय बनाम व्यय",
            "portfolio_allocation": "पोर्टफोलियो आवंटन",
            "recent_transactions": "हाल के लेनदेन",

            "ai_mentors": "एआई मेंटर्स",
            "online_ready": "ऑनलाइन और मदद के लिए तैयार",
            "type_message": "{{name}} से कुछ भी पूछें...",
            "ai_disclaimer": "एआई गलतियाँ कर सकता है। महत्वपूर्ण वित्तीय जानकारी की जाँच करने पर विचार करें।",
            "warren_intro": "नमस्ते! मैं वॉरेन हूँ। मैंने मूल्य और धैर्य के बारे में सीखने में जीवन बिताया है। आज मैं आपकी किस्मत बनाने में कैसे मदद कर सकता हूँ?",
            "naval_intro": "नमस्ते। मैं नवल हूँ। मेरा मानना है कि धन एक कौशल है जिसे आप सीख सकते हैं। आप किस विशिष्ट ज्ञान की तलाश कर रहे हैं?",
            "dalio_intro": "नमस्ते, मैं रे हूँ। मैं अर्थव्यवस्था और जीवन को एक मशीन के रूप में देखता हूँ। आइए आपकी स्थिति को निष्पक्ष रूप से देखें।",

            "invest_response": "खैर, पहला नियम है: कभी पैसा मत खोना। दूसरा नियम है: नियम नंबर एक को कभी मत भूलना! उचित कीमतों पर शानदार व्यवसायों की तलाश करें।",
            "crypto_response": "मैं आपके साथ ईमानदार रहूंगा - मैं उन संपत्तियों को पसंद करता हूं जो कुछ उत्पादन करती हैं, जैसे खेत या कारखाना। उन चीजों से बहुत सावधान रहें जो अपने आप मूल्य उत्पन्न नहीं करती हैं।",
            "default_response": "कीमत वह है जो आप चुकाते हैं। मूल्य वह है जो आपको मिलता है। यदि आप लंबी अवधि के बारे में सोच रहे हैं, तो आप पहले से ही अधिकांश लोगों से आगे हैं।"
        }
    },
    te: {
        translation: {
            "dashboard": "డ్యాష్‌బోర్డ్",
            "chat": "AI మెంటర్",
            "tools": "టూల్స్",
            "profile": "ప్రొఫైల్",
            "settings": "సెట్టింగ్‌లు",
            "login": "లాగిన్",
            "start_chatting": "చాటింగ్ ప్రారంభించండి",
            "welcome": "ఫిన్‌జీనియస్‌కు స్వాగతం",
            "sign_out": "సైన్ అవుట్",
            "language": "భాష",

            "financial_dashboard": "ఆర్థిక డ్యాష్‌బోర్డ్",
            "welcome_back": "స్వాగతం, భవిష్యత్ బిలియనీర్.",
            "finscore": "ఫిన్‌స్కోర్",
            "total_balance": "మొత్తం నిల్వ",
            "monthly_expenses": "నెలవారీ ఖర్చులు",
            "savings_goal": "పొదుపు లక్ష్యం",
            "investment_return": "పెట్టుబడి రాబడి",
            "income_vs_expenses": "ఆదాయం vs ఖర్చులు",
            "portfolio_allocation": "పోర్ట్‌ఫోలియో కేటాయింపు",
            "recent_transactions": "ఇటీవలి లావాదేవీలు",

            "ai_mentors": "AI మెంటార్స్",
            "online_ready": "ఆన్‌లైన్ & సహాయానికి సిద్ధం",
            "type_message": "{{name}}ని ఏదైనా అడగండి...",
            "ai_disclaimer": "AI తప్పులు చేయవచ్చు. ముఖ్యమైన ఆర్థిక సమాచారాన్ని సరిచూసుకోండి.",
            "warren_intro": "నమస్కారం! నేను వారెన్. నేను విలువ మరియు సహనం గురించి నేర్చుకోవడంలో జీవితాన్ని గడిపాను. ఈ రోజు మీ సంపదను నిర్మించడంలో నేను ఎలా సహాయపడగలను?",
            "naval_intro": "నమస్కారం. నేను నావల్. సంపద అనేది మీరు నేర్చుకోగల నైపుణ్యం అని నేను నమ్ముతాను. మీరు ఏ నిర్దిష్ట జ్ఞానం కోసం చూస్తున్నారు?",
            "dalio_intro": "హాయ్, నేను రే. నేను ఆర్థిక వ్యవస్థను మరియు జీవితాన్ని ఒక యంత్రంగా చూస్తాను. మీ పరిస్థితిని నిష్పక్షపాతంగా చూద్దాం.",

            "invest_response": "సరే, మొదటి నియమం: డబ్బును ఎప్పుడూ పోగొట్టుకోవద్దు. రెండవ నియమం: మొదటి నియమాన్ని ఎప్పుడూ మర్చిపోవద్దు! సరసమైన ధరలకు అద్భుతమైన వ్యాపారాల కోసం చూడండి.",
            "crypto_response": "నేను నిజాయితీగా ఉంటాను - వ్యవసాయం లేదా ఫ్యాక్టరీ వంటి ఏదైనా ఉత్పత్తి చేసే ఆస్తులను నేను ఇష్టపడతాను. తమంతట తాముగా విలువను సృష్టించని వాటితో చాలా జాగ్రత్తగా ఉండండి.",
            "default_response": "ధర అనేది మీరు చెల్లించేది. విలువ అనేది మీరు పొందేది. మీరు దీర్ఘకాలికంగా ఆలోచిస్తుంటే, మీరు ఇప్పటికే చాలా మంది కంటే ముందంజలో ఉన్నారు."
        }
    },
    ta: {
        translation: {
            "dashboard": "டாஷ்போர்டு",
            "chat": "AI வழிகாட்டி",
            "tools": "கருவிகள்",
            "profile": "சுயவிவரம்",
            "settings": "அமைப்புகள்",
            "login": "உள்நுழைய",
            "start_chatting": "அரட்டையைத் தொடங்குங்கள்",
            "welcome": "ஃபின்ஜீனியஸுக்கு வரவேற்கிறோம்",
            "sign_out": "வெளியேறு",
            "language": "மொழி",

            "financial_dashboard": "நிதி டாஷ்போர்டு",
            "welcome_back": "மீண்டும் வருக, எதிர்கால கோடீஸ்வரரே.",
            "finscore": "ஃபின்ஸ்கோர்",
            "total_balance": "மொத்த இருப்பு",
            "monthly_expenses": "மாதாந்திர செலவுகள்",
            "savings_goal": "சேமிப்பு இலக்கு",
            "investment_return": "முதலீட்டு வருவாய்",
            "income_vs_expenses": "வருமானம் vs செலவுகள்",
            "portfolio_allocation": "போர்ட்ஃபோலியோ ஒதுக்கீடு",
            "recent_transactions": "சமீபத்திய பரிவர்த்தனைகள்",

            "ai_mentors": "AI வழிகாட்டிகள்",
            "online_ready": "ஆன்லைனில் & உதவத் தயார்",
            "type_message": "{{name}}-இடம் எதையும் கேளுங்கள்...",
            "ai_disclaimer": "AI தவறுகள் செய்யலாம். முக்கியமான நிதித் தகவலைச் சரிபார்க்கவும்.",
            "warren_intro": "வணக்கம்! நான் வாரன். மதிப்பு மற்றும் பொறுமையைப் பற்றி கற்றுக்கொள்வதில் நான் ஒரு வாழ்நாளைச் செலவிட்டேன். இன்று உங்கள் செல்வத்தை உருவாக்க நான் எப்படி உதவ முடியும்?",
            "naval_intro": "வணக்கம். நான் நவல். செல்வம் என்பது நீங்கள் கற்றுக்கொள்ளக்கூடிய ஒரு திறன் என்று நான் நம்புகிறேன். நீங்கள் என்ன குறிப்பிட்ட அறிவைத் தேடுகிறீர்கள்?",
            "dalio_intro": "ஹாய், நான் ரே. நான் பொருளாதாரத்தையும் வாழ்க்கையையும் ஒரு இயந்திரமாகப் பார்க்கிறேன். உங்கள் சூழ்நிலையை புறநிலையாகப் பார்ப்போம்.",

            "invest_response": "சரி, முதல் விதி: பணத்தை ஒருபோதும் இழக்காதீர்கள். இரண்டாவது விதி: விதி எண் ஒன்றை ஒருபோதும் மறக்காதீர்கள்! நியாயமான விலையில் அற்புதமான வணிகங்களைத் தேடுங்கள்.",
            "crypto_response": "நான் நேர்மையாக இருப்பேன் - பண்ணை அல்லது தொழிற்சாலை போன்ற எதையாவது உற்பத்தி செய்யும் சொத்துக்களை நான் விரும்புகிறேன். தானாகவே மதிப்பை உருவாக்காத விஷயங்களில் மிகவும் கவனமாக இருங்கள்.",
            "default_response": "விலை என்பது நீங்கள் செலுத்துவது. மதிப்பு என்பது நீங்கள் பெறுவது. நீங்கள் நீண்ட காலத்திற்கு யோசிக்கிறீர்கள் என்றால், நீங்கள் ஏற்கனவே பெரும்பாலான மக்களை விட முன்னிலையில் இருக்கிறீர்கள்."
        }
    },
    kn: {
        translation: {
            "dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
            "chat": "AI ಮಾರ್ಗದರ್ಶಕ",
            "tools": "ಪರಿಕರಗಳು",
            "profile": "ಪ್ರೊಫೈಲ್",
            "settings": "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
            "login": "ಲಾಗಿನ್",
            "start_chatting": "ಚಾಟಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ",
            "welcome": "ಫಿನ್‌ಜೀನಿಯಸ್‌ಗೆ ಸುಸ್ವಾಗತ",
            "sign_out": "ಸೈನ್ ಔಟ್",
            "language": "ಭಾಷೆ",

            "financial_dashboard": "ಹಣಕಾಸು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
            "welcome_back": "ಸ್ವಾಗತ, ಭವಿಷ್ಯದ ಕೋಟ್ಯಾಧಿಪತಿ.",
            "finscore": "ಫಿನ್‌ಸ್ಕೋರ್",
            "total_balance": "ಒಟ್ಟು ಬಾಕಿ",
            "monthly_expenses": "ಮಾಸಿಕ ವೆಚ್ಚಗಳು",
            "savings_goal": "ಉಳಿತಾಯ ಗುರಿ",
            "investment_return": "ಹೂಡಿಕೆ ಆದಾಯ",
            "income_vs_expenses": "ಆದಾಯ vs ವೆಚ್ಚಗಳು",
            "portfolio_allocation": "ಬಂಡವಾಳ ಹಂಚಿಕೆ",
            "recent_transactions": "ಇತ್ತೀಚಿನ ವಹಿವಾಟುಗಳು",

            "ai_mentors": "AI ಮಾರ್ಗದರ್ಶಕರು",
            "online_ready": "ಆನ್‌ಲೈನ್ ಮತ್ತು ಸಹಾಯಕ್ಕೆ ಸಿದ್ಧ",
            "type_message": "{{name}} ಅವರನ್ನು ಏನನ್ನಾದರೂ ಕೇಳಿ...",
            "ai_disclaimer": "AI ತಪ್ಪುಗಳನ್ನು ಮಾಡಬಹುದು. ಪ್ರಮುಖ ಹಣಕಾಸು ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
            "warren_intro": "ನಮಸ್ಕಾರ! ನಾನು ವಾರೆನ್. ಮೌಲ್ಯ ಮತ್ತು ತಾಳ್ಮೆಯ ಬಗ್ಗೆ ಕಲಿಯಲು ನಾನು ಜೀವನವನ್ನು ಕಳೆದಿದ್ದೇನೆ. ಇಂದು ನಿಮ್ಮ ಸಂಪತ್ತನ್ನು ನಿರ್ಮಿಸಲು ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ?",
            "naval_intro": "ನಮಸ್ಕಾರ. ನಾನು ನವಲ್. ಸಂಪತ್ತು ನೀವು ಕಲಿಯಬಹುದಾದ ಕೌಶಲ್ಯ ಎಂದು ನಾನು ನಂಬುತ್ತೇನೆ. ನೀವು ಯಾವ ನಿರ್ದಿಷ್ಟ ಜ್ಞಾನವನ್ನು ಹುಡುಕುತ್ತಿದ್ದೀರಿ?",
            "dalio_intro": "ಹಾಯ್, ನಾನು ರೇ. ನಾನು ಆರ್ಥಿಕತೆ ಮತ್ತು ಜೀವನವನ್ನು ಯಂತ್ರದಂತೆ ನೋಡುತ್ತೇನೆ. ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಯನ್ನು ವಸ್ತುನಿಷ್ಠವಾಗಿ ನೋಡೋಣ.",

            "invest_response": "ಸರಿ, ಮೊದಲ ನಿಯಮ: ಹಣವನ್ನು ಎಂದಿಗೂ ಕಳೆದುಕೊಳ್ಳಬೇಡಿ. ಎರಡನೇ ನಿಯಮ: ನಿಯಮ ಸಂಖ್ಯೆ ಒಂದನ್ನು ಎಂದಿಗೂ ಮರೆಯಬೇಡಿ! ನ್ಯಾಯಯುತ ಬೆಲೆಯಲ್ಲಿ ಅದ್ಭುತ ವ್ಯವಹಾರಗಳನ್ನು ಹುಡುಕಿ.",
            "crypto_response": "ನಾನು ಪ್ರಾಮಾಣಿಕವಾಗಿರುತ್ತೇನೆ - ಕೃಷಿ ಅಥವಾ ಕಾರ್ಖಾನೆಯಂತಹ ಏನನ್ನಾದರೂ ಉತ್ಪಾದಿಸುವ ಆಸ್ತಿಗಳನ್ನು ನಾನು ಬಯಸುತ್ತೇನೆ. ತಮ್ಮದೇ ಆದ ಮೌಲ್ಯವನ್ನು ಸೃಷ್ಟಿಸದ ವಿಷಯಗಳ ಬಗ್ಗೆ ಬಹಳ ಜಾಗರೂಕರಾಗಿರಿ.",
            "default_response": "ಬೆಲೆ ಎಂದರೆ ನೀವು ಪಾವತಿಸುವುದು. ಮೌಲ್ಯ ಎಂದರೆ ನೀವು ಪಡೆಯುವುದು. ನೀವು ದೀರ್ಘಾವಧಿಯ ಬಗ್ಗೆ ಯೋಚಿಸುತ್ತಿದ್ದರೆ, ನೀವು ಈಗಾಗಲೇ ಹೆಚ್ಚಿನ ಜನರಿಗಿಂತ ಮುಂದಿದ್ದೀರಿ."
        }
    },
    ml: {
        translation: {
            "dashboard": "ഡാഷ്‌ബോർഡ്",
            "chat": "AI മെന്റർ",
            "tools": "ടൂളുകൾ",
            "profile": "പ്രൊഫൈൽ",
            "settings": "ക്രമീകരണങ്ങൾ",
            "login": "ലോഗിൻ",
            "start_chatting": "ചാറ്റിംഗ് ആരംഭിക്കുക",
            "welcome": "ഫിൻജീനിയസിലേക്ക് സ്വാഗതം",
            "sign_out": "സൈൻ ഔട്ട്",
            "language": "ഭാഷ",

            "financial_dashboard": "സാമ്പത്തിക ഡാഷ്‌ബോർഡ്",
            "welcome_back": "സ്വാഗതം, ഭാവി കോടീശ്വരൻ.",
            "finscore": "ഫിൻ‌സ്‌കോർ",
            "total_balance": "ആകെ ബാലൻസ്",
            "monthly_expenses": "പ്രതിമാസ ചെലവുകൾ",
            "savings_goal": "സമ്പാദ്യ ലക്ഷ്യം",
            "investment_return": "നിക്ഷേപ റിട്ടേൺ",
            "income_vs_expenses": "വരുമാനം vs ചെലവുകൾ",
            "portfolio_allocation": "പോർട്ട്ഫോളിയോ അലോക്കേഷൻ",
            "recent_transactions": "സമീപകാല ഇടപാടുകൾ",

            "ai_mentors": "AI മെന്റർമാർ",
            "online_ready": "ഓൺലൈനിൽ & സഹായിക്കാൻ തയ്യാർ",
            "type_message": "{{name}}-നോട് എന്തും ചോദിക്കൂ...",
            "ai_disclaimer": "AI തെറ്റുകൾ വരുത്തിയേക്കാം. പ്രധാനപ്പെട്ട സാമ്പത്തിക വിവരങ്ങൾ പരിശോധിക്കുക.",
            "warren_intro": "നമസ്കാരം! ഞാൻ വാറൻ. മൂല്യത്തെക്കുറിച്ചും ക്ഷമയെക്കുറിച്ചും പഠിക്കാൻ ഞാൻ ഒരു ജീവിതം ചെലവഴിച്ചു. ഇന്ന് നിങ്ങളുടെ സമ്പത്ത് കെട്ടിപ്പടുക്കാൻ എനിക്ക് എങ്ങനെ സഹായിക്കാനാകും?",
            "naval_intro": "നമസ്കാരം. ഞാൻ നവൽ. സമ്പത്ത് നിങ്ങൾക്ക് പഠിക്കാൻ കഴിയുന്ന ഒരു കഴിവാണ് എന്ന് ഞാൻ വിശ്വസിക്കുന്നു. ഏത് പ്രത്യേക അറിവാണ് നിങ്ങൾ തിരയുന്നത്?",
            "dalio_intro": "ഹായ്, ഞാൻ റേ. ഞാൻ സമ്പദ്‌വ്യവസ്ഥയെയും ജീവിതത്തെയും ഒരു യന്ത്രമായാണ് കാണുന്നത്. നമുക്ക് നിങ്ങളുടെ സാഹചര്യം വസ്തുനിഷ്ഠമായി നോക്കാം.",

            "invest_response": "ശരി, ആദ്യത്തെ നിയമം: ഒരിക്കലും പണം നഷ്ടപ്പെടുത്തരുത്. രണ്ടാമത്തെ നിയമം: ഒന്നാം നമ്പർ നിയമം ഒരിക്കലും മറക്കരുത്! ന്യായമായ വിലയിൽ മികച്ച ബിസിനസ്സുകൾക്കായി തിരയുക.",
            "crypto_response": "ഞാൻ സത്യസന്ധനായിരിക്കും - ഫാം അല്ലെങ്കിൽ ഫാക്ടറി പോലെ എന്തെങ്കിലും ഉത്പാദിപ്പിക്കുന്ന ആസ്തികളാണ് ഞാൻ ഇഷ്ടപ്പെടുന്നത്. സ്വന്തമായി മൂല്യം സൃഷ്ടിക്കാത്ത കാര്യങ്ങളിൽ വളരെ ശ്രദ്ധാലുവായിരിക്കുക.",
            "default_response": "വില എന്നത് നിങ്ങൾ നൽകുന്നതാണ്. മൂല്യം എന്നത് നിങ്ങൾക്ക് ലഭിക്കുന്നതാണ്. നിങ്ങൾ ദീർഘകാലാടിസ്ഥാനത്തിൽ ചിന്തിക്കുകയാണെങ്കിൽ, നിങ്ങൾ ഇതിനകം മിക്ക ആളുകളേക്കാളും മുന്നിലാണ്."
        }
    },
    bn: {
        translation: {
            "dashboard": "ড্যাশবোর্ড",
            "chat": "এআই মেন্টর",
            "tools": "টুলস",
            "profile": "প্রোফাইল",
            "settings": "সেটিংস",
            "login": "লগ ইন",
            "start_chatting": "চ্যাট শুরু করুন",
            "welcome": "ফিনজিনিয়াসে স্বাগতম",
            "sign_out": "সাইন আউট",
            "language": "ভাষা",

            "financial_dashboard": "আর্থিক ড্যাশবোর্ড",
            "welcome_back": "স্বাগতম, ভবিষ্যতের কোটিপতি।",
            "finscore": "ফিনস্কোর",
            "total_balance": "মোট ব্যালেন্স",
            "monthly_expenses": "মাসিক খরচ",
            "savings_goal": "সঞ্চয় লক্ষ্য",
            "investment_return": "বিনিয়োগ রিটার্ন",
            "income_vs_expenses": "আয় বনাম ব্যয়",
            "portfolio_allocation": "পোর্টফোলিও বরাদ্দ",
            "recent_transactions": "সাম্প্রতিক লেনদেন",

            "ai_mentors": "এআই মেন্টরস",
            "online_ready": "অনলাইনে এবং সাহায্যের জন্য প্রস্তুত",
            "type_message": "{{name}}-কে যা খুশি জিজ্ঞাসা করুন...",
            "ai_disclaimer": "এআই ভুল করতে পারে। গুরুত্বপূর্ণ আর্থিক তথ্য যাচাই করার বিবেচনা করুন।",
            "warren_intro": "হ্যালো! আমি ওয়ারেন। আমি মান এবং ধৈর্য সম্পর্কে শিখতে সারা জীবন কাটিয়েছি। আজ আপনার সম্পদ গড়তে আমি কীভাবে সাহায্য করতে পারি?",
            "naval_intro": "হ্যালো। আমি নাভাল। আমি বিশ্বাস করি সম্পদ এমন একটি দক্ষতা যা আপনি শিখতে পারেন। আপনি কোন নির্দিষ্ট জ্ঞান খুঁজছেন?",
            "dalio_intro": "হাই, আমি রে। আমি অর্থনীতি এবং জীবনকে একটি মেশিন হিসাবে দেখি। আসুন আপনার পরিস্থিতিটি নিরপেক্ষভাবে দেখি।",

            "invest_response": "আচ্ছা, প্রথম নিয়ম হল: কখনই টাকা হারাবেন না। দ্বিতীয় নিয়ম হল: এক নম্বর নিয়মটি কখনই ভুলবেন না! ন্যায্য মূল্যে দুর্দান্ত ব্যবসার সন্ধান করুন।",
            "crypto_response": "আমি সৎ হব - আমি এমন সম্পদ পছন্দ করি যা কিছু উৎপাদন করে, যেমন খামার বা কারখানা। এমন জিনিসগুলির সাথে খুব সতর্ক থাকুন যা নিজেরা মূল্য তৈরি করে না।",
            "default_response": "দাম হল যা আপনি প্রদান করেন। মান হল যা আপনি পান। আপনি যদি দীর্ঘমেয়াদী চিন্তা করেন তবে আপনি ইতিমধ্যে বেশিরভাগ লোকের চেয়ে এগিয়ে আছেন।"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
