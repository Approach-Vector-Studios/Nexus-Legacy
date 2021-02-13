/*

THIS IS AN VERY OLD NodeJS VERSION OF THE NEXUS.

I highly reccomend against using this for any kind of your work, as I made this when I wasn't the best at coding.
I also won't be updating this is the case that it stops working or that modules stop existing.

~DebugOk

*/

// Require's
const Discord = require('discord.js');
const fs = require('fs')
const Shelljs = require("shelljs");
const stdin = process.openStdin();
const readline = require('readline');
const path = require('path')
const _ = require('underscore')
const util = require('util')
const { v4: uuidv4, NIL } = require('uuid');
const cluster = require('cluster');
const http = require('http');

// Data
const client = new Discord.Client();
const Token = ""
const Prefix = "$"
const Admins = []
const LoadAnim = "<a:Loading:751858268418080788>"
const SendReady = false //true
const SendLargeErr = false
const SendSmallErr = false //true
const KillVideo = false
const fileName = './lastsent.json';
const file = require(fileName);

var CurrentVersion
var HasSentUpdate = false
var Changelog

var StartDate = Date.now()
StartDate = new Date(StartDate)
StartDate = `${StartDate.getDate()}-${StartDate.getMonth() + 1}-${StartDate.getFullYear()}`
var IsVotingOff = false
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

fs.readFile("./Version.txt", 'utf8', function(err, data) {
    if (err) throw err;
    CurrentVersion = data
});
client.login(Token);

// Error handler
process.on('uncaughtException', (err) => {
    console.log(err.stack)
    //fs.writeFile(`./Logs/${uuidv4()}.txt`,err.stack, function (err) {if (err) throw err;})
    setTimeout(function () {
        Shelljs.exec("node CrashHandler.js")
        process.exit();
    }, 5000);
});
process.on('unhandledRejection', (err) => {
    console.log(err.stack)
    //fs.writeFile(`./Logs/${uuidv4()}.txt`,err.stack, function (err) {if (err) throw err;})
    setTimeout(function () {
        Shelljs.exec("node CrashHandler.js")
        process.exit();
    }, 5000);
});

function ReadFile(File){
    fs.readFile(File, 'utf8', function(err, data) {
        if (err) throw err;
        return data
    });
}
function SendToServer(Server,Text,Username,Avatar) {
    console.log(`A message is being sent to server ${Server}. The contents are "${Text}".`)
    switch(Server) {
        case 1:
            if(Username&&Avatar){

            }
            else if(Username){

            }
            else{

            }
            default:
                console.warn("An error has occured and I was unable to process a message")
                break;
    }
}

/*function UpdateTeamInfo(){
    const TeamInfo = client.channels.cache.get("667725473186447360")
    TeamInfo.send("Reading files...").then((msg) => {
        var Projects = fs.readFileSync('./TeamInfo/Projects.txt');
        var ProductionTeam = fs.readFileSync('./TeamInfo/ProductionTeam.txt');
        var Cast = fs.readFileSync('./TeamInfo/Cast.txt');
        var TimeZones = JSON.parse(fs.readFileSync('./TeamInfo/TimeZones.json'));
        fs.readFile("./Version.txt", 'utf8', function(err, data) {
            if (err) throw err;
            CurrentVersion = data
        });
        msg.edit(`${Projects},${ProductionTeam},${Cast}`)
    });
}*/

function Print(Text) {console.info(Text)}
function print(Text) {Print(Text)}

function SendToID(channelID,Message) {
    client.channels.cache.get(channelID).send(Message).then((msg) => {return(msg)})
}

function Restart() {
    rl.close()
    stdin.removeAllListeners('data')
    setTimeout(function () {
        process.on("exit", function () {
            Shelljs.exec("node Bot.js")
        });
        process.exit();
    }, 5000);
}
function IsAdmin(ID) {
    return Admins.includes(ID)
}
function reverseString(str) {
    var splitString = str.split("");
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join("");
    return joinArray;
}
function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}
function getMostRecentFileName(dir) {
    var files = fs.readdirSync(dir);

    return _.max(files, function (f) {
        var fullpath = path.join(dir, f);

        return fs.statSync(fullpath).ctime;
    });
}
function CheckVersion() {
    fs.readFile("./Version.txt", 'utf8', function(err, data) {
        if (err) throw err;
        if (data !== CurrentVersion && HasSentUpdate == false) {
            HasSentUpdate = true
            console.warn("The running version doesn't match Version.txt. An message has been sent to inform users.")
            SendToServer(0,`${LoadAnim} The bot is out of date and will be restarting. Version ${CurrentVersion} is running but ${data} is ready to be used.`)
            Restart()
        }
    });
}
setInterval(CheckVersion, 15000);

