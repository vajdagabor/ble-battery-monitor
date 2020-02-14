import { DeviceId, WebBle } from '../types'

const bt = navigator.bluetooth

class BLE implements WebBle {
  /**
   * Cache for the discovered device objects
   */
  private devices: { [id: string]: BluetoothDevice } = {}

  constructor(public services: string[] = []) {}

  /**
   * Stores a device object in the cache
   *
   * @param device - The device object to be stored
   */
  private storeDevice(device: BluetoothDevice) {
    if (!device.id || this.devices[device.id]) return
    this.devices = { ...this.devices, [device.id]: device }
  }

  /**
   * Gets a device object from the cache
   *
   * @param id - The device UUID
   */
  getDevice(id: DeviceId): BluetoothDevice | undefined {
    return this.devices[id]
  }

  /**
   * Gets all device objects from the cache
   */
  getAllDevices() {
    return Object.values(this.devices)
  }

  /**
   * Scans for a device. When found, the device object gets cached,
   * and the provided callback function gets called.
   *
   * @param cb - A function to be called when a device is found
   */
  async startScanning(
    cb: (id: DeviceId, name?: string) => void
  ): Promise<void> {
    const device = await bt.requestDevice({
      filters: [
        {
          services: this.services
        }
      ]
    })
    console.log('Scanning for devices…')
    this.storeDevice(device)
    cb(device.id, device.name)
  }

  /**
   * Tells if we are connected to the GATT server of the device
   *
   * @param id - The device UUID
   */
  isConnected(id: DeviceId) {
    return Boolean(this.getDevice(id)?.gatt!.connected)
  }

  /**
   * Connects to a device
   *
   * @param id - The device UUID
   * @param onDisconnect - Function to be called after the device is disconnected
   */
  async connect(id: DeviceId, onDisconnect: () => void): Promise<void> {
    const device = this.getDevice(id)
    if (!device || this.isConnected(id)) return
    console.log(`Connection requested to device ${id}`)
    device.addEventListener('gattserverdisconnected', onDisconnect)
    await device.gatt!.connect()
    console.log(`Connected to device ${id}`)
  }

  /**
   * Disconnects from a device
   *
   * @param id - The device UUID
   */
  async disconnect(id: DeviceId) {
    this.getDevice(id)?.gatt!.disconnect()
  }

  /**
   * Gets a GATT characteristic object
   *
   * @param id - The device UUID
   * @param serviceId - UUID of the requested GATT primary service
   * @param characteristicId - UUID of the requested GATT characteristic
   */
  private async getCharacteristic(
    id: DeviceId,
    serviceId: string,
    characteristicId: string
  ) {
    const device = this.getDevice(id)
    if (!device) throw new Error(`Can’t find cached device with UUID "${id}" (not yet discovered)`)
    const server = await device.gatt!.connect()
    const service = await server.getPrimaryService(serviceId)
    console.log(service)
    return service.getCharacteristic(characteristicId)
  }

  /**
   * Gets the value of a GATT characteristic
   *
   * @param id - The device UUID
   * @param serviceId - UUID of the requested GATT primary service
   * @param characteristicId - UUID of the requested GATT characteristic
   */
  async read(id: DeviceId, serviceId: string, characteristicId: string) {
    const characteristic = await this.getCharacteristic(
      id,
      serviceId,
      characteristicId
    )
    console.log(characteristic)
    const valueDataView = await characteristic.readValue()
    const valueUint8Array = new Uint8Array(valueDataView.buffer)
    console.log(valueUint8Array)
    return valueUint8Array
  }

  /**
   * Subscribes to GATT notifications about a value change of a characteristic
   *
   * @param id - The device UUID
   * @param serviceId - UUID of the requested GATT primary service
   * @param characteristicId - UUID of the requested GATT characteristic
   * @param cb - A function to be called on notification
   */
  async subscribe(
    id: DeviceId,
    serviceId: string,
    characteristicId: string,
    cb: (data: Uint8Array) => void
  ) {
    const characteristic = await this.getCharacteristic(
      id,
      serviceId,
      characteristicId
    )
    await characteristic.startNotifications()
    characteristic.addEventListener('characteristicvaluechanged', async () => {
      const value = await characteristic.readValue()
      cb(new Uint8Array(value.buffer))
    })
  }
}

export default BLE
