import React, { useEffect } from "react";

function VideoCallRedirect() {
  useEffect(() => {
    window.location.href = "https://vartalap-wine.vercel.app/";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
      Redirecting to Video Call...
    </div>
  );
}

export default VideoCallRedirect;