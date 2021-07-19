"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exempt = void 0;
const discord_js_1 = require("discord.js");
const modEmbed_1 = require("@structures/modEmbed");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
let { mod: { muteRoleID }, logs: { modLog } } = require('@config');
//exemption actions along with what is done for each one.
const actionsList = {
    Unban: ({ mod, offender, reason }) => {
        mod.guild.members.unban(offender, `unban by ${mod.displayName}(${mod.id}) for following reason : "${reason}"`);
    },
    Unmute: ({ mod, offender, reason }, db) => {
        if (offender instanceof discord_js_1.GuildMember)
            offender.roles.remove(muteRoleID, `unmute by ${mod.displayName} for following reason '${reason}'`);
        else
            db.prepare(`update roles set roleIDs = roleIDs || ',${muteRoleID}' where offenderID = ${offender.id} and roleIDs not like ${muteRoleID}`);
    }
};
async function exempt(obj) {
    //creating connection with db
    const db = new better_sqlite3_1.default('./modDB.db');
    //fetching info from db. 
    //Look at dbObj for expected output
    const dbObj = db.prepare(`select * from ${obj.action.substring(2)}sTable where offenderID = ${obj.offender.id} and status = 1`).get();
    //doing the "exemption"
    actionsList[obj.action](obj, db);
    //updating the db about it.
    db.prepare(`update modsTable set status = 0, reasonOfExemption = ?, modForExemption = ?,action = ? where ID = ${dbObj.ID}`)
        .run(obj.reason, obj.mod.id, obj.action.substring(2));
    //checking modLog
    if (!(modLog instanceof discord_js_1.TextChannel)) {
        const c = obj.mod.guild.channels.cache.get(modLog);
        if (c instanceof discord_js_1.TextChannel)
            modLog = c;
        else
            throw new Error('modLog not found. Check the id');
    }
    //sending a message to logs
    modLog.send({
        embed: new modEmbed_1.modEmbed(obj)
            .addField(`Mod responsible for punishment :`, `<@${dbObj.modID}> (${dbObj.modID})`)
            .addField(`Reason for punishment :`, dbObj.reason)
            .setTimestamp(new Date(dbObj.time))
            .setURL(dbObj.logURL)
    });
    db.close();
}
exports.exempt = exempt;
