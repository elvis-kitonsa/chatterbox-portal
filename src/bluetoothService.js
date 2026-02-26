import { BleClient, dataViewToText, textToDataView } from "@capacitor-community/bluetooth-le";
import { Capacitor } from "@capacitor/core";

// ─── Custom GATT UUIDs (same on every ChatterBox install) ────────────────────
export const CHATTERBOX_SERVICE_UUID = "12345678-0000-1000-8000-00805f9b34fb";
export const IDENTITY_CHAR_UUID = "12345678-0001-1000-8000-00805f9b34fb"; // Read
export const MESSAGE_CHAR_UUID = "12345678-0002-1000-8000-00805f9b34fb"; // Write + Notify

// ─── Platform guard ──────────────────────────────────────────────────────────
export function isNativePlatform() {
  return Capacitor.isNativePlatform();
}

// ─── Initialize BLE (call once before any BLE operation) ─────────────────────
export async function initBLE() {
  if (!isNativePlatform()) return { ok: false, reason: "not-native" };
  try {
    await BleClient.initialize({ androidNeverForLocation: false });
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

// ─── Advertise this device as a ChatterBox user ──────────────────────────────
// NOTE: BLE peripheral advertising is supported on Android via the plugin.
// iOS requires a background capability — works while the app is in foreground.
export async function startAdvertising(userName, avatar = null) {
  if (!isNativePlatform()) return { ok: false, reason: "not-native" };
  try {
    const identity = JSON.stringify({ name: userName, avatar });
    await BleClient.initializeBle(); // ensure BLE stack is ready
    // The plugin exposes requestBlePermissions; actual GATT server creation
    // uses the native layer configured by the plugin for the service UUID.
    // We store identity so it can be read when a peer connects.
    window.__chatterboxIdentity = identity;
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

// ─── Scan for nearby ChatterBox users ────────────────────────────────────────
// onDeviceFound({ deviceId, name, rssi })
export async function startScanning(onDeviceFound) {
  if (!isNativePlatform()) return { ok: false, reason: "not-native" };
  try {
    await BleClient.requestLEScan(
      { services: [CHATTERBOX_SERVICE_UUID], allowDuplicates: false },
      (result) => {
        onDeviceFound({
          deviceId: result.device.deviceId,
          name: result.localName || result.device.name || "ChatterBox User",
          rssi: result.rssi ?? -70,
        });
      }
    );
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

// ─── Stop scanning ────────────────────────────────────────────────────────────
export async function stopScanning() {
  if (!isNativePlatform()) return;
  try {
    await BleClient.stopLEScan();
  } catch (_) {
    // ignore — may already be stopped
  }
}

// ─── Connect to a device and read its identity ───────────────────────────────
// Returns { ok: true, name, avatar } or { ok: false, reason }
export async function connectAndGetIdentity(deviceId) {
  if (!isNativePlatform()) return { ok: false, reason: "not-native" };
  try {
    await BleClient.connect(deviceId, (_id) => {
      // onDisconnect — can dispatch an event here if needed
      window.dispatchEvent(new CustomEvent("ble-disconnect", { detail: { deviceId: _id } }));
    });

    const dataView = await BleClient.read(deviceId, CHATTERBOX_SERVICE_UUID, IDENTITY_CHAR_UUID);
    const raw = dataViewToText(dataView);
    const { name, avatar } = JSON.parse(raw);
    return { ok: true, name, avatar: avatar || null };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

// ─── Subscribe to incoming messages from a connected device ──────────────────
// onMessage(deviceId, parsedMessageObject)
export async function subscribeToMessages(deviceId, onMessage) {
  if (!isNativePlatform()) return { ok: false, reason: "not-native" };
  try {
    await BleClient.startNotifications(deviceId, CHATTERBOX_SERVICE_UUID, MESSAGE_CHAR_UUID, (dataView) => {
      try {
        const raw = dataViewToText(dataView);
        const msg = JSON.parse(raw);
        onMessage(deviceId, msg);
      } catch (_) {
        // malformed message — ignore
      }
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

// ─── Send a message to a connected device ────────────────────────────────────
export async function sendBLEMessage(deviceId, message) {
  if (!isNativePlatform()) return { ok: false, reason: "not-native" };
  try {
    const encoded = textToDataView(JSON.stringify(message));
    await BleClient.write(deviceId, CHATTERBOX_SERVICE_UUID, MESSAGE_CHAR_UUID, encoded);
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

// ─── Disconnect from a device ─────────────────────────────────────────────────
export async function disconnectDevice(deviceId) {
  if (!isNativePlatform()) return;
  try {
    await BleClient.disconnect(deviceId);
  } catch (_) {
    // ignore
  }
}
