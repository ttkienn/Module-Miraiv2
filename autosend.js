const fs = require("fs-extra")
const axios = require("axios")
const config = require("../../config.json");
module.exports.config = {
    name: "autosend",
    version: "1.0.0",
    credits: "Thiệu Trung Kiên",
    hasPermssion: 1,
    description: "Tự động gửi tin nhắn theo so phut",
    usages: "autosend",
    commandCategory: "Nhóm",
    cooldowns: 0
};
module.exports.onLoad = function () {
    if (!config["autosend"]) {
        config["autosend"] = {};
        config["autosend"]["status"] = false;
        config["autosend"]["minutes"] = 60;
        fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
    }
}
module.exports.run = ({ api, event }) => {
    const status = {
        true: false,
        false: true
    }
    config.autosend.status = status[config.autosend.status];
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
    api.sendMessage(`Đã ${config.autosend.status ? "bật" : "tắt"} chức năng tự động gửi tin nhắn!`, event.threadID, event.messageID);
}
module.exports.handleEvent = async function ({ api }) {
    while (config.autosend.status) {
        var allThreads = global.data.allThreadID || [];
        const res = await axios.get('https://girl.demngayyeu.repl.co')
        const getImg = (await axios.get(res.data.data, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(__dirname + '/cache/anh.jpg', Buffer.from(getImg, 'utf-8'));
        allThreads.forEach(thread => {
            api.sendMessage({
                body: "Đây là tin nhắn tự động!",
                attachment: fs.createReadStream(__dirname + '/cache/anh.jpg')
            }, thread);
        });
        await sleep(convertMinutestoMilliSeconds(config.autosend.minutes));
    }
}
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const convertMinutestoMilliSeconds = (minutes) => minutes * 60 * 1000;
