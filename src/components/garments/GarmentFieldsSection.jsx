import { useI18n } from '../../i18n/I18nContext'
import { GARMENT_FIELDS } from '../../utils/garmentFields'

export default function GarmentFieldsSection({ values, onChange }) {
  const { t } = useI18n()
  const set = (key) => (e) => onChange(key, e.target.value)

  const measurements = GARMENT_FIELDS.filter((f) => f.group === 'measurements')
  const style = GARMENT_FIELDS.filter((f) => f.group === 'style')

  return (
    <div className="sm:col-span-2">
      {/* Two side-by-side vertical lists, mirroring the two columns on the
          handwritten reference sheet — measurements on one side, the
          style checklist on the other. */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-600">
            {t('garmentFields.measurementsHeading')}
          </p>
          <div className="divide-y divide-slate-50 rounded-xl border border-slate-100">
            {measurements.map((f) => (
              <div key={f.key} className="flex items-center justify-between gap-3 px-3 py-2">
                <label htmlFor={`garment-${f.key}`} className="text-sm text-slate-600">
                  {t(f.labelKey)}
                </label>
                <input
                  id={`garment-${f.key}`}
                  className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-end text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
                  value={values[f.key] || ''}
                  onChange={set(f.key)}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-600">{t('garmentFields.styleHeading')}</p>
          <div className="divide-y divide-slate-50 rounded-xl border border-slate-100">
            {style.map((f) => (
              <div key={f.key} className="flex items-center justify-between gap-3 px-3 py-2">
                <label htmlFor={`garment-${f.key}`} className="text-sm text-slate-600">
                  {t(f.labelKey)}
                </label>
                <input
                  id={`garment-${f.key}`}
                  className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-end text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
                  value={values[f.key] || ''}
                  onChange={set(f.key)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
