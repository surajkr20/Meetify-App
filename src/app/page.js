"use client"
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function Home() {

  const [isLoading, setIsLoading] = useState(true);
  const {data: session, status} = useSession();
  console.log(session)
  console.log(status)

  return (
    <div>

    </div>
  )
}
