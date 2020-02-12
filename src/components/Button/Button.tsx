import React, { MouseEvent } from 'react'
import './Button.scss'
import cx from 'classnames'

type Props = {
  label: string,
  variant?: string,
  onClick?: (...attrs: any) => void
}

function Button({ label, onClick, variant }: Props) {
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
