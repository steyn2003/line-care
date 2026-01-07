import machines from './machines'
import workOrders from './work-orders'
import preventiveTasks from './preventive-tasks'
import locations from './locations'
import causeCategories from './cause-categories'
import dashboard from './dashboard'
import reports from './reports'
import users from './users'
const api = {
    machines: Object.assign(machines, machines),
workOrders: Object.assign(workOrders, workOrders),
preventiveTasks: Object.assign(preventiveTasks, preventiveTasks),
locations: Object.assign(locations, locations),
causeCategories: Object.assign(causeCategories, causeCategories),
dashboard: Object.assign(dashboard, dashboard),
reports: Object.assign(reports, reports),
users: Object.assign(users, users),
}

export default api