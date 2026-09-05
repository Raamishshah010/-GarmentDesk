import Field, { inputClass } from '../ui/Field'
import { useI18n } from '../../i18n/I18nContext'
import { GARMENT_FIELDS } from '../../utils/garmentFields'

export default function GarmentFieldsSection({ values, onChange }) {
  const { t } = useI18n()
  const set = (key) => (e) => onChange(key, e.target.value)

  const measurements = GARMENT_FIELDS.filter((f) => f.group === 'measurements')
  const style = GARMENT_FIELDS.filter((f) => f.group === 'style')

  return (
    <div className="sm:col-span-2">
      <p className="mb-3 mt-1 text-sm font-semibold text-slate-600">
        {t('garmentFields.measurementsHeading')}
      </p>
      <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-4">
        {measurements.map((f) => (
          <Field key={f.key} label={t(f.labelKey)}>
            <input className={inputClass} value={values[f.key] || ''} onChange={set(f.key)} />
          </Field>
        ))}
      </div>

      <p className="mb-3 mt-1 text-sm font-semibold text-slate-600">{t('garmentFields.styleHeading')}</p>
      <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-3">
        {style.map((f) => (
          <Field key={f.key} label={t(f.labelKey)}>
            <input className={inputClass} value={values[f.key] || ''} onChange={set(f.key)} />
          </Field>
        ))}
      </div>
    </div>
  )
}
