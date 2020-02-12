import React, { useState } from 'react'
import BLEClass from '../../lib/ble'
import Screen from '../Screen'
import Device from '../Device'
import Button from '../Button'
import DeviceList from '../DeviceList'

const BLE = new BLEClass(['battery_service'])
console.log(BLE)

type BLEDeviceState = {
  id: string
  name?: string
  isConnected: boolean
  batteryLevel?: number
}

type BLEDeviceList = {
  [id: string]: BLEDeviceState
}

function App() {
  const [devices, setDevices] = useState<BLEDeviceList>({})

  const allDevices = () => Object.values(devices)

  function updateDevice(deviceId, key, value) {
    setDevices(previousDevices => {
      const changedDevice = { ...previousDevices[deviceId], [key]: value }
      return { ...previousDevices, [deviceId]: changedDevice }
    })
  }

  async function scan() {
    await disconnectAll()
    BLE.startScanning(() => {
      updateDeviceList()
    })
  }

  async function connect(deviceId) {
    try {
      await BLE.connect(deviceId, () => onDisconnect(deviceId))
      onConnect(deviceId)
    } catch (error) {
      console.error(`Connecting to ${deviceId} resulted in an error:`, error)
    }
  }

  async function disconnect(deviceId) {
    try {
      await BLE.disconnect(deviceId)
    } catch (error) {
      console.error(
        `Disconnecting from ${deviceId} resulted in an error:`,
        error
      )
    }
  }

  async function disconnectAll() {
    for (let device of allDevices()) {
      if (device.isConnected) await disconnect(device.id)
    }
  }

  async function onConnect(deviceId) {
    console.log(`Device has been connected (${deviceId})`)
    updateDevice(deviceId, 'isConnected', true)
    await readBatteryLevel(deviceId)
    subscribeToBatteryLevelChanges(deviceId)
  }

  function onDisconnect(deviceId) {
    console.log(`Device has been disconnected (${deviceId})`)
    updateDevice(deviceId, 'isConnected', false)
  }

  async function readBatteryLevel(deviceId) {
    try {
      const value = await BLE.read(deviceId, 'battery_service', 'battery_level')
      updateDevice(deviceId, 'batteryLevel', value[0])
    } catch (error) {
      console.error(`Error while getting battery level for device ${deviceId}`)
    }
  }

  function subscribeToBatteryLevelChanges(deviceId) {
    BLE.subscribe(deviceId, 'battery_service', 'battery_level', (value) =>
      updateDevice(deviceId, 'batteryLevel', value[0])
    )
  }

  function updateDeviceList() {
    setDevices(previousDevices => {
      const newDevicesArr = BLE.getAllDevices().filter(
        d => previousDevices[d.id] === undefined
      )
      const newDevices = newDevicesArr.reduce(
        (out, d) => ({ ...out, [d.id]: deviceStateFromDevice(d) }),
        {}
      )
      return { ...previousDevices, ...newDevices }
    })
  }

  function deviceStateFromDevice(device): BLEDeviceState {
    return {
      id: device.id,
      name: device.name,
      isConnected: BLE.isConnected(device.id)
    }
  }

  const deviceCount = () => Object.keys(devices).length

  return (
    <Screen title="A Battery Watcher">
      {deviceCount() > 0 ? (
        <DeviceList
          devices={allDevices()}
          connect={connect}
          disconnect={disconnect}
                />
      ) : (
        <p>There are no devices yet. Scan with the button!</p>
      )}
      <hr />
      <div>
        <Button label="Find a device" onClick={scan} variant="Primary" />
      </div>
    </Screen>
  )
}

export default App
