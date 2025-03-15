"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const VideoMeeting = () => {
  const { roomId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const containerRef = useRef(null);
  const [zp, setZp] = useState(null);
  const [isInMeeting, setIsInMeeting] = useState(false);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.name &&
      containerRef.current
    ) {
      JoinMeeting(containerRef.current);
    } else {
      toast.error("Session is not authenticated. Please log in.");
    }
  }, [session, status]);

  useEffect(() => {
    return () => {
      if (zp) zp.destroy();
    };
  }, [zp]);

  const JoinMeeting = async (element) => {
    try {
      const appID = Number(process.env.NEXT_PUBLIC_ZEGOAPP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;

      if (!appID || !serverSecret) {
        toast.error(
          "Missing Zego credentials. Please check your environment variables."
        );
        throw new Error("Missing Zego credentials.");
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        session?.user?.id || Date.now().toString(),
        session?.user?.name || "Guest"
      );

      const zegoInstance = ZegoUIKitPrebuilt.create(kitToken);
      setZp(zegoInstance);

      zegoInstance.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "Personal link",
            url: `${window.location.origin}/video-meeting/${roomId}`,
          },
        ],
        scenario: { mode: ZegoUIKitPrebuilt.GroupCall },
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTurnOffRemoteCameraButton: true,
        showTurnOffRemoteMicrophoneButton: true,
        showRemoveUserButton: true,
        onJoinRoom: () => {
          toast.success("Meeting joined successfully");
          setIsInMeeting(true);
        },
        onLeaveRoom: endMeeting,
      });
    } catch (error) {
      console.error("Error joining meeting:", error);
      toast.error("Failed to join the meeting.");
    }
  };

  const endMeeting = () => {
    if (zp) {
      zp.destroy();
      setZp(null);
      setIsInMeeting(false);
      toast.success("Meeting ended successfully");
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div
        className={`flex-grow flex flex-col md:flex-row relative ${
          isInMeeting ? "h-screen" : ""
        }`}
      >
        <div
          ref={containerRef}
          className="video-container flex-grow"
          style={{ height: isInMeeting ? "100%" : "calc(100vh - 4rem)" }}
        ></div>
      </div>

      {!isInMeeting && (
        <div className="flex flex-col p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            Meeting Info
          </h2>
          <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">
            Participant - {session?.user?.name}
          </p>

          <Button
            onClick={endMeeting}
            className="w-full bg-red-500 hover:bg-red-600 text-white mb-4"
          >
            End Meeting
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-200 dark:bg-gray-800">
            {[
              {
                src: "/images/videoQuality.jpeg",
                title: "HD Video Quality",
                desc: "Experience crystal clear video calls",
              },
              {
                src: "/images/videoSharing.png",
                title: "Screen Sharing",
                desc: "Easily share your screen with participants",
              },
              {
                src: "/images/secureMeeting.png",
                title: "Secure Meetings",
                desc: "Your meetings are protected and private",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <Image
                  src={feature.src}
                  alt={`feature_${index}`}
                  width={150}
                  height={150}
                  className="mx-auto mb-2 rounded-full"
                />
                <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoMeeting;
