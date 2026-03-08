'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setVisible(true)
    }
  }, [])

  function handleAccept() {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E5E7EB] bg-white p-4 shadow-lg sm:flex sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-[#4B5563]">
        Utilizamos cookies essenciais para o funcionamento do site. Ao
        continuar, você concorda com nossa{' '}
        <Link href="/privacy" className="text-[#0066CC] underline hover:text-[#0052A3]">
          Política de Privacidade
        </Link>
        .
      </p>
      <button
        onClick={handleAccept}
        className="mt-3 w-full rounded-md bg-[#0066CC] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0052A3] sm:mt-0 sm:ml-4 sm:w-auto"
      >
        Aceitar
      </button>
    </div>
  )
}
