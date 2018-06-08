let http = require("http");
let fs = require("fs");
let cheerio = require("cheerio");
let request = require("request");
let url = "http://www.gamersky.com/"; //试着爬取游民星空中的jpg图片

function fetchPage(x) {
    startRequest(x);
}

function startRequest(x) {
    http.get(x, function (res) {    //进行http请求，获取游民星空的整个网页。
        let html = "";
        res.setEncoding('utf-8');
        res.on("data", function (chunk) {  //接受到数据之后，把数据中的内容保存到res中
            html += chunk;
        });
        res.on("end", function () { //网页保存完毕之后，开始对网页就进行解析。
            let $ = cheerio.load(html);
            saveImg($);            //调用保存图片的函数
        })
    });
}

function saveImg($) {
    $('img').each(function (index, item) {
        let imgSrc = $(this).attr('src');
        if (imgSrc !== undefined) {
            let pictureFormat = imgSrc.substring(imgSrc.lastIndexOf('.') + 1, imgSrc.length);
            if (pictureFormat === 'jpg') {

                let file_Name = imgSrc.substring(imgSrc.lastIndexOf("/") + 1, imgSrc.length);
                let writeStream = fs.createWriteStream('./images/' + file_Name, {autoClose: true});
                request.head(imgSrc, function (err, res, body) {
                    if (err) {
                        console.log("失败了");
                    }
                });
                try {
                    request(imgSrc).pipe(writeStream);
                    writeStream.on("finish", function () {
                        console.log("图片抓取成功");
                    });
                }
                catch (er) {
                    console.log("Invalid URL");
                }
            }

        }
    }
);
}

fetchPage(url);


