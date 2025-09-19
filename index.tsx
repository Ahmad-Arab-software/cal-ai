import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";

// --- i18n Translations ---
const translations = {
    en: {
        // General
        add: "Add",
        save: "Save",
        edit: "Edit",
        delete: "Delete",
        close: "Close",
        cancel: "Cancel",
        calories: "Calories",
        protein: "Protein",
        carbs: "Carbs",
        fat: "Fat",
        water: "Water",
        steps: "Steps",
        grams_short: "g",
        calories_short: "cal",
        // Navigation
        home: "Home",
        planner: "Planner",
        progress: "Progress",
        coach: "Coach",
        settings: "Settings",
        // Dashboard
        streak_days: "Day Streak",
        calories_left: "Calories left",
        insight_lunch: "It looks like you might have missed logging lunch. Keep your log updated!",
        insight_dinner: "Did you forget to log dinner? A complete log helps you track better.",
        insight_hydrate: "Don't forget to stay hydrated! You're about halfway to your water goal.",
        insight_protein: "A little more protein needed to hit your goal. Maybe a high-protein snack?",
        insight_activity: "A light evening walk could be a great way to end the day.",
        insight_default: "Consistency is the key to success. Keep up the great work!",
        water_intake: "Water Intake",
        water_glasses: "of {goal} glasses",
        todays_activities: "Today's Activities",
        todays_meals: "Today's Meals",
        no_meals_logged: "No meals logged yet today.",
        todays_plan: "Today's Plan",
        log: "Log",
        todays_steps: "Today's Steps",
        steps_of_goal: "of {goal}",
        log_steps: "Log Steps",
        // Add Menu
        add_menu: "Add Menu",
        scan_meal: "Scan a meal",
        scan_barcode: "Scan Barcode",
        add_manually: "Add meal manually",
        log_activity: "Log an activity",
        add_favorite: "Add from Favorites",
        create_recipe: "Create a Recipe",
        // Modals & Screens
        edit_meal: "Edit Meal",
        add_food_manually: "Add Food Manually",
        food_name: "Food Name",
        add_meal: "Add Meal",
        save_changes: "Save Changes",
        log_again: "Log {name} again",
        delete_meal_title: "Delete Meal",
        delete_meal_confirm_message: "Are you sure you want to delete this meal from your log?",
        // Progress Screen
        track_progress: "Track Your Progress",
        todays_goal_progress: "Today's Goal Progress",
        trend: "{chart} Trend",
        your_weight: "Your Weight",
        log_in_unit: "Log in {unit}",
        not_enough_data: "Not enough data to display a chart. Log data for more days to see your trend.",
        achievements: "Achievements",
        averages_title: "Averages ({timeframe})",
        avg_daily_calories: "Avg. Daily Calories",
        // Settings
        daily_goals: "Daily Goals",
        preferences: "Preferences",
        weight_unit: "Weight Unit",
        theme: "Theme",
        accent_color: "Accent Color",
        language: "Language",
        light: "Light",
        dark: "Dark",
        english: "English",
        dutch: "Dutch",
        arabic: "Arabic",
        api_key_title: "Google AI API Key",
        api_key_desc: "Manage your Google AI API key for meal scanning.",
        api_key_label: "API Key",
        save_api_key: "Save API Key",
        data_management: "Data Management",
        data_management_desc: "Backup or restore your app data.",
        export_data: "Export Data",
        import_data: "Import Data",
        steps_goal: "Daily Step Goal",
        water_goal_hint: "1 glass is approx. 240ml. Your goal is {ml}ml.",
        // My Foods (Favorites)
        my_foods: "My Foods",
        add_from_favorites: "Add from Favorites",
        no_favorites: "You haven't saved any favorite foods yet.",
        add_to_favorites: "Add to Favorites",
        // Recipe Builder
        recipe_builder: "Recipe Builder",
        recipe_name: "Recipe Name",
        servings: "Servings",
        ingredients: "Ingredients",
        add_ingredient: "Add Ingredient",
        nutrition_per_serving: "Nutrition per Serving",
        log_one_serving: "Log 1 Serving",
        no_recipes: "You haven't created any recipes yet.",
        my_recipes: "My Recipes",
        delete_recipe_title: "Delete Recipe",
        delete_recipe_confirm_message: "Are you sure you want to delete this recipe? This action cannot be undone.",
        amount: "Amount",
        scale_servings: "Scale Servings",
        log_servings: "Log {count} Serving(s)",
        nutrition_for_servings: "Nutrition for {count} serving(s)",
        view_recipe: "View Recipe",
        // Achievements
        ach_streak_3_title: "On a Roll",
        ach_streak_3_desc: "Log meals 3 days in a row",
        ach_streak_7_title: "Committed",
        ach_streak_7_desc: "Log meals 7 days in a row",
        ach_streak_30_title: "True Dedication",
        ach_streak_30_desc: "Log meals 30 days in a row",
        ach_log_1_title: "First Step",
        ach_log_1_desc: "Log your first meal",
        ach_log_50_title: "Meal Master",
        ach_log_50_desc: "Log 50 total meals",
        ach_protein_1_title: "Protein Pro",
        ach_protein_1_desc: "Hit your protein goal once",
        ach_protein_7_title: "Protein Powerhouse",
        ach_protein_7_desc: "Hit protein goals 7 times",
        ach_scan_1_title: "Photo Finish",
        ach_scan_1_desc: "Scan your first meal",
        ach_recipe_1_title: "Chef",
        ach_recipe_1_desc: "Create your first recipe",
        // Planner
        meal_planner: "Meal Planner",
        breakfast: "Breakfast",
        lunch: "Lunch",
        dinner: "Dinner",
        snacks: "Snacks",
        add_to_plan: "Add to Plan",
        // Challenges
        challenges: "Challenges",
        challenge_hydration_hero_title: "Hydration Hero",
        challenge_hydration_hero_desc: "Hit your water goal 7 days in a row.",
        challenge_variety_voyager_title: "Variety Voyager",
        challenge_variety_voyager_desc: "Log 10 different meals.",
        challenge_balanced_day_title: "Balanced Day",
        challenge_balanced_day_desc: "Hit all your macro goals in one day.",
        // Insights
        insights: "Insights",
        insight_top_foods: "Your Top 5 Foods",
        insight_meal_timing: "Busiest Calorie Time",
        insight_macro_balance: "Average Macro Balance",
        // Motivational Modal
        awesome: "Awesome!",
        // Coach
        clear_chat_history: "Clear Chat History",
        clear_chat_confirm_title: "Clear Chat",
        clear_chat_confirm_message: "Are you sure you want to clear your chat history? This action cannot be undone.",
        voice_input_listening: "Listening...",
        voice_input_error: "Voice input is not supported or permission was denied.",
    },
    nl: {
        // General
        add: "Voeg toe",
        save: "Opslaan",
        edit: "Bewerk",
        delete: "Verwijder",
        close: "Sluiten",
        cancel: "Annuleren",
        calories: "Calorieën",
        protein: "Eiwitten",
        carbs: "Koolhydraten",
        fat: "Vetten",
        water: "Water",
        steps: "Stappen",
        grams_short: "g",
        calories_short: "cal",
        // Navigation
        home: "Home",
        planner: "Planner",
        progress: "Voortgang",
        coach: "Coach",
        settings: "Instellingen",
        // Dashboard
        streak_days: "Dagen Reeks",
        calories_left: "Calorieën over",
        insight_lunch: "Het lijkt erop dat je de lunch hebt overgeslagen. Houd je logboek bij!",
        insight_dinner: "Ben je vergeten het avondeten te loggen? Een volledig logboek helpt je beter.",
        insight_hydrate: "Vergeet niet te hydrateren! Je bent halverwege je waterdoel.",
        insight_protein: "Nog wat eiwitten nodig om je doel te bereiken. Misschien een snack?",
        insight_activity: "Een avondwandeling kan een geweldige afsluiter van de dag zijn.",
        insight_default: "Consistentie is de sleutel tot succes. Ga zo door!",
        water_intake: "Waterinname",
        water_glasses: "van de {goal} glazen",
        todays_activities: "Activiteiten van vandaag",
        todays_meals: "Maaltijden van vandaag",
        no_meals_logged: "Nog geen maaltijden gelogd vandaag.",
        todays_plan: "Plan voor Vandaag",
        log: "Log",
        todays_steps: "Stappen Vandaag",
        steps_of_goal: "van {goal}",
        log_steps: "Log Stappen",
        // Add Menu
        add_menu: "Toevoegen Menu",
        scan_meal: "Scan een maaltijd",
        scan_barcode: "Scan Streepjescode",
        add_manually: "Handmatig toevoegen",
        log_activity: "Log een activiteit",
        add_favorite: "Voeg favoriet toe",
        create_recipe: "Maak een Recept",
        // Modals & Screens
        edit_meal: "Bewerk Maaltijd",
        add_food_manually: "Handmatig Eten Toevoegen",
        food_name: "Naam van gerecht",
        add_meal: "Voeg Maaltijd Toe",
        save_changes: "Wijzigingen Opslaan",
        log_again: "Log {name} opnieuw",
        delete_meal_title: "Maaltijd Verwijderen",
        delete_meal_confirm_message: "Weet je zeker dat je deze maaltijd uit je logboek wilt verwijderen?",
        // Progress Screen
        track_progress: "Volg je Voortgang",
        todays_goal_progress: "Doelvoortgang Vandaag",
        trend: "{chart} Trend",
        your_weight: "Jouw Gewicht",
        log_in_unit: "Log in {unit}",
        not_enough_data: "Niet genoeg data voor een grafiek. Log meer dagen om je trend te zien.",
        achievements: "Prestaties",
        averages_title: "Gemiddelden ({timeframe})",
        avg_daily_calories: "Gem. Dagelijkse Calorieën",
        // Settings
        daily_goals: "Dagelijkse Doelen",
        preferences: "Voorkeuren",
        weight_unit: "Gewichtseenheid",
        theme: "Thema",
        accent_color: "Accentkleur",
        language: "Taal",
        light: "Licht",
        dark: "Donker",
        english: "Engels",
        dutch: "Nederlands",
        arabic: "Arabisch",
        api_key_title: "Google AI API Sleutel",
        api_key_desc: "Beheer je Google AI API-sleutel voor het scannen van maaltijden.",
        api_key_label: "API Sleutel",
        save_api_key: "API Sleutel Opslaan",
        data_management: "Gegevensbeheer",
        data_management_desc: "Maak een back-up of herstel je app-gegevens.",
        export_data: "Exporteer Gegevens",
        import_data: "Importeer Gegevens",
        steps_goal: "Dagelijks Stappendoel",
        water_goal_hint: "1 glas is ca. 240ml. Uw doel is {ml}ml.",
        // My Foods (Favorites)
        my_foods: "Mijn Voeding",
        add_from_favorites: "Voeg toe uit Favorieten",
        no_favorites: "Je hebt nog geen favoriete gerechten opgeslagen.",
        add_to_favorites: "Voeg toe aan favorieten",
        // Recipe Builder
        recipe_builder: "Receptenbouwer",
        recipe_name: "Naam van recept",
        servings: "Porties",
        ingredients: "Ingrediënten",
        add_ingredient: "Ingrediënt toevoegen",
        nutrition_per_serving: "Voeding per Portie",
        log_one_serving: "Log 1 Portie",
        no_recipes: "Je hebt nog geen recepten gemaakt.",
        my_recipes: "Mijn Recepten",
        delete_recipe_title: "Recept Verwijderen",
        delete_recipe_confirm_message: "Weet je zeker dat je dit recept wilt verwijderen? Deze actie kan niet ongedaan gemaakt worden.",
        amount: "Hoeveelheid",
        scale_servings: "Porties Aanpassen",
        log_servings: "Log {count} porties",
        nutrition_for_servings: "Voeding voor {count} porties",
        view_recipe: "Bekijk Recept",
        // Achievements
        ach_streak_3_title: "Goed Bezig",
        ach_streak_3_desc: "Log 3 dagen op rij",
        ach_streak_7_title: "Toegewijd",
        ach_streak_7_desc: "Log 7 dagen op rij",
        ach_streak_30_title: "Ware Toewijding",
        ach_streak_30_desc: "Log 30 dagen op rij",
        ach_log_1_title: "Eerste Stap",
        ach_log_1_desc: "Log je eerste maaltijd",
        ach_log_50_title: "Maaltijd Meester",
        ach_log_50_desc: "Log 50 maaltijden in totaal",
        ach_protein_1_title: "Eiwit Pro",
        ach_protein_1_desc: "Behaal je eiwitdoel eenmaal",
        ach_protein_7_title: "Eiwit Krachtpatser",
        ach_protein_7_desc: "Behaal 7 keer je eiwitdoel",
        ach_scan_1_title: "Foto Finish",
        ach_scan_1_desc: "Scan je eerste maaltijd",
        ach_recipe_1_title: "Chef-kok",
        ach_recipe_1_desc: "Creëer je eerste recept",
        // Planner
        meal_planner: "Maaltijdplanner",
        breakfast: "Ontbijt",
        lunch: "Lunch",
        diner: "Diner",
        snacks: "Snacks",
        add_to_plan: "Voeg toe aan Plan",
        // Challenges
        challenges: "Uitdagingen",
        challenge_hydration_hero_title: "Hydratatie Held",
        challenge_hydration_hero_desc: "Behaal 7 dagen op rij je waterdoel.",
        challenge_variety_voyager_title: "Variatie Reiziger",
        challenge_variety_voyager_desc: "Log 10 verschillende maaltijden.",
        challenge_balanced_day_title: "Gebalanceerde Dag",
        challenge_balanced_day_desc: "Behaal al je macrodoelen op één dag.",
        // Insights
        insights: "Inzichten",
        insight_top_foods: "Jouw Top 5 Voeding",
        insight_meal_timing: "Drukste Calorie-uur",
        insight_macro_balance: "Gemiddelde Macrobalans",
        // Motivational Modal
        awesome: "Geweldig!",
        // Coach
        clear_chat_history: "Chatgeschiedenis Wissen",
        clear_chat_confirm_title: "Chat Wissen",
        clear_chat_confirm_message: "Weet je zeker dat je je chatgeschiedenis wilt wissen? Deze actie kan niet ongedaan gemaakt worden.",
        voice_input_listening: "Aan het luisteren...",
        voice_input_error: "Spraakinvoer wordt niet ondersteund of toestemming is geweigerd.",
    },
    ar: {
        // General
        add: "إضافة",
        save: "حفظ",
        edit: "تعديل",
        delete: "حذف",
        close: "إغلاق",
        cancel: "إلغاء",
        calories: "سعرات حرارية",
        protein: "بروتين",
        carbs: "كربوهيدرات",
        fat: "دهون",
        water: "ماء",
        steps: "خطوات",
        grams_short: "غ",
        calories_short: "سعرة",
        // Navigation
        home: "الرئيسية",
        planner: "المنظم",
        progress: "التقدم",
        coach: "المدرب",
        settings: "الإعدادات",
        // Dashboard
        streak_days: "أيام متتالية",
        calories_left: "سعرات متبقية",
        insight_lunch: "يبدو أنك ربما نسيت تسجيل الغداء. حافظ على تحديث سجلك!",
        insight_dinner: "هل نسيت تسجيل العشاء؟ السجل الكامل يساعدك على التتبع بشكل أفضل.",
        insight_hydrate: "لا تنس الحفاظ على رطوبة جسمك! أنت على وشك الوصول إلى نصف هدفك المائي.",
        insight_protein: "تحتاج إلى المزيد من البروتين لتحقيق هدفك. ربما وجبة خفيفة غنية بالبروتين؟",
        insight_activity: "قد تكون نزهة مسائية خفيفة طريقة رائعة لإنهاء اليوم.",
        insight_default: "الاستمرارية هي مفتاح النجاح. استمر في العمل الرائع!",
        water_intake: "كمية الماء",
        water_glasses: "من {goal} أكواب",
        todays_activities: "أنشطة اليوم",
        todays_meals: "وجبات اليوم",
        no_meals_logged: "لم يتم تسجيل أي وجبات اليوم.",
        todays_plan: "خطة اليوم",
        log: "تسجيل",
        todays_steps: "خطوات اليوم",
        steps_of_goal: "من {goal}",
        log_steps: "تسجيل الخطوات",
        // Add Menu
        add_menu: "قائمة الإضافة",
        scan_meal: "مسح وجبة",
        scan_barcode: "مسح الرمز الشريطي",
        add_manually: "إضافة وجبة يدوياً",
        log_activity: "تسجيل نشاط",
        add_favorite: "إضافة من المفضلات",
        create_recipe: "إنشاء وصفة",
        // Modals & Screens
        edit_meal: "تعديل الوجبة",
        add_food_manually: "إضافة طعام يدوياً",
        food_name: "اسم الطعام",
        add_meal: "إضافة وجبة",
        save_changes: "حفظ التغييرات",
        log_again: "تسجيل {name} مرة أخرى",
        delete_meal_title: "حذف الوجبة",
        delete_meal_confirm_message: "هل أنت متأكد أنك تريد حذف هذه الوجبة من سجلك؟",
        // Progress Screen
        track_progress: "تتبع تقدمك",
        todays_goal_progress: "تقدم الهدف اليومي",
        trend: "مؤشر {chart}",
        your_weight: "وزنك",
        log_in_unit: "سجل بـ {unit}",
        not_enough_data: "لا توجد بيانات كافية لعرض الرسم البياني. سجل بيانات لأيام أكثر لرؤية اتجاهك.",
        achievements: "الإنجازات",
        averages_title: "المتوسطات ({timeframe})",
        avg_daily_calories: "متوسط السعرات اليومية",
        // Settings
        daily_goals: "الأهداف اليومية",
        preferences: "التفضيلات",
        weight_unit: "وحدة الوزن",
        theme: "المظهر",
        accent_color: "لون التمييز",
        language: "اللغة",
        light: "فاتح",
        dark: "داكن",
        english: "الإنجليزية",
        dutch: "الهولندية",
        arabic: "العربية",
        api_key_title: "مفتاح Google AI API",
        api_key_desc: "إدارة مفتاح Google AI API الخاص بك لمسح الوجبات.",
        api_key_label: "مفتاح API",
        save_api_key: "حفظ مفتاح API",
        data_management: "إدارة البيانات",
        data_management_desc: "نسخ احتياطي أو استعادة بيانات التطبيق.",
        export_data: "تصدير البيانات",
        import_data: "استيراد البيانات",
        steps_goal: "هدف الخطوات اليومي",
        water_goal_hint: "الكوب الواحد يعادل 240 مل تقريبًا. هدفك هو {ml} مل.",
        // My Foods (Favorites)
        my_foods: "أطعمتی",
        add_from_favorites: "إضافة من المفضلات",
        no_favorites: "لم تقم بحفظ أي أطعمة مفضلة بعد.",
        add_to_favorites: "إضافة إلى المفضلات",
        // Recipe Builder
        recipe_builder: "منشئ الوصفات",
        recipe_name: "اسم الوصفة",
        servings: "حصص",
        ingredients: "مكونات",
        add_ingredient: "إضافة مكون",
        nutrition_per_serving: "التغذية لكل حصة",
        log_one_serving: "تسجيل حصة واحدة",
        no_recipes: "لم تقم بإنشاء أي وصفات بعد.",
        my_recipes: "وصفاتي",
        delete_recipe_title: "حذف الوصفة",
        delete_recipe_confirm_message: "هل أنت متأكد أنك تريد حذف هذه الوصفة؟ لا يمكن التراجع عن هذا الإجراء.",
        amount: "الكمية",
        scale_servings: "تغيير الحصص",
        log_servings: "تسجيل {count} حصص",
        nutrition_for_servings: "التغذية لـ {count} حصص",
        view_recipe: "عرض الوصفة",
        // Achievements
        ach_streak_3_title: "بداية موفقة",
        ach_streak_3_desc: "سجل وجبات لـ 3 أيام متتالية",
        ach_streak_7_title: "ملتزم",
        ach_streak_7_desc: "سجل وجبات لـ 7 أيام متتالية",
        ach_streak_30_title: "تفاني حقيقي",
        ach_streak_30_desc: "سجل وجبات لـ 30 يوماً متتالياً",
        ach_log_1_title: "الخطوة الأولى",
        ach_log_1_desc: "سجل وجبتك الأولى",
        ach_log_50_title: "خبير الوجبات",
        ach_log_50_desc: "سجل 50 وجبة إجمالاً",
        ach_protein_1_title: "محترف البروتين",
        ach_protein_1_desc: "حقق هدف البروتين مرة واحدة",
        ach_protein_7_title: "قوة البروتين",
        ach_protein_7_desc: "حقق أهداف البروتين 7 مرات",
        ach_scan_1_title: "صورة ناجحة",
        ach_scan_1_desc: "امسح وجبتك الأولى",
        ach_recipe_1_title: "طاهٍ",
        ach_recipe_1_desc: "أنشئ وصفتك الأولى",
        // Planner
        meal_planner: "منظم الوجبات",
        breakfast: "فطور",
        lunch: "غداء",
        dinner: "عشاء",
        snacks: "وجبات خفيفة",
        add_to_plan: "إضافة إلى الخطة",
        // Challenges
        challenges: "التحديات",
        challenge_hydration_hero_title: "بطل الترطيب",
        challenge_hydration_hero_desc: "حقق هدف الماء لـ 7 أيام متتالية.",
        challenge_variety_voyager_title: "مستكشف التنوع",
        challenge_variety_voyager_desc: "سجل 10 وجبات مختلفة.",
        challenge_balanced_day_title: "يوم متوازن",
        challenge_balanced_day_desc: "حقق جميع أهداف الماكرو في يوم واحد.",
        // Insights
        insights: "إحصاءات",
        insight_top_foods: "أفضل 5 أطعمة لديك",
        insight_meal_timing: "أكثر أوقات السعرات الحرارية",
        insight_macro_balance: "متوسط توازن الماكرو",
        // Motivational Modal
        awesome: "رائع!",
        // Coach
        clear_chat_history: "مسح سجل الدردشة",
        clear_chat_confirm_title: "مسح الدردشة",
        clear_chat_confirm_message: "هل أنت متأكد أنك تريد مسح سجل الدردشة؟ لا يمكن التراجع عن هذا الإجراء.",
        voice_input_listening: "أستمع...",
        voice_input_error: "الإدخال الصوتي غير مدعوم أو تم رفض الإذن.",
    }
};

