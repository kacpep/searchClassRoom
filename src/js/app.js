let NameWebsite = document.querySelector("h1");
text = NameWebsite.textContent.split("");
NameWebsite.textContent = "";
let i = 0;

let mainTextLoading = () => {
	if (i < text.length) {
		NameWebsite.textContent += text[i];
		i++;
		setTimeout(mainTextLoading, 150);
	}
};
document.addEventListener("load", mainTextLoading());
setInterval(() => {
	i = 0;
	NameWebsite.textContent = "";

	mainTextLoading();
}, 9000);

let bnt = document.querySelector(".button");
let foundClass = document.querySelector("#foundClass");
let result = document.querySelector(".result");
let error = document.querySelector(".error");
let killClass = document.querySelector(".killClass");
let h4 = document.querySelector("h4");

let searchClassInput = document.getElementById("class");
let lessonInput = document.getElementById("lesson");
let searchDayInput = document.getElementById("day");

let inputs = document.querySelectorAll("input");

let getClass = async () => {
	result.style.display = "none";

	foundClass.href = "http://www.zstrzeszow.pl/plan/";

	let searchClass = searchClassInput.value;
	let lesson = lessonInput.value;
	let searchDay = parseInt(searchDayInput.value);
	if (searchClass != "" && lesson != "" && searchDay != "") {
		let rex = /\b[0-4]\b/gm;
		vaildDay = rex.test(searchDay) ? true : false;
		rex = /^([1-9]|1[0-5])$/gm;

		vaildLesson = rex.test(lesson) ? true : false;

		if (vaildDay && vaildLesson) {
			let info = "";
			//my server https://webs.k-k.p4.tiktalik.io/
			info = await fetch(
				`http://127.0.0.1:3000/?searchClass=${searchClass}&searchDay=${searchDay}&lesson=${lesson}`
			).then(async (res) => {
				return [await res.json(), await res.status];
			});
			result.style.display = "flex";

			switch (info[1]) {
				case 420:
					break;
				case 200:
					console.log(info)
					if (info[0].hasOwnProperty("error")) {
						error.textContent = info[0].error;
						error.style.display = "flex";
						h4.style.display = "none";
						killClass.style.display = "none";
					} else {
						h4.style.display = "flex";
						killClass.style.display = "flex";
						error.style.display = "none";

						foundClass.textContent = info[0].error;
						foundClass.href = foundClass.href + info[0].link;
						foundClass.textContent = info[0].class;
					}

					break;

				case 500:
					error.style.display = "flex";
					h4.style.display = "none";
					killClass.style.display = "none";

					error.textContent = info[0].error;

					break;
			}
		} else {
			result.style.display = "flex";

			error.style.display = "flex";
			h4.style.display = "none";
			killClass.style.display = "none";

			error.textContent = "bad lesson(1-15) or day(0-4)";
		}
	} else {
		result.style.display = "flex";

		error.style.display = "flex";
		h4.style.display = "none";
		killClass.style.display = "none";

		error.textContent = "inputs cannot be empty";
	}
};
inputs.forEach((input) => {
	input.addEventListener("keypress", (event) => {
		if (event.key === "Enter") {
			getClass();
		}
	});
});

bnt.addEventListener("click", () => {
	getClass();
});
