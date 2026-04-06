import siteConfig from "./src/utils/config";

const config = siteConfig({
	title: "码到成功",
	prologue: "这个人很懒，什么也没留下～",
	author: {
		name: "Hank Sun",
		email: "shk1717@163.com",
		link: "https://shlock7.github.io"
	},
	description: "Hank 的个人博客.",
	copyright: {
		type: "CC BY-NC-ND 4.0",
		year: "2026"
	},
	i18n: {
		locales: ["zh-cn"],
		defaultLocale: "zh-cn"
	},
	pagination: {
		note: 15,
		jotting: 24
	},
	heatmap: {
		unit: "day",
		weeks: 20
	},
	feed: {
		section: "*",
		limit: 20
	},
	latest: "*"
});

export const monolocale = Number(config.i18n.locales.length) === 1;

export default config;
