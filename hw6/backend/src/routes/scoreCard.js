import { Router } from 'express';
// import { useScoreCard } from '../../../frontend/src/hooks/useScoreCard';
import ScoreCard from "../models/ScoreCard";

const router = Router();

router.get("/cards", async (req, res) => {
    let scorecards = null;
    switch (req.query.type) {
        case 'name':
            scorecards = await ScoreCard.find({ name: req.query.queryString });
            break;
        case 'subject':
            scorecards = await ScoreCard.find({ subject: req.query.queryString });
            break;
    }
    let messages = [];
    scorecards.forEach(scorecard => {
        messages.push(`Found card with ${req.query.type}: (${scorecard.name}, ${scorecard.subject}, ${scorecard.score})`)
    })
    res.json({ messages: messages, message: `${req.query.type} (${req.query.queryString}) not found!` })
});

router.post("/card", async (req, res) => {
    const cards = await ScoreCard.find({ name: req.body.name });
    console.log(cards);
    if (await ScoreCard.exists({ name: req.body.name, subject: req.body.subject })) {
        try {
            const scorecard = await ScoreCard.findOne({ name: req.body.name, subject: req.body.subject })
            scorecard.score = req.body.score;
            await scorecard.save();
            res.json({ message: `Updating (${req.body.name}, ${req.body.subject}, ${req.body.score})`, cards: cards })
        } catch (e) {console.log({message: e.message, cards: cards})}
    } else {
        try {
            const scorecard = await ScoreCard.create({
                name: req.body.name,
                subject: req.body.subject,
                score: req.body.score
            })
            await scorecard.save();
            res.json({ message: `Adding (${req.body.name}, ${req.body.subject}, ${req.body.score})`, cards: cards })
        } catch (e) {res.json({message: e.message, cards: cards})}
    }
});

router.delete("/cards", async (req, res) => {
    try {
        await ScoreCard.deleteMany({});
        res.json({ message: "Database cleared" });
    } catch (e) {console.log(e.message)}
});

export default router;