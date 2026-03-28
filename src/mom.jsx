import React, { useEffect } from "react";
import { Video } from "lucide-react";

function Mom() {
  useEffect(() => {
    window.location.href = "https://digi-assaign-harsh.vercel.app//";
  }, []);

  return (
    <div className="ui-page-main flex min-h-screen flex-col items-center justify-center px-6">
      <div className="ui-card max-w-md p-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
          <Video className="h-7 w-7" />
        </span>
        <h1 className="mt-6 text-xl font-bold text-slate-900">Opening M.O.M. app</h1>
        <p className="mt-2 text-sm text-slate-600">
          You are being redirected to the M.O.M. app. If nothing happens, check your browser popup settings.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
        </div>
      </div>
    </div>
  );
}

export default Mom;
