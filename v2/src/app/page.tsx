import { PrismaHero } from "@/components/ui/prisma-hero";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Capabilities } from "@/components/sections/Capabilities";
import { OperatingModel } from "@/components/sections/OperatingModel";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <PrismaHero />
      <ProofStrip />
      <SelectedWork />
      <Capabilities />
      <OperatingModel />
      <FinalCTA />
      <Footer />
    </main>
  );
}
