import React from 'react'
import './Screen.scss'

function Screen({ title, children }) {
  return (
    <div className="Screen">
      <div className="Screen__Content">
        <h1 className="Screen__Title">{title}</h1>
        <main className="Screen__Body">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Screen
