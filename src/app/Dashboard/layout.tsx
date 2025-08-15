"use client"
import Navbar from '@/components/Dashboard/Navbar'
import axios from 'axios'
import { Loader, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, {  useEffect, useState } from 'react'

const DashboardLayout = ({children,}:Readonly<{children: React.ReactNode}>) => {
  const [isLoading,setIsLoading] = useState<boolean>(true)
  const [adminData, setAdminData] = useState<any>({
    email: "",
    role: "",
    hospitalID:""
  })
  const router = useRouter()
  const authenticateAdmin = async () =>{ 
    setIsLoading(true)
    try {
      const response = await axios.post('/api/authenticateAdmin', {
        withCredentials: true 
      });
      const redirectURL = response.data.redirectURL
      const adminRole = redirectURL.split("/")[2]
      setAdminData({
        email: response.data.email,
        role: adminRole,
        hospitalID: response.data.hospitalID
      })
      if(adminRole){
      setIsLoading(false)
      }
      router.push(redirectURL)
    } catch (error) {
      console.log(error)
      router.push("/login")
    }
  }
  useEffect(()=>{
    authenticateAdmin()
  },[])
  if(isLoading){
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Loading...</h2>
          <p className="text-gray-600">
            Please wait while we fetch the data...
          </p>
        </div>
      </div>
    )
} 
  return (
    <>
    <Navbar role={adminData.role} email={adminData.email} hospitalID={adminData.hospitalID} />
    {children}    
    </>
  )
}

export default DashboardLayout
