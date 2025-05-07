
const isDev = import.meta.env.WEBPHONE_PROFILE === "dev";

export const warn = (...args: any[]) => isDev ? console.warn(...args) : void 0;
export const log = (...args: any[]) => isDev ? console.log(...args) : void 0;
