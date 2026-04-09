import { NavBar } from "@/components/sections/NavBar";
import { Hero } from "@/components/sections/Hero";
import { ProofStrip } from "@/components/sections/ProofStrip";

export default function Home() {
  return (
    <main>
      <NavBar />
      <Hero />
      <ProofStrip />
    </main>
  );
}
