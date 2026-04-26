'use client'

import { useState } from 'react'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ApiRace, RegisterRaceRequest, ApiDistance } from '@/lib/api-types'

const REGIONS = ['서울', '경기', '부산', '대구', '인천', '광주', '대전', '제주', '기타']

const DISTANCE_OPTIONS: { value: ApiDistance; label: string }[] = [
  { value: '풀', label: '풀 (42.195km)' },
  { value: '하프', label: '하프 (21.0975km)' },
  { value: '10K', label: '10K' },
  { value: '5K', label: '5K' },
]

interface CourseInput {
  distance: ApiDistance | ''
  price: number | ''
}

interface FormData {
  name: string
  region: string
  raceDate: string
  regStart: string
  regEnd: string
  description: string
  officialUrl: string
  imageKey: string
  courses: CourseInput[]
}

interface RaceFormProps {
  initialData?: ApiRace
  onSubmit: (data: RegisterRaceRequest) => Promise<void>
  isSubmitting: boolean
  submitLabel: string
}

function toFormData(race?: ApiRace): FormData {
  if (!race) {
    return {
      name: '',
      region: '',
      raceDate: '',
      regStart: '',
      regEnd: '',
      description: '',
      officialUrl: '',
      imageKey: '',
      courses: [{ distance: '', price: '' }],
    }
  }

  return {
    name: race.name,
    region: race.region,
    raceDate: race.raceDate,
    regStart: race.regStart,
    regEnd: race.regEnd,
    description: race.description || '',
    officialUrl: race.officialUrl || '',
    imageKey: race.imageKey || '',
    courses: race.courses.map((c) => ({ distance: c.distance, price: c.price })),
  }
}

export function RaceForm({ initialData, onSubmit, isSubmitting, submitLabel }: RaceFormProps) {
  const [formData, setFormData] = useState<FormData>(() => toFormData(initialData))
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const updateCourse = (index: number, field: keyof CourseInput, value: ApiDistance | '' | number | '') => {
    const newCourses = [...formData.courses]
    newCourses[index] = { ...newCourses[index], [field]: value }
    updateField('courses', newCourses)

    if (field === 'distance') {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[`course_${index}_duplicate`]
        return next
      })
    }
  }

  const addCourse = () => {
    updateField('courses', [...formData.courses, { distance: '', price: '' }])
  }

  const removeCourse = (index: number) => {
    if (formData.courses.length <= 1) return
    const newCourses = formData.courses.filter((_, i) => i !== index)
    updateField('courses', newCourses)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = '대회명을 입력하세요'
    if (!formData.region) newErrors.region = '지역을 선택하세요'
    if (!formData.raceDate) newErrors.raceDate = '대회 날짜를 선택하세요'
    if (!formData.regStart) newErrors.regStart = '접수 시작일을 선택하세요'
    if (!formData.regEnd) newErrors.regEnd = '접수 마감일을 선택하세요'

    const selectedDistances: ApiDistance[] = []
    formData.courses.forEach((course, index) => {
      if (!course.distance) {
        newErrors[`course_${index}_distance`] = '거리를 선택하세요'
      } else {
        if (selectedDistances.includes(course.distance)) {
          newErrors[`course_${index}_duplicate`] = '중복된 거리입니다'
        } else {
          selectedDistances.push(course.distance)
        }
      }
      if (course.price === '' || course.price < 0) {
        newErrors[`course_${index}_price`] = '참가비를 입력하세요'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const requestData: RegisterRaceRequest = {
      name: formData.name.trim(),
      region: formData.region,
      raceDate: formData.raceDate,
      regStart: formData.regStart,
      regEnd: formData.regEnd,
      description: formData.description.trim() || undefined,
      officialUrl: formData.officialUrl.trim() || undefined,
      imageKey: formData.imageKey.trim() || undefined,
      courses: formData.courses
        .filter((c) => c.distance && c.price !== '')
        .map((c) => ({
          distance: c.distance as ApiDistance,
          price: c.price as number,
        })),
    }

    await onSubmit(requestData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 기본 정보 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">기본 정보</h2>

        <div className="space-y-2">
          <Label htmlFor="name">
            대회명 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="대회명을 입력하세요"
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">
            지역 <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.region}
            onValueChange={(value) => updateField('region', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="region" className="w-full">
              <SelectValue placeholder="지역 선택" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.region && <p className="text-sm text-destructive">{errors.region}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="raceDate">
            대회 날짜 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="raceDate"
            type="date"
            value={formData.raceDate}
            onChange={(e) => updateField('raceDate', e.target.value)}
            disabled={isSubmitting}
          />
          {errors.raceDate && <p className="text-sm text-destructive">{errors.raceDate}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="regStart">
              접수 시작일 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="regStart"
              type="date"
              value={formData.regStart}
              onChange={(e) => updateField('regStart', e.target.value)}
              disabled={isSubmitting}
            />
            {errors.regStart && <p className="text-sm text-destructive">{errors.regStart}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="regEnd">
              접수 마감일 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="regEnd"
              type="date"
              value={formData.regEnd}
              onChange={(e) => updateField('regEnd', e.target.value)}
              disabled={isSubmitting}
            />
            {errors.regEnd && <p className="text-sm text-destructive">{errors.regEnd}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">대회 소개</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="대회에 대한 간단한 소개를 입력하세요"
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="officialUrl">공식 홈페이지</Label>
          <Input
            id="officialUrl"
            type="url"
            value={formData.officialUrl}
            onChange={(e) => updateField('officialUrl', e.target.value)}
            placeholder="https://example.com"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageKey">이미지 키 (S3)</Label>
          <Input
            id="imageKey"
            value={formData.imageKey}
            onChange={(e) => updateField('imageKey', e.target.value)}
            placeholder="images/races/example.jpg"
            disabled={isSubmitting}
          />
        </div>
      </section>

      {/* 코스 및 참가비 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">코스 및 참가비</h2>

        <div className="space-y-3">
          {formData.courses.map((course, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-1 space-y-1">
                <Select
                  value={course.distance}
                  onValueChange={(value) => updateCourse(index, 'distance', value as ApiDistance)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="거리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTANCE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`course_${index}_distance`] && (
                  <p className="text-sm text-destructive">{errors[`course_${index}_distance`]}</p>
                )}
                {errors[`course_${index}_duplicate`] && (
                  <p className="text-sm text-destructive">{errors[`course_${index}_duplicate`]}</p>
                )}
              </div>
              <div className="w-32 space-y-1">
                <Input
                  type="number"
                  value={course.price}
                  onChange={(e) =>
                    updateCourse(index, 'price', e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder="참가비"
                  min={0}
                  disabled={isSubmitting}
                />
                {errors[`course_${index}_price`] && (
                  <p className="text-sm text-destructive">{errors[`course_${index}_price`]}</p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeCourse(index)}
                disabled={formData.courses.length <= 1 || isSubmitting}
                className="shrink-0"
              >
                <Trash2 className="size-4" />
                <span className="sr-only">삭제</span>
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={addCourse}
          className="w-full"
          disabled={isSubmitting}
        >
          <Plus className="mr-2 size-4" />
          코스 추가
        </Button>
      </section>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full bg-amber text-navy hover:bg-amber/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            처리중...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  )
}
