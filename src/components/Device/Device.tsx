import React from 'react'
import base64ToHex from '../../lib/base64-to-hex'
import Button from '../Button'
import cx from 'classnames'
import './Device.scss'

function Device({
  id,
  name,
  batteryLevel,
  isConnected = false,
  connect,
  disconnect
}) {
  const classes = cx('Device', {'Device--Connected': isConnected})
  return (
    <div className={classes}>
      <div className="Device__Main">
        <div className="Device__Title">
          <h2 className="Device__Name">{name || 'Unnamed device'}</h2>
          <span className="Device__ID">{base64ToHex(id)}</span>
        </div>
        <div className="Device__Button">
          <Button
            label={isConnected ? 'Disconnect' : 'Connect'}
            onClick={isConnected ? disconnect : connect}
            variant={isConnected && 'Danger'}
          />
        </div>
      </div>
      <div className="Device__Battery">
        {batteryLevel && (
          <span className="Device__BatteryLevel">{batteryLevel}%</span>
        )}
      </div>
    </div>
  )
}

export default Device
