# Notes about this solution

Wow, this was a challenging exercise. I have never spent this much time
with an exercise for a job. It was good though, even if the final product
won’t get any awards. I learned a ton on the way.

Since in this exercise there are a few technologies that I haven't worked
before, I allowed some time to get a bit familiar with them. I learned
about TypeScript, Electron, Bluetooth and the Web BlueTooth API. I started
working on the project only after played a little with those techs.

In my solution I focused on the BLE API first, and built the application
around it. I wanted to make the communication somewhat reliable, then worked
on the interactions, and left little time for styling. I am happy
with the result, but only as a starting point for further improvements.

## Things to improve on the interface

*   Disable buttons / turn them into load state when scanning and connecting
*   Show notifications on the UI (instead of the console)
*   Make the UI more pleasant with more sophisticated style
*   Show state changes with animations (e.g when a device appears)
*   Indicate when a device is no longer in range / can’t connect

## Things to improve in the code

*   Use proper TypeScript everywhere
*   Write tests, especially for the BLE module
*   Use redux for more organised state management (or just refactor the code)
*   Replace console.log to notifications on the UI

## Known issues

*   It is possible to connect to a device multiple times – this triggers
    the connect and disconnect hooks multiple times too.
*   In some cases it is possible to "connect" to a device (on the UI) when
    physically it is not accessible anymore. This results in wrong state of
    the UI.
*   New scan should be disabled while scanning is in progress.
*   In some cases, when a device is not longer in range, the UI doesn't
    update it's state.
