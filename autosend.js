"use strict";
var fs = require("fs-extra"),
	axios = require("axios");
module.exports.config = {
	name: "autosend",
	version: "1.0.0",
	credits: "Thiệu Trung Kiên",
	hasPermssion: 1,
	description: "Tự động gửi tin nhắn theo thời gian!",
	usages: "autosend",
	commandCategory: "Nhóm",
	cooldowns: 0
}, module.exports.onLoad = async function({ api }) {
	var time = [];
	/* 
	    Bỏ trống nếu muốn gửi liên tục mỗi tiếng!
	    Nếu muốn gửi theo từng giờ riêng biệt vui lòng nhâp theo định dạng sau:
	    time: ["10:01:02"] // 10 giờ 1 phút 2 giây
	    */
	if (0 == time.length)
		for (var i = 0; i < 24; i++) time.push(i + ":00:00");
	for (;;) {
		var date = (new Date).toLocaleTimeString("vi-VN", {
			timeZone: "Asia/Ho_Chi_Minh"
		});
		time.find((i => i == date)) && axios.get("https://girl.demngayyeu.repl.co").then((function(res) {
			axios.get(res.data.data, {
				responseType: "arraybuffer"
			}).then((async function(img) {
				fs.writeFileSync(__dirname + "/cache/autosend.jpg", Buffer.from(img.data, "utf-8"));
				var dataCadao = (await axios.get("https://manhkhac.github.io/data/json/cadaovn.json")).data.data,
					values = Object.values(dataCadao),
					rdCadao = values[Math.floor(Math.random() * values.length)];
				global.data.allThreadID.forEach((async function(threadID) {
					isNaN(threadID) || (api.sendMessage({
						body: `Đây là tin nhắn tự động!\n\nCa dao : ${rdCadao}\n\nThời gian : ${date}\n\nChúc các bạn một ngày tốt lành!`,
						attachment: fs.createReadStream(__dirname + "/cache/autosend.jpg")
					}, threadID, ((error, info) => {})), await new Promise((resolve => setTimeout(resolve, 500))))
				}))
			}))
		})), await new Promise((resolve => setTimeout(resolve, 1e3)))
	}
}, module.exports.run =  function({}) {};
