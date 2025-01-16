
export interface SipAccount {
  username: string
  password: string
  domain: string
  proxy: string
}

const KEY = "sip.account"

function set(sipAccount: SipAccount): void {
  console.log('local storage: save sip account')
  const json = JSON.stringify(sipAccount)
  localStorage.setItem(KEY, json)
}

function get(): SipAccount | null {
  const json = localStorage.getItem(KEY)
  if (!json) return null
  console.log('local storage: read sip account')
  return JSON.parse(json)
}

function remove(): void {
  localStorage.removeItem(KEY)
}

export default {
  set,
  get,
  remove,
}
