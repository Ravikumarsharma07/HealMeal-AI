"use client"
import React, { useEffect, useRef, useState } from 'react';
import { LogOut, User, Activity, Hospital } from 'lucide-react';
import axios from 'axios';

interface NavbarProps {
  role: string;
  email: string;
  hospitalID: string;
}

const Navbar: React.FC<NavbarProps> = ({ role, email, hospitalID }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleBtn = useRef<HTMLDivElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    event.stopPropagation();
    if (
      toggleBtn.current &&
      !toggleBtn.current.contains(event.target as Node) && 
      dropdown.current && 
      !dropdown.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const onLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      
      // Show success message (you can replace this with your toast implementation)
      console.log("Successfully logged out");
      
      window.location.href = "/login";
    } catch (error) {
      console.log(error);
      
      // Show error message (you can replace this with your toast implementation)
      console.error("Unexpected error occurred");
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-500 to-green-600 shadow-xl border-b border-emerald-600/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 lg:py-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/30">
              <Activity className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white capitalize">
                {role}'s Dashboard
              </h1>
              <p className="text-emerald-100 text-sm md:text-base lg:text-lg font-medium">Patient Management System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl ring-1 ring-white/30">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Live System</span>
            </div>
            
            {/* User Profile Dropdown */}
            <div className="relative">
              <div
                ref={toggleBtn}
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 md:w-12 md:h-12 text-xl bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/30 cursor-pointer hover:bg-white/30 transition-all duration-200 hover:scale-105"
              >
                {email && email[0].toUpperCase()}
              </div>
              
              
              <div
                ref={dropdown}
                className={`absolute top-16 right-0 ${
                  isOpen ? "visible opacity-100 scale-100" : "invisible opacity-0 scale-95"
                } transform transition-all duration-200 ease-out origin-top-right`}
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 min-w-[240px] overflow-hidden">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 capitalize">{role}</p>
                        <p className="text-xs text-gray-600 truncate max-w-[160px]" title={email}>
                          {email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50">
                  <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Hospital className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 capitalize" >Hospital ID</p>
                        <p className="text-xs text-gray-600 truncate max-w-[160px]">
                          {hospitalID}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={onLogout}
                    className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-red-50 transition-all duration-200 text-gray-700 hover:text-red-600 group"
                  >
                    <div className="w-8 h-8 bg-gray-100 group-hover:bg-red-100 rounded-lg flex items-center justify-center transition-all duration-200">
                      <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                    </div>
                    <span className="font-medium">Log out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;