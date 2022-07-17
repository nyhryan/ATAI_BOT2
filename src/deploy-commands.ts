import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

import fs = require('node:fs');
import path = require('node:path');

import 'dotenv/config';

const TOKEN = process.env.TOKEN ?? 'token';
const APP_ID = process.env.APP_ID ?? 'app_id';
const GUILD_ID = process.env.GUILD_ID ?? 'guild_id';

if (TOKEN === 'token' || APP_ID === 'app_id' || GUILD_ID === 'guild_id') {
	throw new Error('check your .env variables!');
}

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({version: '10'}).setToken(TOKEN);

rest.put(Routes.applicationGuildCommands(APP_ID, GUILD_ID), { body: commands })
.then(() => { console.log('Successfully registered application commands.'); })
.catch(console.error);