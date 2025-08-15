import React, { Dispatch, SetStateAction, useState } from "react";
import {
  User,
  Phone,
  AlertTriangle,
  Heart,
  Edit,
  Trash2,
  Utensils,
  Ban,
  Clock,
  Bed,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Patient } from "./../../types/patients";
import { Button } from "../ui/button";

interface PatientCardProps {
  patient: Patient;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: string) => void;
  handleUpdateDietPlan: (patient: Patient) => Promise<void>;
  isRefreshing: boolean;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onEdit,
  onDelete,
  setIsModalOpen,
  handleUpdateDietPlan,
  isRefreshing,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getDietaryRestrictions = () => {
    const restrictions = [];
    if (patient?.isLowSugarDiet) restrictions.push("Low Sugar");
    if (patient?.isNoSaltDiet) restrictions.push("No Salt");
    return restrictions;
  };
  const getMealCount = () => {
    let count = 0;
    if (patient.dietPlan?.morning?.name) count++;
    if (patient.dietPlan?.evening?.name) count++;
    if (patient.dietPlan?.night?.name) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 overflow-hidden group">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 px-5 py-4 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-white/30">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-tight">
                {patient.name}
              </h3>
              <p className="text-emerald-100 text-sm font-medium">
                {patient.age}y • {patient.gender}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                onEdit(patient);
                setIsModalOpen(true);
              }}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 hover:scale-105"
            >
              <Edit className="w-4 h-4" />
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-red-500/80 transition-all duration-200 hover:scale-105">
                  <Trash2 className="w-4 h-4" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] font-sans">
                <DialogHeader>
                  <DialogTitle className="text-red-500 text-center pb-2 text-xl">
                    Delete Patient
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this patient?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={() => onDelete(patient._id)}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Contact & Location */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium">{patient.contact}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Bed className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium">
                R{patient.roomNumber}-{patient.bedNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        {(patient.diseases.length > 0 || patient.allergies.length > 0) && (
          <div className="space-y-3">
            {patient.diseases.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Conditions
                  </span>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                    {patient.diseases.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {patient.diseases.slice(0, 3).map((disease, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-lg border border-red-200"
                    >
                      {disease}
                    </span>
                  ))}
                  {patient.diseases.length > 3 && (
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                      +{patient.diseases.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {patient.allergies.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Allergies
                  </span>
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                    {patient.allergies.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {patient.allergies.slice(0, 3).map((allergy, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-lg border border-orange-200"
                    >
                      {allergy}
                    </span>
                  ))}
                  {patient.allergies.length > 3 && (
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                      +{patient.allergies.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Diet Plan Summary */}
        {patient.dietPlan && (
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Utensils className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Diet Plan
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">
                  {getMealCount()} meals
                </span>
              </div>
            </div>

            {/* Dietary Restrictions */}
            {getDietaryRestrictions().length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-1.5">
                  {getDietaryRestrictions().map((restriction, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200 flex items-center space-x-1"
                    >
                      <Ban className="w-3 h-3" />
                      <span>{restriction}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Meal Summary */}

            <button
              disabled={isRefreshing}
              className={`${
                isRefreshing && "opacity-50 cursor-not-allowed"
              } flex-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-sm text-white px-2 py-1 rounded-md my-2`}
              onClick={async () => {
                setIsLoading(true);
                await handleUpdateDietPlan(patient);
                setIsLoading(false);
              }}
            >
              <Sparkles className="w-4 h-4" />
              new diet plan
            </button>
            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  time: "Morning",
                  meal: patient.dietPlan.morning,
                  ingredients: patient.dietPlan.morning.ingredients,
                  icon: "🌅",
                  color: "bg-yellow-50 border-yellow-200",
                },
                {
                  time: "Evening",
                  meal: patient.dietPlan.evening,
                  ingredients: patient.dietPlan.evening.ingredients,
                  icon: "🌆",
                  color: "bg-orange-50 border-orange-200",
                },
                {
                  time: "Night",
                  meal: patient.dietPlan.night,
                  ingredients: patient.dietPlan.night.ingredients,
                  icon: "🌙",
                  color: "bg-purple-50 border-purple-200",
                },
              ].map(({ time, meal, ingredients, icon, color }) => (
                <div
                  key={time}
                  className={`${color} border rounded-lg p-2 flex gap-2`}
                >
                  <div className="text-2xl mt-1">{icon}</div>
                  {/* <div className="text-lg font-medium text-gray-700">
                    {time}
                  </div> */}
                  <div>

                  {meal?.name ? (
                    <div
                      className="text-xs font-semibold text-gray-600 mt-1 truncate"
                      title={meal.name}
                    >
                      {isLoading ? "Updating..." : meal.name}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 mt-1">Not set</div>
                  )}
                  {ingredients.length > 0 ? (
                    <div
                      className="text-xs text-gray-600 mt-2"
                      title={ingredients.join(", ")}
                      >
                      {isLoading ? "Updating..." : ingredients.join(", ")}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 mt-1">Not set</div>
                  )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientCard;
