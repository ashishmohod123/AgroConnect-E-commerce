import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    marketplace: 'Marketplace',
    mandiAnalytics: 'Mandi Analytics',
    farmerPortal: 'Farmer Portal',
    myOrders: 'My Consignments',
    adminPanel: 'Admin Panel',
    searchPlaceholder: 'Search Nagpur Oranges, Soybeans, Turmeric, Garlic...',
    allQualityGrades: 'All Quality Grades',
    gradeA: 'Grade A (Export / Premium)',
    organic: '100% Certified Organic',
    gradeB: 'Grade B (Commercial Wholesale)',
    minOrderQty: 'Max MOQ',
    addBatch: 'Add Batch',
    checkout: 'Proceed to B2B Checkout',
    savingsCalc: 'Direct Procurement Savings Calculator',
    liveMandiRates: 'Live APMC Mandi Rates',
    escrowProtected: 'Escrow Protected',
    downloadInvoice: 'Download Tax Invoice (PDF)',
    trackRoute: 'Live GPS Truck Route',
    kisanAI: 'Kisan AI Assistant',
  },
  mr: {
    marketplace: 'कृषी बाजारपेठ',
    mandiAnalytics: 'मंडी विश्लेषण',
    farmerPortal: 'शेतकरी पोर्टल',
    myOrders: 'माझ्या ऑर्डर्स',
    adminPanel: 'प्रशासक पॅनेल',
    searchPlaceholder: 'नागपूर संत्रा, हळद, सोयाबीन, लसूण शोधा...',
    allQualityGrades: 'सर्व गुणवत्ता श्रेणी',
    gradeA: 'ग्रेड-ए (निर्यात गुणवत्ता)',
    organic: '१००% सेंद्रिय प्रमाणित',
    gradeB: 'ग्रेड-बी (व्यापारी घाऊक)',
    minOrderQty: 'कमाल किमान ऑर्डर (MOQ)',
    addBatch: 'बॅच जोडा',
    checkout: 'खरेदीकडे पुढे जा',
    savingsCalc: 'थेट शेतकरी खरेदी बचत कॅल्क्युलेटर',
    liveMandiRates: 'थेट एपीएमसी कळमना बाजार भाव',
    escrowProtected: 'सुरक्षित एस्क्रो पेमेंट',
    downloadInvoice: 'कर पावती डाउनलोड करा (PDF)',
    trackRoute: 'थेट जीपीएस ट्रक ट्रॅकिंग',
    kisanAI: 'किसान एआय सहाय्यक',
  },
  hi: {
    marketplace: 'कृषि बाज़ार',
    mandiAnalytics: 'मंडी भाव विश्लेषण',
    farmerPortal: 'किसान पोर्टल',
    myOrders: 'मेरी खरीददारी',
    adminPanel: 'एडमिन पैनल',
    searchPlaceholder: 'नागपुर संतरा, हल्दी, सोयाबीन, लहसुन खोजें...',
    allQualityGrades: 'सभी गुणवत्ता श्रेणियां',
    gradeA: 'ग्रेड-ए (निर्यात गुणवत्ता)',
    organic: '100% जैविक प्रमाणित',
    gradeB: 'ग्रेड-बी (व्यापारिक थोक)',
    minOrderQty: 'अधिकतम न्यूनतम ऑर्डर (MOQ)',
    addBatch: 'बैच जोड़ें',
    checkout: 'चेकआउट हेतु आगे बढ़ें',
    savingsCalc: 'सीधी किसान खरीद बचत कैलकुलेटर',
    liveMandiRates: 'लाइव एपीएमसी मंडी भाव',
    escrowProtected: 'एस्क्रो सुरक्षित भुगतान',
    downloadInvoice: 'टैक्स इनवॉइस डाउनलोड करें (PDF)',
    trackRoute: 'लाइव जीपीएस ट्रक ट्रैकिंग',
    kisanAI: 'किसान एआई सहायक',
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('agroconnect_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('agroconnect_lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
