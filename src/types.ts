export type DeviceId = string

export interface WebBle {
  startScanning: (cb: (id: DeviceId, name?: string) => void) => Promise<void>
  connect: (id: DeviceId, onDisconnect: () => void) => Promise<void>
  read: (
    id: DeviceId,
    serviceUuid: string,
    characteristicUuid: string
  ) => Promise<Uint8Array>
  subscribe: (
    id: DeviceId,
    serviceUuid: string,
    characteristicUuid: string,
    cb: (data: Uint8Array) => void
  ) => Promise<void>

  disconnect: (id: DeviceId) => Promise<void>
}

export type BLEDevice = {
  id: string
  name?: string
  isConnected: boolean
  batteryLevel?: number
}

export type BLEDeviceList = {
  [id: string]: BLEDevice
}
