const chromeStorageGetAsync = async items => new Promise(resolve => chrome.storage.local.get(items, resolve));
const chromeStorageSetAsync = async items => new Promise(resolve => chrome.storage.local.set(items, resolve));

const waitFor = selector => new Promise(resolve => {
	const f = () => {
		const el = document.querySelector(selector);
		if(el) resolve(el);
		else setTimeout(f, 1);
	}
	setTimeout(f);
});
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const promptPostfix = "\n\nСократи этот текст / Summarize this text";

const urls = {
	"chatgpt_icon": "https://www.pngall.com/wp-content/uploads/15/ChatGPT-Logo-PNG-File.png",
	"chatgpt": "https://chat.openai.com/#letovo"
}

const injectCSS = path => {
	const link = document.querySelector("link");
	link.rel = "stylesheet";
	link.href = path;
	link.type = "text/css";
	document.head.appendChild(link);
}
	
export {
	chromeStorageGetAsync,
	chromeStorageSetAsync,
	waitFor,
	delay,
	urls,
	promptPostfix,
	injectCSS
};
