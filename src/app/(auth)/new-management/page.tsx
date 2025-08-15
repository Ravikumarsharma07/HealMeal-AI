'use client'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import {z} from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {ArrowLeft, Loader} from "lucide-react"
import { useToast } from '@/hooks/use-toast'

const signUpSchema = z.object({
    hospitalName:z.string().min(4, "hospital name must be at least of 4 characters").max(30,"hospital name must be not more 30 characters"),
    email:z.string().email("enter a valid email address"),
    password:z.string(),
    name:z.string(),
    hospitalID:z.string().min(6,"ID must contain 6 characters").max(10,"ID must not be more than 10 characters"),
})

const Page = () => {

  const form = useForm({
    resolver:zodResolver(signUpSchema)
  })
  const router = useRouter()
  const {toast} = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isErrorMessage, setIsErrorMessage] = useState<string>("")

  const onSubmit = async (value:{}) =>{
    try {
      setIsLoading(true)
        const response = await axios.post("/api/new-management", value)
        console.log(response);
        if(response.data.success){
          toast({
          title:response.data.message,
        })
        router.replace("/Dashboard/manager")
        }else{
          toast({
            title:response.data.message,
            variant:"default"
          })
        }
        setIsErrorMessage("")
    } catch (error:any) {
        console.log("Error while registring user", error)
        setIsErrorMessage(error.response.data.message)
        toast({
            title:error.response.data.message || "Unexpected Error Occured",
            variant:"destructive"
          })
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <section className='bg-[#e4e4e4] flex-center lg:flex-between  min-h-screen h-max'>
      <div className="absolute top-5 left-5 text-gray-700 md:text-lg">
              <Link href="/" className="flex-center gap-1 hover:underline">
                <ArrowLeft className="h-5 w-5" />
                <span className="">home</span>
              </Link>
            </div> 
        <div className='max-lg:hidden visible'></div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-5 rounded-sm w-[97%] sm:w-[90%] md:w-[80%] lg:w-[55%]">
        <h2 className='text-center font-serif text-green-700 text-3xl'>New Management System</h2>
        <p className=' text-red-700 text-lg text-end'>{isErrorMessage}</p>
      <FormField
          control={form.control}
          name="hospitalID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Create Hospital ID</FormLabel>
              <FormControl>
                <Input placeholder="Hospital ID" {...field} className=''/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
          <FormField
            control={form.control}
            name="hospitalName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Hospital Name</FormLabel>
                <FormControl>
                  <Input placeholder="Hospital name" {...field} className='outline-none focus:border-none'/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Email</FormLabel>
              <FormControl>
                <Input type='text' placeholder="Email" {...field} className=''/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter your name</FormLabel>
              <FormControl>
                <Input type='text' placeholder="Name" {...field} className=''/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Create a password for your account</FormLabel>
              <FormControl>
                <Input type='password' placeholder="Password" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button type="submit" className='w-full bg-green-700 hover:bg-green-800 text-[#fff9f9] text-xl'>{isLoading ? <Loader className='animate-spin' /> : "Create system"}</Button>
        <p className="text-center text-green-700">Already registered ? <Link className="text-green-800 font-semibold"  href="/login">Login</Link> </p>
      </form>
    </Form>
    
    </section>
  )
}

export default Page
