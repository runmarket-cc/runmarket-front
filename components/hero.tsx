'use client'

import { Button } from '@/components/ui/button'

export function Hero() {
  const handleScrollToRaces = () => {
    const racesSection = document.getElementById('races-section')
    if (racesSection) {
      racesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="bg-navy px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-amber">
          {"KOREA'S MARATHON MARKETPLACE"}
        </p>
        
        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          원하는 마라톤 대회를
        </h1>
        <h1 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          지금 바로 찾아보세요
        </h1>
        
        <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">
          {'전국 마라톤 · 하프 · 10K · 5K 대회를 한곳에서 — 거리, 지역, 접수 일정까지 한눈에'}
        </p>
        
        <Button
          onClick={handleScrollToRaces}
          className="bg-amber px-8 py-3 text-base font-semibold text-navy hover:bg-amber/90"
        >
          대회 둘러보기
        </Button>
      </div>
    </section>
  )
}
