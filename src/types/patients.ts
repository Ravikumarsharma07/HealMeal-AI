export interface DietChart {
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

export interface Patient {
  _id: string;
  name: string;
  age: string;
  gender: "Male" | "Female" | "Other";
  contact: string;
  roomNumber: string;
  bedNumber: string;
  diseases: string[];
  allergies: string[];
  dietPlan: DietChart;
    isNoSaltDiet: boolean;
  isLowSugarDiet: boolean;
}
