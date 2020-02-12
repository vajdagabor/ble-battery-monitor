import React, { useState } from 'react'
import BLEClass from '../../lib/ble'
import Screen from '../Screen'
import Button from '../Button'
import DeviceList from '../DeviceList'
import EmptyState from '../EmptyState'
import { BLEDevice, BLEDeviceList, DeviceId } from '../../types'

const BLE = new BLEClass(['battery_service'])
console.log(BLE)

function App() {
  const [devices, setDevices] = useState<BLEDeviceList>({})

  const allDevices = () => Object.values(devices)

  function updateDevice(deviceId: DeviceId, key: "isConnected", value: boolean): void
  function updateDevice(deviceId: DeviceId, key: "batteryLevel", value: number): void

  function updateDevice(deviceId: DeviceId, key: string, value: any) {
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

  async function connect(deviceId: DeviceId) {
    try {
      await BLE.connect(deviceId, () => onDisconnect(deviceId))
      onConnect(deviceId)
    } catch (error) {
      console.error(`Connecting to ${deviceId} resulted in an error:`, error)
    }
  }

  async function disconnect(deviceId: DeviceId) {
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

  async function onConnect(deviceId: DeviceId) {
    console.log(`Device has been connected (${deviceId})`)
    updateDevice(deviceId, 'isConnected', true)
    await readBatteryLevel(deviceId)
    subscribeToBatteryLevelChanges(deviceId)
  }

  function onDisconnect(deviceId: DeviceId) {
    console.log(`Device has been disconnected (${deviceId})`)
    updateDevice(deviceId, 'isConnected', false)
  }

  async function readBatteryLevel(deviceId: DeviceId) {
    try {
      const value = await BLE.read(deviceId, 'battery_service', 'battery_level')
      updateDevice(deviceId, 'batteryLevel', value[0])
    } catch (error) {
      console.error(`Error while getting battery level for device ${deviceId}`)
    }
  }

  function subscribeToBatteryLevelChanges(deviceId: DeviceId) {
    BLE.subscribe(deviceId, 'battery_service', 'battery_level', value =>
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

  function deviceStateFromDevice(device: BluetoothDevice): BLEDevice {
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
        <EmptyState>
          <p>This little tool scans for BLE devices with battery service, and shows their battery level. Scan with the button to find your first&nbsp;device!</p>
        </EmptyState>
      )}
      <div style={{ textAlign: 'center' }}>
        <Button label="Find a device" onClick={scan} variant="Primary" />
      </div>
    </Screen>
  )
}

export default App
