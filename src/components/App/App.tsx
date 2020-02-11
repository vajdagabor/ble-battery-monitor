import React, { useState } from 'react'
import BLEClass from '../../lib/ble'
import pluralise from '../../lib/pluralise'
import Device from '../Device'

const BLE = new BLEClass()
console.log(BLE)

type BLEDeviceList = {
  [id: string]: { id: string; name?: string; isConnected: boolean }
}

function App() {
  const [devices, setDevices] = useState<BLEDeviceList>({})

  function updateDevice(deviceId, key, value) {
    setDevices(previousDevices => {
      const changedDevice = { ...previousDevices[deviceId], [key]: value }
      return { ...previousDevices, [deviceId]: changedDevice }
    })
  }

  function handleScanRequest() {
    BLE.startScanning(() => {
      updateDeviceList()
    })
  }

  async function handleConnect(deviceId) {
    try {
      await BLE.connect(deviceId, () => onDisconnect(deviceId))
      onConnect(deviceId)
    } catch (error) {
      console.error(`Connecting to ${deviceId} resulted in an error:`, error)
    }
  }

  async function handleDisconnect(deviceId) {
    try {
      await BLE.disconnect(deviceId)
    } catch (error) {
      console.error(
        `Disconnecting from ${deviceId} resulted in an error:`,
        error
      )
    }
  }

  function onConnect(deviceId) {
    console.log(`Device has been connected (${deviceId})`)
    updateDevice(deviceId, 'isConnected', true)
  }

  function onDisconnect(deviceId) {
    console.log(`Device has been disconnected (${deviceId})`)
    updateDevice(deviceId, 'isConnected', false)
  }

  function updateDeviceList() {
    const newDevices = BLE.getAllDevices().reduce(
      (out, device) => ({
        ...out,
        [device.id]: {
          id: device.id,
          name: device.name,
          isConnected: BLE.isConnected(device.id)
        }
      }),
      {}
    )
    setDevices(newDevices)
  }

  const deviceCount = () => Object.keys(devices).length

  return (
    <>
      <h1>BLE scanner</h1>
      {deviceCount() > 0 ? (
        <>
          <p>I found {pluralise(deviceCount(), 'device')}.</p>
          <ul>
            {Object.entries(devices).map(([id, device]) => (
              <li key={id}>
                <Device
                  id={id}
                  name={device.name}
                  isConnected={device.isConnected}
                  connect={() => handleConnect(id)}
                  disconnect={() => handleDisconnect(id)}
                />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>There are no devices yet. Scan with the button!</p>
      )}
      <hr />
      <div>
        <button type="button" onClick={handleScanRequest}>
          Scan
        </button>
      </div>
    </>
  )
}

export default App
