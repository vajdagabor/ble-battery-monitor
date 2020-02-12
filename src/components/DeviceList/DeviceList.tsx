import React from 'react'
import Device from '../Device'
import { BLEDevice } from '../../types'
import './DeviceList.scss'

type Props = {
  devices: BLEDevice[],
  connect: (id: string) => void,
  disconnect: (id: string) => void
}

function DeviceList({ devices = [], connect, disconnect }: Props) {
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
