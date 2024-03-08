const router = require('express').Router();
const volcanoService = require('../services/volcanoServices');

const { isAuth } = require('../middlewares/authMiddleware');

router.get('/catalog', async (req, res) => {
    let volcano = await volcanoService.getAll();
    res.render('volcano/catalog', { volcano });
});

router.get('/create-volcano', isAuth, (req, res) => {
    res.render('volcano/create')
});

router.post('/create-volcano', isAuth, async (req, res) => {
    try {
        await volcanoService.create({ ...req.body, owner: req.user._id });
        res.redirect('/volcano/catalog');
    } catch (error) {
        console.log(error);
        res.render('volcano/create', { error: getErrorMessage(error) });
    }
});

function getErrorMessage(error) {
    let errorsArr = Object.keys(error.errors);

    if (errorsArr.length > 0) {
        return error.errors[errorsArr[0]];
    } else {
        return error.message
    }

}

router.get('/:volcanoId/details', async (req, res) => {
    let volcano = await volcanoService.getOne(req.params.volcanoId);

    let volcanoData = await volcano.toObject();

    let isOwner = volcanoData.owner == req.user?._id;
    let vote = volcano.getBuyers();

    console.log(vote);

    let isVote = req.user && buyer.some(c => c._id == req.user?._id);

    res.render('volcano/details', { ...volcanoData, isOwner, isVote });
});

async function isOwner(req, res, next) {
    let volcano = await volcanoService.getOne(req.params.volcanoId);

    if (volcano.owner == req.user._id) {
        res.redirect(`/volcano/${req.params.volcanoId}/details`);
    } else {
        next();
    }
}

router.get('/:volcanoId/buy', isOwner, async (req, res) => {
    let volcano = await volcanoService.getOne(req.params.volcanoId);

    volcano.buyer.push(req.user._id);
    await volcano.save();

    res.redirect(`/volcano/${req.params.volcanoId}/details`);

});

async function checkIsOwner(req, res, next) {
    let volcano = await volcanoService.getOne(req.params.volcanoId);

    if (volcano.owner == req.user._id) {
        next();
    } else {
        res.redirect(`/volcano/${req.params.volcanoId}/details`);
    }
}

router.get('/:volcanoId/delete', checkIsOwner, async (req, res) => {
    try {
        await volcanoService.delete(req.params.volcanoId);

        res.redirect('/volcano');
    } catch (error) {
        console.log(error);
        res.render('volcano/create', { error: getErrorMessage(error) });
    }

});

router.get('/:volcanoId/edit', checkIsOwner, async (req, res) => {
    let volcano = await volcanoService.getOne(req.params.volcanoId);

    res.render('volcano/edit', { ...volcano.toObject() });
});

router.post('/:volcanoId/edit', checkIsOwner, async (req, res) => {
    try {
        await volcanoService.updateOne(req.params.volcanoId, req.body);

        res.redirect(`/volcano/${req.params.volcanoId}/details`);
    } catch {
        console.log(error);
        res.render('volcano/create', { error: getErrorMessage(error) });
    }

});

module.exports = router;