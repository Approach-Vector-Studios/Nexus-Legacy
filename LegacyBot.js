/*


    Don't even bother with this code. Its so old and outdated you shouldn't even use this to make something new.

*/
// Here we set up all things the bot will use \\
const Discord = require('discord.js')
const client = new Discord.Client()
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const version = "v2.1" // Bot version
const BotID = "." // The bot ID
const firsthook = new Discord.WebhookClient("", "-") // Main AVS wbehook
const secondhook = new Discord.WebhookClient("", "-") // Fan server webhook
var Takinginput = true // Decides if the bot should be enabled by default or not 
const Systemmessage = "Running in emergency mode." // What will be shown under the playing status
const Prefix = "|" // What is used for commands
const MainID = "667367770899480576"
const FanID = "699803300702322699"
const DoSleep = true
var SystemName = "Console"
var SystemServer = 0
var Admins = ['282227463642415104'/* Debug */, '487746760530460674'/* Tdw */]
var Muted = []

// Here we will set up the basics like sending messages
function sendfunc(server,message,user) {
    console.log("A message is being sent to " + server + ". The author is " + user + ". Message: " + message)
    switch(server) {
        case 1:
            secondhook.send("***" + user + "*** : " + message)
            break;
        case 2:
            firsthook.send("***" + user + "*** : " + message)
            break
        case 0:
            firsthook.send("***" + user + "*** : " + message)
            secondhook.send("***" + user + "*** : " + message)
            break
        default: 
            console.error("Server not found")
            break
}}
function print(arg){console.log(arg)}
function execcommand(msg, target) {
    const messageArray = msg.content.split(' ');
    const command = messageArray[0];
    const args = messageArray.slice(1);
    Admins.forEach(element => {
        if(element == msg.author.id){
            print(msg.content)
            switch(command) {
                case Prefix+"sleepmode":
                    sleepmode()
                    minutes = 60
                    break
                case Prefix+"shutdown":
                    shutdown()
                    break
                case Prefix+"mute":
                    if(!msg.mentions.members.first()){
                        msg.reply("Please mention someone to mute them!")
                        return
                    }
                    const toMute = msg.mentions.members.first();
                    Muted.push(toMute.id)
                    print(toMute.id)
                    msg.reply("Muted " + "<@" + toMute.id + ">!")
                    break
                case Prefix+"unmute":
                    if(!msg.mentions.members.first()){
                        msg.reply("Please mention someone to unmute them!")
                        return
                    }
                    const toUnmute = msg.mentions.members.first();
                    Muted.forEach(element => {
                        if(element == toUnmute.id){
                            Muted.splice(Muted.indexOf(toUnmute.id),1);
                            msg.reply("I have unmuted " + "<@" + toUnmute.id + ">!" )
                            return
                        }
                        else{
                            msg.reply("I was unable to find that person on the mute list...")
                        }
                    });
                    break
                default:
                    msg.reply("Command not found!")
                    break
            }

        }
    });
}

function consoleinput() {
    print("Ready!")
    rl.question("", function(message) {
        switch (message){
            case "shutdown".toLowerCase():
                shutdown()
                consoleinput();
                break
            case "switchname".toLowerCase():
                print("Enter a new name")
                rl.question("", function(NewName) {
                    if(NewName.length !== 0){
                        SystemName = NewName
                    }
                    consoleinput();
                })
                break
            case "sleep".toLowerCase():
                timeleft = 60
                sleepmode();
                consoleinput();
                break
            case "switchserver".toLowerCase():
                print("Enter a server number. 0=all,1=main,2=fan")
                rl.question("", function(SwitchServerId) {
                    switch(SwitchServerId){
                        case "0":
                            SystemServer = 0
                            print("Set output to 0(All)")
                            consoleinput();
                            break
                        case "1":
                            SystemServer = 1
                            print("Set output to 1(Fan)")
                            consoleinput();
                            break
                        case "2":
                            SystemServer = 2
                            print("Set output to 2(Main)")
                            consoleinput();
                            break
                        default:
                            print("Enter a valid server please!")
                            consoleinput();
                            break
                    }
                })
            default:
                sendfunc(SystemServer,message,SystemName)
                consoleinput();
                break
        }
        
    })

}
function sleepmode(){ //Puts the bot to sleep
    if(Takinginput==true){
        sendfunc(0,":warning: The AVS CSR is going into sleep mode. It will reactivate when an message in sent in the main server.", "System")
        Takinginput = false
    }
}
function shutdown(){ // Shuts the bot down
    sendfunc(0,":warning: The AVS CSR is shutting down in about 15 seconds! :warning:", "System")
    client.user.setPresence({ activity: { name: 'Bot is preparing to shutdown!'}, status: 'dnd' })
    .then(console.log)
    .catch(console.error)
    console.clear();
    console.log("Bot is preparing to shut down!")
    setTimeout(() => {  
        client.user.setPresence({ activity: {name: 'Shutting down!' }, status: 'invisible'}) 
        .then(console.log)
        .catch(console.error)
        sendfunc(0,":warning: The bot has been shut down :warning:", "System")
      }, 15000);
    setTimeout(() => {  process.exit(1) }, 17000);
}

