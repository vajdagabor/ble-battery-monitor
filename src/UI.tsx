import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import BLE from './lib/ble'
import "./index.css"

function App() {
  const [devices, setDevices] = useState({})

  function handleScanRequest() {
    BLE.startScanning((id, name) => {
      storeDevice(name, id)
    })
  }

  function storeDevice(name, id) {
    if (!id || devices[id]) return
    setDevices(prevState => ({ ...prevState, [id]: name }))
  }

  return (
    <>
      <h1>BLE scanner</h1>
      {Object.keys(devices).length > 0 ? (
        <>
          <p>I found {Object.keys(devices).length} devices.</p>
          <ul>
            {Object.entries(devices).map(([id, name]) => (
              <li key={id}>
                <Device id={id} name={name} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>There are no devices yet. Scan with the button!</p>
      )}
      <hr />
      <div>
        <button type="button" onClick={handleScanRequest}>Scan</button>
      </div>
    </>
  )
}

function Device({ id, name, isConnected = false }) {
  const connectButtonLabel = isConnected => isConnected ? "Disconnect" : "Connect"

  return (
    <div className="Device">
      <h2>{name || "Unknown device"}</h2>
      <p>{id}</p>
      <button type="button">{connectButtonLabel(isConnected)}</button>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
