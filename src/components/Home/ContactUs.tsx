// src/pages/ContactUs.tsx
import React from 'react';

const ContactUs: React.FC = () => {
  return (
    <div className="pt-16">
      <section className="container mx-auto p-6">
        <h2 className="text-4xl font-bold text-safetyGreen-dark text-center">
          Give Feedback On Our Services
        </h2>
        <form className="mt-8 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Your Name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Your Email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Message</label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Your Message"
              rows={5}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-safetyGreen-dark text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
};

export default ContactUs;
