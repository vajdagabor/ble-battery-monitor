import React, { FunctionComponent } from 'react'
import './Screen.scss'

type Props = {
  title?: string
}

const Screen: FunctionComponent<Props> = ({ title, children }) => {
  return (
    <div className="Screen">
      <div className="Screen__Content">
        {title && <h1 className="Screen__Title">{title}</h1>}
        <main className="Screen__Body">{children}</main>
      </div>
    </div>
  )
}

export default Screen
