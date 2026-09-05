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

const ORDERS_COLLECTION = 'orders'

/**
 * Subscribes to the "orders" collection in Firestore in realtime.
 * Falls back to an empty list (with an error message) if Firestore
 * can't be reached, e.g. because Firebase credentials haven't been
 * configured yet.
 */
export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setOrders(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('Failed to load orders:', err)
        setError(err.message)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  const addOrder = (data) =>
    addDoc(collection(db, ORDERS_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
    })

  const updateOrder = (id, data) => updateDoc(doc(db, ORDERS_COLLECTION, id), data)

  const deleteOrder = (id) => deleteDoc(doc(db, ORDERS_COLLECTION, id))

  return { orders, loading, error, addOrder, updateOrder, deleteOrder }
}
