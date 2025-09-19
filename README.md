# Cal AI: AI-Powered Nutrition Tracker

**Cal AI** is a modern, intelligent calorie and macro tracking application
designed to simplify the process of logging meals and monitoring nutritional
intake. By leveraging the power of Google's Gemini AI, users can get detailed
nutritional information simply by taking a picture of their food. The app serves
as a personal health companion, offering a seamless user experience,
personalized coaching, and insightful progress tracking.

---

## ✨ Core Features

### 1. Dashboard

The central hub of the app, providing an at-a-glance summary of the user's daily
progress.

- **Dynamic Summary:** Shows calories remaining, macro consumption (protein,
  carbs, fat), and progress towards daily goals.
- **AI Insights:** A smart card offers context-aware tips and reminders, like
  suggesting a walk or reminding the user to log a meal.
- **Streak Counter:** Motivates users by displaying their daily logging streak.
- **Water & Step Tracking:** Interactive UI to easily log water intake and
  steps.
- **Meal & Activity Logs:** A clear list of meals and activities logged for the
  day, with options to edit, delete, or log again.
- **Today's Plan Integration:** Displays planned meals for the day, allowing for
  quick one-tap logging.

### 2. AI-Powered Meal Logging

Multiple intuitive methods to log food and activities.

- **Scan a Meal:** Users can take or upload a photo of their meal. The Gemini AI
  analyzes the image, identifies ingredients, and returns a complete nutritional
  breakdown (calories, macros, etc.).
- **Scan Barcode/Product:** The AI can analyze images of packaged food or
  barcodes, using Google Search grounding to find and return accurate
  nutritional information for the specific product.
- **Manual Entry with AI Suggestions:** As users type a food name, the AI
  provides a list of common foods and their serving sizes, pre-filling
  nutritional data.
- **Log from Favorites:** Save frequently eaten foods for quick and easy logging
  in the future.
- **Recipe Builder:** Create custom recipes by listing ingredients. The app
  automatically calculates the nutritional information per serving.

### 3. Meal Planner

A weekly planner to help users organize their meals in advance.

- **Weekly View:** A clear, seven-day calendar view.
- **Add to Plan:** Users can add their favorite foods and created recipes to any
  meal slot (Breakfast, Lunch, Dinner, Snacks).
- **Seamless Logging:** Planned meals for the current day appear on the
  dashboard for easy logging.

### 4. Progress Tracking & Insights

A dedicated screen for visualizing long-term progress and discovering trends.

- **Interactive Charts:** Line charts display trends for calories, macros,
  steps, and weight over various timeframes (7 days, 30 days, 1 year, etc.).
- **Chart Tooltips:** Click on any data point in the chart to see its specific
  value and date.
- **Daily Goal Progress:** Progress bars show how the user is tracking against
  their goals for the current day.
- **Data-Driven Insights:** The app analyzes historical data to provide insights
  like the top 5 most logged foods, the time of day with the highest calorie
  intake, and the average macro balance.
- **Achievements & Challenges:** A gamified system to reward consistency and
  healthy habits (e.g., "Log meals 7 days in a row").

### 5. AI Coach ("Cal")

A conversational AI assistant for personalized guidance and support.

- **Context-Aware Chat:** "Cal" has access to the user's daily log and goals,
  allowing it to provide tailored advice (e.g., "What's a good high-protein
  snack?").
- **Natural Conversation:** Powered by the Gemini API's chat model for a
  friendly and encouraging conversational experience.
- **Voice Input:** Users can speak their questions directly into the chat using
  their device's microphone.

### 6. Settings & Personalization

Comprehensive options for customizing the app experience.

- **Custom Goals:** Set personal daily targets for calories, macros, water, and
  steps.
- **Preferences:** Choose between light/dark themes, select an accent color,
  switch languages (English, Dutch, Arabic), and set weight units (lbs/kg).
- **API Key Management:** A secure field for users to enter their Google AI API
  key.
- **Data Management:** Export all app data to a JSON file for backup or import
  data to restore the app's state.

---

## 🛠️ Technology Stack

- **Frontend Framework:** **React** (v19) with Hooks for state and lifecycle
  management.
- **AI & Machine Learning:** **Google Gemini API** (`@google/genai`) is used
  for:
  - **Image Analysis (`gemini-2.5-flash`):** For the "Scan a meal" feature,
    using a strict JSON schema for reliable output.
  - **Product Recognition (`gemini-2.5-flash` with Google Search):** For the
    "Scan Barcode" feature, grounding the model's knowledge in real-time search
    results.
  - **Conversational AI (`gemini-2.5-flash` Chat):** Powers the AI Coach "Cal".
  - **Text Generation (`gemini-2.5-flash`):** For providing food suggestions in
    the manual entry screen.
- **Styling:** Plain **CSS** with Custom Properties (CSS Variables) for robust
  theming (light/dark modes and accent colors). The layout is fully responsive
  for mobile devices.
- **State Management:** Local component state is managed with React's
  `useState`, `useMemo`, and `useCallback` hooks. App-wide state (like logs,
  goals, etc.) is held in the root `App` component and passed down via props.
- **Data Persistence:** The **`useLocalStorage`** custom hook is used to save
  all user data (logs, goals, settings) to the browser's Local Storage, ensuring
  data persistence between sessions.
- **Internationalization (i18n):** A custom solution using **React Context**
  (`LanguageProvider`) to provide translations for English, Dutch, and Arabic
  throughout the application.

---

## 📂 Code Structure

The entire application is architected within three primary files for simplicity
and rapid development.

- **`index.html`**:

  - The single HTML entry point.
  - Sets up the `<div id="root">` where the React app is mounted.
  - Uses an `importmap` to manage JavaScript modules (React, Gemini AI) directly
    from a CDN, eliminating the need for a local build step.

- **`index.tsx`**:

  - The heart of the application, containing all the JavaScript and React code.
  - **Translations:** A `translations` object holds all UI strings for supported
    languages. The `LanguageProvider` and `useTranslations` hook make these
    available throughout the app.
  - **Types & Defaults:** All TypeScript types (`Meal`, `DailyLog`, etc.) and
    default constants (`DEFAULT_GOALS`) are defined at the top.
  - **AI Helpers:** Contains functions that prepare data and prompts for the
    Gemini API, including the JSON schemas (`analysisSchema`,
    `suggestionSchema`) that structure the AI's responses.
  - **UI Components:** A collection of reusable functional components (e.g.,
    `CircularProgress`, `LineChart`, `MealCard`).
  - **Screens & Modals:** Each major feature is encapsulated in its own "Screen"
    or "Modal" component (e.g., `DashboardScreen`, `CameraScreen`,
    `CoachScreen`).
  - **Root `App` Component:** This is the main component that orchestrates the
    entire application. It holds all the primary state using the
    `useLocalStorage` hook and manages which screen or modal is currently
    visible. All data handling functions (e.g., `handleSaveMeal`,
    `handleUpdateWater`) are defined here and passed down as props to child
    components.

- **`index.css`**:

  - A single CSS file containing all styles for the application.
  - Uses CSS variables (`:root`) to define the color palette for both light and
    dark themes, which are toggled by adding a `.dark` class to the `<html>`
    element.
  - Styles are organized logically by component or feature (e.g., Dashboard,
    Modals, Coach Screen).

- **`metadata.json`**:
  - Provides metadata about the application, including the permissions it
    requires (`camera`, `microphone`) to function correctly in a web frame
    environment.
