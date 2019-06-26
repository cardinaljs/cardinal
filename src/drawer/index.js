import SnappedDrawer from './snapped-drawer'

class DrawerManagementStore {
  constructor() {
    this.activities = []
  }

  pushActivity(activity) {
    this.activities.push(activity)
  }

  getRunningActivity() {
    return this.activities.find((activity) => activity.isRunning())
  }
}

export default class Drawer {
  static SnappedDrawer = SnappedDrawer
  // enum
  static UP = SnappedDrawer.UP
  static LEFT = SnappedDrawer.LEFT
  static DOWN = SnappedDrawer.DOWN
  static RIGHT = SnappedDrawer.RIGHT
  static DrawerManagementStore = new DrawerManagementStore()
}
