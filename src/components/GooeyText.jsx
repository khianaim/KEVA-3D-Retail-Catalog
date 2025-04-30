"use client";

import * as React from "react";

// Utility function for classNames, replace with your actual implementation if needed
function cn(...args) {
  return args.filter(Boolean).join(" ");
}

export const GooeyText = ({
  texts,
  morphTime = 1,
  cooldownTime = 0.25,
  className,
  ...props
}) => {
  const canvasRef = React.useRef(null);
  const [textIndex, setTextIndex] = React.useState(0);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    let morph = 0;
    let cooldown = cooldownTime;
    let lastTime = new Date().getTime() / 1000;

    const setTextStyle = () => {
      ctx.font = "bold 48px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#471515";
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;

      if (fraction > 1) {
        fraction = 1;
        cooldown = cooldownTime;
      }

      fraction = Math.sin((fraction * Math.PI) / 2);
      drawText(fraction);
    };

    const drawText = (fraction) => {
      const current = texts[textIndex % texts.length];
      const next = texts[(textIndex + 1) % texts.length];

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.globalAlpha = 1 - fraction;
      setTextStyle();
      ctx.fillText(current, width / 2, height / 2);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = fraction;
      setTextStyle();
      ctx.fillText(next, width / 2, height / 2);
      ctx.restore();
    };

    const animate = () => {
      requestAnimationFrame(animate);
      const now = new Date().getTime() / 1000;
      const dt = now - lastTime;
      lastTime = now;

      if (cooldown > 0) {
        cooldown -= dt;
        if (cooldown <= 0) {
          morph = 0;
          setTextIndex((i) => (i + 1) % texts.length);
        }
        drawText(0);
      } else {
        morph += dt;
        doMorph();
      }
    };

    animate();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [texts, textIndex, morphTime, cooldownTime]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full min-h-[64px] sm:min-h-[80px]", className)}
      {...props}
    />
  );
};
