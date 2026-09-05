import { useState } from 'react'
import { Plus, Store as StoreIcon, Trash2 } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Modal from '../components/ui/Modal'
import Field, { inputClass } from '../components/ui/Field'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { useI18n } from '../i18n/I18nContext'
import { useStores } from '../hooks/useStores'

export default function Stores() {
  const { t } = useI18n()
  const { stores, loading, addStore, deleteStore } = useStores()

  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingStore, setDeletingStore] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await addStore({ name, location })
      setName('')
      setLocation('')
      setFormOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deletingStore) return
    setDeleting(true)
    try {
      await deleteStore(deletingStore.id)
      setDeletingStore(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={t('stores.title')}
        actions={
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            {t('stores.addStore')}
          </button>
        }
      />

      {loading && <p className="text-sm text-slate-400">{t('common.loading')}</p>}
      {!loading && stores.length === 0 && (
        <p className="text-sm text-slate-400">{t('common.noResults')}</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((s) => (
          <div key={s.id} className="flex items-start justify-between rounded-2xl border border-slate-100 bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-brand-blue">
                <StoreIcon size={18} />
              </div>
              <div>
                <p className="font-semibold text-slate-700">{s.name}</p>
                <p className="text-sm text-slate-400">{s.location}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDeletingStore(s)}
              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={t('stores.addStore')}
        footer={
          <>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              form="store-form"
              disabled={saving}
              className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {t('common.save')}
            </button>
          </>
        }
      >
        <form id="store-form" onSubmit={handleAdd}>
          <Field label={t('common.name')} required>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label={t('stores.location')}>
            <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} />
          </Field>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deletingStore}
        onCancel={() => setDeletingStore(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />
    </div>
  )
}
