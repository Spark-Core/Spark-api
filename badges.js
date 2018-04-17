const request = require("request-promise")

const badges = {}
module.exports = (app) => {
    app.get("/badge/npm", async (req, res) => {
        if (!badges.npm || (badges.npm.timestamp + 1800000) < new Date().getTime()) {
            badges.npm = {
                badge: await request("https://img.shields.io/badge/Version-0.0.6-ffe13f.svg"),
                timestamp: new Date().getTime()
            }
        }
        res.set("content-type", "image/svg+xml")
        res.set('Content-disposition', 'attachment; filename=badge.svg');
        res.send(badges.npm.badge)
    })
}