const Users = require('../controllers/user.controller'),
    Nurses = require('../controllers/nurse.controller');

module.exports = app => {

    app.route('/api/nurses').get(Nurses.getAll).post(Nurses.upsert).delete(Nurses.delete);
    app.route('/api/nurses/del').post(Nurses.deactive);
    app.route('/api/nurses/changeBusyDate').post(Nurses.setDate);
    app.route('/api/nurses/changeStatus').post(Nurses.setStatus);
    app.route('/api/activenurses').get(Nurses.search).post(Nurses.search);
    app.route('/api/nurses/:id').get(Nurses.read).post(Nurses.upsert);
    app.param('id', Nurses.getById);
}
