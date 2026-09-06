// Garment measurement + style fields, saved as defaults on the customer
// profile and editable per order.
//
// "measurements" fields are free text (tailors commonly write fractional
// measurements like 15 1/2, so plain text beats a number input).
// "style" fields are Yes/No checkboxes, stored as the string 'yes' or 'no'.
export const GARMENT_FIELDS = [
  { key: 'kinara', labelKey: 'garmentFields.kinara', group: 'measurements', type: 'text' },
  { key: 'bazu', labelKey: 'garmentFields.bazu', group: 'measurements', type: 'text' },
  { key: 'teera', labelKey: 'garmentFields.teera', group: 'measurements', type: 'text' },
  { key: 'collar', labelKey: 'garmentFields.collar', group: 'measurements', type: 'text' },
  { key: 'chhati', labelKey: 'garmentFields.chhati', group: 'measurements', type: 'text' },
  { key: 'kamar', labelKey: 'garmentFields.kamar', group: 'measurements', type: 'text' },
  { key: 'lambai', labelKey: 'garmentFields.lambai', group: 'measurements', type: 'text' },
  { key: 'shalwar', labelKey: 'garmentFields.shalwar', group: 'measurements', type: 'text' },
  { key: 'pancha', labelKey: 'garmentFields.pancha', group: 'measurements', type: 'text' },

  { key: 'collarOption', labelKey: 'garmentFields.collarOption', group: 'style', type: 'checkbox' },
  { key: 'bein', labelKey: 'garmentFields.bein', group: 'style', type: 'checkbox' },
  { key: 'golDaman', labelKey: 'garmentFields.golDaman', group: 'style', type: 'checkbox' },
  { key: 'chokorDaman', labelKey: 'garmentFields.chokorDaman', group: 'style', type: 'checkbox' },
  { key: 'sidePocket', labelKey: 'garmentFields.sidePocket', group: 'style', type: 'checkbox' },
  { key: 'shalwarPocket', labelKey: 'garmentFields.shalwarPocket', group: 'style', type: 'checkbox' },
  { key: 'frontPocket', labelKey: 'garmentFields.frontPocket', group: 'style', type: 'checkbox' },
  { key: 'cuffFitted', labelKey: 'garmentFields.cuffFitted', group: 'style', type: 'checkbox' },
  { key: 'cuffGol', labelKey: 'garmentFields.cuffGol', group: 'style', type: 'checkbox' },
  { key: 'peti', labelKey: 'garmentFields.peti', group: 'style', type: 'checkbox' },
  { key: 'loop', labelKey: 'garmentFields.loop', group: 'style', type: 'checkbox' },
]

export const emptyGarmentFields = GARMENT_FIELDS.reduce((acc, f) => {
  acc[f.key] = f.type === 'checkbox' ? 'no' : ''
  return acc
}, {})

export function pickGarmentFields(source) {
  if (!source) return { ...emptyGarmentFields }
  return GARMENT_FIELDS.reduce((acc, f) => {
    const fallback = f.type === 'checkbox' ? 'no' : ''
    acc[f.key] = source[f.key] ?? fallback
    return acc
  }, {})
}

export function hasAnyGarmentField(source) {
  if (!source) return false
  return GARMENT_FIELDS.some((f) => {
    const value = source[f.key]
    if (f.type === 'checkbox') return value === 'yes'
    return (value || '').trim() !== ''
  })
}
