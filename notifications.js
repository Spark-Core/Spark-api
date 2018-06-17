const request = require("request-promise")
const config = require("./webhook-options.json")
module.exports = (app) => {
    app.post("/push", (req, res) => {
        try {
            if (!req.body.token) {
                return res.sendStatus(400)
            }

            request({
                    uri: "https://iid.googleapis.com/iid/v1/" + req.body.token + "/rel/topics/Updates",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": config.fbkey
                    }
                })
                .catch(e => {
                    console.log(e)
                    return res.sendStatus(500)
                })

            return res.sendStatus(200)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    })
}