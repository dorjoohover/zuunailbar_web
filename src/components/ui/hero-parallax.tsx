"use client";
import React, { useMemo, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";
import { Button } from "@heroui/button";
import { Home } from "@/models/home.model";

export const HeroParallax = ({
  data,
  handleDone,
}: {
  data: Home[];
  handleDone: () => void;
}) => {
  const firstRow = data.slice(0, 5);
  const secondRow = data.slice(5, 10);
  const thirdRow = data.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 50, bounce: 100 };

  const [breakpoint, setBreakpoint] = React.useState<"sm" | "md" | "lg" | "xl">(
    "lg"
  );

  React.useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;
      if (width < 640)
        setBreakpoint("sm"); // < sm
      else if (width < 1024)
        setBreakpoint("md"); // sm to < lg
      else if (width < 1280)
        setBreakpoint("lg"); // lg to < xl
      else setBreakpoint("xl"); // >= xl
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const translateYStartMap: Record<typeof breakpoint, number> = {
    sm: -850,
    md: -900,
    lg: -1100,
    xl: -1100,
  };

  const translateYStart = translateYStartMap[breakpoint];

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  // const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-900, 100]), springConfig);
  // Use different start values depending on screen size
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [translateYStart, 100]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] py-30"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="bg-[url(/bg/blue-gradient.png)] bg-cover bg-center"
      >
        <motion.div className="flex flex-row-reverse mb-10 space-x-reverse space-x-15 sm:mb-14">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              handleDone={handleDone}
              translate={translateX}
              key={product.name}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-10 space-x-15 sm:mb-14 ">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              handleDone={handleDone}
              translate={translateXReverse}
              key={product.name}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-15">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              handleDone={handleDone}
              translate={translateX}
              key={product.name}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="relative top-0 left-0 z-10 w-full px-4 py-20 web-container">
      <div className="container pt-20 space-y-8 text-center">
        <h1 className="text-5xl font-semibold text-center sm:text-7xl">
          <span>Zu Nailbar</span>
          <br /> Төгс
          <span className="gradient-text"> гоо сайхан</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-dark-200">
          {" "}
          Орчин үеийн хумсны урлаг, амралт, гоо сайхныг хослуулсан үйлчилгээ.
          Бид таны хумсыг төгс болгож, өөртөө итгэх итгэлийг тань нэмэгдүүлнэ.
          Zu Nailbar — таны гоо сайхны шинэ түвшин.
        </p>
        <Button size="lg" className="text-white bg-dark">
          Захиалга өгөх
        </Button>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  handleDone,
  translate,
}: {
  handleDone: () => void;
  product: Home;
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        scale: 1.02,
      }}
      key={product.name}
      className="h-[20rem] shadow-lg sm:h-[22rem] lg:h-[30rem] aspect-[3/4] relative shrink-0 bg-clip-padding backdrop-filter backdrop-blur-lg rounded-2xl overflow-hidden group"
    >
      <div
        // href={product.link}
        className="relative flex items-end justify-center overflow-hidden size-full group-hover/product:shadow-2xl"
      >
        <img
          src={`/api/file/${product.image}`}
          height="600"
          width="600"
          className="inset-0 object-cover object-left-top size-full"
          onLoad={handleDone}
          onError={handleDone}
          alt={product.name}
        />
        <div className="absolute flex flex-col items-center justify-end text-white pb-7 size-full bg-gradient-to-t from-black/90 to-transparent">
          <h1 className="text-xl font-bold uppercase">{product.name}</h1>
          <h3>{product.artist_name}</h3>
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
