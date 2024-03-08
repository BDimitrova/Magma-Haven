const router = require('express').Router();
const volcanoService = require('../services/volcanoServices');

router.get('/', (req, res) => {
    res.render('home', { title: 'Home Page' });
});

router.get('/search', async (req, res) => {
    let volcanoText = req.query.text;
    let volcanoType = req.query.paymentMethod;

    let volcano = await volcanoService.search(volcanoText, volcanoType);

    if(volcano == undefined) {
        volcano = await volcanoService.getAll();
    }

    console.log(volcano);

    res.render('search', { title: 'Search Volcano', volcano})
})

module.exports = router;