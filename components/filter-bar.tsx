'use client'

import { useState } from 'react'
import {
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  X,
  ArrowUpDown,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  REGION_OPTIONS,
  SORT_OPTIONS,
  type DistanceFilter,
  type StatusFilter,
  type RegionFilter,
  type SortOrder,
} from '@/lib/types'

interface FilterBarProps {
  distanceFilter: DistanceFilter
  statusFilter: StatusFilter
  regionFilter: RegionFilter
  sortOrder: SortOrder
  onDistanceChange: (value: DistanceFilter) => void
  onStatusChange: (value: StatusFilter) => void
  onRegionChange: (value: RegionFilter) => void
  onSortChange: (value: SortOrder) => void
  onResetFilters: () => void
}

const distanceOptions: { value: DistanceFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: '5km', label: '5K' },
  { value: '10km', label: '10K' },
  { value: '하프', label: '하프' },
  { value: '풀', label: '풀' },
  { value: '기타', label: '기타' },
]

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'OPEN', label: '접수중' },
  { value: 'UPCOMING', label: '접수예정' },
  { value: 'CLOSED', label: '접수마감' },
]

export function FilterBar({
  distanceFilter,
  statusFilter,
  regionFilter,
  sortOrder,
  onDistanceChange,
  onStatusChange,
  onRegionChange,
  onSortChange,
  onResetFilters,
}: FilterBarProps) {
  // 디폴트 값: 접어둔 상태 (false)
  const [isOpen, setIsOpen] = useState(false)

  const isDetailFilterActive = regionFilter !== 'ALL'
  const isAnyFilterActive =
    distanceFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    regionFilter !== 'ALL' ||
    sortOrder !== 'DATE_ASC'

  const handleRegionClick = (region: string) => {
    // 같은 지역을 다시 클릭하면 전체로 복원
    if (regionFilter === region) {
      onRegionChange('ALL')
    } else {
      onRegionChange(region)
    }
  }

  return (
    <div className="border-b bg-white shadow-2xs">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          {/* 상단 기본 필터 & 정렬 바 */}
          <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* 거리 필터 */}
              <div className="flex items-center gap-1.5">
                <span className="mr-1 text-xs font-semibold text-muted-foreground">
                  거리
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {distanceOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onDistanceChange(option.value)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer',
                        distanceFilter === option.value
                          ? 'bg-navy text-white shadow-2xs'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hidden h-5 w-px bg-border sm:block" />

              {/* 상태 필터 */}
              <div className="flex items-center gap-1.5">
                <span className="mr-1 text-xs font-semibold text-muted-foreground">
                  상태
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onStatusChange(option.value)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer',
                        statusFilter === option.value
                          ? 'bg-navy text-white shadow-2xs'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hidden h-5 w-px bg-border md:block" />

              {/* 정렬 (대회 날짜순 등) */}
              <div className="flex items-center gap-1.5">
                <span className="mr-1 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                  <ArrowUpDown className="h-3 w-3" />
                  정렬
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onSortChange(option.value)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer',
                        sortOrder === option.value
                          ? 'bg-navy text-white shadow-2xs'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 우측 조작 버튼 (초기화 & 상세 지역 필터 토글) */}
            <div className="flex items-center gap-2">
              {isAnyFilterActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onResetFilters}
                  className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <RotateCcw className="mr-1.5 h-3 w-3" />
                  초기화
                </Button>
              )}

              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'h-8 gap-1.5 px-3 text-xs font-medium transition-all cursor-pointer',
                    isOpen
                      ? 'bg-secondary text-foreground'
                      : 'hover:bg-secondary/70',
                    isDetailFilterActive &&
                      'border-amber text-amber font-semibold shadow-2xs'
                  )}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>지역 필터</span>
                  {isDetailFilterActive && (
                    <Badge
                      variant="secondary"
                      className="ml-0.5 h-4.5 rounded-full px-1.5 text-[10px] font-bold bg-amber/20 text-amber-900"
                    >
                      {regionFilter}
                    </Badge>
                  )}
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          {/* 펼쳐지는 지역 상세 필터 영역 (디폴트 접힘: isOpen이 true일 때만 렌더링) */}
          {isOpen && (
            <CollapsibleContent
              forceMount
              className="mt-3 overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up"
            >
              <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <MapPin className="h-3.5 w-3.5 text-navy" />
                    <span>지역 선택</span>
                    {regionFilter !== 'ALL' && (
                      <span className="font-normal text-muted-foreground">
                        · {regionFilter}
                      </span>
                    )}
                  </div>
                  {regionFilter !== 'ALL' && (
                    <button
                      type="button"
                      onClick={() => onRegionChange('ALL')}
                      className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                    >
                      전체 지역 보기
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {REGION_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleRegionClick(option.value)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer',
                        regionFilter === option.value
                          ? 'bg-navy text-white shadow-2xs'
                          : 'bg-white border border-border text-foreground hover:bg-secondary'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* 적용된 지역 조건 칩 */}
                {isDetailFilterActive && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60">
                    <span className="text-[11px] text-muted-foreground font-medium mr-1">
                      선택된 지역:
                    </span>
                    <Badge
                      variant="secondary"
                      className="gap-1 rounded-full pl-2.5 pr-1.5 py-0.5 text-xs font-medium bg-white border"
                    >
                      {regionFilter}
                      <button
                        type="button"
                        onClick={() => onRegionChange('ALL')}
                        className="hover:text-destructive cursor-pointer rounded-full p-0.5"
                        aria-label="지역 필터 해제"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    </div>
  )
}
