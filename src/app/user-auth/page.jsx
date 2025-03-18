"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Github, Loader } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false); // Changed to boolean
  const url = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

  useEffect(() =>{
    localStorage.removeItem('hasShownWelcome');
  },[])

  const handleLogin = async (provider) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: url });
      toast.info(`Logging in with ${provider}...`);
    } catch (error) {
      toast.error(`Failed to login with ${provider}, please try again`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 dark:from-gray-100 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <Loader className="w-10 h-10 animate-spin text-white" />
        </div>
      )}

      {/* Left side image (half of login page) */}
      <div className="hidden w-1/2 bg-gray-100 lg:block">
        <Image
          src={"/images/meet-image.jpg"}
          width={1080}
          height={1080}
          alt="login_image"
          className="object-contain h-full w-full"
        />
      </div>

      {/* Right side of login page */}
      <div className="flex flex-col justify-center w-full p-10 lg:w-1/2">
        {/* Text content */}
        <div className="max-w-md mx-auto text-center">
          <h1 className="mb-4 text-4xl font-bold">Welcome to Meetify</h1>
          <p className="mb-8 text-gray-600 dark:text-gray-100">
            Join the Conversation – Login and Start Your Meetings Instantly.
          </p>
        </div>

        {/* Google Login Button */}
        <div className="space-y-4">
          <Button
            className="w-full dark:hover:bg-white dark:hover:text-black"
            variant="outline"
            onClick={() => handleLogin("google")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            Login with Google
          </Button>
        </div>

        {/* GitHub Login and Create Account Section */}
        <div className="flex flex-col space-y-4 mt-6">
          {/* "Or" Divider */}
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-500 dark:border-gray-600"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-gray-700">Or</span>
            </div>
          </div>

          {/* GitHub Login Button */}
          <Button
            className="w-full dark:hover:bg-gray-200 dark:bg-white dark:text-black"
            variant="ghost"
            onClick={() => handleLogin("github")} // Fixed onClick function
          >
            <Github className="w-8 h-8 mr-2" />
            Login with Github
          </Button>

          {/* Create Account Option */}
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link href="#" className="text-blue-500 hover:underline dark:text-blue-400">
              Create now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
