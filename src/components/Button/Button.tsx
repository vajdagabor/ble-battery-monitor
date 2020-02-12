import React from 'react'
import './Button.scss'
import cx from '../../lib/cx'

function Button({ label, onClick, variant = undefined }) {
  const variantClass = variant ? `Button--${variant}` : undefined
  const classes = cx('Button', variantClass)
  return (
    <button className={classes} type="button" onClick={onClick}>
      {label}
    </button>
  )
}

Button.defaultProps = {
  type: 'button'
}

export default Button
