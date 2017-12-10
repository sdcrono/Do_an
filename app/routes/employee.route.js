const Users = require('../controllers/user.controller'),
Employees = require('../controllers/employee.controller');

module.exports = app => {

app.route('/api/employees').get(Employees.getAll).post(Employees.upsert).delete(Employees.delete);
app.route('/api/employees/del').post(Employees.deactive);
app.route('/api/employees/changeBusyDate').post(Employees.setDate);
app.route('/api/employees/changeStatus').post(Employees.setStatus);
app.route('/api/activeemployees').get(Employees.search).post(Employees.search);
app.route('/api/employees/:id').get(Employees.read).post(Employees.upsert);
app.param('id', Employees.getById);
}
