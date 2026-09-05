// Garment measurement + style fields, saved as defaults on the customer
// profile and editable per order. All free text (tailors commonly write
// fractional measurements like 15 1/2, so plain text beats a number input).
export const GARMENT_FIELDS = [
  { key: 'kinara', labelKey: 'garmentFields.kinara', group: 'measurements' },
  { key: 'sleeve', labelKey: 'garmentFields.sleeve', group: 'measurements' },
  { key: 'collar', labelKey: 'garmentFields.collar', group: 'measurements' },
  { key: 'chest', labelKey: 'garmentFields.chest', group: 'measurements' },
  { key: 'waist', labelKey: 'garmentFields.waist', group: 'measurements' },
  { key: 'shalwarLength', labelKey: 'garmentFields.shalwarLength', group: 'measurements' },
  { key: 'pancha', labelKey: 'garmentFields.pancha', group: 'measurements' },
  { key: 'daman', labelKey: 'garmentFields.daman', group: 'style' },
  { key: 'pocket', labelKey: 'garmentFields.pocket', group: 'style' },
  { key: 'cuff', labelKey: 'garmentFields.cuff', group: 'style' },
  { key: 'peti', labelKey: 'garmentFields.peti', group: 'style' },
  { key: 'loop', labelKey: 'garmentFields.loop', group: 'style' },
]

export const emptyGarmentFields = GARMENT_FIELDS.reduce((acc, f) => {
  acc[f.key] = ''
  return acc
}, {})

export function pickGarmentFields(source) {
  if (!source) return { ...emptyGarmentFields }
  return GARMENT_FIELDS.reduce((acc, f) => {
    acc[f.key] = source[f.key] ?? ''
    return acc
  }, {})
}

export function hasAnyGarmentField(source) {
  if (!source) return false
  return GARMENT_FIELDS.some((f) => (source[f.key] || '').trim() !== '')
}
