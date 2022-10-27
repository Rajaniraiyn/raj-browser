export type Tab = {
  id: string
  url: string
  canGo?: {
    back: boolean
    forward: boolean
  }
}
