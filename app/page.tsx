import { GlobeDemo } from "@/components/ui/demo"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-10 px-6 py-16">
        <div className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Reda Portfolio Foundation
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            shadcn + Tailwind + TypeScript Globe
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            The current repo is now scaffolded with a minimal Next.js App Router
            foundation so the provided globe component can run in a proper
            React environment.
          </p>
        </div>

        <GlobeDemo />
      </section>
    </main>
  )
}