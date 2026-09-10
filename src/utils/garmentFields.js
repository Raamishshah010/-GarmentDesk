// Garment measurement + style fields, saved as defaults on the customer
// profile and editable per order. All free text (tailors commonly write
// fractional measurements like 15 1/2, so plain text beats a number input).
export const GARMENT_FIELDS = [
  { key: 'Kandha', labelKey: 'garmentFields.kandha', group: 'measurements', type: 'text' },
  { key: 'bazu', labelKey: 'garmentFields.bazu', group: 'measurements', type: 'text' },
  { key: 'teera', labelKey: 'garmentFields.teera', group: 'measurements', type: 'text' },
  { key: 'collar', labelKey: 'garmentFields.collar', group: 'measurements', type: 'text' },
  { key: 'chhati', labelKey: 'garmentFields.chhati', group: 'measurements', type: 'text' },
  { key: 'ghaira', labelKey: 'garmentFields.ghaira', group: 'measurements', type: 'text' },
  { key: 'lambai', labelKey: 'garmentFields.lambai', group: 'measurements', type: 'text' },
  { key: 'shalwar', labelKey: 'garmentFields.shalwar', group: 'measurements', type: 'text' },
  { key: 'pancha', labelKey: 'garmentFields.pancha', group: 'measurements', type: 'text' },

  { key: 'collarOption', labelKey: 'garmentFields.collarOption', group: 'style', type: 'text' },
  { key: 'bein', labelKey: 'garmentFields.bein', group: 'style', type: 'text' },
  { key: 'golDaman', labelKey: 'garmentFields.golDaman', group: 'style', type: 'text' },
  { key: 'chokorDaman', labelKey: 'garmentFields.chokorDaman', group: 'style', type: 'text' },
  { key: 'sidePocket', labelKey: 'garmentFields.sidePocket', group: 'style', type: 'text' },
  { key: 'shalwarPocket', labelKey: 'garmentFields.shalwarPocket', group: 'style', type: 'text' },
  { key: 'frontPocket', labelKey: 'garmentFields.frontPocket', group: 'style', type: 'text' },
  { key: 'cuffFitted', labelKey: 'garmentFields.cuffFitted', group: 'style', type: 'text' },
  { key: 'cuffGol', labelKey: 'garmentFields.cuffGol', group: 'style', type: 'text' },
  { key: 'peti', labelKey: 'garmentFields.peti', group: 'style', type: 'text' },
  { key: 'loop', labelKey: 'garmentFields.loop', group: 'style', type: 'text' },
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
