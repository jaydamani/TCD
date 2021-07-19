"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderate = void 0;
const _main_1 = require("@main");
const discord_js_1 = require("discord.js");
const modEmbed_1 = require("@structures/modEmbed");
const exempt_1 = require("@src/lib/Utils/moderation/exempt");
const { mod: { muteRoleID }, logs: { modLog } } = require('../../../config/guild.json');
const actionsList = {
    //warn is here in case something extra needs to be done. Like a warned role or probably some sort of cooldown
    warn: ({ mod, offender, reason }) => { },
    ban: ({ mod, offender, reason, time }) => {
        //using guild.members.ban so that offender can be banned 
        //even if he is not a member of the guild
        mod.guild.members.ban(offender, { reason: `banned by ${mod.displayName}(${mod.id}) with following reason : '${reason}'${time?.string}.` });
        if (time)
            delay(exempt_1.exempt, time.ms, { mod: mod.guild.me, reason: `Done by automod as the ban was only${time.string}`,
                offender, action: 'Unban' });
    },
    mute: ({ mod, offender, reason, time }, db) => {
        if (offender instanceof discord_js_1.GuildMember) {
            offender.roles.add(muteRoleID, `muted by ${mod.displayName}(${mod.id}) with following reason : '${reason}'${time?.string ?? ''}.`);
        }
        else
            db.prepare(`update roles set roleIDs = roleIDs || ',${muteRoleID}' where memberID = ${offender.id}`).run();
        if (time)
            setTimeout(exempt_1.exempt, time.ms);
    },
    kick: ({ mod, offender, reason }) => {
        offender.kick(`banned by ${mod.displayName}(${mod.id}) with following reason : '${reason}'.`);
    }
};
async function moderate(obj) {
    actionsList[obj.action](obj, _main_1.db);
    const c = await obj.mod.guild.channels.cache.get(modLog);
    const { lastInsertRowid } = _main_1.db
        .prepare(`insert into modsTable (offenderID,modID,reason,action,timeOfExemption) values (?,?,?,?,?,?)`)
        .run(obj.offender.id, obj.mod.id, obj.reason, obj.action, obj.time ? new Date(obj.time.ms) : null);
    obj.id = +lastInsertRowid;
    if (c instanceof discord_js_1.TextChannel)
        c.send(obj.offender.id, new modEmbed_1.modEmbed(obj));
}
exports.moderate = moderate;
