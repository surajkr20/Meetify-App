"use client"
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Header from "./components/Header";
import MeetingActions from "./components/MeetingActions";
import MeetingFeatures from "./components/MeetingFeatures";

export default function Home() {

  const [isLoading, setIsLoading] = useState(true);
  const {data: session, status} = useSession();
  
  useEffect(()=>{
    if(status === 'authenticated'){
      setIsLoading(false);
      const hasShownWelcome = localStorage.getItem('hasShownWelcome');
      if(!hasShownWelcome){
        toast.success(`Welcome back ${session?.user?.name}!`)
        localStorage.setItem('hasShownWelcome', 'true')
      }
    }else if(status === 'unauthenticated'){
      setIsLoading(false)
    }
  }, [status, session])

  if(isLoading){
    return <Loader/>
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header/>
      <main className="flex-grow p-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Video calls and meetings for everyone
              </h1>
              <p className="text-3xl text-gray-600 dark:text-gray-300 mb-12">
                connect, collaborate and celebrate from anywhere with Meetify
              </p>
                <MeetingActions/>
            </div>

            <div className="md:w-1/2">
              <MeetingFeatures/>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
