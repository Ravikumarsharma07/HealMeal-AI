import AboutUs from "@/components/Home/AboutUS";
import ContactUs from "@/components/Home/ContactUs";
import Features from "@/components/Home/Features";
import Navbar from "@/components/Home/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
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
            <Link href='/new-management'>
            <Button className="ml-4 text-lg border border-white rounded-lg shadow-lg h-[42px] bg-green-600 hover:bg-white hover:text-safetyGreen text-white">Get Started</Button>
            </Link>
          </div>
        </section>
      </div>
      <Features />
      <AboutUs />
      <ContactUs />
    </>
  );
}
