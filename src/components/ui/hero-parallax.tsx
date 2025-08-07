"use client";
import React from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "motion/react";
import { Button } from "@heroui/button";
import Image from "next/image";

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 50, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-750, 100]), springConfig);
  return (
    <div ref={ref} className="h-[220vh] overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]">
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse mb-20 space-x-20 space-x-reverse">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="relative top-0 left-0 z-10 w-full px-4 py-40 mx-auto max-w-7xl">
      <div className="container space-y-8 text-center">
        <h1 className="font-semibold text-center text-7xl">
          <span>Zu Nailbar</span> <br /> Төгс <span className="gradient-text"> гоо сайхан</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-dark-100"> Орчин үеийн хумсны урлаг, амралт, гоо сайхныг хослуулсан үйлчилгээ. Бид таны хумсыг төгс болгож, өөртөө итгэх итгэлийг тань нэмэгдүүлнэ. Zu Nailbar — таны гоо сайхны шинэ түвшин.</p>
        <Button className="bg-primary-pink">Захиалга өгөх</Button>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      // whileHover={{
      //   y: -20,
      // }}
      key={product.title}
      className="h-[20rem] shadow-lg sm:h-[30rem] aspect-[3/4] relative shrink-0 bg-clip-padding backdrop-filter backdrop-blur-lg rounded-2xl overflow-hidden"
    >
      <div
        // href={product.link}
        className="relative flex items-end justify-center overflow-hidden size-full group-hover/product:shadow-2xl"
      >
        <img src={product.thumbnail} height="600" width="600" className="inset-0 object-cover object-left-top size-full" alt={product.title} />
        <div className="absolute flex items-end justify-center text-white pb-7 size-full bg-gradient-to-t from-black/90 to-transparent">
          <h1 className="text-xl font-black uppercase">Гелен будалт</h1>
        </div>
        {/* <h1 className="text-xl font-black uppercase">Гелен будалт</h1> */}
      </div>
      {/* <div className="absolute inset-0 w-full h-full bg-black opacity-0 pointer-events-none group-hover/product:opacity-80"></div>
      <h2 className="absolute text-white opacity-0 bottom-4 left-4 group-hover/product:opacity-100">
        {product.title}
      </h2> */}
    </motion.div>
  );
};