type Language = keyof typeof translations;

const LanguageContext = React.createContext<{
    language: Language;
    setLanguage: React.Dispatch<React.SetStateAction<Language>>;
    t: (key: keyof typeof translations['en'], options?: Record<string, string | number>) => string;
}>({
    language: 'en',
    setLanguage: () => {},
    t: (key) => key,
});

const useTranslations = () => React.useContext(LanguageContext);

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useLocalStorage<Language>('cal-ai-lang', 'en');
    
    useEffect(() => {
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    const t = useCallback((key: keyof typeof translations['en'], options?: Record<string, string | number>) => {
        let translation = translations[language][key] || translations['en'][key];
        if (options) {
            Object.entries(options).forEach(([k, v]) => {
                translation = translation.replace(`{${k}}`, String(v));
            });
        }
        return translation;
    }, [language]);
    
    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};


// --- HELPERS & HOOKS ---
const getTodayKey = (date = new Date()) => date.toISOString().split('T')[0];

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // When updating state, we want to use the latest version of the state.
            // By passing a function to setStoredValue, we get access to the previous state
            // from React's state manager, which is guaranteed to be up-to-date.
            setStoredValue(prevStoredValue => {
                const valueToStore = value instanceof Function ? value(prevStoredValue) : value;
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
                return valueToStore;
            });
        } catch (error) {
            console.error(error);
        }
    };
    return [storedValue, setValue];
};

// --- TYPES & DEFAULTS ---
const DEFAULT_GOALS = {
    calories: 2000,
    protein: 140,
    carbs: 250,
    fat: 65,
    water: 8, // in glasses
    steps: 8000,
};

type Meal = {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    image?: string;
    id: string;
    timestamp: string;
};

type Activity = {
    id: string;
    name: string;
    caloriesBurned: number;
};

type DailyLog = {
    meals: Meal[];
    water: number;
    weight: number | null;
    activities: Activity[];
    steps: number;
    proteinGoalMet?: boolean;
    macrosMet?: boolean;
    waterGoalMet?: boolean;
}

type DailyLogData = {
    [key: string]: DailyLog;
}

type ChatMessage = {
    sender: 'user' | 'ai';
    text: string;
    id: string;
};

type Timeframe = '7d' | '30d' | '90d' | '6m' | '1y' | 'all';
type WeightUnit = 'lbs' | 'kg';
type ThemeAccent = 'green' | 'coral' | 'mint' | 'lavender';
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

type FavoriteFood = Omit<Meal, 'id' | 'image' | 'timestamp'> & { id: string };
type Ingredient = Omit<Meal, 'id' | 'image' | 'timestamp'> & { amount: string };
type Recipe = {
    id: string;
    name: string;
    servings: number;
    ingredients: Ingredient[];
};
type PlannedMeal = {
    id: string; // favorite or recipe ID
    type: 'favorite' | 'recipe';
    name: string;
};
type MealPlan = {
    [dateKey: string]: {
        [mealType in MealType]?: PlannedMeal;
    };
};

type Achievement = {
    id: string;
    titleKey: keyof typeof translations['en'];
    descKey: keyof typeof translations['en'];
    icon: string;
};

const ALL_ACHIEVEMENTS: Achievement[] = [
    { id: 'streak_3', titleKey: 'ach_streak_3_title', descKey: 'ach_streak_3_desc', icon: 'local_fire_department' },
    { id: 'streak_7', titleKey: 'ach_streak_7_title', descKey: 'ach_streak_7_desc', icon: 'whatshot' },
    { id: 'streak_30', titleKey: 'ach_streak_30_title', descKey: 'ach_streak_30_desc', icon: 'rocket_launch' },
    { id: 'log_1', titleKey: 'ach_log_1_title', descKey: 'ach_log_1_desc', icon: 'flag' },
    { id: 'log_50', titleKey: 'ach_log_50_title', descKey: 'ach_log_50_desc', icon: 'restaurant_menu' },
    { id: 'protein_1', titleKey: 'ach_protein_1_title', descKey: 'ach_protein_1_desc', icon: 'egg' },
    { id: 'protein_7', titleKey: 'ach_protein_7_title', descKey: 'ach_protein_7_desc', icon: 'fitness_center' },
    { id: 'scan_1', titleKey: 'ach_scan_1_title', descKey: 'ach_scan_1_desc', icon: 'photo_camera' },
    { id: 'recipe_1', titleKey: 'ach_recipe_1_title', descKey: 'ach_recipe_1_desc', icon: 'menu_book' },
];

type Challenge = {
    id: 'hydration_hero' | 'variety_voyager' | 'balanced_day';
    titleKey: keyof typeof translations['en'];
    descKey: keyof typeof translations['en'];
    goal: number;
    icon: string;
};

const ALL_CHALLENGES: Challenge[] = [
    { id: 'hydration_hero', titleKey: 'challenge_hydration_hero_title', descKey: 'challenge_hydration_hero_desc', goal: 7, icon: 'water_drop' },
    { id: 'variety_voyager', titleKey: 'challenge_variety_voyager_title', descKey: 'challenge_variety_voyager_desc', goal: 10, icon: 'restaurant' },
    { id: 'balanced_day', titleKey: 'challenge_balanced_day_title', descKey: 'challenge_balanced_day_desc', goal: 1, icon: 'check_circle' },
];

const COMMON_ACTIVITIES = [
    // Gym & Strength
    'Weightlifting (general)', 'Deadlift', 'Squat', 'Bench Press', 'Overhead Press',
    'Barbell Row', 'Pull-ups', 'Chin-ups', 'Dumbbell Press', 'Leg Press', 'Bicep Curls',
    'Tricep Dips', 'Kettlebell Swings', 'Crossfit',
    // Cardio
    'Running', 'Jogging', 'Walking', 'Sprinting', 'Treadmill', 'Elliptical Trainer',
    'Cycling (stationary)', 'Cycling (outdoor)', 'Stair Climbing', 'Rowing Machine',
    'Jumping Jacks', 'Jump Rope', 'HIIT (High-Intensity Interval Training)', 'Aerobics',
    // Sports
    'Swimming', 'Basketball', 'Soccer', 'Tennis', 'Baseball', 'Volleyball', 'Badminton',
    'Boxing', 'Martial Arts', 'Hiking', 'Rock Climbing', 'Skiing', 'Snowboarding',
    // Mind & Body
    'Yoga', 'Pilates', 'Stretching', 'Meditation',
    // Daily Life & Chores
    'Gardening', 'House Cleaning', 'Yard Work', 'Shoveling Snow', 'Dancing',
    'Playing with kids'
];

const LBS_TO_KG = 0.453592;
const KG_TO_LBS = 2.20462;


// --- API & AI HELPERS ---
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        mealName: { type: Type.STRING, description: "A concise, descriptive name for the meal, like 'Chicken Caesar Salad' or 'Spaghetti Bolognese'." },
        totalCalories: { type: Type.NUMBER, description: "Total estimated calories. MUST be the mathematical sum of all ingredient calories." },
        totalProtein: { type: Type.NUMBER, description: "Total estimated protein in grams. MUST be the mathematical sum of all ingredient protein." },
        totalCarbs: { type: Type.NUMBER, description: "Total estimated carbohydrates in grams. MUST be the mathematical sum of all ingredient carbs." },
        totalFat: { type: Type.NUMBER, description: "Total estimated fat in grams. MUST be the mathematical sum of all ingredient fat." },
        confidenceLevel: { type: Type.STRING, description: "The estimated confidence of this analysis, must be one of: 'High', 'Medium', or 'Low'." },
        confidenceReason: { type: Type.STRING, description: "A brief, one-sentence explanation for the confidence score (e.g., 'Image is clear and all ingredients are visible', or 'Some ingredients are obscured, estimations may be less accurate')." },
        ingredients: {
            type: Type.ARRAY,
            description: "A comprehensive list of all identified ingredients. Be thorough for mixed dishes.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The specific name of the ingredient (e.g., 'grilled chicken breast')." },
                    amount: { type: Type.STRING, description: "The estimated amount of this ingredient (e.g., '150g', '1 cup', '1 whole')." },
                    calories: { type: Type.NUMBER, description: "Estimated calories for THIS INGREDIENT ONLY." },
                    protein: { type: Type.NUMBER, description: "Estimated protein in grams for THIS INGREDIENT ONLY." },
                    carbs: { type: Type.NUMBER, description: "Estimated carbohydrates in grams for THIS INGREDIENT ONLY." },
                    fat: { type: Type.NUMBER, description: "Estimated fat in grams for THIS INGREDIENT ONLY." },
                },
                required: ["name", "amount", "calories", "protein", "carbs", "fat"],
            }
        }
    },
    required: ["mealName", "totalCalories", "totalProtein", "totalCarbs", "totalFat", "ingredients", "confidenceLevel", "confidenceReason"]
};

const productAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        productName: { type: Type.STRING, description: "The full name of the product or drink, including brand if visible (e.g., 'Nature Valley Crunchy Oats 'n Honey', 'Coca-Cola Zero Sugar')." },
        servingSize: { type: Type.STRING, description: "The serving size as stated on the label (e.g., '2 bars (42g)', '1 can (330ml)')." },
        calories: { type: Type.NUMBER, description: "Calories per serving." },
        protein: { type: Type.NUMBER, description: "Protein in grams per serving." },
        carbs: { type: Type.NUMBER, description: "Total carbohydrates in grams per serving." },
        fat: { type: Type.NUMBER, description: "Total fat in grams per serving." },
        confidenceLevel: { type: Type.STRING, description: "The estimated confidence of this analysis, must be one of: 'High', 'Medium', or 'Low'." },
        confidenceReason: { type: Type.STRING, description: "A brief, one-sentence explanation for the confidence score (e.g., 'Nutrition label is clear and fully legible.', or 'Text is blurry and some values may be incorrect.')." },
    },
    required: ["productName", "servingSize", "calories", "protein", "carbs", "fat", "confidenceLevel", "confidenceReason"]
};

const suggestionSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The common name of the food item." },
            servings: {
                type: Type.ARRAY,
                description: "A list of common serving sizes and their nutritional information.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        description: { type: Type.STRING, description: "The description of the serving size (e.g., '1 cup', '100g', '1 medium')." },
                        calories: { type: Type.NUMBER },
                        protein: { type: Type.NUMBER },
                        carbs: { type: Type.NUMBER },
                        fat: { type: Type.NUMBER },
                    },
                    required: ["description", "calories", "protein", "carbs", "fat"],
                }
            }
        },
        required: ["name", "servings"],
    }
};

const getAIInsight = (todayLog: DailyLog, goals: typeof DEFAULT_GOALS, t: (key: keyof typeof translations['en']) => string): {text: string, icon: string} => {
    const consumedCalories = todayLog.meals.reduce((sum, meal) => sum + meal.calories, 0);
    const consumedProtein = todayLog.meals.reduce((sum, meal) => sum + meal.protein, 0);
    const mealCount = todayLog.meals.length;
    const hour = new Date().getHours();

    if (hour >= 14 && hour < 19 && mealCount < 1) {
        return { text: t('insight_lunch'), icon: "lunch_dining" };
    }
    if (hour >= 20 && mealCount < 2) {
        return { text: t('insight_dinner'), icon: "dinner_dining" };
    }
    if (todayLog.water < (goals.water / 2) && hour > 15) {
        return { text: t('insight_hydrate'), icon: "water_drop" };
    }
    if (consumedProtein < (goals.protein * 0.8) && hour > 19) {
        return { text: t('insight_protein'), icon: "egg" };
    }
     if (todayLog.activities.length === 0 && hour > 16) {
         return { text: t('insight_activity'), icon: "directions_walk" };
    }
    return { text: t('insight_default'), icon: "task_alt" };
};

