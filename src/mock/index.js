const data = require('./data')

module.exports = function apiMock(app) {
    app.post('/dict/findPage', function(req, res) {
        res.json(data.dict)
    })

    app.get('/member/get/user/info', function(req, res) {
        res.json(data.userInfo)
    })

    app.get('/member/get/menu', function(req, res) {
        res.json(data.menuInfo)
    })

    app.post('/supplier/listSupplier', function(req, res) {
        res.json(data.supplierInfo)
    })

    app.post('/mock/random/data', function(req, res) {
        res.json(data.mockData)
    })

    app.get('/menu/findNavTree', function(req, res) {
        res.json(data.allMenu)
    })

    app.post('/role/findAll', function(req, res) {
        res.json(data.roleInfo)
    })
}