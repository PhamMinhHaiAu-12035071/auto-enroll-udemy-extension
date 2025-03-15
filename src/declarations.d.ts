declare module "*.png" {
    const value: string;
    export default value;
}

declare module "*.jpg" {
    const value: string;
    export default value;
}

declare module "*.svg" {
    const value: string;
    export default value;
}

// Add HMR interface
interface NodeModule {
  hot?: {
    accept(dependencies?: string | string[], callback?: () => void): void;
    dispose(callback: (data: any) => void): void;
  };
} 