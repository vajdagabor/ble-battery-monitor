const bt = navigator.bluetooth

type DeviceId = string

interface WebBle {
  startScanning: (cb: (id: DeviceId, name: string) => void) => Promise<void>
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

class BLE implements WebBle {
  /**
   * Cache for the discovered device objects
   */
  private devices: { [id: string]: BluetoothDevice } = {}

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
  getDevice(id: DeviceId) {
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
  async startScanning(cb: (id: DeviceId, name: string) => void): Promise<void> {
    try {
      const device = await bt.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service']
      })
      console.log('Scanning for devices…')
      this.storeDevice(device)
      cb(device.id, device.name)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Tells if we are connected to the GATT server of the device
   *
   * @param id - The device UUID
   */
  isConnected(id: DeviceId) {
    return this.getDevice(id) && this.getDevice(id).gatt.connected
  }

  /**
   * Connects to a device
   *
   * @param id - The device UUID
   * @param onDisconnect - Function to be called after the device is disconnected
   */
  async connect(id: DeviceId, onDisconnect: () => void): Promise<void> {
    const device = this.getDevice(id)
    if (device.gatt.connected) return
    try {
      console.log(`Connection requested to device ${id}`)
      await device.gatt.connect()
      console.log(`Connected to device ${id}`)
      device.addEventListener('gattserverdisconnected', onDisconnect)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Disconnects from a device
   *
   * @param id - The device UUID
   */
  async disconnect(id: DeviceId) {
    try {
      this.getDevice(id).gatt.disconnect()
    } catch (error) {
      console.error(error)
    }
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
    try {
      const server = await device.gatt.connect()
      const service = await server.getPrimaryService(serviceId)
      console.log(service)
      return service.getCharacteristic(characteristicId)
    } catch (error) {
      console.error(error)
    }
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
    try {
      console.log(characteristic)
      const valueDataView = await characteristic.readValue()
      const valueUint8Array = new Uint8Array(valueDataView.buffer)
      console.log(valueUint8Array)
      return valueUint8Array
    } catch (error) {
      console.error(error)
    }
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
    try {
      const characteristic = await this.getCharacteristic(
        id,
        serviceId,
        characteristicId
      )
      await characteristic.startNotifications()
      characteristic.addEventListener('characteristicvaluechanged', () => {
        const value = new Uint8Array(characteristic.value.buffer)
        cb(value)
      })
    } catch (error) {
      console.error(error)
    }
  }
}

export default BLE