function SetPresence(Text,Status) {
    client.user.setPresence({ activity: { name: Text }, status: Status })
    .then(console.log)
    .catch(console.error);
}

function UpdateStatus() {
    let rawdata = fs.readFileSync('Status.json');
    let Status = JSON.parse(rawdata);
    if (Status.ShowVersion == true) {
        SetPresence(`${CurrentVersion} | ${Status.Text}`,Status.StatusType)
    } else {
        SetPresence(Status.Text,Status.StatusType)
    }
    
}

function userCount(Guild) {
    //return "Depricated Function"
    if (Guild){
        var Count = 0
        Guild.roles.cache.get('667367770899480576').members.each(m=>{
            Count = Count + 1
        })
        return Count
    } else {return "Err"}
}

function updateLast(Message) {
    var user = Message.author.username
    var sentAt = Message.createdAt
    var usercount = userCount(Message.guild)
    if(usercount=="Err"){return}
    //console.log(`User:${user},SentAt:${sentAt},userCount:${usercount}`)
    delete file['UserCount'];
    file[user] = sentAt
    file.UserCount = usercount

    fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
        if (err) return console.log(err);
        //console.log(JSON.stringify(file));
        //console.log('writing to ' + fileName);
    });
}

// Read console
stdin.addListener("data", function(Data) {
    var DataString = Data.toString().trim()
    var DataString = DataString.toLowerCase()
    //console.log(String)
    switch(DataString){
        case "fakemessage":
            print("Please enter the arguments 'server,name,text,avatar'\n")
            rl.question("", function(answer) {
                var Arr = answer.split(',');
                if(Arr.length !== 3){print("Invalid input!");return} else if(Arr.length==4){
                    SendToServer(Number(Arr[0]),Arr[2],Arr[1],Arr[4])
                    return
                }
                SendToServer(Number(Arr[0]),Arr[2],Arr[1])
                
            })
            return
        case "rfakemessage":
            print("Please enter the arguments 'server,name,text,avatar'\n")
            rl.question("", function(answer) {
                var Arr = answer.split(',');
                if(Arr.length !== 3){print("Invalid input!");return} else if(Arr.length==4){
                    SendToServer(Number(Arr[0]),reverseString(Arr[2]),reverseString(Arr[1]),Arr[3])
                    return
                }
                SendToServer(Number(Arr[0]),reverseString(Arr[2]),reverseString(Arr[1]))
            })
            return
        case "restart":
            Restart()
            return
        case '"^C"':
            process.exit()
            return
    }
});

