"use client"

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

const page = () => {
  const params = useParams();
  const roomId = params.roomId;
  const {data: session, status} = useSession();
  const router = useRouter();
  return (
    <div>page</div>
  )
}

export default page;