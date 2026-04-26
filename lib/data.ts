import type { Race, Distance } from './types'

export const races: Race[] = [
  {
    id: 1,
    name: '2025 서울 봄 마라톤',
    region: '서울',
    raceDate: '2025-04-06',
    regStart: '2025-01-01',
    regEnd: '2025-03-20',
    description: '한강 코스',
    courses: [
      { distance: 'FULL', price: 45000 },
      { distance: 'HALF', price: 35000 },
      { distance: 'TEN_K', price: 25000 },
    ],
  },
  {
    id: 2,
    name: '제주 국제 마라톤',
    region: '제주',
    raceDate: '2025-04-20',
    regStart: '2025-01-15',
    regEnd: '2025-04-01',
    description: '해안도로 코스',
    courses: [
      { distance: 'FULL', price: 55000 },
      { distance: 'HALF', price: 40000 },
    ],
  },
  {
    id: 3,
    name: '부산 벚꽃 런',
    region: '부산',
    raceDate: '2025-04-13',
    regStart: '2025-02-01',
    regEnd: '2025-04-05',
    description: '광안리 ~ 해운대',
    courses: [
      { distance: 'TEN_K', price: 28000 },
      { distance: 'FIVE_K', price: 18000 },
    ],
  },
  {
    id: 4,
    name: '경기 하프 마라톤',
    region: '경기',
    raceDate: '2025-05-11',
    regStart: '2025-03-01',
    regEnd: '2025-04-30',
    description: '팔당댐 코스',
    courses: [
      { distance: 'HALF', price: 35000 },
      { distance: 'TEN_K', price: 25000 },
    ],
  },
  {
    id: 5,
    name: '서울 5K 펀런',
    region: '서울',
    raceDate: '2025-03-30',
    regStart: '2024-12-01',
    regEnd: '2025-03-15',
    description: '올림픽공원',
    courses: [{ distance: 'FIVE_K', price: 20000 }],
  },
]

export const distancePillColors: Record<string, string> = {
  '풀': 'bg-blue-500 text-white',
  '풀마라톤': 'bg-blue-500 text-white',
  '하프': 'bg-green-500 text-white',
  '하프마라톤': 'bg-green-500 text-white',
  '10km': 'bg-amber text-foreground',
  '10K': 'bg-amber text-foreground',
  '5km': 'bg-gray-400 text-white',
  '5K': 'bg-gray-400 text-white',
}

export const regionColors: Record<string, string> = {
  서울: 'bg-blue-500',
  제주: 'bg-orange-500',
  부산: 'bg-teal-500',
  경기: 'bg-purple-500',
}
