<div align="center">

# 🚀 expo-native-safe-imports

### Safely use native-only React Native libraries inside **Expo Go** — no crashes, no config hacks.

---

![npm](https://img.shields.io/npm/v/expo-native-safe-imports?color=blue&style=for-the-badge)
![platform](https://img.shields.io/badge/platform-ios%20|%20android%20|%20web-green?style=for-the-badge)
![typescript](https://img.shields.io/badge/TypeScript-Yes-blue?style=for-the-badge)
![expo](https://img.shields.io/badge/Expo-Go%20Compatible-purple?style=for-the-badge)
![license](https://img.shields.io/badge/license-MIT-lightgrey?style=for-the-badge)

</div>

---

## ✨ Why This Exists

Expo Go does **not** support custom native modules.  
Normally, if you do:

```ts
import Pdf from "react-native-pdf";
```

Expo Go will crash with:

```
Unable to resolve module react-native-pdf
```

`expo-native-safe-imports` automatically replaces unsupported native imports with safe stubs **only in Expo Go**, while using the real module on:

- Expo Dev Client
- EAS Build (APK / IPA)
- Real Devices
- Bare Workflow

➡️ No code changes.  
➡️ No conditional imports.  
➡️ No metro config editing.

---

## 📦 Installation

```sh
npm install --save-dev expo-native-safe-imports
```

or

```sh
yarn add --dev expo-native-safe-imports
```

---

## ⚙️ Usage

Simply register the plugin and list modules you want ignored in **Expo Go**:

```ts
// app.config.ts or app.json

export default {
  name: "My App",
  plugins: [
    [
      "expo-native-safe-imports",
      {
        ignore: ["react-native-pdf", "react-native-share"],
      },
    ],
  ],
};
```

---

## 📁 Metro config (Required)

Add this into your metro.config.js:

```ts
/** @type {import('expo/metro-config').MetroConfig} */
const { getDefaultConfig } = require("expo/metro-config");
const fs = require("fs"); // Add This
const path = require("path"); // Add This
const { createRequire } = require("module"); // Add This

const config = getDefaultConfig(__dirname);
const requireESM = createRequire(__filename); // Add This

// Add This
const resolverPath = path.join(
  __dirname,
  ".expo",
  "native-safe-imports",
  "metro.mjs"
);

// Add This
const isExpoGo = process.env.npm_lifecycle_event === "start";

// Add This
if (isExpoGo && fs.existsSync(resolverPath)) {
  const custom = requireESM(resolverPath);
  config.resolver.resolveRequest = custom.resolveRequest;
}

module.exports = config;
```

## 🔁 After Changing Plugin Configuration

If you update anything related to this plugin inside app.json or app.config.ts, run:

```sh
npx expo prebuild --clean
npx expo start
```

## 🧠 How It Works

| Runtime Environment             | Behavior                                         |
| ------------------------------- | ------------------------------------------------ |
| **Expo Go**                     | Imports resolve to safe stub, preventing crashes |
| **Expo Dev Client / EAS Build** | Imports resolve to the real native module        |
| **Web**                         | Stub fallback auto-applied (safe default)        |

The stub module behaves like the real one:

- Rendering native components → returns `null` (no crash)
- Calling native methods → logs a dev warning instead of breaking the app

---

## 🧪 Example Usage

No wrapper functions or changes — write code normally:

```tsx
import Pdf from "react-native-pdf";
import Share from "react-native-share";

export default function Screen() {
  return <Pdf source={{ uri: "https://example.com/file.pdf" }} />;
}

Share.open({ message: "Hello world" });
```

### In Expo Go (Dev Mode)

```
[expo-native-safe-imports] react-native-share.open called in Expo Go.
```

### In Real Build or Dev Client

- PDF loads normally
- Share sheet opens

---

## 🔧 Configuration Options

| Option   | Type       | Required | Description                                  |
| -------- | ---------- | -------- | -------------------------------------------- |
| `ignore` | `string[]` | ✅       | Native modules to safely fallback in Expo Go |

---

## 🛡 Features

- ✔ Zero runtime conditionals
- ✔ Zero metro edits
- ✔ Supports both components and functions
- ✔ Compatible with iOS, Android & Web
- ✔ Does **not** modify your source code or project structure

---

## 🪪 License

MIT License

---

<div align="center">

**Made for developers who want Expo convenience without native limitations ⚡**

⭐ Star the repo if it helped you!

</div>
