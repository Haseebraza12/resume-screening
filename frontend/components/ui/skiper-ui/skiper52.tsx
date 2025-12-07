"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { cn } from "@/lib/utils";

const Skiper52 = () => {
  const images = [
    {
      src: "/images/x.com/13.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/32.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/20.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/21.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/19.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/1.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/2.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/3.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/4.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f5f4f3]">
      <HoverExpand_001 className="" images={images} />{" "}
    </div>
  );
};

export { Skiper52 };

const HoverExpand_001 = ({
  images,
  className,
}: {
  images: {
    src: string;
    alt: string;
    code: string;
    testimonial?: {
      quote: string;
      author: string;
      role: string;
      company: string;
    }
  }[];
  className?: string;
}) => {
  const [activeImage, setActiveImage] = useState<number | null>(1);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("relative w-full max-w-screen-xl px-5", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="flex w-full items-center justify-center gap-1">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className={cn(
                "relative cursor-pointer overflow-hidden rounded-[2.5rem] transition-colors duration-300",
                activeImage === index ? "bg-accent-dark" : "bg-transparent"
              )}
              initial={{ width: "2.5rem", height: "20rem" }}
              animate={{
                width: activeImage === index ? "32rem" : "6rem",
                height: activeImage === index ? "25rem" : "25rem",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setActiveImage(index)}
              onHoverStart={() => setActiveImage(index)}
            >
              {/* Expanded State: Testimonial Text Card */}
              <AnimatePresence>
                {activeImage === index && image.testimonial && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="absolute inset-0 flex flex-col justify-between p-8 z-20"
                  >
                    <div className="flex-1">
                      <svg className="w-8 h-8 text-white/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21L14.017 18C14.017 16.0547 15.3738 15.1226 15.9141 14.5735C16.318 14.1641 16.7992 13.6773 16.7992 12.0791C16.7992 10.4809 16.318 9.99414 15.9141 9.58475C15.3738 9.03564 14.017 8.10352 14.017 6.1582V3.1582H19.017V6.1582C19.017 8.10352 17.6602 9.03564 17.1199 9.58475C16.716 9.99414 16.2348 10.4809 16.2348 12.0791C16.2348 13.6773 16.716 14.1641 17.1199 14.5735C17.6602 15.1226 19.017 16.0547 19.017 18V21H14.017ZM5.0166 21L5.0166 18C5.0166 16.0547 6.37341 15.1226 6.91373 14.5735C7.31763 14.1641 7.79883 13.6773 7.79883 12.0791C7.79883 10.4809 7.31763 9.99414 6.91373 9.58475C6.37341 9.03564 5.0166 8.10352 5.0166 6.1582V3.1582H10.0166V6.1582C10.0166 8.10352 8.65979 9.03564 8.11947 9.58475C7.71558 9.99414 7.23438 10.4809 7.23438 12.0791C7.23438 13.6773 7.71558 14.1641 8.11947 14.5735C8.65979 15.1226 10.0166 16.0547 10.0166 18V21H5.0166Z" />
                      </svg>
                      <p className="text-white text-xl font-medium leading-relaxed">
                        "{image.testimonial.quote}"
                      </p>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">
                        {image.testimonial.author}
                      </p>
                      <p className="text-white/70 text-sm">
                        {image.testimonial.role}, {image.testimonial.company}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Unexpanded State: Gradient Overlay */}
              <AnimatePresence>
                {activeImage !== index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-10 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* Collapsed State: Avatar Image */}
              <motion.img
                src={image.src}
                className="absolute inset-0 size-full object-cover"
                alt={image.alt}
                animate={{ opacity: activeImage === index ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              />

            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export { HoverExpand_001 };

/**
 * Skiper 52 HoverExpand_001 — React + Framer Motion
 * Illustrations by AarzooAly - https://x.com/AarzooAly
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.in
 * Twitter: https://x.com/Gur__vi
 */
