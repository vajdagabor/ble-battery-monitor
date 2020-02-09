const bt = navigator.bluetooth

type DeviceId = string

interface WebBle {
  startScanning: (cb: (device: DeviceId, name: string) => void) => Promise<void>
  isConnected: (device: DeviceId) => boolean
  connect: (device: DeviceId, onDisconnect: () => void) => Promise<void>
  read: (
    device: DeviceId,
    serviceUuid: string,
    characteristicUuid: string
  ) => Promise<Uint8Array>
  subscribe: (
    device: DeviceId,
    serviceUuid: string,
    characteristicUuid: string,
    cb: (data: Uint8Array) => void
  ) => Promise<void>

  disconnect: (device: DeviceId) => Promise<void>
}

async function startScanning(
  cb: (device: DeviceId, name: string) => void
): Promise<void> {
  try {
    const device = await bt.requestDevice({
      acceptAllDevices: true
    })
    console.log(typeof device.id)
    console.log(device)
    cb(device.id, device.name)
    setTimeout(() => startScanning(cb), 1000)
  } catch (error) {
    console.error(error)
  }
}

export default {
  startScanning
}
