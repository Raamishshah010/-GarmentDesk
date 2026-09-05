import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'

const STORES_COLLECTION = 'stores'

export function useStores() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, STORES_COLLECTION), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setStores(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('Failed to load stores:', err)
        setError(err.message)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  const addStore = (data) =>
    addDoc(collection(db, STORES_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
    })

  const deleteStore = (id) => deleteDoc(doc(db, STORES_COLLECTION, id))

  return { stores, loading, error, addStore, deleteStore }
}
