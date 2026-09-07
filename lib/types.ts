export type DistanceFilter = 'ALL' | '5km' | '10km' | '하프' | '풀' | '기타'
export type StatusFilter = 'ALL' | 'OPEN' | 'UPCOMING' | 'CLOSED'
export type RaceStatus = 'OPEN' | 'UPCOMING' | 'CLOSED'

export type RegionFilter = 'ALL' | string

export type SortOrder = 'DATE_ASC' | 'STATUS'

export const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'DATE_ASC', label: '대회 날짜순' },
  { value: 'STATUS', label: '접수 상태순' },
]

export const REGION_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: '서울', label: '서울' },
  { value: '경기', label: '경기' },
  { value: '인천', label: '인천' },
  { value: '강원', label: '강원' },
  { value: '대전', label: '대전' },
  { value: '세종', label: '세종' },
  { value: '충남', label: '충남' },
  { value: '충북', label: '충북' },
  { value: '광주', label: '광주' },
  { value: '전북', label: '전북' },
  { value: '전남', label: '전남' },
  { value: '대구', label: '대구' },
  { value: '경북', label: '경북' },
  { value: '부산', label: '부산' },
  { value: '울산', label: '울산' },
  { value: '경남', label: '경남' },
  { value: '제주', label: '제주' },
  { value: '기타', label: '기타' },
] as const
