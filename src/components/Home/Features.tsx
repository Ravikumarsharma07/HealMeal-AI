import React from 'react';

const Features = () => {
  return (
    <div className="pt-16">
      <section className="container mx-auto p-6">
        <h2 className="text-4xl font-bold text-safetyGreen-dark text-center">
          Key Features
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-safetyGreen-light">
            <h3 className="text-xl font-bold text-safetyGreen-dark">
              Patient Meal Tracking
            </h3>
            <p className="mt-4 text-gray-700">
              Track and monitor meal preferences, allergies, and nutrition.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-safetyGreen-dark">
            <h3 className="text-xl font-bold text-safetyGreen-dark">
              AI generated meals
            </h3>
            <p className="mt-4 text-gray-700">
              Generate personalized meals based on patient preferences and pantry items.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-safetyGreen-light">
            <h3 className="text-xl font-bold text-safetyGreen-dark">
              Real-time Analytics
            </h3>
            <p className="mt-4 text-gray-700">
              Get insights into Daily Cooking List and inventory.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
