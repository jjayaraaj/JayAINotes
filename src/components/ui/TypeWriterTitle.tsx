"use client";

import React from "react";
import Typewriter from "typewriter-effect";

const TypeWriterTitle = () => {
  return (
    <Typewriter
      options={{ loop: true }}
      onInit={(typewriter) => {
        typewriter
          .typeString("🚀 Supercharged Productivity.")
          .pauseFor(1000)
          .deleteAll()
          .typeString(" JayAI-Powered Insigts. ")
          .start();
      }}
    />
  );
};

export default TypeWriterTitle;
