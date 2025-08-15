import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, User, Heart, Utensils, Loader } from "lucide-react";
import { Patient } from "@/types/patients";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const SubHeading = ({ icon, heading }: { icon: any; heading: string }) => {
  return (
    <div className="col-span-full flex items-center space-x-3 pb-4 border-b border-gray-200">
      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800">{heading}</h3>
    </div>
  );
};

// Zod schema for validation
const patientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z
    .string()
    .min(0, "Age must be a positive number")
    .max(150, "Age must be realistic"),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required",
  }),
  contact: z.string().min(10, "Contact must be at least 10 digits"),
  roomNumber: z.string().min(1, "Room number is required"),
  bedNumber: z.string().min(1, "Bed number is required"),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface dietChartSchema {
  diseases: string[];
  allergies: string[];
  dietPlan: {
    
    morning: {
      name: string;
    ingredients: string[];
  };
  evening: {
    name: string;
    ingredients: string[];
  };
  night: {
    name: string;
    ingredients: string[];
  };
}
  isLowSugarDiet: boolean;
  isNoSaltDiet: boolean;
}

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPatient?: Patient | null;
  fetchPatients: () => void;
}

const PatientForm: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  editingPatient,
  fetchPatients,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newDisease, setNewDisease] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [dietChart, setDietChart] = useState<dietChartSchema>({
    diseases: [],
    allergies: [],
    dietPlan: {
      morning: {
        name: "",
        ingredients: [""],
      },
      evening: {
        name: "",
        ingredients: [""],
      },
      night: {
        name: "",
        ingredients: [""],
      },
    },
      isNoSaltDiet: false,
      isLowSugarDiet: false,
  });
  const {toast} = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      age: "",
      gender: "Male",
      contact: "",
      roomNumber: "",
      bedNumber: "",
    },
  });

  // Reset form when modal opens/closes or editing patient changes
  useEffect(() => {
    if (isOpen) {
      if (editingPatient) {
        reset({
          name: editingPatient.name,
          age: editingPatient.age,
          gender: editingPatient.gender,
          contact: editingPatient.contact,
          roomNumber: editingPatient.roomNumber,
          bedNumber: editingPatient.bedNumber,
        });
        setDietChart({
          diseases: editingPatient.diseases,
          allergies: editingPatient.allergies,
          dietPlan: editingPatient.dietPlan,
          isLowSugarDiet: editingPatient.isLowSugarDiet,
          isNoSaltDiet: editingPatient.isNoSaltDiet,
        });
      } else {
        reset({
          name: "",
          age: "",
          gender: "Male",
          contact: "",
          roomNumber: "",
          bedNumber: "",
        });
        setDietChart({
          diseases: [],
          allergies: [],
          dietPlan: {
            morning: {
              name: "",
              ingredients: [""],
            },
            evening: {
              name: "",
              ingredients: [""],
            },
            night: {
              name: "",
              ingredients: [""],
            },
          },
          isLowSugarDiet: false,
          isNoSaltDiet: false,
        })
      }
    }
  }, [isOpen, editingPatient, reset]);

  // Handle click outside to close modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;
  const onSubmit = async (data: PatientFormData) => {
    setIsLoading(true);

    // updating the existing patient 
    if(editingPatient){
      try {
        const response = await axios.put(
          `/api/patients/${editingPatient._id}`,
          {...data, ...dietChart},
          {
            withCredentials: true,
          }
        )
        if(response.data.success){
          toast({
            title:"Patient Updated Successfully",
            variant:"default"
          })
          fetchPatients();
          onClose();
          reset();
        }else{
          toast({
            title:response?.data?.message || "Failed to update patient",
            variant:"destructive"
          })
        }
      } catch (error) {
        console.log("Error submitting form:", error);
        toast({
          title:"Error while updating patient",
          variant:"destructive"
        })
      } finally{
        setIsLoading(false);
      }
      return
    }

    // adding new patient
    try {
      const response = await axios.post(
        "/api/patients",
        {...data, ...dietChart},
        {
          withCredentials: true,
        }
      )
      if(response.data.success){
        toast({
          title:"Patient Added Successfully",
          variant:"default"
        })
        fetchPatients();
        onClose();
        reset();
      }else{
        toast({
          title:response.data.message,
          variant:"destructive"
        })
      }
    } catch (error) {
      console.log("Error submitting form:", error);
      toast({
        title:"Unexpected Error Occured",
        variant:"destructive"
      })
    } finally {
      setIsLoading(false);
    }
  };

  const addDisease = () => {
    if (newDisease.trim()) {
      setDietChart((prevDietChart) => ({
        ...prevDietChart,
        diseases: [...prevDietChart.diseases, newDisease],
      }));
      setNewDisease("");
    }
  };

  const removeDisease = (index: number) => {
    const filteredDiseases = dietChart.diseases.filter((item, i) => i != index);
    setDietChart((prevDietChart) => {
      return {
        ...prevDietChart,
        diseases: filteredDiseases,
      };
    });
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setDietChart((prevDietChart) => ({
        ...prevDietChart,
        allergies: [...prevDietChart.allergies, newAllergy],
      }));
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    const filteredAllergies = dietChart.allergies.filter(
      (item, i) => i != index
    );
    setDietChart((prevDietChart) => ({
      ...prevDietChart,
      allergies: filteredAllergies,
    }));
  };

  const FormField = ({
    label,
    error,
    required = false,
    children,
  }: {
    label?: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
  }) => (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
        {children}
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );

  const mealTime = Object.keys(dietChart.dietPlan);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Enhanced Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-600 px-6 lg:px-8 py-6 flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold">
                {editingPatient ? "Edit Patient" : "Add New Patient"}
              </h2>
              <p className="text-emerald-100 font-medium">
                {editingPatient
                  ? "Update patient information"
                  : "Enter patient details and medical information"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-200 hover:scale-105"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 lg:p-8 space-y-8 lg:space-y-10"
          >
            {/* Personal Information Section */}
            <div className="space-y-6">
              <SubHeading
                heading="Personal Information"
                icon={<User className="w-5 h-5 text-emerald-600" />}
              />

              {/* Personal info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2">
                  <FormField
                    label="Full Name"
                    required
                    error={errors.name?.message}
                  >
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                          placeholder="Enter patient's full name"
                        />
                      )}
                    />
                  </FormField>
                </div>

                <FormField label="Age" required error={errors.age?.message}>
                  <Controller
                    name="age"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="0"
                        max="150"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        placeholder="Age"
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label="Gender"
                  required
                  error={errors.gender?.message}
                >
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    )}
                  />
                </FormField>

                <FormField
                  label="Contact Number"
                  required
                  error={errors.contact?.message}
                >
                  <Controller
                    name="contact"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        placeholder="Phone number"
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label="Room Number"
                  required
                  error={errors.roomNumber?.message}
                >
                  <Controller
                    name="roomNumber"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        placeholder="Room number"
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label="Bed Number"
                  required
                  error={errors.bedNumber?.message}
                >
                  <Controller
                    name="bedNumber"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        placeholder="Bed identifier"
                      />
                    )}
                  />
                </FormField>
              </div>
            </div>

            {/* Medical Information Section */}
            <section className="grid grid-cols-8 space-y-4 gap-2">
              <SubHeading
                heading="Medical Information"
                icon={<Heart className="w-5 h-5 text-emerald-600" />}
              />
              {/* medical conditions  */}
              <div className="col-span-8 md:col-span-4 space-y-1">
                <label
                  htmlFor="disease"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Medical Conditions
                </label>
                <div className="flex gap-2">
                  <input
                    id="disease"
                    type="text"
                    value={newDisease}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addDisease();
                      }
                    }}
                    onChange={(e) => {
                      setNewDisease(e.target.value);
                    }}
                    placeholder="Add medical conditions"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200}"
                  ></input>
                  <span
                    onClick={addDisease}
                    className="flex items-center bg-emerald-500 text-white px-4 py-3 rounded-xl"
                  >
                    +Add
                  </span>
                </div>
                {dietChart.diseases.map((disease, index) => {
                  return (
                    <div key={index} className="w-max relative inline-block">
                      <span
                        onClick={() => removeDisease(index)}
                        className="absolute opacity-60 hover:opacity-100 right-[0px] top-[-8px] cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </span>
                      <span className="bg-red-600/40 mt-4 px-4 md:text-lg py-1 mr-2 rounded-lg">
                        {disease}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* allergies  */}
              <div className="col-span-8 md:col-span-4 space-y-1">
                <label
                  htmlFor="allergy"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Allergies
                </label>
                <div className="flex gap-2">
                  <input
                    id="allergy"
                    type="text"
                    value={newAllergy}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addAllergy();
                      }
                    }}
                    onChange={(e) => {
                      setNewAllergy(e.target.value);
                    }}
                    placeholder="Add allergies"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  ></input>
                  <span
                    onClick={addAllergy}
                    className="flex items-center bg-emerald-500 text-white px-4 py-3 rounded-xl"
                  >
                    +Add
                  </span>
                </div>
                {dietChart.allergies.map((allergy, index) => {
                  return (
                    <div key={index} className="w-max relative inline-block">
                      <span
                        onClick={() => removeAllergy(index)}
                        className="absolute opacity-60 hover:opacity-100 right-[0px] top-[-8px] cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </span>
                      <span className="bg-orange-500/40 mt-4 px-4 md:text-lg py-1 mr-2 rounded-lg">
                        {allergy}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Diet Plan Section */}
            <section>
              <SubHeading
                heading="Diet Plan"
                icon={<Utensils className="w-5 h-5 text-emerald-600" />}
              />
              {/* Dietary Restrictions */}
              <div className="grid md:grid-cols-2 items-start my-3 bg-gray-400/20 py-5 px-2 md:px-4 rounded-xl">
                <div className="space-x-2 flex">
                  <input
                    className="w-5 h-5"
                    id="isLowSugar"
                    type="checkbox"
                    checked={dietChart.isLowSugarDiet}
                    onChange={() =>
                      setDietChart((prev) => ({
                        ...prev,
                        isLowSugarDiet: !dietChart.isLowSugarDiet,
                      }))
                    }
                  />
                  <label
                    className="text-[16px] cursor-pointer font-semibold text-gray-700"
                    htmlFor="isLowSugar"
                  >
                    Low Sugar Diet
                  </label>
                </div>
                <div className="space-x-2 flex">
                  <input
                    className="w-5 h-5"
                    id="isNoSalt"
                    type="checkbox"
                    checked={dietChart.isNoSaltDiet}
                    onChange={() =>
                      setDietChart((prev) => ({
                        ...prev,
                        isNoSaltDiet: !dietChart.isNoSaltDiet,
                      }))
                    }
                  />
                  <label
                    className="text-[16px] cursor-pointer font-semibold text-gray-700"
                    htmlFor="isNoSalt"
                  >
                    No Salt Diet
                  </label>
                </div>
              </div>

              {/* meals  */}
              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {["🌅 Morning Meal", "🌆 Evening Meal", "🌙 Night Meal"].map(
                  (time, index) => {
                    return (
                      <div key={time} className="bg-gray-400/20 rounded-xl p-4">
                        <h3 className="text-[17px] mb-3 cursor-pointer font-semibold text-gray-700">
                          {time}
                        </h3>
                        <label
                          className="text-[14px] cursor-pointer font-semibold text-gray-700"
                          htmlFor={mealTime[index]}
                        >
                          Meal name
                        </label>
                        <input
                          value={index == 0 ? dietChart.dietPlan.morning.name : index == 1 ? dietChart.dietPlan.evening.name: dietChart.dietPlan.night.name}
                          onChange={(e:any) => {
                            if (index == 0) {
                              setDietChart((prev) => ({
                                ...prev,
                                dietPlan: {
                                  ...prev.dietPlan,
                                  morning: {
                                    ...prev.dietPlan.morning,
                                    name: e.target.value,
                                  },
                                },
                              }));
                            } else if (index == 1) {
                              setDietChart((prev) => ({
                                ...prev,
                                dietPlan: {
                                  ...prev.dietPlan,
                                  evening: {
                                    ...prev.dietPlan.evening,
                                    name: e.target.value,
                                  },
                                },
                              }));
                            } else {
                              setDietChart((prev) => ({
                                ...prev,
                                dietPlan: {
                                  ...prev.dietPlan,
                                  night: {
                                    ...prev.dietPlan.night,
                                    name: e.target.value,
                                  },
                                },
                              }));
                            }
                          }}
                          type="text"
                          id={mealTime[index]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    );
                  }
                )}
              </div> */}
            </section>

            {/* Enhanced Submit Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-200">
              <button type="button" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="flex justify-center items-center bg-emerald-600 text-white px-4 py-3 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>
                    {editingPatient ? "Update Patient" : "Add Patient"}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
