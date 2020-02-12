import React from 'react'
import Device from '../Device'
import './DeviceList.scss'

function DeviceList({ devices = [], connect, disconnect }) {
  return (
    <ul>
      {devices.map(({id, name, batteryLevel, isConnected}) => (
        <li key={id}>
          <Device
            id={id}
            name={name}
            batteryLevel={batteryLevel}
            isConnected={isConnected}
            connect={() => connect(id)}
            disconnect={() => disconnect(id)}
          />
        </li>
      ))}
    </ul>
  )
}

export default DeviceList
