var moment = require("moment")
var fs = require("fs")
var versions = {
    all: [{
            version: "0.0.6",
            release_date: new Date(1516130128000).toUTCString(),
            release: true
        },
        {
            version: "0.0.6-beta.1",
            release_date: new Date(1515514188000).toUTCString(),
            release: false
        },
        {
            version: "0.0.6-beta.0",
            release_date: new Date(1515286628000).toUTCString(),
            release: false
        },
        {
            version: "0.0.5",
            release_date: new Date(1516130128000).toUTCString(),
            release: true
        },
        {
            version: "0.0.5-beta.2",
            release_date: new Date(1511618875000).toUTCString(),
            release: false
        },
        {
            version: "0.0.5-beta.1",
            release_date: new Date(1510771361000).toUTCString(),
            release: false
        },
        {
            version: "0.0.5-beta.0",
            release_date: new Date(1509084129000).toUTCString(),
            release: false
        },
        {
            version: "0.0.3",
            release_date: new Date(1508791195000).toUTCString(),
            release: true
        },
        {
            version: "0.0.3-beta.2",
            release_date: new Date(1507395740000).toUTCString(),
            release: false
        },
        {
            version: "0.0.3-beta.1",
            release_date: new Date(1506757426000).toUTCString(),
            release: false
        },
        {
            version: "0.0.3-beta.0",
            release_date: new Date(1505645370000).toUTCString(),
            release: false
        },
        {
            version: "0.0.2",
            release_date: new Date(1505597306000).toUTCString(),
            release: true
        },
        {
            version: "0.0.2-beta.4",
            release_date: new Date(1505399327000).toUTCString(),
            release: false
        },
        {
            version: "0.0.2-beta.3",
            release_date: new Date(1504948193000).toUTCString(),
            release: false
        },
        {
            version: "0.0.2-beta.2",
            release_date: new Date(1504531337000).toUTCString(),
            release: false
        },
        {
            version: "0.0.2-beta.0",
            release_date: new Date(1504193191000).toUTCString(),
            release: false
        },
        {
            version: "0.0.1",
            release_date: new Date(1503944919000).toUTCString(),
            release: true
        }

    ],
    stable: {
        version: "0.1.0",
        release_date: new Date().toUTCString()
    },
    beta: {
        version: "0.1.0-beta",
        release_date: new Date().toUTCString()
    }
}
var modified = new moment().format("ddd, DD MMM YYYY HH:mm:ss [GMT]")
var data;
try {
    data = require("./ids.json")
} catch (e) {
    data = {
        beta: [],
        stable: []
    }
    fs.writeFile(__dirname + "/ids.json", JSON.stringify(data), {
        encoding: "utf8"
    })

}

function update(data) {
    fs.writeFile(__dirname + "/ids.json", JSON.stringify(data), {
        encoding: "utf8"
    })
}

module.exports = (app) => {
    app.get("/versions", (req, res) => {
        res.set("Last-Modified", modified)
        var discord = false;
        if (req.query.ownerID && !isNaN(req.query.ownerID)) {
            if (req.query.version == versions.stable.version) {
                if (new Date().getTime() >= (new Date(versions.stable.release_date).getTime() + 43200000)) {
                    if (data.stable.length > 0) {
                        data.stable = []
                        update(data)

                    }
                }
                if (data.stable.includes(req.query.ownerID)) {
                    discord = true;
                } else {
                    data.stable.push(req.query.ownerID)
                    update(data)
                }
                versions.discord = discord;
            } else if (req.query.version == versions.beta.version) {
                if (new Date().getTime() >= (new Date(versions.beta.release_date).getTime() + 43200000)) {
                    if (data.beta.length > 0) {
                        data.beta = []
                        update(data)

                    }
                }
                if (data.beta.includes(req.query.ownerID)) {
                    discord = true;
                } else {
                    data.beta.push(req.query.ownerID)
                    update(data)
                }
                versions.discord = discord;
            } else {
                delete versions.discord
            }
        } else {
            delete versions.discord
        }
        res.send(JSON.stringify(versions))
    })
}