/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: "com.chatterbox.portal",
  appName: "ChatterBox",
  webDir: "dist",
  plugins: {
    BluetoothLe: {
      displayStrings: {
        scanning: "Scanning for nearby ChatterBox users...",
        cancel: "Cancel",
        availableDevices: "Nearby ChatterBox Users",
        noDeviceFound: "No users found nearby",
      },
    },
  },
};

export default config;
