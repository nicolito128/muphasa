export default class Config {
	static readonly token = process.env.BOT_TOKEN || "";
	static readonly owner = process.env.BOT_OWNER || "";
	static readonly prefix = 'mu.';
};