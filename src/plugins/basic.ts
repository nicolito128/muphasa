'use strict';

export const commands: Types.ICommands = {
    test({message, user, targets, cmd}) {
        message.reply('test')
    }
}