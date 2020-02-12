import React from 'react'
import base64ToHex from '../../lib/base64-to-hex'
import './Device.scss'

function Device({
  id,
  name,
  batteryLevel,
  isConnected = false,
  connect,
  disconnect
}) {
  const batteryLabel = isConnected ? "Battery level" : "Last known battery level"

  return (
    <div className="Device">
      <h2 className="Device__Name">{name || 'Unnamed device'}</h2>
      <span className="Device__ID">{base64ToHex(id)}</span>
      <div>{isConnected ? 'Connected' : 'Not connected'}</div>
      {batteryLevel && <div>{batteryLabel}: {batteryLevel}%</div>}
      <button
        className="Device__ConnectButton"
        type="button"
        onClick={isConnected ? disconnect : connect}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  )
}

export default Device
