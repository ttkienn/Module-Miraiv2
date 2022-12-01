const fs = require("fs-extra");
const config = require("../../config.json");
module.exports.config = {
    name: "autoleave",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Thiệu Trung Kiên",
    description: "Bot sẽ tự động rời khỏi nhóm dưới số thành viên được chỉ định.",
    commandCategory: "Admin",
    usages: "[số thành viên]",
    cooldowns: 0
};

module.exports.onLoad = () => {
    if(!config["leave"]) config["leave"] = {};
    if(!config["leave"]["status"]) config["leave"]["status"] = false;
    if(!config["leave"]["number"]) config["leave"]["number"] = 0;
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
}

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    if(args[0]) number = parseInt(args[0]);
    config.leave = { status: config.leave.status == true ? false : true, number: number || config.leave.number}
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
    return api.sendMessage(`Đã ${config["leave"]["status"] == true ? "bật" : "tắt"} chức năng tự động rời khỏi nhóm khi nhóm có số thành viên nhỏ hơn ${config["leave"]["number"]} thành viên.`, threadID, messageID);
}

module.exports.handleEvent = async ({ api, event }) => {
    const { threadID, messageID, participantIDs } = event;
    if (config["leave"]["status"] && participantIDs.length <= config["leave"]["number"] && event.isGroup && event.senderID != api.getCurrentUserID() && !config.ADMINBOT.includes(event.senderID)) {
        await api.sendMessage(`Nhóm này có ${participantIDs.length}/${config["leave"]["number"]} thành viên, bot sẽ tự động rời khỏi nhóm.`, threadID);
        return api.removeUserFromGroup(api.getCurrentUserID(), threadID);
    }
}                       
