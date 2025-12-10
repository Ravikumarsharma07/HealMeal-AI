"use client";
import AboutUs from "@/components/Home/AboutUS";
import ContactUs from "@/components/Home/ContactUs";
import Features from "@/components/Home/Features";
import Navbar from "@/components/Home/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ArrowUpRight, LoaderIcon, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Dialog box for selecting Dashboard (manager or pantry staff)
const DialogForLogin = ({ onClose }: { onClose: (value: boolean) => void }) => {
  const {toast} = useToast();
  const [isLoading, setIsLoading] = useState({
    manager: false,
    pantry: false
  });
  const router = useRouter()
  const handleClickOutside = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose(false);    
  }

  // function for loggging as manager
  const handleManagerLogin =async () => {
    setIsLoading((prev)=>({...prev, manager: true}));
    try {
      const response = await axios.post("/api/login", {email: "manager@gmail.com", password: "12345678"});
      if(response.data.success){
        toast({
          title:"Successfully logged in as manager",
          variant:"default"
        })
        router.replace("/Dashboard/manager");
      }
      
    } catch (error:any) {
      toast({
        title:error.response.data.message || "Unexpected error occured",
        variant:"destructive"
      })
    }finally{
      setIsLoading((prev)=>({...prev, manager: true}));
    }
  }
  // function for loggging as pantry
  const handlePantryLogin = async () => {
    setIsLoading((prev) => ({ ...prev, pantry: true }));
    try {
      const response = await axios.post("/api/login", {email: "pantry@gmail.com", password: "12345678"});
      if(response.data.success){
        toast({
          title:"Successfully logged in as pantry staff",
          variant:"default"
        })
        router.replace("/Dashboard/pantry");
      }
    } catch (error:any) {
      toast({
        title:error.response.data.message || "Unexpected error occured",
        variant:"destructive"
      })
    }finally{
      setIsLoading((prev) => ({ ...prev, pantry: false }));
    }
  }
  return (
    <div className="fixed flex-center inset-0 z-50">
      <div onClick={(e)=>handleClickOutside(e)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white flex flex-col gap-2 p-2 sm:p-4 z-50 inset-0 h-max w-[300px] rounded-xl">
        <button onClick={() => onClose(false)}>
          <X className="absolute top-2 right-2 text-black" strokeWidth={2} />
        </button>
        <p className="text-2xl mb-6 font-bold text-safetyGreen">Login as</p>
        <Button onClick={handleManagerLogin} className="border border-safetyGreen-dark bg-safetyGreen text-white hover:bg-green-600 text-lg">
          <User className="scale-[1.4]" strokeWidth={2} />
          Manager <ArrowUpRight className="scale-[1.4]" strokeWidth={2} />
          {isLoading.manager && <LoaderIcon className="animate-spin" strokeWidth={2} />}
        </Button>
        <Button onClick={handlePantryLogin} className="border border-safetyGreen-dark bg-safetyGreen text-white hover:bg-green-600 text-lg">
          <User className="scale-[1.4]" strokeWidth={2} />
          Pantry <ArrowUpRight className="scale-[1.4]" strokeWidth={2} />
          {isLoading.pantry && <LoaderIcon className="animate-spin" strokeWidth={2} />}
        </Button>
      </div>
    </div>
  );
};

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <section className="h-max bg-gradient-to-br from-green-500 to-green-700 flex flex-col py-24 justify-start items-center text-center text-white">
          <h1 className="text-[2.5rem] md:text-[3rem] lg:text-[3.7rem] leading-[60px] md:leading-[80px] px-2 md:px-10 font-bold animate-fadeIn">
            Welcome to the Future of Hospital Food Management
          </h1>
          <p className="mt-4 text-xl tracking-wide font-serif animate-fadeIn px-4 md:px-16">
            Optimizing patient care with streamlined food logistics.
          </p>
          <div className="mt-8">
            <Link href="/new-management">
              <Button className="ml-4 text-lg border border-white rounded-lg shadow-lg h-[42px] bg-green-600 hover:bg-white hover:text-safetyGreen text-white">
                Get Started
              </Button>
            </Link>
            <Button
              onClick={() => setIsDialogOpen(!isDialogOpen)}
              className="ml-4 text-lg border border-[#b7b7b7] font-semibold rounded-lg shadow-lg h-[42px] bg-white hover:bg-green-600 hover:text-white text-safetyGreen"
            >
              Try It Out
            </Button>
            {isDialogOpen && <DialogForLogin onClose={setIsDialogOpen} />}
          </div>
        </section>
      </div>
      <Features />
      <AboutUs />
      <ContactUs />
    </>
  );
}
