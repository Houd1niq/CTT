export {};

declare global {
  interface ServiceWorkerGlobalScope extends WorkerGlobalScope {
    skipWaiting(): unknown;

    addEventListener(arg0: string, arg1: (this: ServiceWorkerGlobalScope, event: any) => void): unknown;

    registration: ServiceWorkerRegistration;
  }
}
