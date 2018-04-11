const discord = require("discord.js")
const options = require("./webhook-options.json")
const hook = new discord.WebhookClient(options.hookId, options.hookToken);
const request = require("request-promise")
require("request")
const crypto = require("crypto")
const fs = require("fs")
const moment = require("moment")
require("moment-duration-format")

module.exports = async (req, res) => {
    if (!req.body.payload) {
        return res.sendStatus(404)
    }
    try {
        payload = JSON.parse(req.body.payload)
        payload.signature = Buffer.from(req.headers.signature, 'base64');
        var key;
        if (payload.build_url.startsWith("https://travis-ci.com/")) {
            key = await request({
                uri: "https://api.travis-ci.com/config",
                json: true
            })
        } else {
            key = await request({
                uri: "https://api.travis-ci.org/config",
                json: true
            })
        }
        key = key.config.notifications.webhook.public_key;
        let verifier = crypto.createVerify('sha1');
        verifier.update(req.body.payload);
        status = verifier.verify(key, payload.signature);
        if (!status) {
            return res.sendStatus(403)
        } else if (options.whitelist.length != 0 && !options.whitelist.includes(payload.repository.id)) {
            return res.sendStatus(401)
        }
        req.buildInfo = payload;
        next(req, res)
    } catch (e) {
        console.log(e)
        return res.sendStatus(403)
    }
}

function next(req, res) {
    const embed = new discord.RichEmbed;
    hook.edit(options.name || "Travis status update", options.icon || "https://cdn.discordapp.com/attachments/347923404357107712/433693539805691905/travis4x.png")

    if (req.buildInfo.pull_request) {
        embed.setFooter("Pull request #" + req.buildInfo.pull_request_number + " (" + req.buildInfo.commit + ")", "https://cdn.discordapp.com/attachments/347923404357107712/433673027385819148/Scheme-256.png")
    } else {
        embed.setFooter("Push (" + req.buildInfo.commit + ")", "https://cdn.discordapp.com/attachments/347923404357107712/433673144218419210/commit-128.png")
    }
    if (req.buildInfo.state == "started") {
        embed.setTitle("Build #" + req.buildInfo.number + " has started!")
        message = req.buildInfo.message.substring(0, 2000)
        embed.setDescription("Commit body:\n" + message)
        embed.setColor(0xedde3f)
    } else if (req.buildInfo.state == "passed") {
        embed.setTitle("Build #" + req.buildInfo.number + " has completed succesfully.")
        var time = moment.duration(req.buildInfo.duration, "seconds").format("hh:mm:ss", {
            trim: false
        });
        embed.setDescription("Duration: \n**" + time + "**")
        embed.setColor(0x39aa56)
    } else if (req.buildInfo.state == "failed") {
        embed.setTitle("Build #" + req.buildInfo.number + " has failed.")
        embed.setDescription("Check [your console](" + req.buildInfo.build_url + ") for errors")
        embed.setColor(0xdb4545)
    } else if (req.buildInfo.state == "canceled") {
        embed.setTitle("Build #" + req.buildInfo.number + " has been canceled.")
        embed.setDescription("This build has been canceled.")
        embed.setColor(0x9d9d9d)
    } else {
        embed.setTitle("Invalid state (" + req.buildInfo.state + ")")
        embed.setDescription("Please see the console for more information.")
    }
    embed.addField("Links", "[Commit **" + req.buildInfo.commit.substring(0, 6) + "**](https://github.com/" + req.buildInfo.repository.owner_name + "/" + req.buildInfo.repository.name + "/" + req.buildInfo.commit + ")\n[Compare](" + req.buildInfo.compare_url + ")\n[Build info](" + req.buildInfo.build_url + ")\n[Github repo](https://github.com/" +
        req.buildInfo.repository.owner_name + "/" + req.buildInfo.repository.name + ")")
    hook.send("", {
            embeds: [embed]
        })
        .then(() => {
            return res.sendStatus(200)
        })
        .catch(() => {
            return res.sendStatus(500)
        })
}