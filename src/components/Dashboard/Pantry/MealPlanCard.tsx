import { Patient } from "@/types/patients";
import { Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";

const MealPlanCard = ({
  mealTime,
  patients,
  meals,
}: {
  meals: any;
  mealTime: string;
  patients: Patient[];
}) => {
  const [meal, setMeal] = useState<string[]>([]);
  useEffect(() => {
    const mealNames: string[] = Object.keys(meals);
    setMeal(mealNames);
  }, [patients]);                                         
  return (
    <div className="p-2 bg-white rounded-lg border border-gray-200">
      {/* header of meal's card */}
      <div className="flex gap-2 flex-between">
        <div className="grid grid-flow-col space-x-2">
          <span className="row-span-2 text-[1.8rem]">
            {mealTime == "Morning" && "🌅"}
            {mealTime == "Evening" && "🌆"}
            {mealTime == "Night" && "🌙"}
          </span>
          <h3 className="text-[16px] font-semibold">{mealTime} Meal Plan</h3>
          <p className="text-[13px] text-black/70 flex-center gap-4">
            <span className="flex-center gap-1">
              <Clock className="w-4 h-4" />
              {mealTime == "Morning" && "7:00 AM - 9:00 AM "}
              {mealTime == "Evening" && "5:00 PM - 7:00 PM "}
              {mealTime == "Night" && "9:00 PM - 10:00 PM "}
            </span>{" "}
            <span className="flex-center gap-1">
              <Users className="w-4 h-4" />
              {patients?.length} patients
            </span>
          </p>
        </div>
        <span className="bg-green-500/20 border border-emerald-400 text-emerald-500 rounded-full px-1 text-sm">
          {patients?.length} meals
        </span>
      </div>

      {/* meal details and patients details (main content) */}
      <div className="grid md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-2 mt-6">
          {meal.map((meal: any) => {
            return (
              <div
                key={meal}
                className="bg-gray-100 p-3 flex-between rounded-md"
              >
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  {meal}
                </p>
                <span className="bg-emerald-400/20 rounded-full text-sm text-emerald-500 px-2 border border-emerald-400">
                  {meals[meal]}x
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2 my-4 h-max">
          <h3 className="text-[1.2rem] leading-6 font-semibold w-full">
            Patients details
          </h3>
          {patients.map((patient) => (
            <p
              key={patient._id}
              className={`rounded-full px-2  border  text-sm ${patient.isLowSugarDiet && patient.isNoSaltDiet
                ? "bg-red-500/20 border-red-400 text-red-500"
                : patient.isLowSugarDiet
                ? "bg-yellow-400/20 border-yellow-400 text-yellow-500"
                : patient.isNoSaltDiet
                ? "bg-yellow-400/20 border-yellow-400 text-yellow-500"
                : "bg-blue-300/20 border-blue-400 text-blue-500"}`}
            >
              {patient.name}-
              {patient.isLowSugarDiet && patient.isNoSaltDiet
                ? "No sugar/Low salt"
                : patient.isLowSugarDiet
                ? "Low Sugar"
                : patient.isNoSaltDiet
                ? "No Salt"
                : "Regular"}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealPlanCard;
