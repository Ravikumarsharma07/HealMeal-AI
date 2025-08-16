"use client";
import DailyCookingList from "@/components/Dashboard/Pantry/DailyCookingList";
import DailyIngredientsNeeded from "@/components/Dashboard/Pantry/DailyIngredientsNeeded";
import Inventory from "@/components/Dashboard/Pantry/Inventory";
import { PantryItem } from "@/types/pantry";
import { Patient } from "@/types/patients";
import axios from "axios";
import { AlertTriangle, Box, CircleX, Loader, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";



const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<PantryItem[]>([]);
  const [currentPage, setCurrentPage] = useState<"today-meals" | "inventory">('today-meals');
  const [patients, setPatients] = useState<Patient[]>([])
  const [stats, setStats] = useState<{
    total:number,
    critical:number,
    expiringSoon:number,
    lowStock:number,
  }>({total:0, lowStock:0, expiringSoon:0, critical:0})

    const [meals, setMeals] = useState({
    morning: {},
    evening: {},
    night: {},
  });
  
  useEffect(()=>{
    fetchPantryItems();
    fetchPatients()
  },[]) 

  useEffect(() => {
    if(patients.length < 1) return
    const meals: any = {
      morning:{},
      evening:{},
      night:{}
    };
    patients.forEach((patient) => {
      if(!patient.dietPlan) return
      if (!meals.morning[patient.dietPlan.morning.name]) {
        meals.morning[patient.dietPlan.morning.name] = 1;
      } else {
        meals.morning[patient.dietPlan.morning.name] += 1;
      }
      
      if (!meals.evening[patient.dietPlan.evening.name]) {
        meals.evening[patient.dietPlan.evening.name] = 1;
      } else {
        meals.evening[patient.dietPlan.evening.name] += 1;
      }

      if (!meals.night[patient.dietPlan.night.name]) {
        meals.night[patient.dietPlan.night.name] = 1;
      } else {
        meals.night[patient.dietPlan.night.name] += 1;
      }
    });
    setMeals(meals);
  }, [patients]);

  const fetchPantryItems = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.get("/api/pantry", {
        withCredentials: true,
      });
      if (response.data.pantryItems) {
        setItems(response.data.pantryItems);
      }
    } catch (error) {
      console.log(error);
      setError("Error while fetching pantry's data");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchPatients = async () => {
    try { 
      setError(null)
      setIsLoading(true)
      const { data } = await axios.get("/api/patients", {
        withCredentials: true,
      });
      if (data.success){
        setPatients(data.patients);
      }
    } catch (err: any) {
      setError(err.response.data.message || "Unable to fetch daily meals data. Try again")
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(()=>{
    if(items.length > 0){
      setStats(() => {
        return {
        total: items.length,
        lowStock: items.filter((item) => item.quantity < item.threshold).length,
        expiringSoon: items.filter(
          (item) =>
            new Date(item.expiryDate).getTime() - Date.now() <
            1000 * 60 * 60 * 24 * 5
        ).length, 
         critical: items.filter(
          (item) =>
            item.quantity <= 0
        ).length,
      };
    })
  }
  },[items])

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <Loader className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div>
          <AlertTriangle className="w-10 h-10 text-red-600 mx-auto mb-4" />
          <p className="text-xl font-semibold mb-2">{error}</p>
          <button
            onClick={() => (fetchPantryItems(), fetchPatients)()}
            className="bg-emerald-500 text-white px-4 py-2 rounded-xl"
          >
            <RefreshCw className="inline-block mr-2" /> Try Again
          </button>
        </div>
      </div>
    );

  const colorClasses: Record<string, { text: string; bg: string }> = {
    emerald: {
      text: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    red: {
      text: "text-red-600",
      bg: "bg-red-100",
    },
    yellow: {
      text: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    orange:{
      text:"text-orange-500",
      bg:"bg-orange-100"
    }
  };

  return (
    <section className="max-w-7xl mx-auto py-6 font-sans px-2 md:px-4">

      {/* stats of items like total item , low stock item , expiring soon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-7">
        {[
          ["Total Items", stats.total, "emerald"],
          ["Low Stock", stats.lowStock, "yellow"],
          ["Expiring Soon", stats.expiringSoon, "orange"],
          ["Critical Stock", stats.critical, "red"],
        ].map(([label, value, color], index) => (
          <div
            key={label}
            className={`hover:scale-105 transition-all  bg-white rounded-xl p-4 drop-shadow-xl flex-between`}
          >
            <div>
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className={`text-2xl font-bold ${colorClasses[color].text}`}>
                {value}
              </p>
            </div>
            <div
              className={`w-12 h-12 ${colorClasses[color].bg} rounded-full flex items-center justify-center`}
            >
              {index === 0 && <Box className={`w-6 h-6 ${colorClasses[color].text}`} />}
              {index === 1 && <AlertTriangle className={`w-6 h-6 ${colorClasses[color].text}`} />}
              {index === 2 && <AlertTriangle className={`w-6 h-6 ${colorClasses[color].text}`} />}
              {index === 3 && <CircleX className={`w-6 h-6 ${colorClasses[color].text}`} />}
            </div>
          </div>
        ))}
      </div>

      <section>
        <div className="relative z-10">
          <button onClick={() => setCurrentPage("today-meals")} className={`px-2 pb-1 font-semibold border-b-2 ${currentPage == "today-meals"? "text-emerald-600 border-emerald-500" : "border-transparent"}`}>
            Daily Cooking
          </button>
          <button onClick={() => setCurrentPage("inventory")} className={`px-2 pb-1 font-semibold border-b-2 ${currentPage == "inventory"? "text-emerald-600 border-emerald-500" : "border-transparent"}`}>
            Inventory
          </button>
        </div>
        <div className="h-0.5 bg-gray-300 relative rounded-lg bottom-[2px] z-0"></div>
      </section>
        {currentPage == "inventory" && <Inventory pantryItems={items} fetchPantryItems={fetchPantryItems}/>}
        {currentPage == "today-meals" && (
          <section className="grid my-2 px-2">
            <DailyCookingList patients={patients} meals={meals}/>
          </section>
          )}
    </section>
  );
};

export default Page;
