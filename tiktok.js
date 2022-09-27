const fs = require("fs-extra"),
	axios = require("axios");
module.exports.config = {
	name: "tiktok",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Thiệu Trung Kiên",
	cooldowns: 5,
	description: "Tải video từ TikTok",
	commandCategory: "Media",
	usages: "tiktok [link]"
}, module.exports.run = async function ({
	api,
	event
}) {
	api.sendMessage("===TIKTOK CATEGORY===\n1.Info\n2.Search\n3.Download\n\nReply theo số thứ tự để chọn tính năng!", event.threadID, ((error, info) => {
		global.client.handleReply.push({
			name: this.config.name,
			messageID: info.messageID,
			author: event.senderID,
			type: "choose"
		})
	}))
}, module.exports.handleReply = async function ({
	api,
	event,
	handleReply
}) {
	switch (handleReply.type) {
		case "choose":
			switch (event.body) {
				case "1":
					return api.sendMessage("Reply tin nhắn này để nhập username!", event.threadID, ((error, info) => {
						global.client.handleReply.push({
							name: this.config.name,
							author: event.senderID,
							messageID: info.messageID,
							type: "info"
						})
					}), event.messageID);
				case "2":
					return api.sendMessage("Reply tin nhắn này để nhập từ khóa!", event.threadID, ((error, info) => {
						global.client.handleReply.push({
							name: this.config.name,
							author: event.senderID,
							messageID: info.messageID,
							type: "search",
							keyword: event.body
						})
					}), event.messsageID);
				case "3":
					return api.sendMessage("Reply tin nhắn này để nhập link video!", event.threadID, ((error, info) => {
						global.client.handleReply.push({
							name: this.config.name,
							author: event.senderID,
							messageID: info.messageID,
							type: "download",
							url: event.body
						})
					}), event.messageID);
				default:
					return api.sendMessage("Lựa chọn không hợp lệ!", event.threadID, event.messageID)
			}
		case "search":
			axios.get("https://www.tikwm.com/api/feed/search?keywords=" + event.body + "&count=30&cursor=10").then((res => {
				var arr = [];
				for (let i = 0; i < 6; i++) {
					arr.push({
						video_id: res.data.data.videos[i].video_id,
						title: res.data.data.videos[i].title,
						no_watermark: res.data.data.videos[i].play,
						duration: res.data.data.videos[i].duration
					})
				}
				let msg = arr.map(((item, number) => `[${number + 1}] - ID: ${item.video_id}\nTitle: ${item.title}\nDuration: ${item.duration}`)).join("\n\n");
				return api.sendMessage(msg, event.threadID, event.messageID)
			}));
			break;
		case "info": {
			const data = (await axios({
				method: "get",
				url: "https://tiktok.com/node/share/user/@" + event.body + "?aid=1988",
				headers: {
					"user-agent": "Thunder Client (https://www.thunderclient.com)",
					cookie: 'tt_csrf_token=y3PBNNUH-JY7LmYyUNs8VY3q0WBKF0pGze_E; __tea_cache_tokens_1988={"_type_":"default","user_unique_id":"7146956745427813890","timestamp":1664030552347}; csrf_session_id=2a68f9f68d02fb358f8e63b0a29fb293; ttwid=1|PbY6ZvfAsQ1ZSk7CkoTKReD3r1IyvpZESh3sp4aRq88|1664102192|28a15e14fb1295aa47f4e3d51c79d5501385500d6b46cd3e2922a66ad7581590; msToken=JG9kUYzpxPGxrOq37EqOu7kYWdIZEsD9f1oMFMaT5E09zf8TBmGwaVCiJT3cP9D6uscdMNsRY1JwQDJQg1aO_a7k5eMZvLTAnP109r1ISLQZNgvBEuI4KC4cNR2L7r5RqOYk-d5i211yLOxo; _ttp=2FG06njTH59zhJyQMorcpsvbBtY; _abck=AE42C8BEACEC344C9B2707B8253B780D~-1~YAAQbwqrcawksmuDAQAApE9weQi8SMo88nw+rY15tGq4ewEev72UCarv0YHyPNCWls63Ak8kExy3pZ61Dw0fQXHgi48Zc5cfT7dRkFfTqfgFupKq4J3ntvDlXwhdk7yE9bRHQLVtw3iKiW7vzK7QaUoaZ6SMwzbmYBv0NZKOjaOV+eAAXqQGrScao1TZ6cpP1/QnujBhTuNplpBG7X6z8a7qQgNnapnBV84FaMRIwdisxfyGLM5EkmRZi/1Nj/ca3sOcdYpqNkRiNv6gxZujdAeAgoWMjhx7ime/BBBzH1mZ4UXIakDz/eYHjc6yeWhMk5Ceiv3aysObOz+a0mngmBfF7q2Ol8pI0Pn3Pb5KIrRue5UAp3ria3yoz97xUaRwhxvAM6VmeoaZcg==~-1~-1~-1; ak_bmsc=28D9DF3826B3538CA4F8E1AD10D9AF0D~000000000000000000000000000000~YAAQbwqrca0ksmuDAQAApE9weRHEqUKt6POc4DbVzrfoLH8D8Oh9wMWE1cv+o5LTSZV+Rm0ex9tUUOpzDe7SanzXMoRIZYPskXhnMJV5jMgm8AYkVYLkQIIJavUyIg7rplltAqJ6sEjD3EtEKfb99ZQj8tvvjCvj//ODeE4L3c/K9eXXqdsmU30/vfSuZxfneErQ6cBifbmXzsCj+VH8s7BMRWgMa1ZuySZSmEQzyHN2YAsHR6KiVEYwzZZKcPJQFBMgUhUCAOnr4ppsqcjwRQ99ve+Pp5lgd0qMxRTO+XoEqDmoRJ7zSU66mf0vXCQdjS7/UxjUP9WXmIITx+sQMmcG46dcAe9hW6tYP//YlT/EqrIlyErn/mPmA5N2kIXTh3nkigsztsQ=; bm_sz=A4E147F26F07A21E33E35F795A247988~YAAQbwqrca8ksmuDAQAApE9weRHD569NgO7U7Who1B8p8CBCtKU6Lf/JQHhzFrUaPlcwmmxzeUTp75f700h39H9MAmw9rjr1bx/6Q6NIqPVtFiPU8olwKNeQCUiiD/kvl89a7AKSELOahWPhgddirr5vhb5gVvCPIIbMA9B0GjzTIF/lvpKLVhzib/ePuM96g1v/5zIqq3MC9y6S6v+ElZiAfTgL/KsGWS0y/PpzEL8g3K7ZUYojLy469ZXlQ1LpN5gd6riCjaK/C2qPcvN6+GFU1Ct7Ny/euZUYBA8Y+YJGRu4=~3422002~4600882; msToken=9HkS_7wvheO7ljlvoRYVEjg8pkfIsZHg7FW8V-1Zt-24L7cjEHSed4NseotC1OTZ1GPUsZBNEHppOAt5q7TAwB-wJHmle7T1axrGXznx2n2ZXE_cqGOmtveEJy6ahrXFuaVgHAZMFzfvmctX'
				}
			})).data;
			var id = data.userInfo.user.id,
				nickname = data.userInfo.user.nickname,
				uniqueID = data.userInfo.user.uniqueId,
				avatarLarger = data.userInfo.user.avatarLarger;
			const getImg = (await axios.get(avatarLarger, {
				responseType: "arraybuffer"
			})).data;
			return fs.writeFileSync(__dirname + "/cache/" + id + ".jpg", Buffer.from(getImg, "utf-8")), api.sendMessage({
				body: "ID : " + id + "\nNickname: " + nickname + "\nUniqueID: " + uniqueID + "\n",
				attachment: fs.createReadStream(__dirname + "/cache/" + id + ".jpg")
			}, event.threadID, (() => {
				fs.unlinkSync(__dirname + "/cache/" + id + ".jpg")
			}), event.messageID)
		}
		case "download": {
			axios.get("https://thieutrungkien.dev/tiktok?url=" + event.body).then((async res => {
				var uid = res.data.channel.uid,
					nickname = res.data.channel.nickname,
					title = res.data.video.title,
					no_watermark = res.data.video.no_watermark;
				const getVideo = (await axios.get(no_watermark, {
					responseType: "arraybuffer"
				})).data;
				return fs.writeFileSync(__dirname + "/cache/" + event.senderID + ".mp4", Buffer.from(getVideo, "utf-8")), api.sendMessage({
					body: `Uid: ${uid}\nNickname: ${nickname}\nTitle: ${title}`,
					attachment: fs.createReadStream(__dirname + "/cache/" + event.senderID + ".mp4")
				}, event.threadID, (() => {
					fs.unlinkSync(__dirname + "/cache/" + event.senderID + ".mp4")
				}))
			})).catch(err => api.sendMessage("Không tìm thấy video", event.threadID, event.messageID))
		}
	}
}
