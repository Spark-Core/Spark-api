var moment = require("moment")
var versions = {
    all: [
        { version: "0.0.6", release_date: new Date(1516130128000).toUTCString(), release: true },
        { version: "0.0.6-beta.1", release_date: new Date(1515514188000).toUTCString(), release: false },
        { version: "0.0.6-beta.0", release_date: new Date(1515286628000).toUTCString(), release: false },
        { version: "0.0.5", release_date: new Date(1516130128000).toUTCString(), release: true },
        { version: "0.0.5-beta.2", release_date: new Date(1511618875000).toUTCString(), release: false },
        { version: "0.0.5-beta.1", release_date: new Date(1510771361000).toUTCString(), release: false },
        { version: "0.0.5-beta.0", release_date: new Date(1509084129000).toUTCString(), release: false },
        { version: "0.0.3", release_date: new Date(1508791195000).toUTCString(), release: true },
        { version: "0.0.3-beta.2", release_date: new Date(1507395740000).toUTCString(), release: false },
        { version: "0.0.3-beta.1", release_date: new Date(1506757426000).toUTCString(), release: false },
        { version: "0.0.3-beta.0", release_date: new Date(1505645370000).toUTCString(), release: false },
        { version: "0.0.2", release_date: new Date(1505597306000).toUTCString(), release: true },
        { version: "0.0.2-beta.4", release_date: new Date(1505399327000).toUTCString(), release: false },
        { version: "0.0.2-beta.3", release_date: new Date(1504948193000).toUTCString(), release: false },
        { version: "0.0.2-beta.2", release_date: new Date(1504531337000).toUTCString(), release: false },
        { version: "0.0.2-beta.0", release_date: new Date(1504193191000).toUTCString(), release: false },
        { version: "0.0.1", release_date: new Date(1503944919000).toUTCString(), release: true }

    ],
    stable: { version: "0.1", release_date: new Date() },
    beta: { version: "0.1-beta", release_date: new Date() }
}
var modified = new moment(1522677392694).format("ddd, DD MMM YYYY HH:mm:ss [GMT]")
module.exports = (app) => {
    app.get("/versions", (req, res) => {
        res.set("Last-Modified", modified)
        res.send(JSON.stringify(versions))
    })
}