import express from 'express'
import { getNumber, genNumber } from '../core/getNumber'
const router = express.Router()

router.post('/start', (_, res) => {
    genNumber()
    res.json({ msg: 'The game has started.' })
})

router.get('/guess', (req, res) => {
    // ⽤ req.query.number 拿到前端輸入的數字
    const number = req.query.number;
    if (number < 1 || number > 100) res.status(406).json({ msg: 'Not a legal number.' })
    if (number < getNumber()) res.json({ msg: 'Greater' })
    if (number > getNumber()) res.json({ msg: 'Less' })
    if (number == getNumber()) res.json({ msg: 'Equal' })
})

router.post('/restart', (_, res) => {

})

export default router