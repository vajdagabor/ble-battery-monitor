import React from 'react'
import base64ToHex from '../../lib/base64-to-hex'
import Button from '../Button'
import './Device.scss'

function Device({
  id,
  name,
  batteryLevel,
  isConnected = false,
  connect,
  disconnect
}) {
  const batteryLabel = isConnected
    ? 'Battery level'
    : 'Last known battery level'

  return (
    <div className="Device">
      <div className="Device__Header">
        <h2 className="Device__Name">{name || 'Unnamed device'}</h2>
        <span className="Device__ID">{base64ToHex(id)}</span>
      </div>
      <div className="Device__Status">
        {isConnected ? 'Connected' : 'Not connected'}
      </div>
      {batteryLevel && (
        <div>
          {batteryLabel}: {batteryLevel}%
        </div>
      )}
      <div className="Device__Button"></div>
      <Button
        label={isConnected ? 'Disconnect' : 'Connect'}
        onClick={isConnected ? disconnect : connect}
        variant={isConnected && 'Danger'}
      />
    </div>
  )
}

export default Device
