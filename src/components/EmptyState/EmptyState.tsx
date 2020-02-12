import React, { FunctionComponent } from 'react'
import './EmptyState.scss'

const EmptyState: FunctionComponent = ({ children }) => {
  return (
    <section className="EmptyState">
      {children}
    </section>
  )
}

export default EmptyState