// Client events
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}! Currently running version ${CurrentVersion} as worker ${process.pid}`);
    if(SendReady==true){SendToServer(0,`Logged in as ${client.user.tag}! Currently running version ${CurrentVersion} as worker ${process.pid}`)}
    UpdateStatus()
    UpdateTeamInfo()
    //setInterval(UpdateStatus, 30000);
});

client.on('message', msg => {
    if(msg.guild == null){return} // Make sure we dont crash when someone DM's us
    if(msg.author.discriminator == 0000 | msg.author.id == client.user.id){return} // Stop bots/deleted users/webhooks from yeeting us into a loop
    if (msg.content.slice(0,1) == Prefix) {
        var Command = msg.content.toLowerCase()
        var cmdargument = NIL
        if(Command.indexOf(" ")<=0){
            Command = Command.substring(1)
        } else {
            Command = Command.substring(1,Command.indexOf(" "))
        }
        if(!Command){var Command = Command.substring(1)}
        var user = msg.mentions.users.first();
        if (user) {
            var member = msg.guild.member(user);
            var mentiontag = user.tag
        }
        msg.delete({timeout:100,reason:"Command message removed"})

        if(msg.content.indexOf("-")>1){
            if(IsAdmin(msg.author.id)){
                //print(msg.content.slice(msg.content.indexOf("-")))
                cmdargument = msg.content.slice(msg.content.indexOf("-"))
                print(`Running command "${Command}" with argument(s) "${cmdargument}"`)
            } else{
                msg.reply("You must be an admin to use command arguments.").then(msg=>{
                    msg.delete({timeout:1000,reason:"Argument error message"})
                })
            }
        }else{
            Print(`Running command "${Command}"`)
        }

        switch(Command) {
            // System/Debugging
            case "ping":
                msg.reply(`Pong! ${Math.round(client.ws.ping)}ms.`)
                return
            case "error":
                if(IsAdmin(msg.author.id)){
                    NoIDontWantToDie
                } else {
                    msg.reply("You must be an admin to use this command")
                }
                return
            case "updateteamtest":
                if(IsAdmin(msg.author.id)){
                    UpdateTeamInfo()
                } else {
                    msg.reply("You must be an admin to use this command")
                }
                return
            case "getlastmessages":
                if(IsAdmin(msg.author.id)){
                    var String = ""
                    for(var attributename in file){
                        if(attributename === "UserCount") {
                            String = String + `-${file[attributename]} unlogged.`
                        } else {
                            String = String + `+${attributename}: ${file[attributename]}\n\n`
                        }
                    }
                    if(String.length < 2048){
                        const Embed = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('Last messages')
                            .setDescription(`\`\`\`diff\n${String}\`\`\``)
                            .setTimestamp()
                            .setFooter(`Ping: ${Math.round(client.ws.ping)}ms - All times are displayed in GMT+0000 (Coordinated Universal Time)`);
                        msg.reply(Embed)
                    }else{
                        fs.writeFile(`./LastMessages.txt`,String, function (err) {if (err) throw err;})
                        msg.reply("I'm sorry, but I cant fit everything into an embed. Take this txt file instead.", { files: ["./LastMessages.txt"] })
                    }
                } else {
                    msg.reply("You must be an admin to use this command")
                }
                return
            case "kill":
                if(IsAdmin(msg.author.id)){
                    setPresence("Shutting down","offline")
                    if(KillVideo){
                        Hook1.send("The bot has been terminated for unknown reasons.", { files: ["./Memes/KillVideo.mp4"] });
                        Hook2.send("The bot has been terminated for unknown reasons.", { files: ["./Memes/KillVideo.mp4"] });
                    } else{
                        SendToServer(0,"The bot has been terminated for unknown reasons.")
                    }
                        setTimeout(function () {
                        console.log("Bot has been terminated!")
                        process.exit();
                    }, 1000);
                } else {
                    msg.reply("You must be an admin to use this command")
                }
                return
            case "changelog":
                Changelog = fs.readFileSync("Changelog.txt", 'utf8');
                let MaxSize = 2048 - `Current version: ${CurrentVersion}.`.length
                let ChangeSize = `${Changelog}`.length
                if (ChangeSize < MaxSize) {
                    const Embed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Changelog')
                        .setDescription(`Current version: ${CurrentVersion}. \`\`\`diff\n${Changelog}\`\`\``)
                        .setTimestamp()
                        .setFooter(`Ping: ${Math.round(client.ws.ping)}ms`);
                    msg.reply(Embed)
                } else {
                    msg.reply("An error has occured. The max length of the changelog has been reached. Please tell DebugOk that she needs to shorten the changelog.")
                }
                return
            case "restart":
                if(IsAdmin(msg.author.id)){
                    SendToServer(0,LoadAnim+"The bot will be restarting shortly. It will not react to any input while its restarting.")
                    Restart()
                } else {
                    msg.reply("You must be an admin to use this command")
                }
                return
            case "help":
                Commands = fs.readFileSync("Commands.txt", 'utf8');
                const Embed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Changelog')
                        .setDescription(`${Commands}`)
                        .setTimestamp()
                        .setFooter(`Ping: ${Math.round(client.ws.ping)}ms`);
                msg.reply(Embed)
                return
            case "voteoff":
                if(IsVotingOff!==true&&member){
                    IsVotingOff = true
                    SendToServer(0,`**Pink** : What?`)
                    SendToServer(0,`**Cyan** : Who`)
                    SendToServer(0,`**Red** : ${mentiontag} looking kinda sus`)
                    SendToServer(0,`**Cyan** : ${mentiontag}?`)
                    SendToServer(0,`**Red** : Yes`)
                    SendToServer(0,`Pink has Voted.\nCyan has voted.\nRed has voted.\nPurple has voted.\nLime has voted.`)
                    if(cmdargument==NIL){
                        if(Math.random() < 0.8){SendToServer(0,`${mentiontag} was not The Imposter.\n1 Imposter remains.`)}
                        else{SendToServer(0,`${mentiontag} was The Imposter.\n0 Imposter remains.`)}
                    } else if(cmdargument=="-f imposter"){
                        SendToServer(0,`${mentiontag} was The Imposter.\n0 Imposter remains.`)
                    } else if(cmdargument=="-f crewmate"){
                        SendToServer(0,`${mentiontag} was not The Imposter.\n1 Imposter remains.`)
                    }
                } else{msg.reply("This command is not yet off cooldown/you have not mentioned anyone.")}
                IsVotingOff = false
                return
            case "crashlog":
                msg.reply("Saving logs broke the bot so this is disabled :/")
                return
                if(IsAdmin(msg.author.id)){
                    var CrashLog = getMostRecentFileName("./Logs")
                    if(CrashLog){
                        CrashReport = fs.readFileSync(`./Logs/${CrashLog}`, 'utf8');
                        const Embed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Crash Report')
                        .setDescription(`Displaying file './Logs/${CrashLog}'. \`\`\`${CrashReport}\`\`\``)
                        .setTimestamp()
                        .setFooter(`Ping: ${Math.round(client.ws.ping)}ms`);
                    msg.reply(Embed)
                    }
                } else {
                    msg.reply("You must be an admin to use this command")
                }
                return
            case "updatestatus":
                if(IsAdmin(msg.author.id)){
                    msg.reply(`${LoadAnim}Please wait while I read the Status file and apply the update.`).then((msg) => {
                        UpdateStatus()
                        msg.edit("The status has been applied!")
                        msg.delete({timeout: 5000})
                    });
                } else {
                    msg.reply("You must be an admin to use this command")
                }
                return
            default:
                msg.reply("That is not a valid command!")
                return
        }
    }
    if(msg.content.slice(0,1) !== Prefix && msg.channel.id == Channel1 | msg.channel.id == Channel2) {
        switch(msg.channel.id) {
            case Channel1:
                //SendToServer(2,`**${msg.author.tag}** : ${msg.content}`)
                if(msg.content.length > 0){SendToServer(2,msg.content,msg.author.tag,msg.author.avatarURL())}
                if(msg.attachments){
                    msg.attachments.forEach(function(attachment){
                        if(attachment.url.length>5){SendToServer(2,attachment.url,msg.author.tag,msg.author.avatarURL())}
                    })
                }
                break;
            case Channel2:
                //SendToServer(1,`**${msg.author.tag}** : ${msg.content}`)
                if(msg.content.length > 0){SendToServer(1,msg.content,msg.author.tag,msg.author.avatarURL())}
                if(msg.attachments){
                    msg.attachments.forEach(function(attachment){
                        if(attachment.url.length>5){SendToServer(1,attachment.url,msg.author.tag,msg.author.avatarURL())}
                    })
                }
                break;
        }
    }
});
// Eval
client.on("message", msg => {
    const args = msg.content.split(" ").slice(1);
   
    if (msg.content.startsWith("djs!eval")) {
      if(IsAdmin(msg.author.id) !== true) return;
      try {
        const code = args.join(" ");
        let evaled = eval(code);
   
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        if (evaled.length > 1800) {
            fs.writeFile(`./eval.txt`,clean(evaled), function (err) {if (err) throw err;})
            msg.channel.send("Eval too long, sending as txt instead", {files: ["./eval.txt"]});
        } else {
        msg.channel.send(clean(evaled), {code:"xl"});
        }
      } catch (err) {
        msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
    }
  });
// DM suggestion and UpdateLast
client.on("message", msg => {
    if(msg.guild.id == 667367770899480576 && !msg.author.bot){
        lastMsg = msg
        updateLast(msg)
    }
    if (msg.channel.type == "dm" && msg.author.id !== client.user.id) {
        client.users.fetch('282227463642415104').then((user) => {
            user.send(`${msg.author.tag} has made a suggestion. It is the following: "${msg.content}"`);
        });
    }
});