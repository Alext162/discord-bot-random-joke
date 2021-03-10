require("dotenv").config();
const Discord = require("discord.js");
const bot = new Discord.Client();
const { TOKEN, NASA_API_KEY } = process.env;
const https = require("https");

bot.login(TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", (msg) => {
  switch (msg.content) {
    case "!joke":
      https
        .get("https://official-joke-api.appspot.com/jokes/random", (resp) => {
          let data = "";
          // A chunk of data has been received.
          resp.on("data", (chunk) => {
            data += chunk;
          });
          // The whole response has been received. Print out the result.
          resp.on("end", () => {
            msg.reply(JSON.parse(data).setup);
            setTimeout(punchline, 7000);

            function punchline() {
              msg.reply(JSON.parse(data).punchline);
            }
          });
        })
        .on("error", (err) => {
          msg.reply("Error: " + err.message);
        });
      break;
    case "!kick":
      msg.reply("I can never be kicked");
      break;
    case "!flip":
      let result = Math.random();
      if (result < 0.5) {
        msg.reply("https://giphy.com/gifs/7QKFAfwBiTVgALZ0lo");
      } else {
        msg.reply("https://giphy.com/gifs/F7WI2Bq2AAjrszdqT5");
      }
      break;
    case "!apod":
      https
        .get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`, (resp) => {
          let data = "";
          // A chunk of data has been received.
          resp.on("data", (chunk) => {
            data += chunk;
          });
          // The whole response has been received. Print out the result.
          resp.on("end", () => {
            console.log(data);
            const { date, copyright, explanation, url } = JSON.parse(data);
            let reply = `\n Date: ${date} \n Copyright: ${copyright} \n Description: ${explanation} \n URL: ${url} `;

            msg.reply(reply);
          });
        })
        .on("error", (err) => {
          msg.reply("Error: " + err.message);
        });
      break;
  }
});
