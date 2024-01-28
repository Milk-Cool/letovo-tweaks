(async () => {
	console.log("LetovoTweaks is active!");
	
	const { chromeStorageGetAsync, chromeStorageSetAsync, waitFor, delay, urls } = await import(chrome.runtime.getURL("common.js"));
	
	if(location.hash == "#letovo") {
		const text = (await chromeStorageGetAsync(["_chatgpt_query"]))._chatgpt_query;
		if(!text) return;
		const prompt = await waitFor("#prompt-textarea");
		prompt.value = text;
		prompt.dispatchEvent(new Event('input', { bubbles: true }));
		const send = await waitFor("[data-testid='send-button']");
		send.click();
	}
})();
