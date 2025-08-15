"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Users,
  AlertTriangle,
  Search,
  Loader,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import PatientCard from "@/components/Dashboard/PatientCard";
import { Patient } from "@/types/patients";
import { useToast } from "@/hooks/use-toast";
import PatientForm from "@/components/Dashboard/Manager/PatientForm";

const page = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { toast } = useToast();

  const fetchPatients = async (showRefresh = false) => {
    try {
      setError(null);
      showRefresh ? setIsRefreshing(true) : setIsLoading(true);
      const { data } = await axios.get("/api/patients", {
        withCredentials: true,
      });
      if (data.success) setPatients(data.patients);
      else setError(data.message || "Failed to fetch patients");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load patients.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDeletePatient = async (id: string) => {
    setPatients(patients.filter((p) => p._id !== id));
    try {
      await axios.delete(`/api/patients/${id}`, {
        withCredentials: true,
      });
      fetchPatients(true);
      toast({
        title: "Patient deleted successfully",
        variant: "default",
      });
    } catch (err: any) {
      console.log(err);
      toast({
        title: err?.response?.data?.message || "Failed to delete patient.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateDietPlan = async (patient: Patient) => {
    setIsRefreshing(true);
    try {
      const response = await axios.put(
        `/api/patients/update-dietplan/${patient._id}`,
        patient,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast({
          title: "Diet plan updated successfully",
          variant: "default",
        });
        filteredPatients.map((p) => {
          if (p._id === patient._id) {
            p.dietPlan = response.data.dietPlan || patient.dietPlan;
          }
        });
      } else {
        toast({
          title: response.data.message || "Failed to update diet plan",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to generate new diet plan",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredPatients = useMemo(
    () =>
      patients.filter((p) => {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(q) ||
          p.roomNumber.includes(q) ||
          p.diseases.some((d) => d.toLowerCase().includes(q));

        const matchesGender = !filterGender || p.gender === filterGender;
        return matchesSearch && matchesGender;
      }),
    [patients, searchTerm, filterGender]
  );

  const stats = useMemo(
    () => ({
      total: patients.length,
      male: patients.filter((p) => p.gender === "Male").length,
      female: patients.filter((p) => p.gender === "Female").length,
    }),
    [patients]
  );

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
            onClick={() => fetchPatients()}
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
    blue: {
      text: "text-blue-600",
      bg: "bg-blue-100",
    },
    pink: {
      text: "text-pink-600",
      bg: "bg-pink-100",
    },
  };

  return (
    <div className="min-h-screen px-4 py-8 ">
      <div className="max-w-7xl mx-auto">
        {/* Stats */}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            ["Total", stats.total, "emerald"],
            ["Male", stats.male, "blue"],
            ["Female", stats.female, "pink"],
          ].map(([label, value, color], index) => (
            <div
              key={label}
              className={`${
                index === 0 ? "max-md:col-span-2" : ""
              } hover:scale-105 transition-all  bg-white/80 rounded-xl p-4 shadow-lg flex-between`}
            >
              <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className={`text-3xl font-bold ${colorClasses[color].text}`}>
                  {value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${colorClasses[color].bg} rounded-xl flex items-center justify-center`}
              >
                <Users className={`w-6 h-6 ${colorClasses[color].text}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, room, or condition"
              className="pl-10 pr-4 py-3 w-full border rounded-xl shadow"
            />
          </div>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="py-3 px-4 border rounded-xl shadow"
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 text-white px-6 py-3 rounded-xl shadow hover:bg-emerald-600"
          >
            <Plus className="inline-block mr-2" /> Add Patient
          </button>
        </div>

        {/* Patients */}
        {filteredPatients.length === 0 ? (
          <p className="text-center text-gray-500">No patients found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filteredPatients.map((p) => (
              <PatientCard
                key={p._id}
                patient={p}
                setIsModalOpen={setIsModalOpen}
                onEdit={setEditingPatient}
                onDelete={handleDeletePatient}
                handleUpdateDietPlan={handleUpdateDietPlan}
                isRefreshing={isRefreshing}
              />
            ))}
          </div>
        )}
      </div>

      <PatientForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPatient(null);
        }}
        editingPatient={editingPatient}
        fetchPatients={fetchPatients}
      />
    </div>
  );
};

export default page;
