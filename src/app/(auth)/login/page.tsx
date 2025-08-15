"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader } from "lucide-react";
import useAuthenticate from "@/hooks/useAuthenticate";
import { toast } from "@/hooks/use-toast";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const Page = () => { 

  useAuthenticate();

  const form = useForm({
    resolver: zodResolver(signInSchema),
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (value: {}) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/login", value, {
        withCredentials: true,
      });
      console.log("response");
      console.log(response);
      if(response.data.success){
        router.replace("/Dashboard/manager");
      }
    } catch (error:any) {
      console.log("Error while registering user", error);
      toast({
        title: error.response.data.message|| "Unexpected Error Occured",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
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
          className="relative space-y-5 py-10 bg-cyan-50 p-6 shadow-xl w-[350px]"
        >
          <p className="text-center text-2xl md:text-3xl font-semibold font-mono text-green-700">
            Admin's Login
          </p>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="py-4">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="pb-4">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-[#fff9f9] text-xl"
          >
            {isLoading ? <Loader className="animate-spin" /> : "Login"}
          </Button>
          <p className="text-center text-green-700">
            Don't have account ?{" "}
            <Link className="text-green-800 font-semibold" href="/register">
              Register
            </Link>{" "}
          </p>
        </form>
      </Form>
    </section>
  );
};

export default Page;
