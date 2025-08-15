"use client"
import Link from 'next/link'
import React from 'react'


const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <header className="bg-white backdrop-blur-sm shadow-lg fixed top-0 left-0 w-full z-50">
      <nav className="container mx-auto px-2 md:px-6 py-4 h-20 flex justify-between items-center">
        {/* <h1 className="text-xl md:text-2xl font-bold text-gray-700">HealMeal AI</h1> */}
        <img src="/logo.png" onClick={() => window.location.reload()} alt="logo" width={100} height={100} className='w-[200px] cursor-pointer' />
        
        {/* for small screens  */}
        <div className="md:hidden mr-2">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {isOpen && (
          <ul className="absolute top-0 right-0 w-[300px] p-4 text-xl h-screen bg-white flex flex-col space-y-4 mt-4 md:hidden">
            <button onClick={() => setIsOpen(false)} className="absolute top-2 right-4 text-gray-700 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <li>
            <Link href="/new-management" className="flex w-max items-center gap-1 md:text-lg text-gray-700 hover:text-gray-900">
            <span className='font-semibold scale-[1.3]'>+</span>
            <p>Create Management</p>
            </Link>
          </li>
          <li>
            <Link href="/login" className="text-gray-700 w-max md:text-lg hover:text-gray-900">
              Login
            </Link>
          </li>
          <li>
            <Link href="/Dashboard/manager" className="text-gray-700 w-max md:text-lg hover:text-gray-900">
              Admin's Dashboard
            </Link>
          </li>
          </ul>
        )}
        
        {/* for big screens */}
        <ul className="flex space-x-6 md:space-x-8 max-md:hidden">
          <li>
            <Link href="/new-management" className="flex items-center gap-1 md:text-lg text-gray-700 hover:text-gray-900">
            <span className='font-semibold scale-[1.3]'>+</span>
            <p>Create Management</p>
            </Link>
          </li>
          <li>
            <Link href="/login" className="text-gray-700 md:text-lg hover:text-gray-900">
              Login
            </Link>
          </li>
          <li>
            <Link href="/Dashboard/manager" className="text-gray-700 md:text-lg hover:text-gray-900">
              Admin's Dashboard
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
