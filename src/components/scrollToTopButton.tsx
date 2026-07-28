"use client";

import { Button } from "@heroui/button";
import { ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!showButton) return null;

  return (
    <Button
      onPress={scrollToTop}
      aria-label="Scroll to top"
      className="fixed p-0 text-white transition shadow-2xl flex-center  rounded-xl size-8 sm:size-12  aspect-square bottom-10 right-10 bg-rose-500/90 hover:bg-pink-600 "
      style={{ zIndex: 50 }}
    >
      <ChevronUp className="size-5" />
    </Button>
  );
}
