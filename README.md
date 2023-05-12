## Description
Simple proof of concept of a Discord bot connecting to 42 Intra API to manage roles on a Discord server.

## Configuration
Create app/config.json
```
{
	"clientId": "<42 API Application UID>",
	"clientSecret": "<42 API Application SECRET>",
	"clientRedirect": "<42 API Application REDIRECT URI>"
}
```
Create bot/config.json
```
{
	"token": "<Discord Bot Token>",
	"clientId": "<Discord Application ID>",
	"guildId": "<Server ID>",
	"segmentationSlayers": "<Role ID>",
	"kernelKamikazes": "<Role ID>",
	"unixUnicorns": "<Role ID>",
	"bugBusters": "<Role ID>"
}
```

## How to use
Install and run nest.js backend app
```
# Go into the app directory
$ cd app

# Install dependencies
$ npm install

# Run the app
$ npm run start
```
Install and run discord.js bot app
```
# Go into the bot directory
$ cd bot

# Install dependencies
$ npm install

# Deploy slash commands to server
$ node deploy-commands.js

# Run the app
$ node .
```