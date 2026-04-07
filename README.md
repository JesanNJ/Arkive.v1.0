# Arkive

A secure file encryption app built with React Native. Arkive lets you encrypt files using **AES-256** before uploading them to Google Drive, ensuring your data remains private even in the cloud.

## How It Works

### AES-256 Encryption

Arkive encrypts your files using **AES-256** (via `crypto-js`) in a **chunked streaming** approach so even large files never exceed device memory:

1. **Chunked processing** — The file is read in **1 MB base64 chunks**. Each chunk is encrypted independently, so the entire file is never held in memory at once.
2. **Secure output format** — Encrypted chunks are written to a `.ark` file as a JSON structure containing metadata (original filename, file size, chunk count, encryption version) followed by the encrypted base64 strings.
3. **Decryption** — The reverse process reads only the needed portion of each chunk at a time, decrypts it back to base64, and streams the decoded binary to the output file. A wrong key or corrupted chunk will throw a clear error.
4. **Key security** — Encryption keys are managed through `react-native-keychain` for secure device-level storage.

## Quick Start

### 1. Run `setup_project.bat`

Navigate to the **`ArkiveStable`** folder and double-click **`setup_project.bat`**. This script will:

- Check your **Node.js** installation (v16+ required).
- Run `npm install` to fetch all dependencies.
- Auto-generate the Android `local.properties` file with your SDK path.

> **This is the only time you should run `npm install`.** The script handles everything.

### 2. Keep Dependencies Updated

Whenever new modules are added to the project, re-run **`setup_project.bat`** to pull in the latest dependencies.

### 3. Run the App

After setup, open a terminal in the `ArkiveStable` folder and run:

```bash
npm run android
```

### Important: Before You Work

Always **check your installed package versions** before making changes or adding new modules. Do **not** blindly run `npm install` — verify versions in `package.json` first to avoid conflicts or unnecessary reinstalls.

### Prerequisites

Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions before running the app.
