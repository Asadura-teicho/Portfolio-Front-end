'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/api'

export default function KYCManagement() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const response = await api.get('/admin/kyc')
        if (response.data?.success) {
          setData(response.data.data)
        }
      } catch (err) {
        console.error("Connection failed. Check terminal for CORS/Auth errors.");
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="p-10 text-white">Connecting to {process.env.NEXT_PUBLIC_API_URL}...</div>

  return (
    <div className="p-10 bg-black min-h-screen text-white">
      <h1 className="text-2xl mb-6 font-bold border-b border-white/10 pb-4">KYC Management</h1>
      <div className="grid gap-4">
        {data.map(item => (
          <div key={item._id} className="p-4 bg-zinc-900 border border-white/5 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">{item.user.username}</p>
              <p className="text-sm text-gray-400">{item.user.email}</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded text-xs font-bold uppercase">
                {item.status}
              </span>
              <p className="text-[10px] text-gray-600 mt-2">ID: {item._id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}