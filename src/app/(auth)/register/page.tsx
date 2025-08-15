"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useAuthenticate from "@/hooks/useAuthenticate";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  hospitalID: z.string(),
  role: z.string(),
  name: z.string(),
});

const Page = () => {

  useAuthenticate();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
  });
  const router = useRouter();
  const {toast} = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const onSubmit = async (value: {}) => {
    setIsLoading(true)
    try {
      const response = await axios.post("/api/register", value);
      console.log(response);
      toast({
        title:response.data.message 
      })
      if (response.data.success) {
        toast({
          title:"Admin successfully registered",
          variant:"default"
        })
        router.replace("/Dashboard/manager");
      }
    } catch (error:any) {
      toast({
        title:error.response.data.message || "Unexpected error occured",
        variant:"destructive"
      })
      console.log("Error while resistring user", error);
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <section className="bg-green-400 flex-center min-h-screen">
      <div className="absolute top-5 left-5 text-gray-700 md:text-lg">
        <Link href="/" className="flex-center gap-1 hover:underline">
          <ArrowLeft className="h-5 w-5" />
          <span className="">home</span>
        </Link>
      </div>  
      <Form {...form}> 
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 bg-cyan-50 p-8 px-5 shadow-xl w-[420px]"
        >
          <h2 className="text-center text-green-500 font-semibold text-2xl pb-2">
            Admin Registeration
          </h2>
          <FormField
            control={form.control}
            name="hospitalID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hospital ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter hospital ID"
                    {...field}
                    className=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                    className=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} className="" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                   <select
                        {...field}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      >
                        <option value="manager">Manager</option>
                        <option value="pantry">Pantry</option>
                        <option value="delivery">Delivery</option>
                      </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-[#fff9f9] text-xl"
          >
            {isLoading ? <Loader className="animate-spin" /> : "Register"}
          </Button>
          <p className="text-center text-green-700">
            Already registered ?{" "}
            <Link className="text-green-800 font-semibold" href="/login">
              Login
            </Link>{" "}
          </p>
        </form>
      </Form>
    </section>
  );
};

export default Page;
