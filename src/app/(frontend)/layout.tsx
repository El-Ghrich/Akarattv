import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Akarattv — actualités et analyses du Maroc.',
  title: 'Akarattv',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ar">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
