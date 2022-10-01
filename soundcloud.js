"use strict";

var _this = this;

var axios = require("axios"),
    fs = require("fs-extra"),
    baseUrl = "https://thieutrungkien.dev/";

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 6e4),
        seconds = (millis % 6e4 / 1e3).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function isSoundCloud(url) {
    return (/soundcloud\.com/.test(url)
    );
}
module.exports.config = {
    name: "soundcloud",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Thiệu Trung Kiên",
    description: "Tải nhạc từ SoundCloud",
    commandCategory: "media",
    usages: "soundcloud [url]",
    cooldowns: 5
};
module.exports.run = function callee$0$0(_ref) {
    var api = _ref.api;
    var event = _ref.event;
    var args = _ref.args;
    return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                if (args[0]) {
                    context$1$0.next = 2;
                    break;
                }

                return context$1$0.abrupt("return", api.sendMessage("Vui lòng nhập link SoundCloud hoặc tên bài hát!", event.threadID, event.messageID));

            case 2:
                isSoundCloud(args[0]) ? axios.get(baseUrl + "soundcloud/track?url=" + encodeURIComponent(args[0])).then(function (res) {
                    axios.get(res.data.music.url, {
                        responseType: "arraybuffer"
                    }).then(function (data) {
                        fs.writeFileSync(__dirname + event.senderID + "_soundcloud.mp3", Buffer.from(data.data, "utf-8")), api.sendMessage({
                            body: "Title: " + res.data.music.title + "\nGenres: " + res.data.music.genres,
                            attachment: fs.createReadStream(__dirname + event.senderID + "_soundcloud.mp3")
                        }, event.threadID, function () {
                            return fs.unlinkSync(__dirname + event.senderID + "_soundcloud.mp3");
                        }, event.messageID);
                    });
                })["catch"](function (err) {
                    return console.log(err), api.sendMessage("Không tìm thấy bài hát!", event.threadID, event.messageID);
                }) : axios.get(baseUrl + "soundcloud/search?query=" + encodeURIComponent(args.join(" "))).then(function (res) {
                    var data = [];
                    res.data.forEach(function (item, index) {
                        data.push({
                            title: item.title,
                            url: item.url,
                            duration: item.duration,
                            author: item.user.username
                        });
                    });
                    var msg = data.map(function (item, index) {
                        if (!(index >= 6)) return index + 1 + ". " + item.title + "\nAuthor: " + item.author + "\nDuration: " + millisToMinutesAndSeconds(item.duration);
                    }).join("\n\n").trim();
                    api.sendMessage(msg + "\n\nReply tin nhắn theo số thứ tự để tải nhạc!", event.threadID, function (error, info) {
                        global.client.handleReply.push({
                            name: undefined.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "reply",
                            data: data
                        });
                    });
                })["catch"](function (err) {
                    return console.log(err), api.sendMessage("Không tìm thấy bài hát!", event.threadID, event.messageID);
                });

            case 3:
            case "end":
                return context$1$0.stop();
        }
    }, null, _this);
};
module.exports.handleReply = function callee$0$0(_ref2) {
    var api = _ref2.api;
    var event = _ref2.event;
    var handleReply = _ref2.handleReply;
    return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                if (!(handleReply.author != event.senderID)) {
                    context$1$0.next = 2;
                    break;
                }

                return context$1$0.abrupt("return", api.setMessageReaction("🚫", event.messageID));

            case 2:
                "reply" == handleReply.type && axios.get(baseUrl + "soundcloud/track?url=" + encodeURIComponent(handleReply.data[event.body - 1].url)).then(function (res) {
                    axios.get(res.data.music.url, {
                        responseType: "arraybuffer"
                    }).then(function (data) {
                        fs.writeFileSync(__dirname + handleReply.author + "_soundcloud.mp3", Buffer.from(data.data, "utf-8")), api.sendMessage({
                            body: "Title: " + handleReply.data[event.body - 1].title + "\nAuthor: " + handleReply.data[event.body - 1].author + "\nDuration: " + millisToMinutesAndSeconds(handleReply.data[event.body - 1].duration),
                            attachment: fs.createReadStream(__dirname + handleReply.author + "_soundcloud.mp3")
                        }, event.threadID, function () {
                            return fs.unlinkSync(__dirname + handleReply.author + "_soundcloud.mp3");
                        }, event.messageID);
                    });
                })["catch"](function (err) {
                    return console.log(err), api.sendMessage("Không tìm thấy bài hát!", event.threadID, event.messageID);
                });

            case 3:
            case "end":
                return context$1$0.stop();
        }
    }, null, _this);
};
