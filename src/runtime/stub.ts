import { type ComponentType, type ReactElement } from "react";

type UnknownProps = Record<string, unknown>;

// A stub that is both callable (React component) and has callable properties.
const createStub = <T extends object>(moduleName: string): T => {
  const StubComponent: ComponentType<
    UnknownProps
  > = (): ReactElement | null => {
    if (__DEV__) {
      console.warn(
        `[expo-native-safe-imports] '${moduleName}' component rendered in Expo Go.`
      );
    }
    return null;
  };

  return new Proxy(StubComponent, {
    get(_target, prop) {
      return (..._args: unknown[]): void => {
        if (__DEV__) {
          console.warn(
            `[expo-native-safe-imports] '${moduleName}.${String(
              prop
            )}' was called in Expo Go.`
          );
        }
      };
    },
  }) as unknown as T;
};

export default createStub;
