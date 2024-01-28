(async () => {
	console.log("LetovoTweaks is active!");
	
	const { chromeStorageGetAsync, chromeStorageSetAsync, waitFor } = await import(chrome.runtime.getURL("common.js"));

	const parser = new DOMParser();
	
	const uname = document.querySelector("#navbarSupportedContent > ul.navbar-nav.ml-auto.mr-3 > li:nth-child(3) > a");
	const iframe = document.querySelector("iframe#page_content");
	const search = document.querySelector("#navbarSupportedContent > form");
	const logo = document.querySelector("body > nav > div:nth-child(1)");
	if(uname && (await chromeStorageGetAsync(["pfp"])).pfp) {
		const myImg = document.createElement("img");
		myImg.src = "https://student.letovo.ru/student/meow/photo.jpg";
		myImg.width = 24;
		myImg.height = 24;
		myImg.style.borderRadius = "4px";
		uname.appendChild(myImg);
	}
	if(search && (await chromeStorageGetAsync(["hide_search"])).hide_search) {
		search.remove();
	}
	if(iframe && (await chromeStorageGetAsync(["old"])).old) {
		location.href = iframe.src;
	}
	if(logo && (await chromeStorageGetAsync(["hide_logo"])).hide_logo) {
		logo.remove();
	}

	switch(location.pathname.replace(/^\/+|\/+$/g, "")) {
		case "home":
			console.log("Replacing news");
			
			const container = document.querySelector("body > div.container > div:nth-child(3) > div.col-md-8.col-sm-12.pt-2.pb-2");
			const newsSel = document.querySelector("#news_list");
			
			const type = (await chromeStorageGetAsync(["type"])).type || "news";
			
			const style1 = document.createElement("link");
			style1.href = "https://student.letovo.ru/css/style.css";
			style1.rel = "stylesheet";
			document.head.appendChild(style1);
			
			let summativesHTML = null, marksHTML = null, infoHTML = null;
			if(type == "marks") {
				marksHTML = await (await fetch("/index.php?part_student=progress")).text();
				marksHTML = parser.parseFromString(marksHTML, "text/html").querySelector("#progress_table");
				marksHTML.style.transform = "scale(65%) translate(-17.5%,-17.5%)";
			}
			if(type == "summatives") {
				summativesHTML = await (await fetch("/?r=student&part_student=summative")).text();
				summativesHTML = parser.parseFromString(summativesHTML, "text/html").querySelector("table#table_fix");
			}
			if(type == "info") {
				infoHTML = await (await fetch("/student/mammamia")).text();
				infoHTML = parser.parseFromString(infoHTML, "text/html").querySelector(`body > div.container > div:nth-child(2) > div.col-lg-8.col-sm-12`);
			}
			
			if(type != "news") {
				newsSel.remove();
			}
			
			if(marksHTML !== null) container.appendChild(marksHTML);
			if(summativesHTML !== null) container.appendChild(summativesHTML);
			if(infoHTML !== null) container.appendChild(infoHTML);
			
			if((await chromeStorageGetAsync(["links"])).links) {
				console.log("Adding links");
				const links = document.querySelector("body > div.container > div:nth-child(3) > div.col-md-4.col-sm-12.pt-2.pb-2 > div:nth-child(1) > ul.mt-2.pl-4.pr-4");
				for(let i of Object.entries({
					"Canvas": "https://canvas.letovo.ru",
					"Почта": "https://mail.yandex.ru",
					"Навигатор": "https://navigator.letovo.ru",
					"Новый ЛК": "https://s.letovo.ru"
				})) {
					const li = document.createElement("li");
					const a = document.createElement("a");
					a.href = i[1];
					a.innerText = i[0];
					li.appendChild(a);
					links.appendChild(li);
				}
			}
			
			console.log("Replacing welcome text");
			const welcome = document.querySelector("body > div.container > div:nth-child(1) > div > h3");
			const text = (await chromeStorageGetAsync(["custom_text"])).custom_text;
			if(welcome && text != "")
				welcome.innerText = text;
			
			break;
	}
})();
