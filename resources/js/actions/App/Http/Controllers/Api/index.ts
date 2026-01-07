import AuthController from './AuthController'
import MachineController from './MachineController'
import MachineImportController from './MachineImportController'
import WorkOrderController from './WorkOrderController'
import PreventiveTaskController from './PreventiveTaskController'
import LocationController from './LocationController'
import CauseCategoryController from './CauseCategoryController'
import DashboardController from './DashboardController'
import UserController from './UserController'
const Api = {
    AuthController: Object.assign(AuthController, AuthController),
MachineController: Object.assign(MachineController, MachineController),
MachineImportController: Object.assign(MachineImportController, MachineImportController),
WorkOrderController: Object.assign(WorkOrderController, WorkOrderController),
PreventiveTaskController: Object.assign(PreventiveTaskController, PreventiveTaskController),
LocationController: Object.assign(LocationController, LocationController),
CauseCategoryController: Object.assign(CauseCategoryController, CauseCategoryController),
DashboardController: Object.assign(DashboardController, DashboardController),
UserController: Object.assign(UserController, UserController),
}

export default Api