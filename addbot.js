const fs = require("fs")
const config = require("../../config.json")
module.exports.config = {
    name: "addbot",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Thiệu Trung Kiên",
    description: "Những người có trong danh sách có thể thêm bot vào nhóm!,
    commandCategory: "Events",
    usages: "",
    cooldowns: 0
}
module.exports.onLoad = () => {
    if (!config.addbot) config.addbot = { data: { status: false, UID: [] } }
    global.client.events.set('addbot', {
        config: {
            name: 'addbot',
            eventType: ['log:subscribe'],
            version: '1.0.0',
            credits: 'Thiệu Trung Kiên',
            description: 'Người dùng có trong danh sách sẽ được thêm bot vào nhóm'
        },
        run: async function ({ event, api }) {
            switch (event.logMessageType) {
                case "log:subscribe": {
                    if (config.addbot.data.status && event.participantIDs.includes(api.getCurrentUserID()) && !config.addbot.data.UID.includes(event.author) && !config.ADMINBOT.includes(event.author)) {
                        return api.sendMessage("Bạn không có quyền thêm bot vào nhóm này!\nBot sẽ tự động rời khỏi nhóm sau 3s!", event.threadID, (err, info) => {
                            if (err) return console.log(err)
                            setTimeout(() => api.removeUserFromGroup(api.getCurrentUserID(), info.threadID), 3000)
                        })
                    }
                }
            }
        }
    })
}
module.exports.run = async ({ api, event, args }) => {
    if (["add", "remove", "check"].includes(args[0])) {
        if (!args[1]) return api.sendMessage("Vui lòng nhập ID người dùng", event.threadID, event.messageID)
        return this.configData(args[0], args[1], api, event)
    }
    this.configData("status", null, api, event)
}
module.exports.configData = async (type, tid, api, event) => {
    var { threadID, messageID } = event;
    switch (type) {
        case "add":
            if (!config.addbot.data.UID.includes(tid)) return config.addbot.data.UID.push(tid), api.sendMessage("Đã thêm người dùng vào danh sách", threadID, messageID);
            api.sendMessage("Người dùng đã có trong danh sách", threadID, messageID);
            break;
        case "remove":
            if (config.addbot.data.UID.includes(tid)) return config.addbot.data.UID.splice(config.addbot.data.UID.indexOf(tid), 1), api.sendMessage("Đã xóa người dùng khỏi danh sách", threadID, messageID);
            api.sendMessage("Người dùng không có trong danh sách", threadID, messageID);
            break;
        case "check":
            return config.addbot.data.UID.includes(tid), api.sendMessage("Người dùng có trong danh sách: " + (config.addbot.data.UID.includes(tid) ? "Có" : "Không"), threadID, messageID);
        case "status":
            return config.addbot.data.status = !config.addbot.data.status, api.sendMessage(`Đã ${config.addbot.data.status ? "bật" : "tắt"} chức năng\nSử dụng lệnh: ${config.PREFIX}addbot [add/remove/check] [ID]`, threadID, messageID);
        default:
            return !1
    }
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 4))
};
