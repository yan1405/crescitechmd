'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export interface ConversionOptionsValues {
  preserveImages: boolean
  preserveTables: boolean
  preserveHeaders: boolean
  preserveLists: boolean
}

interface ConversionOptionsProps {
  options: ConversionOptionsValues
  onChange: (options: ConversionOptionsValues) => void
  disabled?: boolean
}

const optionsList = [
  { key: 'preserveImages' as const, label: 'Preservar imagens' },
  { key: 'preserveTables' as const, label: 'Manter formatação de tabelas' },
  { key: 'preserveHeaders' as const, label: 'Converter headers/títulos' },
  { key: 'preserveLists' as const, label: 'Preservar listas numeradas/bullets' },
]

export function ConversionOptions({
  options,
  onChange,
  disabled = false,
}: ConversionOptionsProps) {
  return (
    <Card className="border-[#E5E7EB]">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-[#111827]">
          Opções de Conversão
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {optionsList.map((opt) => (
            <div key={opt.key} className="flex items-center gap-2">
              <Checkbox
                id={opt.key}
                checked={options[opt.key]}
                onCheckedChange={(checked) =>
                  onChange({ ...options, [opt.key]: !!checked })
                }
                disabled={disabled}
              />
              <Label
                htmlFor={opt.key}
                className="text-sm text-[#4B5563] cursor-pointer"
              >
                {opt.label}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
