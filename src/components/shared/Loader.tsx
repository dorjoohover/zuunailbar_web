import { LoaderCircle } from "lucide-react";
import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      {/* <LoaderCircle className="animate-spin" /> */}
{/* <div className="loader">
    <span className="bar"></span>
    <span className="bar"></span>
    <span className="bar"></span>
</div> */}

<div className="dot-spinner">
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
</div>
    </div>
  );
}
