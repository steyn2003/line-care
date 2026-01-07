import Api from './Api'
import DashboardController from './DashboardController'
import MachineController from './MachineController'
import WorkOrderController from './WorkOrderController'
import PreventiveTaskController from './PreventiveTaskController'
import LocationController from './LocationController'
import CauseCategoryController from './CauseCategoryController'
import UserController from './UserController'
import ReportsController from './ReportsController'
import Settings from './Settings'
const Controllers = {
    Api: Object.assign(Api, Api),
DashboardController: Object.assign(DashboardController, DashboardController),
MachineController: Object.assign(MachineController, MachineController),
WorkOrderController: Object.assign(WorkOrderController, WorkOrderController),
PreventiveTaskController: Object.assign(PreventiveTaskController, PreventiveTaskController),
LocationController: Object.assign(LocationController, LocationController),
CauseCategoryController: Object.assign(CauseCategoryController, CauseCategoryController),
UserController: Object.assign(UserController, UserController),
ReportsController: Object.assign(ReportsController, ReportsController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers