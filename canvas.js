(async () => {
	console.log("LetovoTweaks is active!");
	
	const { chromeStorageGetAsync, chromeStorageSetAsync, waitFor, urls, promptPostfix } = await import(chrome.runtime.getURL("common.js"));
	
	const logo = document.querySelector(".ic-app-header__logomark-container");
	if(logo && (await chromeStorageGetAsync(["canvas_hide_logo"])).canvas_hide_logo)
		logo.remove();
	
	const trimmed = location.pathname.replace(/^\/+|\/+$/g, "");
	if(trimmed.match(/courses\/\d+\/(pages|assignments)\/.*/)) {
		if((await chromeStorageGetAsync(["canvas_summarize"])).canvas_summarize) {
			const button = document.createElement("img");
			button.src = urls.chatgpt_icon;
			button.style.width = "4em";
			button.style.height = "4em";
			button.style.bottom = "2em";
			button.style.right = "2em";
			button.style.borderRadius = "50%";
			button.style.position = "fixed";
			button.style.zIndex = 9999999;
			button.style.cursor = "pointer";
			document.body.appendChild(button);
			
			button.onclick = async () => {
				await chromeStorageSetAsync({
					"_chatgpt_query": document.querySelector(".user_content").innerText + promptPostfix
				});
				window.open(urls.chatgpt);
			};
		}
	} else switch(trimmed) {
		case "":
			console.log("Replacing welcome text");
			const welcome = await waitFor("#dashboard_header_container > div > span > span:nth-child(1) > span > span");
			const text = (await chromeStorageGetAsync(["canvas_custom_text"])).canvas_custom_text;
			console.log(welcome, text)
			if(welcome && text != "")
				welcome.innerText = text;
			
			break;
	}
})();
