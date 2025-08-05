import Image from "next/image";
import React from "react";

export default function footer() {
  return (
    <footer className="border-gray-200 border-y">
      <div className="container grid grid-cols-3">
        {/* <Image src={"/images/logo.png"} /> */}
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, earum?</p>
      </div>
    </footer>
  );
}
