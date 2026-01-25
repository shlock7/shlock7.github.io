import siteConfig from "./src/utils/config";

const config = siteConfig({
	title: "码到成功",
	prologue: "If you need a website\nthat loads fast and has great SEO, then Astro is for you.",
	author: {
		name: "Hank Sun",
		email: "shk1717@163.com",
		link: "https://your.website"
	},
	description: "A modern Astro theme focused on content creation.",
	copyright: {
		type: "CC BY-NC-ND 4.0",
		year: "2025"
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