const generateAiContext = (dailyLog: DailyLogData, goals: typeof DEFAULT_GOALS, weightUnit: WeightUnit): string => {
    const todayKey = getTodayKey();
    const todayLog = dailyLog[todayKey] || { meals: [], water: 0, weight: null, activities: [], steps: 0 };

    const consumed = todayLog.meals.reduce((acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    const displayWeight = todayLog.weight !== null ? (weightUnit === 'kg' ? todayLog.weight * LBS_TO_KG : todayLog.weight) : null;

    let context = `
    This is a summary of the user's data. Use this to provide personalized advice. Do not repeat this summary in your response.

    **User's Goals:**
    - Calories: ${goals.calories} kcal, Protein: ${goals.protein}g, Carbs: ${goals.carbs}g, Fat: ${goals.fat}g, Steps: ${goals.steps}

    **Today's Progress:**
    - Consumed: ${Math.round(consumed.calories)}/${goals.calories} kcal, ${Math.round(consumed.protein)}g Protein, ${Math.round(consumed.carbs)}g Carbs, ${Math.round(consumed.fat)}g Fat.
    - Water: ${todayLog.water} glasses.
    - Steps: ${todayLog.steps || 0}/${goals.steps}.
    - Weight: ${displayWeight ? `${displayWeight.toFixed(1)} ${weightUnit}` : 'Not logged today'}.
    - Activities: ${todayLog.activities.length > 0 ? todayLog.activities.map(a => `${a.name} (${a.caloriesBurned} cal)`).join(', ') : 'None logged'}.

    The user's message is below. Respond as "Cal", a friendly and encouraging coach. Keep responses concise (under 100 words).
    ---
    `;
    return context;
};

// --- UI COMPONENTS ---
const Loader = ({ message }: { message: string }) => (
    <div className="loader-overlay">
        <div className="spinner"></div>
        <p>{message}</p>
    </div>
);

const ApiKeyModal = ({ onKeySaved }: { onKeySaved: (key: string) => void }) => {
    const [key, setKey] = useState('');

    const handleSave = () => {
        if (key.trim()) {
            onKeySaved(key.trim());
        }
    };

    return (
        <div className="api-key-modal-overlay">
            <div className="api-key-modal-content card">
                <h3>Google AI API Key Required</h3>
                <p>
                    To enable AI features like meal scanning, you need a Google AI API key.
                    You can get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>.
                </p>
                <div className="form-group">
                    <label htmlFor="apiKey">Your API Key</label>
                    <input
                        type="password"
                        id="apiKey"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="Enter your new API key here"
                    />
                </div>
                <button onClick={handleSave} className="action-button">Save Key</button>
            </div>
        </div>
    );
};

const CircularProgress = ({ percentage, strokeWidth = 8, size = 100, color = 'currentColor', children }: { percentage: number, strokeWidth?: number, size?: number, color?: string, children?: React.ReactNode }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="circular-progress-container" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="circular-progress">
                <circle className="bg" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
                <circle className="fg" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} r={radius} cx={size / 2} cy={size / 2} style={{ color }} />
            </svg>
            {children && <div className="circular-progress-child">{children}</div>}
        </div>
    );
};

const MealCard = ({ meal, onLogAgain, onEdit, onDelete }: { meal: Meal, onLogAgain: (meal: Meal) => void, onEdit: (meal: Meal) => void, onDelete: (id: string) => void }) => {
    const { t } = useTranslations();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
    <div className="meal-card">
        {meal.image && <img src={meal.image} alt={meal.name} />}
        {!meal.image && <div className="meal-card-placeholder"><span className="material-symbols-outlined">restaurant</span></div>}
        <div className="meal-card-info">
            <h4>{meal.name}</h4>
            <div className="meal-card-macros">
                <span>🔥 {meal.calories} {t('calories_short')}</span>
                <span>∙ P {meal.protein}{t('grams_short')}</span>
                <span>∙ C {meal.carbs}{t('grams_short')}</span>
                <span>∙ F {meal.fat}{t('grams_short')}</span>
            </div>
        </div>
        <div className="meal-card-actions" ref={menuRef}>
            <button className="more-options-button" onClick={() => setMenuOpen(p => !p)} aria-label="More options">
                <span className="material-symbols-outlined">more_vert</span>
            </button>
            {menuOpen && (
                <div className="meal-card-menu">
                    <button onClick={() => { onLogAgain(meal); setMenuOpen(false); }}>{t('log_again', { name: '' }).trim()}</button>
                    <button onClick={() => { onEdit(meal); setMenuOpen(false); }}>{t('edit')}</button>
                    <button onClick={() => { onDelete(meal.id); setMenuOpen(false); }} className="delete">{t('delete')}</button>
                </div>
            )}
        </div>
    </div>
)};

const BottomNav = ({ active, setActive }: { active: string, setActive: (screen: string) => void }) => {
    const { t } = useTranslations();
    const navItems = [
        { id: 'dashboard', icon: 'home', label: t('home') },
        { id: 'planner', icon: 'calendar_month', label: t('planner') },
        { id: 'progress', icon: 'show_chart', label: t('progress') },
        { id: 'coach', icon: 'smart_toy', label: t('coach') },
        { id: 'settings', icon: 'settings', label: t('settings') }
    ];

    return (
        <nav className="bottom-nav">
             {navItems.map(item => (
                <button key={item.id} onClick={() => setActive(item.id)} className={`nav-item ${active === item.id ? 'active' : ''}`} aria-label={item.label}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span className="label">{item.label}</span>
                </button>
             ))}
        </nav>
    );
};


// --- SCREENS & MODALS ---

const AddOptions = ({ onSelect }: { onSelect: (option: string) => void}) => {
    const { t } = useTranslations();
    return (
    <div className="add-options-container">
        <button onClick={() => onSelect('scan_meal')} className="add-option-button" aria-label={t('scan_meal')}>
            <span className="material-symbols-outlined">photo_camera</span>
        </button>
        <button onClick={() => onSelect('scan_barcode')} className="add-option-button" aria-label={t('scan_barcode')}>
            <span className="material-symbols-outlined">barcode_scanner</span>
        </button>
         <button onClick={() => onSelect('manual')} className="add-option-button" aria-label={t('add_manually')}>
            <span className="material-symbols-outlined">edit</span>
        </button>
        <button onClick={() => onSelect('favorites')} className="add-option-button" aria-label={t('add_favorite')}>
            <span className="material-symbols-outlined">star</span>
        </button>
        <button onClick={() => onSelect('recipe')} className="add-option-button" aria-label={t('create_recipe')}>
            <span className="material-symbols-outlined">menu_book</span>
        </button>
         <button onClick={() => onSelect('activity')} className="add-option-button" aria-label={t('log_activity')}>
            <span className="material-symbols-outlined">directions_run</span>
        </button>
    </div>
)};

