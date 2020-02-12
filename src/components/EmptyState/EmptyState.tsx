import React from 'react'
import './EmptyState.scss'

function EmptyState({ children }) {
  return (
    <section className="EmptyState">
      {children}
    </section>
  )
}

export default EmptyState
