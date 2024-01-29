(async () => {
	const { chromeStorageGetAsync, chromeStorageSetAsync } = await import(chrome.runtime.getURL("common.js"));
	
	document.querySelector("#home").value = (await chromeStorageGetAsync(["type"])).type || "news";
	document.querySelector("#pfp").checked = (await chromeStorageGetAsync(["pfp"])).pfp || false;
	document.querySelector("#links").checked = (await chromeStorageGetAsync(["links"])).links || false;
	document.querySelector("#hide_search").checked = (await chromeStorageGetAsync(["hide_search"])).hide_search || false;
	document.querySelector("#old").checked = (await chromeStorageGetAsync(["old"])).old || false;
	document.querySelector("#custom_text").value = (await chromeStorageGetAsync(["custom_text"])).custom_text || "";
	document.querySelector("#hide_logo").checked = (await chromeStorageGetAsync(["hide_logo"])).hide_logo || false;
	document.querySelector("#canvas_custom_text").value = (await chromeStorageGetAsync(["canvas_custom_text"])).canvas_custom_text || "";
	document.querySelector("#canvas_summarize").checked = (await chromeStorageGetAsync(["canvas_summarize"])).canvas_summarize || false;
	document.querySelector("#canvas_hide_logo").checked = (await chromeStorageGetAsync(["canvas_hide_logo"])).canvas_hide_logo || false;
	document.querySelector("#canvas_dark_mode").checked = (await chromeStorageGetAsync(["canvas_dark_mode"])).canvas_dark_mode || false;
	document.querySelector("#canvas_main_search").checked = (await chromeStorageGetAsync(["canvas_main_search"])).canvas_main_search || false;
	document.querySelector("#canvas_course_search").checked = (await chromeStorageGetAsync(["canvas_course_search"])).canvas_course_search || false;
	
	console.log(document.querySelector("#home").value);
	
	setInterval(async () => {
		await chromeStorageSetAsync({
			"type": document.querySelector("#home").value,
			"pfp": document.querySelector("#pfp").checked,
			"links": document.querySelector("#links").checked,
			"hide_search": document.querySelector("#hide_search").checked,
			"old": document.querySelector("#old").checked,
			"custom_text": document.querySelector("#custom_text").value,
			"hide_logo": document.querySelector("#hide_logo").checked,
			"canvas_custom_text": document.querySelector("#canvas_custom_text").value,
			"canvas_summarize": document.querySelector("#canvas_summarize").checked,
			"canvas_hide_logo": document.querySelector("#canvas_hide_logo").checked,
			"canvas_dark_mode": document.querySelector("#canvas_dark_mode").checked,
			"canvas_main_search": document.querySelector("#canvas_main_search").checked,
			"canvas_course_search": document.querySelector("#canvas_course_search").checked
		});
	}, 20);
})();