// Basic startup stuff
client.on('ready', () => { 
    client.user.setPresence({ activity: { name: Systemmessage + ' | ' + version }, status: 'Online' }) //Sets the bot to online and gives it the correct status
    .then(console.log)
    .catch(console.error);
    console.clear()
    console.log(`Logged in as ${client.user.tag}! AVS relay bot is online!`); //Gives a nice friendly message about the bot being online
    consoleinput() //Lets us execute commands via the console
    //sendfunc(0,"The bot has been restarted and is now listening for messages.","System")
})
// Mesage stuff
client.on('message', msg => {
    if(msg.guild == null){return} // Make sure we dont crash when someone DM's us
    if(msg.author.discriminator!==0000){
        if(msg.content.startsWith("|") && msg.content.charAt(1)!="|"){ //Check for commands
            var target = msg.mentions.users.first()
            execcommand(msg,target)
            return
        }
        var breaknext = false
        Muted.forEach(element => {
            if(msg.author.id == element){
                breaknext = true
            }
        });
        if(breaknext==true){
            return
        }
        if(msg.guild.id == MainID && msg.channel.name.toLowerCase() === 'cross-server-relay' && Takinginput && msg.author.id !== client.user.id && msg.author.discriminator !== "0000"){ //Execute for main server
            sendfunc(2,msg.content,msg.author.tag)
            minutes = 0
        }
        if(msg.guild.id == FanID && msg.channel.name.toLowerCase() === 'cross-server-relay' && Takinginput && msg.author.id !== client.user.id && msg.author.discriminator !== "0000"){ //Execute for main server
            sendfunc(1,msg.content,msg.author.tag)
            minutes = 0
        }
    }
})
// Here we start to check for attachments and get their link. Then we sent the links so images can get through the relay
client.on('message', msg => {
    if(msg.guild == null){return} // Make sure we dont crash when someone DM's us
    if(msg.author.discriminator!==0000){
        var breaknext = false
        Muted.forEach(element => {
            if(msg.author.id == element){
                breaknext = true
            }
        });
        if(msg.content == ""){return}
        if(breaknext==true){
            return
        }
        if(msg.guild.id == MainID && msg.channel.name.toLowerCase() === 'cross-server-relay' && Takinginput && msg.author.id !== client.user.id && msg.author.discriminator !== "0000"){ //Execute for main server
            if(msg.attachments){
                msg.attachments.forEach(function(attachment){
                    sendfunc(2,msg.author.tag + " : " + attachment.url,"System")
                })
            }
        }
        if(msg.guild.id == FanID && msg.channel.name.toLowerCase() === 'cross-server-relay' && Takinginput && msg.author.id !== client.user.id && msg.author.discriminator !== "0000"){ //Execute for main server
            if(msg.attachments){
                msg.attachments.forEach(function(attachment){
                    sendfunc(1,msg.author.tag + " : " + attachment.url,"System")
                })
            }
        }
    }
})

//Test code for a delay that locks the bot
var minutes = 0
const timer = 1 * 60 * 1000
setInterval(function(){
    if(Takinginput==true){
        timeleft = 60-minutes
        //console.log("Time left until we go to sleep: " + timeleft)
        minutes = minutes + 1
    }
}, timer)

setInterval(function(){
    if(minutes == 30 && DoSleep == true){sendfunc(0,"The AVS relay will go into sleep mode in 30 minutes if no one says anything", "System")}
    if(minutes == 60 && DoSleep == true){sleepmode()}
},timer)
client.on('message', msg => {
    if(Takinginput==false && msg.content !== "|sleepmode"){
        if(msg.guild.id == MainID && msg.channel.name.toLowerCase() === 'cross-server-relay' && Takinginput == false && msg.author.id !== client.user.id && msg.author.discriminator !== "0000"){ //Execute for main server
            sendfunc(0,"The bot has been reactivated!", "System")
            sendfunc(2,msg.content,msg.author.tag)
            Takinginput = true
            minutes = 0
        }
    }
})

//Log in the bot
client.login(BotID)