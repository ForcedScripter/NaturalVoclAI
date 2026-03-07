import SmoothScroll from "@/components/SmoothScroll";
import HeroSection from "@/components/HeroSection";
import CanvasScrollyTelling from "@/components/CanvasScrollyTelling";
import TrustedByMarquee from "@/components/TrustedByMarquee";
import DocumentUploader from "@/components/DocumentUploader";
import LiveAudioStreamer from "@/components/LiveAudioStreamer";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[#050505] text-white overflow-clip">

        <HeroSection />

        <CanvasScrollyTelling />

        <TrustedByMarquee />

        <section id="demo" className="relative w-full py-32 px-4 md:px-12 bg-[#050505]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase text-white mb-4">
                Test the Agent
              </h2>
              <p className="text-zinc-500 tracking-widest text-sm max-w-2xl mx-auto leading-relaxed uppercase">
                Upload a document to build knowledge. Speak into the microphone to hear it respond live.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
              {/* Left column: Context (RAG) */}
              <div className="flex flex-col h-full">
                <DocumentUploader />
              </div>

              {/* Right column: Audio Streamer */}
              <div className="flex flex-col h-full">
                <LiveAudioStreamer />
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </SmoothScroll>
  );
}
