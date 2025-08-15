import { ChefHat } from "lucide-react";
import MealPlanCard from "./MealPlanCard";
import { useEffect, useState } from "react";
import { Patient } from "@/types/patients";

const DailyCookingList = ({ patients, meals }: { patients: Patient[], meals:any }) => {


  if(patients.length < 1) return;
  return (
    <section className="p-2 bg-white rounded-lg">
      <div className="grid grid-flow-col w-max">
        <ChefHat className="row-span-2 bg-green-400/20 text-emerald-500 w-12 h-12 p-2 mr-2 rounded-lg" />
        <h3 className="text-[1.2rem] leading-6 font-semibold">
          Daily Cooking List
        </h3>
        <p className="text-sm text-black/70">
          Today's meal preparation schedule
        </p>
      </div>

      <div className="space-y-4 mt-4">
          <MealPlanCard mealTime={"Morning"} meals={meals.morning} patients={patients} />
          <MealPlanCard mealTime={"Evening"} meals={meals.evening} patients={patients} />
          <MealPlanCard mealTime={"Night"} meals={meals.night} patients={patients} />
      </div>
    </section>
  );
};

export default DailyCookingList;
