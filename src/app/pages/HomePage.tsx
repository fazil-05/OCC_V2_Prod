"use client";

import React from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { VideoReel } from "../components/VideoReel";
import { AboutOCC } from "../components/AboutOCC";
import { Approach } from "../components/Approach";
import { FeaturedWork } from "../components/FeaturedWork";
import { Experiences } from "../components/Experiences";
import { ShowcaseCards } from "../components/ShowcaseCards";
import { LayoutEditorProvider, MovableSection } from "../components/LayoutEditor";

export default function HomePage() {
  return (
    <LayoutEditorProvider>
      <div className="font-general-sans w-full min-h-screen max-w-[100vw] overflow-x-hidden bg-[#F6F7FA] text-slate-900 selection:bg-slate-900 selection:text-white">
        <MovableSection id="header">
          <Header />
        </MovableSection>
        <main>
          <MovableSection id="hero">
            <Hero />
          </MovableSection>
          <MovableSection id="video-reel">
            <VideoReel />
          </MovableSection>
          <MovableSection id="about-occ">
            <AboutOCC />
          </MovableSection>
          <MovableSection id="approach">
            <Approach />
          </MovableSection>
          <MovableSection id="featured-work">
            <FeaturedWork />
          </MovableSection>
          <MovableSection id="experiences">
            <Experiences />
          </MovableSection>
          <MovableSection id="showcase-cards">
            <ShowcaseCards />
          </MovableSection>
        </main>
      </div>
    </LayoutEditorProvider>
  );
}
