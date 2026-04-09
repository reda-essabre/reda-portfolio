import { NavBar } from "@/components/sections/NavBar";
import { Hero } from "@/components/sections/Hero";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { SelectedWork } from "@/components/sections/SelectedWork";

export default function Home() {
  return (
    <main>
      <NavBar />
      <Hero />
      <ProofStrip />
      <SelectedWork />
    </main>
  );
}
