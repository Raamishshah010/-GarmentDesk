import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'

const CUSTOMERS_COLLECTION = 'customers'

export function useCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, CUSTOMERS_COLLECTION), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setCustomers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('Failed to load customers:', err)
        setError(err.message)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  const addCustomer = (data) =>
    addDoc(collection(db, CUSTOMERS_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
    })

  const updateCustomer = (id, data) => updateDoc(doc(db, CUSTOMERS_COLLECTION, id), data)

  const deleteCustomer = (id) => deleteDoc(doc(db, CUSTOMERS_COLLECTION, id))

  return { customers, loading, error, addCustomer, updateCustomer, deleteCustomer }
}
