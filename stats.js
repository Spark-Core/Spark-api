var time = 0
var data = {}
var moment = require("moment")
const request = require("request-promise")
const config = require("./webhook-options.json")
var modified = new moment().format("ddd, DD MMM YYYY HH:mm:ss GMT")
module.exports = (app) => {
    app.get("/stats", async (req, res) => {
        var curr = new Date()

        // Only fetch new data every 3 minutes
        if (curr.getTime() < time) {
            res.set("Last-Modified", modified)
            return res.send(JSON.stringify(data))
        }

        var downloads = await request({
            uri: `https://api.npmjs.org/downloads/point/2012-07-20:${curr.toLocaleString().split(" ")[0]}/sparkbots`,
            headers: {
                "User-Agent": "Sparkbots"
            },
            json: true
        })
        downloads = downloads.downloads
        var github = await request({
            uri: "https://api.github.com/repos/TobiasFeld22/Spark",
            headers: {
                "User-Agent": "Sparkbots"
            },
            json: true
        })
        github = github.stargazers_count;
        var releases = await request({
            uri: "https://api.github.com/repos/TobiasFeld22/Spark/releases?client_id=" + config.ghid + "&client_secret=" + config.ghsecret,
            headers: {
                "User-Agent": "Sparkbots"
            },
            json: true
        })

        var version = releases.filter(i => (i.draft == false)).filter(i => (i.prerelease == false))[0].tag_name.replace("v", "")
        time = (curr.getTime() + 180000)
        data = {
            github,
            version,
            downloads
        }
        modified = new moment().format("ddd, DD MMM YYYY HH:mm:ss GMT")
        res.set("Last-Modified", modified)
        res.send(JSON.stringify(data))

    })

}