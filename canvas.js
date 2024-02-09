const createSearchBar = (parent, placeholder, handler) => {
	const form = document.createElement("form");
	form.classList.add("ic-Input-group");
	form.classList.add("ef-search-form");

	const input = document.createElement("input");
	input.placeholder = placeholder;
	input.type = "search";
	input.classList.add("ic-Input");
	form.appendChild(input);

	const button = document.createElement("button");
	button.type = "submit";

	const icon = document.createElement("i");
	icon.classList.add("icon-search");
	button.appendChild(icon);

	const span = document.createElement("span");
	span.classList.add("screenreader-only");
	span.innerText = placeholder;
	button.appendChild(span);

	form.appendChild(button);

	form.onsubmit = (e) => {
		e.preventDefault();
		handler(input.value);
	}
	input.onkeydown = () => {
		setTimeout(handler, 2, input.value);
	}
	input.onchange = () => {
		handler(input.value);
	}

	parent.prepend(form);
}

(async () => {
	console.log("LetovoTweaks is active!");
	
	const { chromeStorageGetAsync, chromeStorageSetAsync, waitFor, urls, promptPostfix, injectCSS } = await import(chrome.runtime.getURL("common.js"));
	
	if((await chromeStorageGetAsync(["canvas_dark_mode"])).canvas_dark_mode) {
		injectCSS(chrome.runtime.getURL("canvas-dark-mode.css"));
	}
	
	const logo = document.querySelector(".ic-app-header__logomark-container");
	if(logo && (await chromeStorageGetAsync(["canvas_hide_logo"])).canvas_hide_logo)
		logo.remove();

	const menu = document.querySelector("#menu");
	if(menu && (await chromeStorageGetAsync(["canvas_button_tododo"])).canvas_button_tododo) {
		const li = document.createElement("li");
		li.classList.add("menu-item");
		li.classList.add("ic-app-header__menu-list-item");

		const a = document.createElement("a");
		a.id = "global_nav_tododo_link";
		a.role = "button";
		a.href = "https://elk.letovo.ru/student/tododo/tasks";
		a.classList.add("ic-app-header__menu-list-link");
		a.target = "_blank";

		const divIconContainer = document.createElement("div");
		divIconContainer.classList.add("menu-item-icon-container");
		divIconContainer.setAttribute("aria-hidden", "true");

		const img = document.createElement("img");
		img.src = "https://img.icons8.com/?size=256&id=4023&format=png";
		img.width = "28";
		img.height = "28";
		img.style.filter = "invert(100%)";
		divIconContainer.appendChild(img);

		const divText = document.createElement("div");
		divText.classList.add("menu-item__text");
		divText.innerText = "ToDoDo";

		a.appendChild(divIconContainer);
		a.appendChild(divText);

		li.appendChild(a);

		menu.appendChild(li);
	}
	
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

			if((await chromeStorageGetAsync(["canvas_main_search"])).canvas_main_search) setTimeout(() => {
				// We have to wait for the dashboard to load
				console.log("Adding search bar: main");
				createSearchBar(document.querySelector(".ic-DashboardCard__box"), "Search for a course", query => {
					for(let i of document.querySelectorAll(".ic-DashboardCard"))
						if(i.querySelector(".ic-DashboardCard__header-title").innerText.toLowerCase().includes(query.toLowerCase())
							|| i.querySelector(".ic-DashboardCard__header-subtitle").innerText.toLowerCase().includes(query.toLowerCase()))
							i.style.display = "";
						else
							i.style.display = "none";
				});
			}, 1000);

			break;
		case "courses":
			if((await chromeStorageGetAsync(["canvas_course_search"])).canvas_course_search) setTimeout(() => {
				console.log("Adding search bar: courses");
				createSearchBar(document.querySelector(".ic-Action-header"), "Search", query => {
					for(let i of document.querySelectorAll(".course-list-table-row")) {
						if(i.querySelector(".name").innerText.toLowerCase().includes(query.toLowerCase())
							|| i.querySelector(".course-list-nickname-column").innerText.toLowerCase().includes(query.toLowerCase()))
							i.style.display = "";
						else
							i.style.display = "none";
					}
				});
			}, 1000);
			break;
	}
})();
