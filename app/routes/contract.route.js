const Contracts = require('../controllers/contract.controller');

module.exports = app => {

    app.route('/api/contracts').get(Contracts.getAll).post(Contracts.upsert);
    app.route('/api/contracts/:id').get(Contracts.read);
    app.param('id', Contracts.getById);
    app.route('/api/contracts/checks').get(Contracts.getAllCheck);
    app.route('/api/contracts/search').post(Contracts.getAllSearch);
    app.route('/api/contracts/approve').post(Contracts.approve);
    app.route('/api/contracts/reject').post(Contracts.reject);

}