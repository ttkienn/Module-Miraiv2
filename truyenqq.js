function _asyncToGenerator(fn) {
    return function () {
        var gen = fn.apply(this, arguments);
        return new Promise(function (resolve, reject) {
            function step(key, arg) {
                try {
                    var info = gen[key](arg);
                    var value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                if (info.done) {
                    resolve(value);
                } else {
                    return Promise.resolve(value).then(function (value) {
                        return step("next", value);
                    }, function (err) {
                        return step("throw", err);
                    });
                }
            }
            return step("next");
        });
    };
}

var axios = require("axios"),
    fs = require("fs-extra"),
    baseURL = 'https://thieutrungkien.dev/';
module.exports.config = {
    name: "truyenqq",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Thiệu Trung Kiên",
    description: "Xem truyện online",
    commandCategory: "Truyện",
    usages: "truyenqq [tên truyện]",
    cooldowns: 5
};
module.exports.onLoad = _asyncToGenerator(function* () {
    fs.existsSync(__dirname + "/truyenqq") || fs.mkdirSync(__dirname + "/truyenqq", {
        recursive: !0
    });
});
module.exports.run = (() => {
    var ref = _asyncToGenerator(function* ({
        api,
        event,
        args
    }) {
        var _this = this;

        var data = [],
            images = [],
            path = [];
        if (!args[0]) {
            axios({
                method: 'GET',
                url: baseURL + 'truyenqq/home',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36'
                }
            }).then((() => {
                var ref = _asyncToGenerator(function* (res) {
                    res.data.forEach((() => {
                        var ref = _asyncToGenerator(function* (item, element) {
                            if (element >= 6) return;
                            data.push({
                                title: item.name,
                                url: item.url,
                                time_ago: item.time_ago,
                                images: item.images
                            });
                        });

                        return function (_x3, _x4) {
                            return ref.apply(this, arguments);
                        };
                    })());
                    for (let i = 0; i < data.length; i++) {
                        const res = (yield axios.get(data[i].images, {
                            responseType: 'arraybuffer'
                        })).data;
                        fs.writeFileSync(__dirname + `/truyenqq/${i}_${event.senderID}.png`, Buffer.from(res, 'utf-8'));
                        images.push(fs.createReadStream(__dirname + `/truyenqq/${i}_${event.senderID}.png`));
                        path.push(__dirname + `/truyenqq/${i}_${event.senderID}.png`);
                    }
                    let msg = data.map(function (item) {
                        return `📖 Name: ${item.title}\n📅 Time: ${item.time_ago}\n`;
                    }).join('\n\n');
                    return api.sendMessage({
                        body: `Danh sách các truyện mới cập nhật\n${msg}\n\nReply tin nhắn này theo số thứ tự để đọc truyện!`,
                        attachment: images
                    }, event.threadID, function (err, info) {
                        for (u in path) fs.unlinkSync(path[u]);
                        global.client.handleReply.push({
                            name: _this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "reply",
                            data: data
                        });
                    });
                });

                return function (_x2) {
                    return ref.apply(this, arguments);
                };
            })());
        } else {
            axios({
                method: 'GET',
                url: baseURL + 'truyenqq/search',
                params: {
                    query: args.join(' ')
                },
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36'
                }
            }).then((() => {
                var ref = _asyncToGenerator(function* (res) {
                    res.data.data.forEach((() => {
                        var ref = _asyncToGenerator(function* (item, element) {
                            if (element >= 6) return;
                            data.push({
                                title: item.name,
                                url: item.url,
                                time_ago: item.time_ago,
                                images: item.images
                            });
                        });

                        return function (_x6, _x7) {
                            return ref.apply(this, arguments);
                        };
                    })());
                    for (let i = 0; i < data.length; i++) {
                        const res = (yield axios.get(data[i].images, {
                            responseType: 'arraybuffer'
                        })).data;
                        fs.writeFileSync(__dirname + `/truyenqq/${i}_${event.senderID}.png`, Buffer.from(res, 'utf-8'));
                        images.push(fs.createReadStream(__dirname + `/truyenqq/${i}_${event.senderID}.png`));
                        path.push(__dirname + `/truyenqq/${i}_${event.senderID}.png`);
                    }
                    let msg = data.map(function (item) {
                        return `📖 Name: ${item.title}\n📅 Time: ${item.time_ago}\n`;
                    }).join('\n\n');
                    return api.sendMessage({
                        body: `Kết quả tìm kiếm!\n${msg}\n\nReply tin nhắn này theo số thứ tự để đọc truyện!`,
                        attachment: images
                    }, event.threadID, function (err, info) {
                        for (u in path) fs.unlinkSync(path[u]);
                        global.client.handleReply.push({
                            name: _this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "reply",
                            data: data
                        });
                    });
                });

                return function (_x5) {
                    return ref.apply(this, arguments);
                };
            })());
        }
    });

    return function (_x) {
        return ref.apply(this, arguments);
    };
})();
module.exports.handleReply = (() => {
    var ref = _asyncToGenerator(function* ({
        api,
        event,
        handleReply
    }) {
        var _this2 = this;

        if (handleReply.author != event.senderID) return api.sendMessage('Cút', event.threadID, event.messageID);
        switch (handleReply.type) {
            case "reply": {
                axios({
                    method: 'GET',
                    url: baseURL + 'truyenqq/details',
                    params: {
                        url: handleReply.data[event.body - 1].url
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36'
                    }
                }).then((() => {
                    var ref = _asyncToGenerator(function* (res) {
                        var chapter = [];
                        var name = res.data.name,
                            author = res.data.author,
                            status = res.data.status,
                            description = res.data.descriptions,
                            chapters = res.data.chapters,
                            images = res.data.images;
                        var genres = res.data.genres.map(function (item) {
                            return item;
                        }).join(', ');
                        var chapters = res.data.chapters.map(function (item) {
                            chapter.push(item);
                        });
                        var getImg = (yield axios.get(images, {
                            responseType: 'arraybuffer'
                        })).data;
                        fs.writeFileSync(__dirname + `/truyenqq/details_${event.senderID}.png`, Buffer.from(getImg, 'utf-8'));
                        var msg = `📖 Tên truyện: ${name}\n👨‍💻 Tác giả: ${author}\n📅 Cập nhật: ${status}\n📚 Thể loại: ${genres}\n📝 Nội dung: ${description}\n\nTruyện đang có ${chapter.length} chương!\n\nReply tin nhắn này theo số thứ tự chương để đọc truyện!`;
                        console.log(chapters.length);
                        return api.sendMessage({
                            body: msg,
                            attachment: fs.createReadStream(__dirname + `/truyenqq/details_${event.senderID}.png`)
                        }, event.threadID, function (error, info) {
                            fs.unlinkSync(__dirname + `/truyenqq/details_${event.senderID}.png`);
                            global.client.handleReply.push({
                                name: _this2.config.name,
                                messageID: info.messageID,
                                author: event.senderID,
                                type: "read",
                                data_old: handleReply.data,
                                data: chapter
                            });
                        });
                    });

                    return function (_x9) {
                        return ref.apply(this, arguments);
                    };
                })());
            }
                break;
            case "read": {
                "->" == event.body ? (chap = handleReply.chap + 1, api.unsendMessage(handleReply.messageID)) : "<-" == event.body ? (chap = handleReply.chap - 1, api.unsendMessage(handleReply.messageID)) : chap = event.body - 1;
                console.log(handleReply.data[parseInt(chap)]);
                axios({
                    method: 'GET',
                    url: baseURL + 'truyenqq/getChapters',
                    params: {
                        url: handleReply.data[parseInt(chap)]
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36'
                    }
                }).then((() => {
                    var ref = _asyncToGenerator(function* (res) {
                        console.log(res.data);
                        var arr = [];
                        for (let i = 0; i < res.data.length; i++) {
                            var getImg = (yield axios.get(res.data[i], {
                                headers: {
                                    referer: 'https://truyenqqpro.com/'
                                },
                                responseType: 'arraybuffer'
                            })).data;
                            fs.writeFileSync(__dirname + `/truyenqq/read_${i}_${event.senderID}.png`, Buffer.from(getImg, 'utf-8'));
                            arr.push(fs.createReadStream(__dirname + `/truyenqq/read_${i}_${event.senderID}.png`));
                            if (arr.length == 10 || i + 1 == res.data.length) {
                                yield new Promise(function (resolve) {
                                    return api.sendMessage({
                                        body: `Chương ${chap + 1} của truyện ${handleReply.data_old[0].title}\n\nReply tin nhắn này theo số thứ tự chương để đọc truyện!\n\nReply "<-" để đọc chương trước\nReply "->" để đọc chương sau`,
                                        attachment: arr
                                    }, event.threadID, function (error, info) {
                                        arr.splice(0, arr.length);
                                        global.client.handleReply.push({
                                            name: _this2.config.name,
                                            messageID: info.messageID,
                                            author: event.senderID,
                                            type: "read",
                                            data_old: handleReply.data_old,
                                            data: handleReply.data,
                                            chap: parseInt(chap)
                                        });
                                        resolve();
                                    });
                                });
                            }
                        }
                    });

                    return function (_x10) {
                        return ref.apply(this, arguments);
                    };
                })());
            }
        }
    });

    return function (_x8) {
        return ref.apply(this, arguments);
    };
})();
