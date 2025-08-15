'use client';

import { motion, useScroll, useTransform } from "framer-motion";

export default function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { scrollY } = useScroll();
  const yTransform = useTransform(scrollY, [0, 1000], [0, -100]); // page scroll effect

  return (
    <motion.div
      style={{ y: yTransform }}
      className="w-full min-h-screen overflow-x-hidden"
    >
      {children}
    </motion.div>
  );
}
