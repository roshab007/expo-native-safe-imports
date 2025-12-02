import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import fs from "fs";
import path from "path";

export interface NativeSafePluginConfig {
  ignore: string[];
}

const withNativeSafeImports: ConfigPlugin<NativeSafePluginConfig> = (
  config,
  props
) => {
  return withDangerousMod(config, [
    "ios",
    (cfg) => {
      const projectRoot = config._internal?.projectRoot || process.cwd();
      const dir = path.join(projectRoot, ".expo/native-safe-imports");

      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      // Write plugin config
      fs.writeFileSync(
        path.join(dir, "config.json"),
        JSON.stringify(props, null, 2)
      );

      // Write Metro resolver
      fs.writeFileSync(
        path.join(dir, "metro.mjs"),
        `
import fs from "fs";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const CONFIG_PATH = path.join(process.cwd(), ".expo", "native-safe-imports", "config.json");

// Normalize path for Metro (Windows fix)
function normalize(p) {
  return p.replace(/\\\\/g, "/");
}

let config = { ignore: [] };
try {
  config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
} catch (e) {
  console.warn("[expo-native-safe-imports] Failed reading config:", e);
}

export function resolveRequest(context, realModuleName, platform) {
  if (config.ignore.includes(realModuleName)) {
    const stubPath = normalize(
      require.resolve("expo-native-safe-imports/build/runtime/stub.js")
    );
    return {
      type: "sourceFile",
      filePath: stubPath,
    };
  }

  return context.resolveRequest(context, realModuleName, platform);
}
`
      );

      return cfg;
    },
  ]);
};

export default withNativeSafeImports;
