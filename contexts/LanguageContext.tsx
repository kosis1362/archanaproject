import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

type Language = 'en' | 'ne';

const translations = {
  en: {
    welcome: 'Welcome to',
    appName: 'Bechbikhan',
    tagline: "Nepal's Premier Live Commerce Marketplace",
    loginCustomer: 'Login as Customer',
    registerSeller: 'Register as Seller',
    discover: 'Discover authentic Nepali treasures from local artisans',
    home: 'Home',
    search: 'Search',
    cart: 'Cart',
    profile: 'Profile',
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    liveSessions: 'Live Sessions',
    analytics: 'Analytics',
    earnings: 'Earnings',
    settings: 'Settings',
    logout: 'Logout',
    goLive: 'Go Live',
    todayRevenue: "Today's Revenue",
    totalOrders: 'Total Orders',
    activeProducts: 'Active Products',
    storeVisitors: 'Store Visitors',
    salesOverview: 'Sales Overview',
    recentOrders: 'Recent Orders',
    topProducts: 'Top Products',
    viewAll: 'View All',
    processing: 'Processing',
    shipped: 'Shipped',
    pending: 'Pending',
    delivered: 'Delivered',
    addProduct: 'Add Product',
    manageSession: 'Manage Session',
    endLive: 'End Live',
    watching: 'watching',
    vsLastWeek: 'vs last week',
    revenuePerformance: 'Revenue performance',
    latestOrders: 'Latest customer orders',
    bestPerforming: 'Best performing items',
    reviews: 'reviews',
    prepareStore: 'Prepare Store',
    upcomingFestival: 'Upcoming Festival Sale',
    festivalMessage: 'Makar Sankranti sale starts in 3 days. Prepare your inventory!',
    goodEvening: 'Good Evening',
    storeMessage: "Here's what's happening with your store today",
    searchPlaceholder: 'Search products, orders...',
    liveNow: 'Live Now',
    flashDeals: 'Flash Deals',
    categories: 'Categories',
    trending: 'Trending',
    forYou: 'For You',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    wishlist: 'Wishlist',
    checkout: 'Checkout',
    total: 'Total',
    items: 'items',
    help: 'Help',
  },
  ne: {
    welcome: 'स्वागत छ',
    appName: 'बेचबिखान',
    tagline: 'नेपालको प्रमुख लाइभ कमर्स मार्केटप्लेस',
    loginCustomer: 'ग्राहकको रूपमा लगइन',
    registerSeller: 'विक्रेताको रूपमा दर्ता',
    discover: 'स्थानीय कारिगरहरूबाट प्रामाणिक नेपाली खजाना पत्ता लगाउनुहोस्',
    home: 'गृह',
    search: 'खोज्नुहोस्',
    cart: 'कार्ट',
    profile: 'प्रोफाइल',
    dashboard: 'ड्यासबोर्ड',
    products: 'उत्पादनहरू',
    orders: 'अर्डरहरू',
    liveSessions: 'लाइभ सत्रहरू',
    analytics: 'विश्लेषण',
    earnings: 'आम्दानी',
    settings: 'सेटिङहरू',
    logout: 'लगआउट',
    goLive: 'लाइभ जानुहोस्',
    todayRevenue: 'आजको आम्दानी',
    totalOrders: 'कुल अर्डर',
    activeProducts: 'सक्रिय उत्पादनहरू',
    storeVisitors: 'स्टोर आगन्तुक',
    salesOverview: 'बिक्री अवलोकन',
    recentOrders: 'हालका अर्डरहरू',
    topProducts: 'शीर्ष उत्पादनहरू',
    viewAll: 'सबै हेर्नुहोस्',
    processing: 'प्रशोधन',
    shipped: 'पठाइयो',
    pending: 'पर्खिरहेको',
    delivered: 'डेलिभर',
    addProduct: 'उत्पादन थप्नुहोस्',
    manageSession: 'सत्र व्यवस्थापन',
    endLive: 'लाइभ समाप्त',
    watching: 'हेर्दै',
    vsLastWeek: 'गत हप्ता भन्दा',
    revenuePerformance: 'राजस्व प्रदर्शन',
    latestOrders: 'नवीनतम ग्राहक अर्डरहरू',
    bestPerforming: 'उत्कृष्ट प्रदर्शन गर्ने वस्तुहरू',
    reviews: 'समीक्षाहरू',
    prepareStore: 'स्टोर तयार गर्नुहोस्',
    upcomingFestival: 'आगामी उत्सव बिक्री',
    festivalMessage: 'मकर संक्रान्ति बिक्री ३ दिनमा सुरु हुन्छ। आफ्नो इन्भेन्टरी तयार गर्नुहोस्!',
    goodEvening: 'शुभ साँझ',
    storeMessage: 'आज तपाईंको स्टोरमा के भइरहेको छ',
    searchPlaceholder: 'उत्पादन, अर्डर खोज्नुहोस्...',
    liveNow: 'अहिले लाइभ',
    flashDeals: 'फ्ल्यास डिल',
    categories: 'वर्गहरू',
    trending: 'ट्रेन्डिङ',
    forYou: 'तपाईंको लागि',
    addToCart: 'कार्टमा थप्नुहोस्',
    buyNow: 'अहिले किन्नुहोस्',
    wishlist: 'इच्छा सूची',
    checkout: 'चेकआउट',
    total: 'कुल',
    items: 'वस्तुहरू',
    help: 'मद्दत',
  },
};

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

export const [LanguageProvider, useLanguage] = createContextHook<LanguageState>(() => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem('bechbikhan_language');
      if (stored === 'en' || stored === 'ne') {
        setLanguageState(stored);
      }
    } catch (error) {
      console.log('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('bechbikhan_language', lang);
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || key;
  };

  return { language, setLanguage, t };
});
