"use client";

import React, { useEffect, useRef } from "react";

import { gsap } from "gsap";

export function TitleAnimation({
  text = "Hệ thống quản lý phòng xét nghiệm toàn diện giúp bạn theo dõi bệnh nhân, quản lý thiết bị và xử lý kết quả xét nghiệm máu một cách dễ dàng.",
  speed = 120, // pixels per second
  className = "text-xl text-foreground/70",
}: {
  text?: string;
  speed?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    container.style.overflow = "hidden";
    content.style.whiteSpace = "nowrap";
    content.style.display = "inline-block";

    const contentWidth = content.offsetWidth;
    const containerWidth = container.offsetWidth;
    const distance = contentWidth + containerWidth;
    const duration = distance / speed;

    const ctx = gsap.context(() => {
      // start just outside right edge
      gsap.set(content, { x: containerWidth });
      // animate to left outside edge, repeat forever
      gsap.to(content, {
        x: -contentWidth,
        duration,
        ease: "none",
        repeat: -1,
        // after each repeat GSAP will jump back to the initial set value
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [speed, text]);

  return (
    <div ref={containerRef} className={`w-full`} aria-hidden={false}>
      <div ref={contentRef} className={className}>
        {text}
      </div>
    </div>
  );
}