const TodaysPlan = ({ plan, onLogMeal, recipes, favorites }: { plan: {[key in MealType]?: PlannedMeal}, onLogMeal: (meal: Omit<Meal, 'id' | 'timestamp'>, mealType: MealType) => void, recipes: Recipe[], favorites: FavoriteFood[] }) => {
    const { t } = useTranslations();

    const getMealFromPlan = (plannedMeal: PlannedMeal): Omit<Meal, 'id'|'timestamp'> | null => {
        if (plannedMeal.type === 'favorite') {
            return favorites.find(f => f.id === plannedMeal.id) || null;
        }
        if (plannedMeal.type === 'recipe') {
            const recipe = recipes.find(r => r.id === plannedMeal.id);
            if (!recipe) return null;

            const total = recipe.ingredients.reduce((acc, ing) => ({
                calories: acc.calories + ing.calories, protein: acc.protein + ing.protein,
                carbs: acc.carbs + ing.carbs, fat: acc.fat + ing.fat,
            }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

            return {
                name: `${recipe.name} (1 serving)`,
                calories: Math.round(total.calories / recipe.servings),
                protein: Math.round(total.protein / recipe.servings),
                carbs: Math.round(total.carbs / recipe.servings),
                fat: Math.round(total.fat / recipe.servings),
            };
        }
        return null;
    }

    const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];
    const plannedItems = mealTypes.map(type => ({ type, meal: plan[type] })).filter(item => item.meal);

    if (plannedItems.length === 0) {
        return null;
    }

    return (
        <div className="card">
            <h2 className="section-header">{t('todays_plan')}</h2>
            <div className="todays-plan-list">
                {plannedItems.map(({ type, meal }) => (
                    <div key={type} className="planned-meal-item">
                        <div className="planned-meal-info">
                            <span className="meal-type-label">{t(type)}</span>
                            <span className="meal-name">{meal!.name}</span>
                        </div>
                        <button className="action-button-small" onClick={() => {
                            const mealToLog = getMealFromPlan(meal!);
                            if (mealToLog) onLogMeal(mealToLog, type);
                        }}>{t('log')}</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WaterGlassVisual = ({ percentage }: { percentage: number }) => {
    const fullHeight = 115; // Max height of water in SVG units
    const topY = 20; // Top Y position when full
    const waterHeight = Math.max(0, (percentage / 100) * fullHeight);
    const waterY = topY + fullHeight - waterHeight;

    return (
        <svg width="120" height="180" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="water-glass-svg-single">
            {/* Water that fills up */}
            <rect
                className="water-fill"
                x="21"
                y={waterY}
                width="58"
                height={waterHeight}
                rx="5" // Slightly rounded corners for a softer look
            />
            {/* Glass outline */}
            <path 
                className="glass-outline"
                d="M10 10 L20 140 H 80 L 90 10 H 10 Z"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Top rim of the glass */}
            <path 
                className="glass-outline"
                d="M90 10 C 90 25, 70 35, 50 35 C 30 35, 10 25, 10 10"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

const DashboardScreen = ({ todayLog, goals, onUpdateWater, onLogAgain, onDeleteActivity, onEditActivity, streak, mealPlan, onLogPlannedMeal, recipes, favorites, onEditMeal, onDeleteMeal, onLogSteps }: { todayLog: DailyLog, goals: typeof DEFAULT_GOALS, onUpdateWater: (amount: number) => void, onLogAgain: (meal: Meal) => void, onDeleteActivity: (id: string) => void, onEditActivity: (activity: Activity) => void, streak: number, mealPlan: MealPlan, onLogPlannedMeal: (meal: Omit<Meal, 'id'|'timestamp'>, mealType: MealType) => void, recipes: Recipe[], favorites: FavoriteFood[], onEditMeal: (meal: Meal) => void, onDeleteMeal: (id: string) => void, onLogSteps: (steps: number) => void }) => {
    const { t } = useTranslations();
    const [stepInput, setStepInput] = useState('');
    
    const consumed = todayLog.meals.reduce((acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const totalCaloriesBurned = todayLog.activities.reduce((sum, act) => sum + act.caloriesBurned, 0);
    const caloriesGoalWithActivity = goals.calories + totalCaloriesBurned;
    const caloriesLeft = caloriesGoalWithActivity - consumed.calories;
    const consumedPercentage = caloriesGoalWithActivity > 0 ? (consumed.calories / caloriesGoalWithActivity) * 100 : 0;
    const insight = getAIInsight(todayLog, goals, t);
    
    const todaysPlanData = mealPlan[getTodayKey()] || {};
    
    const handleAddSteps = () => {
        const steps = parseInt(stepInput);
        if (steps > 0) {
            onLogSteps(steps);
            setStepInput('');
        }
    };
    
    const currentSteps = todayLog.steps || 0;
    const stepPercentage = goals.steps > 0 ? (currentSteps / goals.steps) * 100 : 0;

    const handleWaterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        const currentWater = todayLog.water;
        if (!isNaN(value) && value >= 0) {
            const delta = value - currentWater;
            onUpdateWater(delta);
        } else if (e.target.value === '') {
            const delta = 0 - currentWater;
            onUpdateWater(delta);
        }
    };
    
    const waterPercentage = goals.water > 0 ? Math.min(100, (todayLog.water / goals.water) * 100) : 0;

    return (
    <>
        <header className="app-header">
            <div className="app-header-logo">
                 <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25.4382 17.7191C25.5506 20.9438 23.3663 25.1303 20.4674 25.3528C18.6697 25.4831 17.2045 24.364 16.0315 24.364C14.8584 24.364 13.5056 25.4607 11.9685 25.4607C9.09213 25.4607 6.42247 21.3618 6.42247 17.218C6.42247 13.582 8.65169 9.69663 11.5281 9.56629C13.3258 9.47865 14.973 10.7079 16.0315 10.7079C17.09 10.7079 18.909 9.47865 20.7528 9.56629C22.0427 9.63146 23.2382 10.2315 24.018 11.164C22.0427 12.3056 20.8472 14.6135 20.8472 17.1528C20.8472 20.4517 23.3438 21.9843 23.3438 21.9843C23.2382 22.0719 25.3326 17.809 25.4382 17.7191Z" fill="currentColor"></path><path d="M19.4562 7.72135C20.2135 6.83371 20.5461 5.61798 20.4382 4.40225C19.1258 4.53258 17.9303 5.24494 17.1506 6.13258C16.3483 6.93258 15.8831 8.09551 16.0315 9.25843C17.418 9.23596 18.636 8.56854 19.4562 7.72135Z" fill="currentColor"></path></svg>
                <span>Cal AI</span>
            </div>
             <div className="day-streak">
                <span className="material-symbols-outlined">local_fire_department</span>
                <span>{streak}</span>
            </div>
        </header>
        <main>
            <div className="card summary-card">
                <div className="summary-card-left">
                    <div className="amount">{Math.round(caloriesLeft).toLocaleString()}</div>
                    <div className="label">{t('calories_left')}</div>
                </div>
                <div className="summary-card-right">
                    <CircularProgress percentage={consumedPercentage} size={80} strokeWidth={10} color="var(--primary)">
                       <span className="material-symbols-outlined">restaurant</span>
                    </CircularProgress>
                </div>
            </div>

            <div className="card macros-card">
                 <div className="macro-item">
                    <CircularProgress percentage={(consumed.protein/goals.protein)*100} size={70} strokeWidth={8} color="var(--accent-protein)">
                        <span className="material-symbols-outlined">egg</span>
                    </CircularProgress>
                    <div className="amount">{Math.round(consumed.protein)}{t('grams_short')}</div>
                    <div className="label">{t('protein')}</div>
                </div>
                <div className="macro-item">
                    <CircularProgress percentage={(consumed.carbs/goals.carbs)*100} size={70} strokeWidth={8} color="var(--accent-carbs)">
                        <span className="material-symbols-outlined">bakery_dining</span>
                    </CircularProgress>
                    <div className="amount">{Math.round(consumed.carbs)}{t('grams_short')}</div>
                    <div className="label">{t('carbs')}</div>
                </div>
                <div className="macro-item">
                     <CircularProgress percentage={(consumed.fat/goals.fat)*100} size={70} strokeWidth={8} color="var(--accent-fats)">
                        <span className="material-symbols-outlined">spa</span>
                     </CircularProgress>
                    <div className="amount">{Math.round(consumed.fat)}{t('grams_short')}</div>
                    <div className="label">{t('fat')}</div>
                </div>
            </div>
            
            <TodaysPlan plan={todaysPlanData} onLogMeal={onLogPlannedMeal} recipes={recipes} favorites={favorites} />
            
            <div className="card insight-card">
                <span className="material-symbols-outlined">{insight.icon}</span>
                <p>{insight.text}</p>
            </div>

            <div className="card step-card">
                <div className="step-card-progress">
                    <CircularProgress percentage={stepPercentage} size={80} strokeWidth={10} color="var(--primary)">
                       <span className="material-symbols-outlined">footprint</span>
                    </CircularProgress>
                </div>
                <div className="step-card-content">
                    <h3>{t('todays_steps')}</h3>
                    <p className="amount">{currentSteps.toLocaleString()} {t('steps_of_goal', {goal: goals.steps.toLocaleString()})}</p>
                    <div className="log-steps-form">
                        <input type="number" value={stepInput} onChange={e => setStepInput(e.target.value)} placeholder={t('log_steps')} />
                        <button onClick={handleAddSteps}>{t('add')}</button>
                    </div>
                </div>
            </div>
            
            <div className="card water-card">
                <h3>{t('water_intake')}</h3>
                <div className="water-glass-visual-container">
                    <WaterGlassVisual percentage={waterPercentage} />
                </div>
                 <div className="water-input-controls">
                    <button onClick={() => onUpdateWater(-1)} disabled={todayLog.water <= 0} aria-label="Decrease water intake by one glass">
                        <span className="material-symbols-outlined">remove</span>
                    </button>
                    <input
                        type="number"
                        className="water-input-display"
                        value={todayLog.water}
                        onChange={handleWaterInputChange}
                        aria-label="Current water intake in glasses"
                        min="0"
                    />
                    <button onClick={() => onUpdateWater(1)} aria-label="Increase water intake by one glass">
                        <span className="material-symbols-outlined">add</span>
                    </button>
                </div>
                <p className="amount">{todayLog.water} {t('water_glasses', {goal: goals.water})}</p>
                <p className="hint-text">{t('water_goal_hint', { ml: goals.water * 240 })}</p>
            </div>

            {todayLog.activities.length > 0 &&
                <div className="card">
                    <h2 className="section-header">{t('todays_activities')}</h2>
                    {todayLog.activities.map(activity => (
                        <div key={activity.id} className="activity-item">
                            <div className="activity-info">
                                <span>{activity.name}</span>
                                <span className="calories-burned">🔥 {activity.caloriesBurned} {t('calories_short')}</span>
                            </div>
                            <div className="activity-actions">
                                <button onClick={() => onEditActivity(activity)} aria-label="Edit activity"><span className="material-symbols-outlined">edit</span></button>
                                <button onClick={() => onDeleteActivity(activity.id)} aria-label="Delete activity"><span className="material-symbols-outlined">delete</span></button>
                            </div>
                        </div>
                    ))}
                </div>
            }
            
            <div className="card recent-meals-card">
                <h2 className="section-header">{t('todays_meals')}</h2>
                <div className="recent-meals-list">
                    {todayLog.meals.length > 0 ? todayLog.meals.map((meal) => (
                        <MealCard key={meal.id} meal={meal} onLogAgain={onLogAgain} onEdit={onEditMeal} onDelete={onDeleteMeal} />
                    )) : <p className="empty-state">{t('no_meals_logged')}</p>}
                </div>
            </div>
        </main>
    </>
    )
};

const CameraScreen = ({ onBack, onMealAdded, onFixResults, ai, onUnlockAchievement, scanMode }: { onBack: () => void, onMealAdded: (meal: Omit<Meal, 'id'|'timestamp'>) => void, onFixResults: (analysis: any) => void, ai: GoogleGenAI | null, onUnlockAchievement: (id: string) => void, scanMode: 'scan_meal' | 'scan_barcode' }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslations();
    const [showIngredients, setShowIngredients] = useState(false);

    const isMealMode = scanMode === 'scan_meal';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setAnalysis(null);
            setShowIngredients(false);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!imageFile || !ai) return;
        setIsLoading(true);
        setError(null);
        try {
            const imagePart = await fileToGenerativePart(imageFile);
            
            const mealPrompt = `You are an expert nutritionist AI. Your task is to analyze the food in this image with the highest possible accuracy, paying close attention to complex and mixed dishes.

Follow these steps precisely:
1.  **Identify each individual ingredient.** Be specific (e.g., 'romaine lettuce', 'sourdough croutons', 'shaved parmesan cheese').
2.  **Estimate quantity and nutrition for each ingredient.** Provide a reasonable weight or volume and the corresponding nutritional values (calories, protein, carbs, fat).
3.  **Sum the ingredient nutrition.** The 'total' values in your output MUST be the precise mathematical sum of the individual ingredient values you identified.
4.  **Assess Confidence.** Based on image quality, food complexity, and visibility of all items, provide a confidence level ('High', 'Medium', or 'Low') and a brief reason for it. For example, a 'Low' confidence might be due to a blurry image, while 'High' confidence implies a clear image of a simple dish.

Provide a concise name for the meal and respond ONLY with the requested JSON object.`;

            const productPrompt = `You are an expert AI at identifying packaged food products and extracting their nutritional information from an image. Your goal is maximum accuracy.

Follow these steps meticulously:

1.  **Identify the Product with High Priority on Barcode:**
    *   First, look for a barcode (UPC or EAN). If a barcode is clear and legible, prioritize it for identification.
    *   Use Google Search to find the exact product associated with the barcode number.
    *   If no barcode is visible or it's unreadable, use the product's full name, brand, and any other distinctive packaging details to perform a Google Search.

2.  **Find Official Nutritional Data:**
    *   Your primary objective is to find the official nutritional information from a reliable source like the manufacturer's website, a major retailer, or a trusted food database.
    *   Do NOT guess or estimate values.

3.  **Use OCR as a Last Resort:**
    *   Only if you cannot find the product online through search, you may attempt to use Optical Character Recognition (OCR) on a "Nutrition Facts" panel in the image.
    *   Only use OCR if the label is perfectly clear, flat, and fully legible. If it's blurry, distorted, or partially obscured, state that you cannot read it accurately.

4.  **Extract Key Information:**
    *   From your findings (ideally from search), provide the following nutritional details PER SERVING.
    *   \`productName\`: The full, official name of the product, including brand.
    *   \`servingSize\`: The serving size as stated on the label (e.g., '2 bars (42g)', '1 can (330ml)').
    *   \`calories\`: Calories per serving.
    *   \`protein\`: Protein in grams per serving.
    *   \`carbs\`: Total carbohydrates in grams per serving.
    *   \`fat\`: Total fat in grams per serving.

5.  **Assess Confidence and Method:**
    *   \`confidenceLevel\`: 'High', 'Medium', or 'Low'.
        *   'High': You found an exact match via barcode search or a very clear product name search on an official site, OR you performed OCR on a perfect label.
        *   'Medium': You identified the product visually and found data for what appears to be the same product, but without a barcode confirmation.
        *   'Low': You could not find an exact match and are providing data for a similar product, or the nutrition label was difficult to read.
    *   \`confidenceReason\`: A brief sentence EXPLAINING HOW you got the data. Be specific. Examples: "Matched barcode to product via Google Search.", "Identified product from packaging and found nutrition data on the manufacturer's website.", "Extracted data from a clear nutrition label via OCR.", "Could not find an exact match; data is for a similar product."

**Output Format:**
CRITICAL: Respond ONLY with a single, raw JSON object that can be parsed by \`JSON.parse()\`. Do not include any explanatory text, markdown formatting like \`\`\`json, or anything else outside of the JSON object. The JSON should conform to this structure: {"productName": "...", "servingSize": "...", "calories": ..., "protein": ..., "carbs": ..., "fat": ..., "confidenceLevel": "...", "confidenceReason": "..."}.
`;

            let response;
            let result;

            if (isMealMode) {
                 response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: { parts: [ { text: mealPrompt }, imagePart ] },
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: analysisSchema,
                    },
                });
                result = JSON.parse(response.text);
            } else {
                 response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: { parts: [ { text: productPrompt }, imagePart ] },
                    config: {
                         tools: [{googleSearch: {}}],
                    },
                });
                let responseText = response.text.trim();
                if (responseText.startsWith('```json')) {
                    responseText = responseText.substring(7, responseText.length - 3).trim();
                } else if (responseText.startsWith('```')) {
                    responseText = responseText.substring(3, responseText.length - 3).trim();
                }
                result = JSON.parse(responseText);
            }
            
            setAnalysis(result);
            if (isMealMode) {
                setShowIngredients(true);
            }
            onUnlockAchievement('scan_1');
        } catch (err) {
            console.error("API Error:", err);
            setError("Sorry, I couldn't analyze that image. Please try another one. Don't forget to set your API key in Settings.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDone = () => {
      if (!analysis) return;
      const isMealResult = !!analysis.mealName;

      onMealAdded({
        name: isMealResult ? analysis.mealName : `${analysis.productName} (${analysis.servingSize})`,
        calories: Math.round(isMealResult ? analysis.totalCalories : analysis.calories),
        protein: Math.round(isMealResult ? analysis.totalProtein : analysis.protein),
        carbs: Math.round(isMealResult ? analysis.totalCarbs : analysis.carbs),
        fat: Math.round(isMealResult ? analysis.totalFat : analysis.fat),
        image: imagePreview || undefined
      });
      onBack();
    };
    
    return (
        <div className="modal-screen">
            {isLoading && <Loader message={isMealMode ? "Analyzing your meal..." : "Scanning product..."} />}
            <header className="modal-header">
                <button onClick={onBack} aria-label={t('close')}>
                    <span className="material-symbols-outlined">close</span>
                </button>
            </header>
            <main>
                <div className="modal-content">
                    {!analysis ? (
                        <>
                            <div className="image-preview-container" onClick={() => fileInputRef.current?.click()}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Selected food" className="image-preview" />
                                ) : (
                                    <div className="image-placeholder">
                                        <span className="material-symbols-outlined">{isMealMode ? 'photo_camera' : 'barcode_scanner'}</span>
                                        <p>{isMealMode ? 'Tap to select a picture of your meal' : 'Tap to scan a product label'}</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button className="action-button" onClick={handleAnalyze} disabled={!imageFile || isLoading || !ai}>
                                {isLoading ? 'Analyzing...' : (isMealMode ? 'Analyze Meal' : 'Analyze Product')}
                            </button>
                             {error && <div className="error-message">{error}</div>}
                             {!ai && <div className="error-message">API Key not configured. Please set it in Settings.</div>}
                        </>
                    ) : (
                         <div className="analysis-container">
                            {imagePreview && <img src={imagePreview} alt="Analyzed food" className="analysis-image-preview" />}
                            
                            {analysis.mealName ? ( // Meal Result
                                <div className="card analysis-results">
                                    <div className="analysis-header">
                                        {analysis.confidenceLevel && (
                                            <div className={`confidence-badge confidence-${analysis.confidenceLevel.toLowerCase()}`}>
                                                <span className="material-symbols-outlined">
                                                    {analysis.confidenceLevel === 'High' ? 'check_circle' : analysis.confidenceLevel === 'Medium' ? 'warning' : 'error'}
                                                </span>
                                                {analysis.confidenceLevel} Confidence
                                            </div>
                                        )}
                                        <p className="calories">🔥 {Math.round(analysis.totalCalories)} Calories</p>
                                        <h2>{analysis.mealName}</h2>
                                        {analysis.confidenceReason && <p className="analysis-summary">{analysis.confidenceReason}</p>}
                                    </div>
                                     <div className="analysis-macros">
                                        <div className="analysis-macro-item"><div className="amount">{Math.round(analysis.totalProtein)}g</div><div className="label">Protein</div></div>
                                        <div className="analysis-macro-item"><div className="amount">{Math.round(analysis.totalCarbs)}g</div><div className="label">Carbs</div></div>
                                        <div className="analysis-macro-item"><div className="amount">{Math.round(analysis.totalFat)}g</div><div className="label">Fat</div></div>
                                    </div>
                                    {analysis.ingredients && analysis.ingredients.length > 0 && (
                                        <div className="ingredient-breakdown">
                                            <button className="ingredient-toggle" onClick={() => setShowIngredients(p => !p)} aria-expanded={showIngredients}>
                                                <span>Detected Ingredients ({analysis.ingredients.length})</span>
                                                <span className={`material-symbols-outlined expand-icon ${showIngredients ? 'expanded' : ''}`}>expand_more</span>
                                            </button>
                                            {showIngredients && (
                                                <ul className="ingredient-list">
                                                    {analysis.ingredients.map((ing: any, index: number) => (
                                                        <li key={index} className="ingredient-item">
                                                            <div className="ingredient-name">{ing.name} <span className="ingredient-amount">({ing.amount})</span></div>
                                                            <div className="ingredient-macros">
                                                                🔥{Math.round(ing.calories)} P{Math.round(ing.protein)} C{Math.round(ing.carbs)} F{Math.round(ing.fat)}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : ( // Product Result
                                 <div className="card analysis-results">
                                    <div className="analysis-header">
                                        {analysis.confidenceLevel && (
                                            <div className={`confidence-badge confidence-${analysis.confidenceLevel.toLowerCase()}`}>
                                                <span className="material-symbols-outlined">
                                                    {analysis.confidenceLevel === 'High' ? 'check_circle' : analysis.confidenceLevel === 'Medium' ? 'warning' : 'error'}
                                                </span>
                                                {analysis.confidenceLevel} Confidence
                                            </div>
                                        )}
                                        <p className="calories">🔥 {Math.round(analysis.calories)} Calories</p>
                                        <h2>{analysis.productName}</h2>
                                        {analysis.confidenceReason && <p className="analysis-summary">{analysis.confidenceReason}</p>}
                                        <p className="serving-size-info">Per {analysis.servingSize}</p>
                                    </div>
                                     <div className="analysis-macros">
                                        <div className="analysis-macro-item"><div className="amount">{Math.round(analysis.protein)}g</div><div className="label">Protein</div></div>
                                        <div className="analysis-macro-item"><div className="amount">{Math.round(analysis.carbs)}g</div><div className="label">Carbs</div></div>
                                        <div className="analysis-macro-item"><div className="amount">{Math.round(analysis.fat)}g</div><div className="label">Fat</div></div>
                                    </div>
                                </div>
                            )}

                            <div className="analysis-actions" style={{ width: '100%' }}>
                                <button className="action-button secondary" onClick={() => onFixResults(analysis)}>Fix Results</button>
                                <button className="action-button" onClick={handleDone}>Done</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const ManualEntryScreen = ({ onBack, onMealSaved, initialData, ai, onAddToFavorites }: { onBack: () => void, onMealSaved: (meal: Omit<Meal, 'timestamp'> & { id?: string }) => void, initialData?: any | null, ai: GoogleGenAI | null, onAddToFavorites: (food: FavoriteFood) => void }) => {
    const { t } = useTranslations();
    const [meal, setMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [expandedSuggestion, setExpandedSuggestion] = useState<number | null>(null);
    const [addToFavorites, setAddToFavorites] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            let name = initialData.name;
            let calories = initialData.calories;
            let protein = initialData.protein;
            let carbs = initialData.carbs;
            let fat = initialData.fat;
            
            // Data from meal scan
            if (initialData.mealName) {
                name = initialData.mealName;
                calories = initialData.totalCalories;
                protein = initialData.totalProtein;
                carbs = initialData.totalCarbs;
                fat = initialData.totalFat;
            } 
            // Data from product scan
            else if (initialData.productName) {
                name = `${initialData.productName} (${initialData.servingSize})`;
                calories = initialData.calories;
                protein = initialData.protein;
                carbs = initialData.carbs;
                fat = initialData.fat;
            }
    
            setMeal({
                name: name || '',
                calories: calories?.toString() || '',
                protein: protein?.toString() || '',
                carbs: carbs?.toString() || '',
                fat: fat?.toString() || '',
            });
        } else {
            nameInputRef.current?.focus();
        }
    }, [initialData]);
    
    const fetchSuggestions = useCallback(async (query: string) => {
        if (query.length < 3 || !ai) {
            setSuggestions([]);
            return;
        }
        setIsLoadingSuggestions(true);
        try {
            const prompt = `Provide up to 3 common food suggestions for "${query}". For each food, include a list of common serving sizes (e.g., "1 cup", "100g", "1 medium") and their corresponding nutritional values (calories, protein, carbs, fat). Respond in the requested JSON format. Only provide foods, not complex meals.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [{ text: prompt }] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: suggestionSchema,
                },
            });
            const result = JSON.parse(response.text);
            setSuggestions(result);
            setExpandedSuggestion(null);
        } catch (err) {
            console.error("Suggestion API Error:", err);
            setSuggestions([]);
        } finally {
            setIsLoadingSuggestions(false);
        }
    }, [ai]);

    useEffect(() => {
        const handler = setTimeout(() => {
           fetchSuggestions(meal.name);
        }, 500);
        return () => clearTimeout(handler);
    }, [meal.name, fetchSuggestions]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMeal(prev => ({...prev, [name]: value }));
    };

    const handleServingClick = (foodName: string, serving: any) => {
        setMeal({
            name: `${foodName} (${serving.description})`,
            calories: serving.calories.toString(),
            protein: serving.protein.toString(),
            carbs: serving.carbs.toString(),
            fat: serving.fat.toString(),
        });
        setSuggestions([]);
        setExpandedSuggestion(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalMeal = {
            id: initialData?.id,
            name: meal.name,
            calories: parseInt(meal.calories) || 0,
            protein: parseInt(meal.protein) || 0,
            carbs: parseInt(meal.carbs) || 0,
            fat: parseInt(meal.fat) || 0,
        };
        onMealSaved(finalMeal);
        if (addToFavorites) {
            onAddToFavorites({ ...finalMeal, id: Date.now().toString() });
        }
        onBack();
    };
    
    const isFormValid = meal.name && meal.calories;

    return (
        <div className="modal-screen">
            <header className="modal-header">
                <h3>{initialData?.id ? t('edit_meal') : t('add_food_manually')}</h3>
                <button onClick={onBack} aria-label={t('close')}>
                    <span className="material-symbols-outlined">close</span>
                </button>
            </header>
            <form className="modal-form-container" onSubmit={handleSubmit}>
                <main>
                    <div className="form-group">
                        <label htmlFor="name">{t('food_name')}</label>
                        <input type="text" id="name" name="name" value={meal.name} onChange={handleChange} required autoComplete="off" ref={nameInputRef} />
                         {isLoadingSuggestions && <div className="suggestions-loader">Loading suggestions...</div>}
                        {suggestions.length > 0 && (
                            <div className="suggestions-list">
                                {suggestions.map((s, i) => (
                                    <div key={i} className="suggestion-group">
                                        <button type="button" className="suggestion-item main" onClick={() => setExpandedSuggestion(expandedSuggestion === i ? null : i)}>
                                            <span className="suggestion-name">{s.name}</span>
                                            <span className={`material-symbols-outlined expand-icon ${expandedSuggestion === i ? 'expanded' : ''}`}>expand_more</span>
                                        </button>
                                        {expandedSuggestion === i && (
                                            <div className="serving-list">
                                                {s.servings.map((serving: any, servingIndex: number) => (
                                                    <button key={servingIndex} type="button" className="suggestion-item serving" onClick={() => handleServingClick(s.name, serving)}>
                                                        <div className="suggestion-name">{serving.description}</div>
                                                        <div className="suggestion-macros">🔥{Math.round(serving.calories)} P{Math.round(serving.protein)} C{Math.round(serving.carbs)} F{Math.round(serving.fat)}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                     <div className="form-group">
                        <label htmlFor="calories">{t('calories')}</label>
                        <input type="number" id="calories" name="calories" value={meal.calories} onChange={handleChange} required />
                    </div>
                     <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="protein">{t('protein')} ({t('grams_short')})</label>
                            <input type="number" id="protein" name="protein" value={meal.protein} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="carbs">{t('carbs')} ({t('grams_short')})</label>
                            <input type="number" id="carbs" name="carbs" value={meal.carbs} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fat">{t('fat')} ({t('grams_short')})</label>
                            <input type="number" id="fat" name="fat" value={meal.fat} onChange={handleChange} />
                        </div>
                    </div>
                </main>
                <footer className="modal-footer">
                    <div className="form-group-checkbox">
                        <input type="checkbox" id="add-to-favorites" checked={addToFavorites} onChange={() => setAddToFavorites(p => !p)} />
                        <label htmlFor="add-to-favorites">{t('add_to_favorites')}</label>
                    </div>
                    <button type="submit" className="action-button" disabled={!isFormValid}>{initialData?.id ? t('save_changes') : t('add_meal')}</button>
                </footer>
            </form>
        </div>
    );
};

const ActivityEntryScreen = ({ onBack, onActivitySaved, initialData }: { onBack: () => void, onActivitySaved: (activity: Activity) => void, initialData?: Activity | null }) => {
    const { t } = useTranslations();
    const [activity, setActivity] = useState({ name: '', caloriesBurned: '' });
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        if (initialData) {
            setActivity({
                name: initialData.name,
                caloriesBurned: initialData.caloriesBurned.toString(),
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setActivity(prev => ({ ...prev, [name]: value }));

        if (name === 'name' && value.length > 1) {
            const filtered = COMMON_ACTIVITIES.filter(act =>
                act.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setActivity(prev => ({ ...prev, name: suggestion }));
        setSuggestions([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onActivitySaved({
            id: initialData?.id || Date.now().toString(),
            name: activity.name,
            caloriesBurned: parseInt(activity.caloriesBurned) || 0,
        });
        onBack();
    };

    const isFormValid = activity.name && activity.caloriesBurned;

    return (
        <div className="modal-screen">
            <header className="modal-header">
                <h3>{initialData ? t('edit') + ' ' + t('log_activity') : t('log_activity')}</h3>
                <button onClick={onBack} aria-label={t('close')}><span className="material-symbols-outlined">close</span></button>
            </header>
            <form className="modal-form-container" onSubmit={handleSubmit}>
                <main>
                    <div className="form-group">
                        <label htmlFor="name">Activity Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={activity.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Morning Run"
                            autoComplete="off"
                        />
                        {suggestions.length > 0 && (
                            <div className="activity-suggestions-list">
                                {suggestions.map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        className="activity-suggestion-item"
                                        onClick={() => handleSuggestionClick(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="caloriesBurned">Calories Burned</label>
                        <input type="number" id="caloriesBurned" name="caloriesBurned" value={activity.caloriesBurned} onChange={handleChange} required placeholder="e.g., 300"/>
                    </div>
                </main>
                <footer className="modal-footer">
                     <button type="submit" className="action-button" disabled={!isFormValid}>{initialData ? t('save_changes') : t('log_activity')}</button>
                </footer>
            </form>
        </div>
    );
};

const LineChart = ({ data, color, width = 300, height = 100, onPointClick }: { data: { label: string, value: number }[], color: string, width?: number, height?: number, onPointClick?: (point: { label: string, value: number }, event: React.MouseEvent<SVGGElement>) => void }) => {
    const { t } = useTranslations();
    if (data.length < 2) {
        return <div className="chart-placeholder-text">{t('not_enough_data')}</div>;
    }

    const PADDING = 20;
    const chartWidth = width - PADDING * 2;
    const chartHeight = height - PADDING * 2;

    const values = data.map(d => d.value).filter(v => v > 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min === 0 ? 1 : max - min;

    const points = data.map((point, i) => {
        const x = (i / (data.length - 1)) * chartWidth;
        const y = point.value <= 0 ? chartHeight : chartHeight - ((point.value - min) / range) * chartHeight;
        return { x: x + PADDING, y: y + PADDING, value: point.value };
    });

    const pathD = points.map((p, i) => i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="line-chart-svg" preserveAspectRatio="xMidYMid meet">
            <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => (p.value > 0 &&
                <g key={i} className="chart-point" onClick={(e) => onPointClick && onPointClick(data[i], e)}>
                    <circle cx={p.x} cy={p.y} r="10" fill="transparent" />
                    <circle cx={p.x} cy={p.y} r="8" fill={color} fillOpacity="0.2" style={{ pointerEvents: 'none' }} />
                    <circle cx={p.x} cy={p.y} r="4" fill={color} style={{ pointerEvents: 'none' }} />
                </g>
            ))}
        </svg>
    );
};


const ProgressScreen = ({ dailyLog, goals, onLogWeight, weightUnit, achievements, challengeProgress }: { dailyLog: DailyLogData, goals: typeof DEFAULT_GOALS, onLogWeight: (weight: number) => void, weightUnit: WeightUnit, achievements: string[], challengeProgress: { [key: string]: number } }) => {
    const { t } = useTranslations();
    const [weightInput, setWeightInput] = useState("");
    const [activeChart, setActiveChart] = useState<'calories' | 'protein' | 'carbs' | 'fat' | 'weight' | 'steps'>('calories');
    const [timeframe, setTimeframe] = useState<Timeframe>('7d');
    const [selectedPoint, setSelectedPoint] = useState<{ label: string, value: number, x: number, y: number } | null>(null);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    const handlePointClick = (point: { label: string, value: number }, event: React.MouseEvent<SVGGElement>) => {
        if (selectedPoint && selectedPoint.label === point.label) {
            setSelectedPoint(null); // Toggle off
        } else {
            const chartRect = chartContainerRef.current?.getBoundingClientRect();
            if (chartRect) {
                const svgElement = event.currentTarget.ownerSVGElement;
                if (svgElement) {
                    const pt = svgElement.createSVGPoint();
                    pt.x = event.clientX;
                    pt.y = event.clientY;
                    const svgP = pt.matrixTransform(svgElement.getScreenCTM()?.inverse());
                    setSelectedPoint({ ...point, x: svgP.x, y: svgP.y });
                }
            }
        }
    };

    const handleLogWeight = () => {
        const weight = parseFloat(weightInput);
        if (weight > 0) {
            const weightInLbs = weightUnit === 'kg' ? weight * KG_TO_LBS : weight;
            onLogWeight(weightInLbs);
            setWeightInput("");
        }
    };

    const timeframes: { label: Timeframe, days: number }[] = [
        { label: '7d', days: 7 }, { label: '30d', days: 30 }, { label: '90d', days: 90 },
        { label: '6m', days: 182 }, { label: '1y', days: 365 },
    ];

    const allLogKeys = useMemo(() => Object.keys(dailyLog).sort(), [dailyLog]);

    const chartData = useMemo(() => {
        if (allLogKeys.length === 0) return [];
        const endDate = new Date();
        const startDate = new Date();
        let days = 7;
        if (timeframe === 'all') {
            if (allLogKeys.length > 0) {
                const firstDate = new Date(allLogKeys[0]);
                days = Math.ceil((endDate.getTime() - firstDate.getTime()) / (1000 * 3600 * 24)) + 1;
            }
        } else {
            days = timeframes.find(tf => tf.label === timeframe)?.days || 7;
        }
        startDate.setDate(endDate.getDate() - (days - 1));

        const data: { label: string; value: number }[] = [];
        let lastSeenWeight = -1;
        const startKey = getTodayKey(startDate);
        const precedingKeys = allLogKeys.filter(k => k < startKey);
        if (precedingKeys.length > 0) {
            for (let i = precedingKeys.length - 1; i >= 0; i--) {
                const log = dailyLog[precedingKeys[i]];
                if (log && log.weight !== null) { lastSeenWeight = log.weight; break; }
            }
        }

        for (let i = 0; i < days; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            const key = getTodayKey(d);
            const log = dailyLog[key];
            const dayLabel = d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
            let value = 0;
            if (log) {
                switch (activeChart) {
                    case 'calories': value = log.meals.reduce((sum, m) => sum + m.calories, 0); break;
                    case 'protein': value = log.meals.reduce((sum, m) => sum + m.protein, 0); break;
                    case 'carbs': value = log.meals.reduce((sum, m) => sum + m.carbs, 0); break;
                    case 'fat': value = log.meals.reduce((sum, m) => sum + m.fat, 0); break;
                    case 'steps': value = log.steps || 0; break;
                    case 'weight':
                        value = log.weight !== null ? log.weight : lastSeenWeight;
                        if (log.weight !== null) lastSeenWeight = log.weight;
                        break;
                }
            } else if (activeChart === 'weight') { value = lastSeenWeight; }
            data.push({ label: dayLabel, value });
        }
        if (activeChart === 'weight') {
            return data.map(d => ({ ...d, value: d.value === -1 ? 0 : (weightUnit === 'kg' ? d.value * LBS_TO_KG : d.value) }));
        }
        return data;
    }, [dailyLog, activeChart, timeframe, weightUnit, allLogKeys]);

    const averageData = useMemo(() => {
        const relevantKeys = allLogKeys.slice(-timeframes.find(tf => tf.label === timeframe)?.days || -7);
        if (relevantKeys.length === 0) return null;
        const total = relevantKeys.reduce((acc, key) => {
            const day = dailyLog[key];
            if (day) {
                acc.calories += day.meals.reduce((s, m) => s + m.calories, 0);
                acc.protein += day.meals.reduce((s, m) => s + m.protein, 0);
                acc.carbs += day.meals.reduce((s, m) => s + m.carbs, 0);
                acc.fat += day.meals.reduce((s, m) => s + m.fat, 0);
            }
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
        return {
            calories: Math.round(total.calories / relevantKeys.length),
            protein: Math.round(total.protein / relevantKeys.length),
            carbs: Math.round(total.carbs / relevantKeys.length),
            fat: Math.round(total.fat / relevantKeys.length),
        };
    }, [dailyLog, timeframe, allLogKeys]);

    const insights = useMemo(() => {
        const allMeals = Object.values(dailyLog).flatMap(d => d.meals);
        if (allMeals.length === 0) return null;
        const foodCounts = allMeals.reduce((acc, meal) => {
            acc[meal.name] = (acc[meal.name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const topFoods = Object.entries(foodCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(entry => ({ name: entry[0], count: entry[1] }));
        const hourCounts = allMeals.reduce((acc, meal) => {
            const hour = new Date(meal.timestamp).getHours();
            acc[hour] = (acc[hour] || 0) + meal.calories;
            return acc;
        }, {} as Record<number, number>);
        const busiestHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
        const busiestHourFormatted = busiestHour ? `${parseInt(busiestHour)}:00 - ${parseInt(busiestHour) + 1}:00` : "N/A";
        const totalMacros = allMeals.reduce((acc, meal) => ({
            protein: acc.protein + meal.protein, carbs: acc.carbs + meal.carbs, fat: acc.fat + meal.fat,
        }), { protein: 0, carbs: 0, fat: 0 });
        const totalCaloriesFromMacros = (totalMacros.protein * 4) + (totalMacros.carbs * 4) + (totalMacros.fat * 9);
        const macroBalance = totalCaloriesFromMacros > 0 ? {
            protein: Math.round((totalMacros.protein * 4) / totalCaloriesFromMacros * 100),
            carbs: Math.round((totalMacros.carbs * 4) / totalCaloriesFromMacros * 100),
            fat: Math.round((totalMacros.fat * 9) / totalCaloriesFromMacros * 100),
        } : { protein: 0, carbs: 0, fat: 0 };
        return { topFoods, busiestHour: busiestHourFormatted, macroBalance };
    }, [dailyLog]);

    const chartConfig = {
        calories: { label: t('calories'), color: "var(--primary)", unit: t('calories_short') },
        protein: { label: t('protein'), color: "var(--accent-protein)", unit: t('grams_short') },
        carbs: { label: t('carbs'), color: "var(--accent-carbs)", unit: t('grams_short') },
        fat: { label: t('fat'), color: "var(--accent-fats)", unit: t('grams_short') },
        weight: { label: t('your_weight'), color: "#A78BFA", unit: weightUnit },
        steps: { label: t('steps'), color: "#34D399", unit: '' },
    };

    const todayLog = dailyLog[getTodayKey()] || { meals: [], water: 0, weight: null, activities: [], steps: 0 };
    const consumed = todayLog.meals.reduce((acc, meal) => ({
        calories: acc.calories + meal.calories, protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs, fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    const displayWeight = todayLog.weight !== null ? (weightUnit === 'kg' ? todayLog.weight * LBS_TO_KG : todayLog.weight) : null;

    const ProgressBar = ({ label, consumed, goal, color, unit = "g" }: { label: string, consumed: number, goal: number, color: string, unit?: string }) => (
        <div className="progress-bar-item">
            <div className="progress-bar-labels">
                <span>{label}</span>
                <span>{Math.round(consumed)} / {goal}{unit}</span>
            </div>
            <div className="progress-bar-bg"><div className="progress-bar-fg" style={{ width: `${Math.min(100, (consumed / goal) * 100)}%`, backgroundColor: color }}></div></div>
        </div>
    );

    return (
        <>
            <header className="app-header"><h2>{t('track_progress')}</h2></header>
            <main>
                <div className="card">
                    <div className="card-header"><h3><span className="material-symbols-outlined">flag</span><span>{t('todays_goal_progress')}</span></h3></div>
                    <div className="progress-bar-container">
                        <ProgressBar label={t('calories')} consumed={consumed.calories} goal={goals.calories} color={chartConfig.calories.color} unit={t('calories_short')} />
                        <ProgressBar label={t('protein')} consumed={consumed.protein} goal={goals.protein} color={chartConfig.protein.color} unit={t('grams_short')} />
                        <ProgressBar label={t('carbs')} consumed={consumed.carbs} goal={goals.carbs} color={chartConfig.carbs.color} unit={t('grams_short')} />
                        <ProgressBar label={t('fat')} consumed={consumed.fat} goal={goals.fat} color={chartConfig.fat.color} unit={t('grams_short')} />
                        <ProgressBar label={t('steps')} consumed={todayLog.steps || 0} goal={goals.steps} color={chartConfig.steps.color} unit="" />
                    </div>
                </div>
                <div className="card">
                    <div className="card-header"><h3><span className="material-symbols-outlined">show_chart</span><span>{t('trend', { chart: chartConfig[activeChart].label })}</span></h3></div>
                    <div className="chart-toggle-buttons scrollable">
                        <button className={timeframe === '7d' ? 'active' : ''} onClick={() => setTimeframe('7d')}>7d</button>
                        <button className={timeframe === '30d' ? 'active' : ''} onClick={() => setTimeframe('30d')}>30d</button>
                        <button className={timeframe === '90d' ? 'active' : ''} onClick={() => setTimeframe('90d')}>90d</button>
                        <button className={timeframe === '6m' ? 'active' : ''} onClick={() => setTimeframe('6m')}>6m</button>
                        <button className={timeframe === '1y' ? 'active' : ''} onClick={() => setTimeframe('1y')}>1y</button>
                        <button className={timeframe === 'all' ? 'active' : ''} onClick={() => setTimeframe('all')}>All</button>
                    </div>
                    <div className="chart-container" ref={chartContainerRef}>
                        {selectedPoint && (
                            <div className="chart-tooltip" style={{ left: selectedPoint.x, top: selectedPoint.y, position: 'absolute' }}>
                                <strong>{selectedPoint.label}</strong>
                                <div>{Math.round(selectedPoint.value)} {chartConfig[activeChart].unit}</div>
                            </div>
                        )}
                        <LineChart data={chartData} color={chartConfig[activeChart].color} onPointClick={handlePointClick} />
                    </div>
                    <div className="chart-toggle-buttons">
                        <button className={activeChart === 'calories' ? 'active' : ''} onClick={() => setActiveChart('calories')}>{t('calories')}</button>
                        <button className={activeChart === 'protein' ? 'active' : ''} onClick={() => setActiveChart('protein')}>{t('protein')}</button>
                        <button className={activeChart === 'steps' ? 'active' : ''} onClick={() => setActiveChart('steps')}>{t('steps')}</button>
                        <button className={activeChart === 'weight' ? 'active' : ''} onClick={() => setActiveChart('weight')}>{t('your_weight')}</button>
                    </div>
                </div>

                {averageData && (
                    <div className="card averages-card">
                        <div className="card-header"><h3><span className="material-symbols-outlined">calculate</span><span>{t('averages_title', { timeframe })}</span></h3></div>
                        <div className="averages-grid">
                            <div className="average-item"><div className="amount">{averageData.calories}</div><div className="label">{t('calories')}</div></div>
                            <div className="average-item"><div className="amount">{averageData.protein}</div><div className="label">{t('protein')}</div></div>
                            <div className="average-item"><div className="amount">{averageData.carbs}</div><div className="label">{t('carbs')}</div></div>
                            <div className="average-item"><div className="amount">{averageData.fat}</div><div className="label">{t('fat')}</div></div>
                        </div>
                    </div>
                )}
                
                {insights && (
                    <div className="card insights-card">
                        <div className="card-header"><h3><span className="material-symbols-outlined">auto_awesome</span><span>{t('insights')}</span></h3></div>
                        <div className="insight-item">
                            <h4>{t('insight_top_foods')}</h4>
                            <ol className="top-foods-list">{insights.topFoods.map(food => <li key={food.name}><span>{food.name}</span> <span>{food.count}x</span></li>)}</ol>
                        </div>
                        <div className="insight-item"><h4>{t('insight_meal_timing')}</h4><p className="insight-highlight">{insights.busiestHour}</p></div>
                        <div className="insight-item">
                            <h4>{t('insight_macro_balance')}</h4>
                            <div className="macro-balance-chart">
                                <div className="macro-bar protein" style={{ flexBasis: `${insights.macroBalance.protein}%` }}>P</div>
                                <div className="macro-bar carbs" style={{ flexBasis: `${insights.macroBalance.carbs}%` }}>C</div>
                                <div className="macro-bar fat" style={{ flexBasis: `${insights.macroBalance.fat}%` }}>F</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="card challenges-card">
                    <div className="card-header"><h3><span className="material-symbols-outlined">workspace_premium</span><span>{t('challenges')}</span></h3></div>
                    <div className="challenges-list">{ALL_CHALLENGES.map(challenge => {
                        const progress = challengeProgress[challenge.id] || 0;
                        const isComplete = progress >= challenge.goal;
                        return (<div key={challenge.id} className={`challenge-item ${isComplete ? 'complete' : ''}`}>
                            <span className="material-symbols-outlined">{challenge.icon}</span>
                            <div className="challenge-info">
                                <h4>{t(challenge.titleKey)}</h4><p>{t(challenge.descKey)}</p>
                                <div className="challenge-progress-bar"><div className="challenge-progress" style={{ width: `${Math.min(100, (progress / challenge.goal) * 100)}%` }}></div></div>
                            </div>
                            <div className="challenge-status">{isComplete ? <span className="material-symbols-outlined">check</span> : `${progress}/${challenge.goal}`}</div>
                        </div>);
                    })}</div>
                </div>

                <div className="card achievements-card">
                    <div className="card-header"><h3><span className="material-symbols-outlined">emoji_events</span><span>{t('achievements')}</span></h3></div>
                    <div className="achievements-grid">{ALL_ACHIEVEMENTS.map(ach => {
                        const isUnlocked = achievements.includes(ach.id);
                        return (<div key={ach.id} className={`achievement-badge ${isUnlocked ? '' : 'locked'}`}>
                            <span className="material-symbols-outlined">{ach.icon}</span>
                            <div className="achievement-info"><h4>{t(ach.titleKey)}</h4><p>{t(ach.descKey)}</p></div>
                        </div>);
                    })}</div>
                </div>

                <div className="card progress-card your-weight">
                    <div className="card-header"><h3><span className="material-symbols-outlined">scale</span><span>{t('your_weight')}</span></h3></div>
                    <p className="amount">{displayWeight ? `${displayWeight.toFixed(1)} ${weightUnit}` : "N/A"}</p>
                    <div className="log-weight-form">
                        <input type="number" value={weightInput} onChange={e => setWeightInput(e.target.value)} placeholder={t('log_in_unit', { unit: weightUnit })} />
                        <button onClick={handleLogWeight}>{t('add')}</button>
                    </div>
                </div>
            </main>
        </>
    );
};

const CoachScreen = ({ dailyLog, goals, ai, weightUnit }: { dailyLog: DailyLogData, goals: typeof DEFAULT_GOALS, ai: GoogleGenAI | null, weightUnit: WeightUnit }) => {
    const { t, language } = useTranslations();
    const [messages, setMessages] = useLocalStorage<ChatMessage[]>('cal-ai-chat-history', [
        { id: 'initial', sender: 'ai', text: "Hi there! I'm Cal, your AI nutrition coach. How can I help you on your health journey today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isClearConfirmOpen, setClearConfirmOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any | null>(null);
    const chat = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ai && !chat.current) {
            chat.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: "You are 'Cal', a friendly, encouraging, and knowledgeable nutrition coach. Your tone is positive and helpful. Keep your responses concise and easy to understand, usually under 100 words. Use the user's logged data to provide personalized, positive, and actionable advice. Do not repeat the data summary back to the user; just use it as context for your answer."
                }
            });
        }
    }, [ai]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleConfirmClearChat = () => {
        setMessages([
            { id: 'initial', sender: 'ai', text: "Hi there! I'm Cal, your AI nutrition coach. How can I help you on your health journey today?" }
        ]);
        setClearConfirmOpen(false);
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;
        if (!ai || !chat.current) {
             const errorMessage: ChatMessage = { id: Date.now().toString() + 'err', sender: 'ai', text: "I can't seem to connect. Please make sure your API key is set correctly in Settings." };
            setMessages(prev => [...prev, errorMessage]);
            return;
        }

        const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const context = generateAiContext(dailyLog, goals, weightUnit);
            const fullPrompt = `${context}${userMessage.text}`;

            const response: GenerateContentResponse = await chat.current.sendMessage({ message: fullPrompt });
            const aiResponseText = response.text;
            
            const aiMessage: ChatMessage = { id: Date.now().toString() + 'ai', sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("AI chat error:", error);
            const errorMessage: ChatMessage = { id: Date.now().toString() + 'err', sender: 'ai', text: "Sorry, I'm having a little trouble connecting. Please try again in a moment. Don't forget to set your API key in Settings." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleVoiceInput = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert(t('voice_input_error'));
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        recognitionRef.current = new SpeechRecognition();
        
        // Use more specific language codes for better compatibility
        const speechLang = {
            'en': 'en-US',
            'nl': 'nl-NL',
            'ar': 'ar-EG',
        }[language] || language;

        recognitionRef.current.lang = speechLang;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onstart = () => {
            setIsListening(true);
        };

        recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => prev ? `${prev} ${transcript}` : transcript);
        };
        
        recognitionRef.current.onerror = (event: any) => {
             console.error('Speech recognition error:', event.error);
             // "no-speech" and "aborted" are common non-critical errors (e.g., user stopped talking or clicked the button again).
             if (event.error !== 'no-speech' && event.error !== 'aborted') {
                 alert(t('voice_input_error'));
             }
             setIsListening(false);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current.start();
    };

    return (
        <div className="coach-screen-container">
            <ConfirmationDialog
                isOpen={isClearConfirmOpen}
                onClose={() => setClearConfirmOpen(false)}
                onConfirm={handleConfirmClearChat}
                title={t('clear_chat_confirm_title')}
                message={t('clear_chat_confirm_message')}
                confirmText={t('delete')}
            />
            <header className="app-header">
                <h2>Coach Cal</h2>
                <button onClick={() => setClearConfirmOpen(true)} className="header-action-button" aria-label={t('clear_chat_history')}>
                    <span className="material-symbols-outlined">delete_sweep</span>
                </button>
            </header>
            <main className="coach-screen-main">
                <div className="message-list">
                    {messages.map(msg => (
                        <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                             <div className="message-meta">{msg.sender === 'ai' ? 'Cal' : 'You'}</div>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message-bubble ai">
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>
             <form className="chat-input-area" onSubmit={handleSendMessage}>
                <textarea
                    className="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? t('voice_input_listening') : "Ask Cal anything..."}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    rows={1}
                />
                <button type="button" onClick={handleVoiceInput} className={`voice-input-button ${isListening ? 'listening' : ''}`} aria-label="Voice input">
                    <span className="material-symbols-outlined">{isListening ? 'mic_off' : 'mic'}</span>
                </button>
                <button type="submit" className="send-button" disabled={!input.trim() || isLoading}>
                    <span className="material-symbols-outlined">send</span>
                </button>
            </form>
        </div>
    );
};

const SettingsScreen = ({ goals, setGoals, onExport, onImport, apiKey, onUpdateApiKey, weightUnit, onUpdateWeightUnit, theme, onUpdateTheme, accentColor, onUpdateAccentColor }: { goals: typeof DEFAULT_GOALS, setGoals: (g: typeof DEFAULT_GOALS) => void, onExport: () => void, onImport: (e: React.ChangeEvent<HTMLInputElement>) => void, apiKey: string, onUpdateApiKey: (key: string) => void, weightUnit: WeightUnit, onUpdateWeightUnit: (unit: WeightUnit) => void, theme: 'light' | 'dark', onUpdateTheme: (theme: 'light' | 'dark') => void, accentColor: ThemeAccent, onUpdateAccentColor: (color: ThemeAccent) => void }) => {
    const { t, language, setLanguage } = useTranslations();
    const [localGoals, setLocalGoals] = useState(goals);
    const [localApiKey, setLocalApiKey] = useState(apiKey);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const themeColors: {name: ThemeAccent, value: string}[] = [
        { name: 'green', value: '#22c55e' },
        { name: 'coral', value: '#f87171' },
        { name: 'mint', value: '#34d399' },
        { name: 'lavender', value: '#a78bfa' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalGoals(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    const handleSaveGoals = () => {
        setGoals(localGoals);
        alert('Goals saved!');
    };

    const handleSaveApiKey = () => {
        onUpdateApiKey(localApiKey);
        alert('API Key saved!');
    };


    return (
        <>
            <header className="app-header">
                <h2>{t('settings')}</h2>
            </header>
            <main className="settings-screen">
                <div className="card">
                    <h3>{t('daily_goals')}</h3>
                    <div className="form-group">
                        <label htmlFor="calories">{t('calories')}</label>
                        <input type="number" id="calories" name="calories" value={localGoals.calories} onChange={handleChange} />
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="protein">{t('protein')} ({t('grams_short')})</label>
                            <input type="number" id="protein" name="protein" value={localGoals.protein} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="carbs">{t('carbs')} ({t('grams_short')})</label>
                            <input type="number" id="carbs" name="carbs" value={localGoals.carbs} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fat">{t('fat')} ({t('grams_short')})</label>
                            <input type="number"id="fat" name="fat" value={localGoals.fat} onChange={handleChange} />
                        </div>
                    </div>
                     <div className="form-group">
                        <label htmlFor="water">{t('water')} (glasses)</label>
                        <input type="number" id="water" name="water" value={localGoals.water} onChange={handleChange} />
                        <p className="hint-text">{t('water_goal_hint', { ml: localGoals.water * 240 })}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="steps">{t('steps_goal')}</label>
                        <input type="number" id="steps" name="steps" value={localGoals.steps} onChange={handleChange} />
                    </div>
                    <button className="action-button" onClick={handleSaveGoals}>{t('save')}</button>
                </div>

                 <div className="card">
                    <h3>{t('preferences')}</h3>
                    <div className="preference-item">
                        <label>{t('weight_unit')}</label>
                        <div className="segmented-control">
                            <button className={weightUnit === 'lbs' ? 'active' : ''} onClick={() => onUpdateWeightUnit('lbs')}>lbs</button>
                            <button className={weightUnit === 'kg' ? 'active' : ''} onClick={() => onUpdateWeightUnit('kg')}>kg</button>
                        </div>
                    </div>
                    <div className="preference-item">
                        <label>{t('theme')}</label>
                        <div className="segmented-control">
                            <button className={theme === 'light' ? 'active' : ''} onClick={() => onUpdateTheme('light')}>{t('light')}</button>
                            <button className={theme === 'dark' ? 'active' : ''} onClick={() => onUpdateTheme('dark')}>{t('dark')}</button>
                        </div>
                    </div>
                    <div className="preference-item">
                        <label>{t('accent_color')}</label>
                        <div className="theme-picker">
                            {themeColors.map(color => (
                                <button key={color.name} className={`color-swatch ${accentColor === color.name ? 'active' : ''}`} style={{ backgroundColor: color.value }} onClick={() => onUpdateAccentColor(color.name)} aria-label={`Select ${color.name} theme`} />
                            ))}
                        </div>
                    </div>
                    <div className="preference-item">
                        <label>{t('language')}</label>
                        <div className="segmented-control">
                            <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>{t('english')}</button>
                            <button className={language === 'nl' ? 'active' : ''} onClick={() => setLanguage('nl')}>{t('dutch')}</button>
                            <button className={language === 'ar' ? 'active' : ''} onClick={() => setLanguage('ar')}>{t('arabic')}</button>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3>{t('api_key_title')}</h3>
                    <p className="label" style={{marginBottom: '16px'}}>{t('api_key_desc')}</p>
                    <div className="form-group">
                        <label htmlFor="apiKeySetting">{t('api_key_label')}</label>
                        <input type="password" id="apiKeySetting" value={localApiKey} onChange={(e) => setLocalApiKey(e.target.value)} />
                    </div>
                    <button className="action-button" onClick={handleSaveApiKey}>{t('save_api_key')}</button>
                </div>

                <div className="card">
                    <h3>{t('data_management')}</h3>
                    <p className="label" style={{marginBottom: '16px'}}>{t('data_management_desc')}</p>
                    <div className="data-actions">
                        <button className="action-button secondary" onClick={onExport}>{t('export_data')}</button>
                        <button className="action-button secondary" onClick={() => fileInputRef.current?.click()}>{t('import_data')}</button>
                    </div>
                    <input type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={onImport} />
                </div>
            </main>
        </>
    );
};

const MyFoodsScreen = ({ onBack, onMealAdded, favorites, onRemoveFavorite }: { onBack: () => void, onMealAdded: (meal: Omit<Meal, 'id'|'timestamp'>) => void, favorites: FavoriteFood[], onRemoveFavorite: (id: string) => void }) => {
    const { t } = useTranslations();
    return (
        <div className="modal-screen">
            <header className="modal-header">
                <h3>{t('my_foods')}</h3>
                <button onClick={onBack} aria-label={t('close')}><span className="material-symbols-outlined">close</span></button>
            </header>
            <main>
                {favorites.length > 0 ? (
                    <div className="my-items-list">
                        {favorites.map(fav => (
                            <div key={fav.id} className="my-item-card">
                                <div className="my-item-info" onClick={() => onMealAdded(fav)}>
                                    <h4>{fav.name}</h4>
                                    <div className="my-item-macros">
                                        <span>🔥 {fav.calories}</span>
                                        <span>∙ P {fav.protein}g</span>
                                        <span>∙ C {fav.carbs}g</span>
                                        <span>∙ F {fav.fat}g</span>
                                    </div>
                                </div>
                                <button className="my-item-delete" onClick={() => onRemoveFavorite(fav.id)} aria-label={t('delete')}>
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="empty-state">{t('no_favorites')}</p>
                )}
            </main>
        </div>
    );
};

const RecipeBuilderScreen = ({ onBack, onRecipeSaved }: { onBack: () => void, onRecipeSaved: (recipe: Recipe) => void }) => {
    const { t } = useTranslations();
    const [recipe, setRecipe] = useState<Omit<Recipe, 'id'>>({ name: '', servings: 1, ingredients: [] });
    const [isAddingIngredient, setIsAddingIngredient] = useState(false);
    const [newIngredient, setNewIngredient] = useState<Ingredient>({ name: '', amount: '', calories: 0, protein: 0, carbs: 0, fat: 0 });

    const handleAddIngredient = () => {
        if (newIngredient.name && newIngredient.amount && newIngredient.calories > 0) {
            setRecipe(prev => ({...prev, ingredients: [...prev.ingredients, newIngredient]}));
            setNewIngredient({ name: '', amount: '', calories: 0, protein: 0, carbs: 0, fat: 0 });
            setIsAddingIngredient(false);
        }
    };
    
    const handleRemoveIngredient = (index: number) => {
        setRecipe(prev => ({...prev, ingredients: prev.ingredients.filter((_, i) => i !== index)}));
    };

    const totalNutrition = useMemo(() => {
        return recipe.ingredients.reduce((acc, ing) => ({
            calories: acc.calories + ing.calories,
            protein: acc.protein + ing.protein,
            carbs: acc.carbs + ing.carbs,
            fat: acc.fat + ing.fat,
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }, [recipe.ingredients]);

    const perServingNutrition = {
        calories: Math.round(totalNutrition.calories / recipe.servings),
        protein: Math.round(totalNutrition.protein / recipe.servings),
        carbs: Math.round(totalNutrition.carbs / recipe.servings),
        fat: Math.round(totalNutrition.fat / recipe.servings),
    };
    
    const handleSaveRecipe = () => {
        onRecipeSaved({ ...recipe, id: Date.now().toString() });
        onBack();
    };

    return (
        <div className="modal-screen">
             <header className="modal-header">
                <h3>{t('recipe_builder')}</h3>
                <button onClick={onBack} aria-label={t('close')}><span className="material-symbols-outlined">close</span></button>
            </header>
            <main className="recipe-builder-main">
                <div className="form-group">
                    <label>{t('recipe_name')}</label>
                    <input type="text" value={recipe.name} onChange={e => setRecipe(p => ({...p, name: e.target.value}))} />
                </div>
                 <div className="form-group">
                    <label>{t('servings')}</label>
                    <input type="number" value={recipe.servings} onChange={e => setRecipe(p => ({...p, servings: Math.max(1, parseInt(e.target.value) || 1)}))} />
                </div>
                
                <div className="card">
                     <h4 className="section-header">{t('ingredients')}</h4>
                     {recipe.ingredients.map((ing, i) => (
                        <div key={i} className="recipe-ingredient-item">
                            <span>{ing.name} <span className="ingredient-amount">({ing.amount})</span></span>
                            <button onClick={() => handleRemoveIngredient(i)}><span className="material-symbols-outlined">delete</span></button>
                        </div>
                     ))}
                     <button className="action-button secondary" onClick={() => setIsAddingIngredient(true)}>{t('add_ingredient')}</button>
                </div>

                {isAddingIngredient && (
                     <div className="card">
                         <h4>{t('add_ingredient')}</h4>
                         <div className="form-group">
                             <label>{t('food_name')}</label>
                             <input type="text" value={newIngredient.name} onChange={e => setNewIngredient(p=>({...p, name: e.target.value}))} />
                         </div>
                         <div className="form-group">
                             <label>{t('amount')}</label>
                             <input type="text" placeholder="e.g. 100g, 1 cup" value={newIngredient.amount} onChange={e => setNewIngredient(p=>({...p, amount: e.target.value}))} />
                         </div>
                          <div className="form-grid">
                            <div className="form-group"><label>{t('calories')}</label><input type="number" value={newIngredient.calories} onChange={e => setNewIngredient(p => ({...p, calories: parseInt(e.target.value) || 0}))} /></div>
                            <div className="form-group"><label>{t('protein')}</label><input type="number" value={newIngredient.protein} onChange={e => setNewIngredient(p => ({...p, protein: parseInt(e.target.value) || 0}))} /></div>
                            <div className="form-group"><label>{t('carbs')}</label><input type="number" value={newIngredient.carbs} onChange={e => setNewIngredient(p => ({...p, carbs: parseInt(e.target.value) || 0}))} /></div>
                            <div className="form-group"><label>{t('fat')}</label><input type="number" value={newIngredient.fat} onChange={e => setNewIngredient(p => ({...p, fat: parseInt(e.target.value) || 0}))} /></div>
                         </div>
                         <button className="action-button" onClick={handleAddIngredient}>{t('add')}</button>
                     </div>
                )}
            </main>
            <footer className="recipe-builder-footer">
                <h4>{t('nutrition_per_serving')}</h4>
                <div className="macros-card" style={{padding: '10px 0'}}>
                    <div className="macro-item"><div className="amount">{perServingNutrition.calories}</div><div className="label">{t('calories')}</div></div>
                    <div className="macro-item"><div className="amount">{perServingNutrition.protein}g</div><div className="label">{t('protein')}</div></div>
                    <div className="macro-item"><div className="amount">{perServingNutrition.carbs}g</div><div className="label">{t('carbs')}</div></div>
                    <div className="macro-item"><div className="amount">{perServingNutrition.fat}g</div><div className="label">{t('fat')}</div></div>
                </div>
                <button className="action-button" onClick={handleSaveRecipe} disabled={!recipe.name || recipe.ingredients.length === 0}>{t('save')}</button>
            </footer>
        </div>
    );
};

const MyRecipesScreen = ({ onBack, recipes, onDeleteRecipe, onCreateRecipe, onViewRecipe }: { onBack: () => void, recipes: Recipe[], onDeleteRecipe: (id: string) => void, onCreateRecipe: () => void, onViewRecipe: (recipe: Recipe) => void }) => {
    const { t } = useTranslations();

    return (
        <div className="modal-screen">
            <header className="modal-header">
                <h3>{t('my_recipes')}</h3>
                <button onClick={onBack} aria-label={t('close')}><span className="material-symbols-outlined">close</span></button>
            </header>
            <main>
                <button className="action-button" onClick={onCreateRecipe} style={{ marginBottom: 16 }}>{t('create_recipe')}</button>
                {recipes.length > 0 ? (
                    <div className="my-items-list">
                        {recipes.map(rec => (
                            <div key={rec.id} className="my-item-card">
                                <div className="my-item-info" onClick={() => onViewRecipe(rec)}>
                                    <h4>{rec.name}</h4>
                                    <p className="my-item-macros">{rec.ingredients.length} ingredients, {rec.servings} servings</p>
                                </div>
                                <button className="my-item-delete" onClick={() => onDeleteRecipe(rec.id)}><span className="material-symbols-outlined">delete</span></button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="empty-state">{t('no_recipes')}</p>
                )}
            </main>
        </div>
    );
}

const RecipeViewScreen = ({ onBack, onMealAdded, recipe }: { onBack: () => void, onMealAdded: (meal: Omit<Meal, 'id' | 'timestamp'>) => void, recipe: Recipe }) => {
    const { t } = useTranslations();
    const [scaledServings, setScaledServings] = useState(recipe.servings);

    const scaleAmount = useCallback((originalAmount: string, originalServings: number, newServings: number) => {
        if (!originalAmount) return '';
        const match = originalAmount.trim().match(/^(\d*\.?\d+)\s*(.*)$/);
        if (!match) return originalAmount;

        const value = parseFloat(match[1]);
        const unit = match[2] || '';
        if (originalServings === 0) return originalAmount;

        const perServing = value / originalServings;
        const scaledValue = perServing * newServings;

        const formattedValue = Number.isInteger(scaledValue) ? scaledValue : parseFloat(scaledValue.toFixed(2));
        return `${formattedValue} ${unit}`.trim();
    }, []);

    const totalNutrition = useMemo(() => {
        return recipe.ingredients.reduce((acc, ing) => ({
            calories: acc.calories + ing.calories,
            protein: acc.protein + ing.protein,
            carbs: acc.carbs + ing.carbs,
            fat: acc.fat + ing.fat,
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }, [recipe.ingredients]);

    const scaledNutrition = useMemo(() => {
        const factor = recipe.servings > 0 ? scaledServings / recipe.servings : 0;
        return {
            calories: Math.round(totalNutrition.calories * factor),
            protein: Math.round(totalNutrition.protein * factor),
            carbs: Math.round(totalNutrition.carbs * factor),
            fat: Math.round(totalNutrition.fat * factor),
        };
    }, [totalNutrition, scaledServings, recipe.servings]);
    
    const handleLogRecipe = () => {
        const mealToLog = {
            name: `${recipe.name} (${scaledServings} serving${scaledServings !== 1 ? 's' : ''})`,
            ...scaledNutrition,
        };
        onMealAdded(mealToLog);
        onBack();
    };

    return (
        <div className="modal-screen">
             <header className="modal-header">
                <h3>{t('view_recipe')}</h3>
                <button onClick={onBack} aria-label={t('close')}><span className="material-symbols-outlined">close</span></button>
            </header>
            <main className="recipe-builder-main">
                <h2>{recipe.name}</h2>
                <div className="card">
                    <h4 className="section-header">{t('scale_servings')}</h4>
                    <div className="serving-scaler">
                         <button onClick={() => setScaledServings(s => Math.max(1, s - 1))} disabled={scaledServings <= 1}>
                            <span className="material-symbols-outlined">remove</span>
                        </button>
                        <input type="number" value={scaledServings} onChange={(e) => setScaledServings(Math.max(1, parseInt(e.target.value) || 1))} />
                        <button onClick={() => setScaledServings(s => s + 1)}>
                            <span className="material-symbols-outlined">add</span>
                        </button>
                    </div>
                </div>
                <div className="card">
                     <h4 className="section-header">{t('ingredients')}</h4>
                     {recipe.ingredients.map((ing, i) => (
                        <div key={i} className="recipe-ingredient-item">
                            <span>{ing.name}</span>
                            <span className="ingredient-amount">{scaleAmount(ing.amount, recipe.servings, scaledServings)}</span>
                        </div>
                     ))}
                </div>
            </main>
            <footer className="recipe-builder-footer">
                <h4>{t('nutrition_for_servings', { count: scaledServings })}</h4>
                <div className="macros-card" style={{padding: '10px 0'}}>
                    <div className="macro-item"><div className="amount">{scaledNutrition.calories}</div><div className="label">{t('calories')}</div></div>
                    <div className="macro-item"><div className="amount">{scaledNutrition.protein}g</div><div className="label">{t('protein')}</div></div>
                    <div className="macro-item"><div className="amount">{scaledNutrition.carbs}g</div><div className="label">{t('carbs')}</div></div>
                    <div className="macro-item"><div className="amount">{scaledNutrition.fat}g</div><div className="label">{t('fat')}</div></div>
                </div>
                <button className="action-button" onClick={handleLogRecipe} disabled={scaledServings <= 0}>{t('log_servings', { count: scaledServings })}</button>
            </footer>
        </div>
    );
};

const AddToPlanPopover = ({ onClose, onAddToPlan, favorites, recipes, position, triggerRef }: { onClose: () => void, onAddToPlan: (item: FavoriteFood | Recipe, type: 'favorite' | 'recipe') => void, favorites: FavoriteFood[], recipes: Recipe[], position: React.CSSProperties, triggerRef: React.RefObject<HTMLButtonElement> }) => {
    const { t } = useTranslations();
    const popoverRef = useRef<HTMLDivElement>(null);
    const firstFocusableElementRef = useRef<HTMLButtonElement>(null);
    const lastFocusableElementRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
            if (event.key === 'Tab') {
                if (event.shiftKey) {
                    if (document.activeElement === firstFocusableElementRef.current) {
                        event.preventDefault();
                        lastFocusableElementRef.current?.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusableElementRef.current) {
                        event.preventDefault();
                        firstFocusableElementRef.current?.focus();
                    }
                }
            }
        };

        firstFocusableElementRef.current?.focus();
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
            triggerRef.current?.focus();
        };
    }, [onClose, triggerRef]);

    return (
        <>
            <div className="popover-overlay" onClick={onClose}></div>
            <div className="add-to-plan-popover" style={position} ref={popoverRef} role="dialog" aria-modal="true" aria-labelledby="popover-title">
                <div className="popover-header">
                    <h3 id="popover-title">{t('add_to_plan')}</h3>
                    <button onClick={onClose} className="popover-close-btn" aria-label={t('close')} ref={firstFocusableElementRef}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="popover-content">
                    <h4 className="popover-section-title">{t('add_from_favorites')}</h4>
                    <div className="popover-item-list">
                        {favorites.length > 0 ? favorites.map(fav => (
                            <div key={fav.id} className="popover-item">
                                <span>{fav.name}</span>
                                <button className="popover-add-btn" onClick={() => onAddToPlan(fav, 'favorite')}>{t('add')}</button>
                            </div>
                        )) : <p className="popover-empty-state">{t('no_favorites')}</p>}
                    </div>
                     <h4 className="popover-section-title">{t('my_recipes')}</h4>
                    <div className="popover-item-list">
                         {recipes.length > 0 ? recipes.map(rec => (
                            <div key={rec.id} className="popover-item">
                                <span>{rec.name}</span>
                                <button className="popover-add-btn" onClick={() => onAddToPlan(rec, 'recipe')}>{t('add')}</button>
                            </div>
                        )) : <p className="popover-empty-state">{t('no_recipes')}</p>}
                    </div>
                </div>
                {/* Dummy button for trapping focus. A more complex popover would list all buttons. */}
                <button ref={lastFocusableElementRef} style={{opacity: 0, position: 'absolute', width: 0, height: 0, pointerEvents: 'none'}} onFocus={() => firstFocusableElementRef.current?.focus()} />
            </div>
        </>
    );
}

const PlannerScreen = ({ mealPlan, setMealPlan, favorites, recipes }: { mealPlan: MealPlan, setMealPlan: React.Dispatch<React.SetStateAction<MealPlan>>, favorites: FavoriteFood[], recipes: Recipe[] }) => {
    const { t } = useTranslations();
    const [weekOffset, setWeekOffset] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState<{ dateKey: string, mealType: MealType, position: React.CSSProperties, triggerRef: React.RefObject<HTMLButtonElement> } | null>(null);
    const todayRef = useRef<HTMLDivElement>(null);
    const mealSlotRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});

    useEffect(() => {
        const timer = setTimeout(() => {
            if (todayRef.current) {
                todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 150);
        return () => clearTimeout(timer);
    }, []);

    const weekDays = useMemo(() => {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (weekOffset * 7));
        return Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            return date;
        });
    }, [weekOffset]);

    const handleSelectSlot = (e: React.MouseEvent<HTMLButtonElement>, date: Date, mealType: MealType) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const popoverWidth = 280;
        const viewportPadding = 16;
        const position: React.CSSProperties = { top: rect.bottom + window.scrollY + 8 };

        if (window.innerWidth < 480) {
            position.left = (window.innerWidth - popoverWidth) / 2;
        } else {
            if (rect.left + popoverWidth + viewportPadding < window.innerWidth) {
                position.left = rect.left;
            } else {
                position.right = viewportPadding;
            }
        }
        
        const estimatedPopoverHeight = 350;
        if ((rect.bottom + estimatedPopoverHeight) > window.innerHeight && rect.top > estimatedPopoverHeight) {
            position.top = rect.top + window.scrollY - estimatedPopoverHeight - 8;
        }

        if ((position.top as number) < window.scrollY) {
            position.top = window.scrollY + viewportPadding;
        }
        
        const triggerRef = React.createRef<HTMLButtonElement>();
        triggerRef.current = e.currentTarget;

        setSelectedSlot({ dateKey: getTodayKey(date), mealType, position, triggerRef });
    };

    const handleAddToPlan = (item: FavoriteFood | Recipe, type: 'favorite' | 'recipe') => {
        if (!selectedSlot) return;
        const { dateKey, mealType } = selectedSlot;
        setMealPlan(prev => ({
            ...prev,
            [dateKey]: { ...prev[dateKey], [mealType]: { id: item.id, name: item.name, type } }
        }));
        setSelectedSlot(null);
    };

    const handleRemoveFromPlan = (dateKey: string, mealType: MealType) => {
        setMealPlan(prev => {
            const newPlan = { ...prev };
            if (newPlan[dateKey]) {
                delete newPlan[dateKey][mealType];
                if (Object.keys(newPlan[dateKey]).length === 0) {
                    delete newPlan[dateKey];
                }
            }
            return newPlan;
        });
    }

    return (
        <>
            <header className="app-header"><h2>{t('meal_planner')}</h2></header>
            <main className="planner-main">
                <div className="week-navigator">
                    <button onClick={() => setWeekOffset(w => w - 1)}><span className="material-symbols-outlined">chevron_left</span></button>
                    <span>{weekDays[0].toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} - {weekDays[6].toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                    <button onClick={() => setWeekOffset(w => w + 1)}><span className="material-symbols-outlined">chevron_right</span></button>
                </div>
                <div className="planner-grid">
                    {weekDays.map(date => {
                        const dateKey = getTodayKey(date);
                        const isToday = dateKey === getTodayKey();
                        const plannedMeals = mealPlan[dateKey] || {};
                        return (
                            <div key={dateKey} className={`planner-day ${isToday ? 'today' : ''}`} ref={isToday ? todayRef : null}>
                                <div className="planner-day-header">
                                    <span className="day-name">{date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                                    <span className="day-number">{date.getDate()}</span>
                                </div>
                                <div className="meal-slots">
                                    {(['breakfast', 'lunch', 'dinner', 'snacks'] as MealType[]).map(mealType => {
                                        const planned = plannedMeals[mealType];
                                        return (
                                            <button key={mealType} className={`meal-slot ${!planned ? 'empty' : ''}`} onClick={(e) => handleSelectSlot(e, date, mealType)} aria-label={`Plan ${mealType} for ${date.toLocaleDateString()}`}>
                                                <span className="meal-type-label">{t(mealType)}</span>
                                                {planned ? (
                                                    <div className="planned-item">
                                                        <div className="planned-item-details">
                                                            <span className={`material-symbols-outlined type-icon ${planned.type === 'favorite' ? 'favorite' : ''}`}>{planned.type === 'recipe' ? 'menu_book' : 'star'}</span>
                                                            <span>{planned.name}</span>
                                                        </div>
                                                        <button onClick={(e) => { e.stopPropagation(); handleRemoveFromPlan(dateKey, mealType); }} className="remove-item-btn" aria-label={`Remove ${planned.name}`}>
                                                            <span className="material-symbols-outlined">close</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="add-item-placeholder"><span className="material-symbols-outlined add-icon">add</span></div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </main>
            {selectedSlot && (
                <AddToPlanPopover onClose={() => setSelectedSlot(null)} onAddToPlan={handleAddToPlan} favorites={favorites} recipes={recipes} position={selectedSlot.position} triggerRef={selectedSlot.triggerRef} />
            )}
        </>
    );
}

const MotivationalModal = ({ achievement, onClose }: { achievement: Achievement, onClose: () => void }) => {
    const { t } = useTranslations();
    return (
        <div className="modal-overlay">
            <div className="motivational-modal card">
                <span className="material-symbols-outlined achievement-icon">{achievement.icon}</span>
                <h2>{t(achievement.titleKey)}</h2>
                <p>{t(achievement.descKey)}</p>
                <button className="action-button" onClick={onClose}>{t('awesome')}</button>
            </div>
        </div>
    );
};

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string, confirmText: string }) => {
    if (!isOpen) return null;
    const { t } = useTranslations();

    return (
        <div className="modal-overlay">
            <div className="confirmation-dialog card">
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="dialog-actions">
                    <button className="action-button secondary" onClick={onClose}>{t('cancel')}</button>
                    <button className="action-button danger" onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    const { t } = useTranslations();
    const [activeScreen, setActiveScreen] = useState('dashboard');
    const [modal, setModal] = useState<string | null>(null);
    const [showAddOptions, setShowAddOptions] = useState(false);
    const [mealToEdit, setMealToEdit] = useState<Meal | any | null>(null);
    const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
    
    const [goals, setGoals] = useLocalStorage('cal-ai-goals', DEFAULT_GOALS);
    const [dailyLog, setDailyLog] = useLocalStorage<DailyLogData>('cal-ai-log', {});
    const [apiKey, setApiKey] = useLocalStorage('cal-ai-api-key', process.env.API_KEY || '');
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('cal-ai-theme', 'light');
    const [accentColor, setAccentColor] = useLocalStorage<ThemeAccent>('cal-ai-accent', 'green');
    const [weightUnit, setWeightUnit] = useLocalStorage<WeightUnit>('cal-ai-weight-unit', 'lbs');
    const [isApiKeyModalOpen, setApiKeyModalOpen] = useState(false);
    
    // New Features State
    const [favoriteFoods, setFavoriteFoods] = useLocalStorage<FavoriteFood[]>('cal-ai-favorites', []);
    const [recipes, setRecipes] = useLocalStorage<Recipe[]>('cal-ai-recipes', []);
    const [achievements, setAchievements] = useLocalStorage<string[]>('cal-ai-achievements', []);
    const [mealPlan, setMealPlan] = useLocalStorage<MealPlan>('cal-ai-meal-plan', {});
    const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<Achievement | null>(null);
    const [recipeToDeleteId, setRecipeToDeleteId] = useState<string | null>(null);
    const [mealToDeleteId, setMealToDeleteId] = useState<string | null>(null);
    const [recipeToView, setRecipeToView] = useState<Recipe | null>(null);

    const ai = useMemo(() => (apiKey ? new GoogleGenAI({ apiKey }) : null), [apiKey]);

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);
    
    useEffect(() => {
        const themeColors: Record<ThemeAccent, string> = {
            green: '#22c55e', coral: '#f87171', mint: '#34d399', lavender: '#a78bfa',
        };
        const hexColor = themeColors[accentColor];
        document.documentElement.style.setProperty('--primary', hexColor);

        // Add RGB version for box-shadow with opacity
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
    }, [accentColor]);

    useEffect(() => {
        if (!apiKey) {
            setApiKeyModalOpen(true);
        }
    }, [apiKey]);

    const handleKeySaved = (key: string) => {
        setApiKey(key);
        setApiKeyModalOpen(false);
    };

    const todayKey = getTodayKey();
    const todayData = dailyLog[todayKey] || { meals: [], water: 0, weight: null, activities: [], steps: 0 };

    const updateTodayLog = (updates: Partial<DailyLog>) => {
        setDailyLog(prev => {
            const prevTodayData = prev[todayKey] || { meals: [], water: 0, weight: null, activities: [], steps: 0 };
            return {
                ...prev,
                [todayKey]: { ...prevTodayData, ...updates }
            };
        });
    };
    
    // --- Achievement Logic ---
    const handleUnlockAchievement = useCallback((id: string) => {
        if (!achievements.includes(id)) {
            setAchievements(prev => [...prev, id]);
            const achievementData = ALL_ACHIEVEMENTS.find(ach => ach.id === id);
            if (achievementData) {
                setNewlyUnlockedAchievement(achievementData);
            }
        }
    }, [achievements, setAchievements]);

    const calculateStreak = useMemo(() => {
        const sortedKeys = Object.keys(dailyLog).sort().reverse();
        if (sortedKeys.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        const hasLogForToday = sortedKeys[0] === getTodayKey(today);

        if (hasLogForToday) {
            streak = 1;
        } else {
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            if(sortedKeys[0] !== getTodayKey(yesterday)) {
                return 0; // Streak broken
            }
        }

        for (let i = 0; i < sortedKeys.length - 1; i++) {
            const current = new Date(sortedKeys[i]);
            const prev = new Date(sortedKeys[i+1]);
            const diff = (current.getTime() - prev.getTime()) / (1000 * 3600 * 24);
            if (diff === 1) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }, [dailyLog]);

    const challengeProgress = useMemo(() => {
        const progress = { hydration_hero: 0, variety_voyager: 0, balanced_day: 0 };
        const allLogs = Object.values(dailyLog);

        // Hydration Hero
        progress.hydration_hero = allLogs.filter(day => day.waterGoalMet).length;
        
        // Variety Voyager
        const uniqueMeals = new Set(allLogs.flatMap(day => day.meals.map(m => m.name)));
        progress.variety_voyager = uniqueMeals.size;

        // Balanced Day
        progress.balanced_day = allLogs.filter(day => day.macrosMet).length;

        return progress;
    }, [dailyLog]);

    useEffect(() => {
        if (calculateStreak >= 3) handleUnlockAchievement('streak_3');
        if (calculateStreak >= 7) handleUnlockAchievement('streak_7');
        if (calculateStreak >= 30) handleUnlockAchievement('streak_30');
    }, [calculateStreak, handleUnlockAchievement]);

    // --- Data Handlers ---
    const handleSaveMeal = (mealData: Omit<Meal, 'id' | 'timestamp'> & { id?: string; image?: string }) => {
        setDailyLog(prev => {
            const prevTodayData = prev[todayKey] || { meals: [], water: 0, weight: null, activities: [], steps: 0 };
            let newMeals: Meal[];
            let isNewMeal = false;

            if (mealData.id) { // Edit meal
                const originalMeal = prevTodayData.meals.find(m => m.id === mealData.id);
                if (!originalMeal) return prev; // Safety check

                const updatedMeal: Meal = {
                    name: mealData.name,
                    calories: mealData.calories,
                    protein: mealData.protein,
                    carbs: mealData.carbs,
                    fat: mealData.fat,
                    id: mealData.id,
                    timestamp: originalMeal.timestamp,
                    image: mealData.image || originalMeal.image,
                };
                newMeals = prevTodayData.meals.map(m => m.id === mealData.id ? updatedMeal : m);
            } else { // New meal
                isNewMeal = true;
                const mealWithId: Meal = {
                    ...mealData,
                    id: Date.now().toString(),
                    timestamp: new Date().toISOString()
                };
                newMeals = [mealWithId, ...prevTodayData.meals];
            }

            const consumed = newMeals.reduce((acc, m) => ({
                calories: acc.calories + m.calories, protein: acc.protein + m.protein,
                carbs: acc.carbs + m.carbs, fat: acc.fat + m.fat
            }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

            const proteinGoalMet = consumed.protein >= goals.protein;
            const macrosMet = proteinGoalMet && consumed.calories >= goals.calories && consumed.carbs >= goals.carbs && consumed.fat >= goals.fat;

            // Achievement logic
            if (isNewMeal) {
                const totalMeals = Object.values(prev).flatMap(d => d.meals).length + 1;
                if (totalMeals >= 1) handleUnlockAchievement('log_1');
                if (totalMeals >= 50) handleUnlockAchievement('log_50');
            }
            if (proteinGoalMet && !prevTodayData.proteinGoalMet) {
                handleUnlockAchievement('protein_1');
                const proteinGoalDays = Object.values(prev).filter(d => d.proteinGoalMet).length + 1;
                if (proteinGoalDays >= 7) handleUnlockAchievement('protein_7');
            }

            return { ...prev, [todayKey]: { ...prevTodayData, meals: newMeals, proteinGoalMet, macrosMet } };
        });

        setMealToEdit(null);
        handleCloseModal();
    };
    
    const handleLogPlannedMeal = (mealData: Omit<Meal, 'id' | 'timestamp'>, mealType: MealType) => {
        // Log the meal
        handleSaveMeal(mealData);
        // Remove from plan for today
        setMealPlan(prev => {
            const newPlan = { ...prev };
            const todayPlan = newPlan[todayKey];
            if (todayPlan && todayPlan[mealType]) {
                const updatedTodayPlan = { ...todayPlan };
                delete updatedTodayPlan[mealType];
                if (Object.keys(updatedTodayPlan).length === 0) {
                    delete newPlan[todayKey];
                } else {
                    newPlan[todayKey] = updatedTodayPlan;
                }
            }
            return newPlan;
        });
    };

    const handleOpenEditMeal = (meal: Meal) => {
        setMealToEdit(meal);
        setModal('manual');
    };
    
    const handleDeleteMeal = (id: string) => {
        setMealToDeleteId(id);
    };

    const confirmDeleteMeal = () => {
        if (mealToDeleteId) {
            setDailyLog(prev => {
                const todayLog = prev[todayKey] || { meals: [], water: 0, weight: null, activities: [], steps: 0 };
                const updatedMeals = todayLog.meals.filter(m => m.id !== mealToDeleteId);
                return {
                    ...prev,
                    [todayKey]: { ...todayLog, meals: updatedMeals }
                };
            });
            setMealToDeleteId(null);
        }
    };
    
    const handleAddToFavorites = (food: FavoriteFood) => {
        setFavoriteFoods(prev => [food, ...prev.filter(f => f.name !== food.name)]);
    };
    
    const handleRemoveFavorite = (id: string) => {
        setFavoriteFoods(prev => prev.filter(f => f.id !== id));
    };

    const handleSaveRecipe = (recipe: Recipe) => {
        setRecipes(prev => [recipe, ...prev.filter(r => r.id !== recipe.id)]);
        handleUnlockAchievement('recipe_1');
    };

    const handleDeleteRecipe = (id: string) => {
        setRecipeToDeleteId(id);
    };

    const confirmDeleteRecipe = () => {
        if (recipeToDeleteId) {
            setRecipes(prev => prev.filter(r => r.id !== recipeToDeleteId));
            setRecipeToDeleteId(null);
        }
    };

    const handleLogAgain = (meal: Meal) => {
        const newMealInstance = { ...meal, id: Date.now().toString(), timestamp: new Date().toISOString() };
        setDailyLog(prev => {
            const todayLog = prev[todayKey] || { meals: [], water: 0, weight: null, activities: [], steps: 0 };
            const newMeals = [newMealInstance, ...todayLog.meals];
            return { ...prev, [todayKey]: { ...todayLog, meals: newMeals } };
        });
    };

    const handleSaveActivity = (activity: Activity) => {
        setDailyLog(prev => {
            const todayLog = prev[todayKey] || { meals: [], water: 0, weight: null, activities: [], steps: 0 };
            const existing = todayLog.activities.find(a => a.id === activity.id);
            const updatedActivities = existing
                ? todayLog.activities.map(a => a.id === activity.id ? activity : a)
                : [activity, ...todayLog.activities];
            return { ...prev, [todayKey]: { ...todayLog, activities: updatedActivities } };
        });
        setActivityToEdit(null);
        handleCloseModal();
    };

    const handleEditActivity = (activity: Activity) => {
        setActivityToEdit(activity);
        setModal('activity');
    };

    const handleDeleteActivity = (id: string) => {
        if (window.confirm("Are you sure you want to delete this activity?")) {
            setDailyLog(prev => {
                const todayLog = prev[todayKey] || { meals: [], water: 0, weight: null, activities: [], steps: 0 };
                const updatedActivities = todayLog.activities.filter(a => a.id !== id);
                return { ...prev, [todayKey]: { ...todayLog, activities: updatedActivities } };
            });
        }
    };
    
    const handleUpdateWater = (amount: number) => {
        setDailyLog(prev => {
            const todayLog = prev[todayKey] || { meals: [], water: 0, weight: null, activities: [], steps: 0 };
            const newWater = Math.max(0, todayLog.water + amount);
            const waterGoalMet = newWater >= goals.water;
            return { ...prev, [todayKey]: { ...todayLog, water: newWater, waterGoalMet } };
        });
    };
    
    const handleLogSteps = (stepsToAdd: number) => {
        if (stepsToAdd <= 0) return;
        setDailyLog(prev => {
            const prevTodayData = prev[todayKey] || { meals: [], water: 0, weight: null, activities: [], steps: 0 };
            const newSteps = (prevTodayData.steps || 0) + stepsToAdd;
            return {
                ...prev,
                [todayKey]: { ...prevTodayData, steps: newSteps }
            };
        });
    };

    const handleLogWeight = (weight: number) => {
        updateTodayLog({ weight });
    };

    const handleAddClick = () => setShowAddOptions(prev => !prev);
    const handleAddOptionSelect = (option: string) => {
        if (option === 'recipe') {
            setModal('recipes');
        } else if (option === 'favorites') {
            setModal('favorites');
        } else {
            setModal(option);
        }
        setShowAddOptions(false);
    };
    
    const handleCloseModal = () => {
        setModal(null);
        setMealToEdit(null);
        setActivityToEdit(null);
        setRecipeToView(null);
    }

    const handleFixResults = (analysisData: any) => {
        setMealToEdit(analysisData);
        setModal('manual');
    };

    const handleExportData = () => {
        const data = {
            goals, dailyLog, favoriteFoods, recipes, achievements, mealPlan,
            theme, accentColor, weightUnit, language: 'en' // Get from context
        };
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `cal-ai-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        if (!event.target.files || event.target.files.length === 0) return;

        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = e => {
            if (e.target?.result) {
                if (window.confirm("Are you sure you want to import this data? This will overwrite all current data.")) {
                    try {
                        const importedData = JSON.parse(e.target.result as string);
                        if (importedData.goals && importedData.dailyLog) {
                            setGoals(importedData.goals);
                            setDailyLog(importedData.dailyLog);
                            setFavoriteFoods(importedData.favoriteFoods || []);
                            setRecipes(importedData.recipes || []);
                            setAchievements(importedData.achievements || []);
                            setMealPlan(importedData.mealPlan || {});
                            setTheme(importedData.theme || 'light');
                            setAccentColor(importedData.accentColor || 'green');
                            setWeightUnit(importedData.weightUnit || 'lbs');
                            // How to set language?
                            alert("Data imported successfully!");
                            setActiveScreen('dashboard');
                        } else {
                            alert("Invalid data file.");
                        }
                    } catch (error) {
                        alert("Error parsing data file.");
                    }
                }
            }
        };
        event.target.value = '';
    };

    const renderScreen = () => {
        switch (activeScreen) {
            case 'planner':
                return <PlannerScreen mealPlan={mealPlan} setMealPlan={setMealPlan} favorites={favoriteFoods} recipes={recipes} />;
            case 'progress':
                return <ProgressScreen dailyLog={dailyLog} goals={goals} onLogWeight={handleLogWeight} weightUnit={weightUnit} achievements={achievements} challengeProgress={challengeProgress} />;
            case 'coach':
                return <CoachScreen dailyLog={dailyLog} goals={goals} ai={ai} weightUnit={weightUnit}/>;
            case 'settings':
                return <SettingsScreen goals={goals} setGoals={setGoals} onExport={handleExportData} onImport={handleImportData} apiKey={apiKey} onUpdateApiKey={setApiKey} weightUnit={weightUnit} onUpdateWeightUnit={setWeightUnit} theme={theme} onUpdateTheme={setTheme} accentColor={accentColor} onUpdateAccentColor={setAccentColor} />;
            case 'dashboard':
            default:
                return <DashboardScreen todayLog={todayData} goals={goals} onUpdateWater={handleUpdateWater} onLogAgain={handleLogAgain} onDeleteActivity={handleDeleteActivity} onEditActivity={handleEditActivity} streak={calculateStreak} mealPlan={mealPlan} onLogPlannedMeal={handleLogPlannedMeal} recipes={recipes} favorites={favoriteFoods} onEditMeal={handleOpenEditMeal} onDeleteMeal={handleDeleteMeal} onLogSteps={handleLogSteps} />;
        }
    };
    
    return (
        <div className="app-container">
            {isApiKeyModalOpen && <ApiKeyModal onKeySaved={handleKeySaved} />}
            {newlyUnlockedAchievement && <MotivationalModal achievement={newlyUnlockedAchievement} onClose={() => setNewlyUnlockedAchievement(null)} />}
            <ConfirmationDialog
                isOpen={!!recipeToDeleteId}
                onClose={() => setRecipeToDeleteId(null)}
                onConfirm={confirmDeleteRecipe}
                title={t('delete_recipe_title')}
                message={t('delete_recipe_confirm_message')}
                confirmText={t('delete')}
            />
            <ConfirmationDialog
                isOpen={!!mealToDeleteId}
                onClose={() => setMealToDeleteId(null)}
                onConfirm={confirmDeleteMeal}
                title={t('delete_meal_title')}
                message={t('delete_meal_confirm_message')}
                confirmText={t('delete')}
            />
            
            <div className="screen-content">
                {renderScreen()}
            </div>

            {activeScreen !== 'coach' && (
                <button onClick={handleAddClick} className={`add-button ${showAddOptions ? 'active' : ''}`} aria-label={useTranslations().t('add_menu')}>
                    <span className="material-symbols-outlined">add</span>
                </button>
            )}
            
            {(modal === 'scan_meal' || modal === 'scan_barcode') && <CameraScreen scanMode={modal as 'scan_meal' | 'scan_barcode'} onBack={handleCloseModal} onMealAdded={handleSaveMeal} onFixResults={handleFixResults} ai={ai} onUnlockAchievement={handleUnlockAchievement} />}
            {modal === 'manual' && <ManualEntryScreen onBack={handleCloseModal} onMealSaved={handleSaveMeal} initialData={mealToEdit} ai={ai} onAddToFavorites={handleAddToFavorites} />}
            {modal === 'activity' && <ActivityEntryScreen onBack={handleCloseModal} onActivitySaved={handleSaveActivity} initialData={activityToEdit} />}
            {modal === 'favorites' && <MyFoodsScreen onBack={handleCloseModal} onMealAdded={handleSaveMeal} favorites={favoriteFoods} onRemoveFavorite={handleRemoveFavorite} />}
            {modal === 'recipeBuilder' && <RecipeBuilderScreen onBack={() => setModal('recipes')} onRecipeSaved={handleSaveRecipe} />}
            {modal === 'recipes' && <MyRecipesScreen onCreateRecipe={() => setModal('recipeBuilder')} onBack={handleCloseModal} recipes={recipes} onDeleteRecipe={handleDeleteRecipe} onViewRecipe={(recipe) => { setRecipeToView(recipe); setModal('recipeView'); }} />}
            {modal === 'recipeView' && recipeToView && <RecipeViewScreen onBack={handleCloseModal} onMealAdded={handleSaveMeal} recipe={recipeToView} />}
            
            {activeScreen !== 'coach' && showAddOptions && <AddOptions onSelect={handleAddOptionSelect} />}
            <BottomNav active={activeScreen} setActive={setActiveScreen} />
        </div>
    );
};


const Root = () => (
    <React.StrictMode>
        <LanguageProvider>
            <App />
        </LanguageProvider>
    </React.StrictMode>
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Root />);