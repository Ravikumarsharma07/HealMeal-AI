import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="pt-16">
      <section className="container mx-auto p-6">
        <h2 className="text-4xl font-bold text-safetyGreen-dark text-center">
          About Us
        </h2>
        <p className="mt-4 text-gray-700 text-center">
          We are dedicated to transforming hospital food management with
          innovative technology and efficient processes.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-safetyGreen-light text-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold">Our Mission</h3>
            <p className="mt-4">
              Delivering nutritious meals to patients while optimizing staff
              workflow and reducing waste.
            </p>
          </div>
          <div className="bg-safetyGreen-dark text-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold">Our Vision</h3>
            <p className="mt-4">
              A future where hospitals run efficiently with seamless food
              logistics.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
