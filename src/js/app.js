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

let searchClassInput = document.querySelectorAll(".class");
let lessonInput = document.querySelectorAll(".lesson");
let searchDayInput = document.querySelectorAll(".day");

let inputs = document.querySelectorAll("input");

let errorVisible = (textError) => {
	result.style.display = "flex";

	error.style.display = "flex";
	h4.style.display = "none";
	killClass.style.display = "none";

	error.textContent = textError;
};
let resultVisible = () => {
	h4.style.display = "flex";
	killClass.style.display = "flex";
	error.style.display = "none";
};
let url = "https://api.kacpep.dev";

let getClass = async () => {
	result.style.display = "none";

	foundClass.href = "http://www.zstrzeszow.pl/plan/";
	if (searchClassInput[0].closest(".d-none") == null) {
		let searchClass = searchClassInput[0].value;
		let lesson = lessonInput[0].value;
		let searchDay = parseInt(searchDayInput[0].value);
		console.log(`${searchClass} ${lesson} ${searchDay}`);

		if (searchClass != "" && lesson != "") {
			let rex = /\b[0-4]\b/gm;
			vaildDay = rex.test(searchDay) ? true : false;
			rex = /^([1-9]|1[0-5])$/gm;

			vaildLesson = rex.test(lesson) ? true : false;

			if (vaildDay && vaildLesson) {
				let info = "";
				//my server https://api.kacpep.dev/
				info = await fetch(
					`${url}/nameClass?searchClass=${searchClass}&searchDay=${searchDay}&lesson=${lesson}`
				).then(async (res) => {
					return [await res.json(), await res.status];
				});
				result.style.display = "flex";

				switch (info[1]) {
					case 200:
						if (info[0].hasOwnProperty("error")) {
							errorVisible(info[0].error);
						} else {
							foundClass.innerHTML = "";

							resultVisible();
							h4.textContent = "Ta klasa ma tu lekcje:";
							result.style.flexDirection = "row";
							foundClass.style.marginTop = "0";

							let el = document.createElement("a");
							el.href = "http://www.zstrzeszow.pl/plan/";
							el.target = "_blank";

							el.textContent = info[0].error;
							el.href = foundClass.href + info[0].link;
							el.textContent = info[0].class;
							foundClass.appendChild(el);
						}

						break;

					case 500:
						errorVisible(info[0].error);

						break;
				}
			} else {
				errorVisible("błędna wartość lekcji");
			}
		} else {
			errorVisible("pola nie mogą być puste");
		}
	} else {
		let searchClass = searchClassInput[1].value;

		let searchDay = parseInt(searchDayInput[1].value);

		if (searchClass != "") {
			let rex = /\b[0-4]\b/gm;
			vaildDay = rex.test(searchDay) ? true : false;

			if (vaildDay) {
				let info = "";
				//my server https://api.kacpep.dev/
				info = await fetch(
					`${url}/class?searchClass=${searchClass}&searchDay=${searchDay}`
				).then(async (res) => {
					return [await res.json(), await res.status];
				});
				result.style.display = "flex";

				switch (info[1]) {
					case 200:
						if (info[0].hasOwnProperty("error")) {
							errorVisible(info[0].error);
						} else {
							resultVisible();
							console.log(info);
							foundClass.innerHTML = "";
							h4.textContent = "W tej sali lekcje mają:";
							result.style.flexDirection = "column";
							foundClass.style.marginTop = "20px";
							let elUl = document.createElement("ul"); //craete element
							for (let c in info[0]) {
								let el = document.createElement("a");
								let elLi = document.createElement("li");
								elLi.textContent = info[0][c].numberLesson + ".";
								el.textContent = info[0][c].class;
								el.href = foundClass.href + info[0][c].link;
								el.target = "_blank";
								elLi.appendChild(el);
								elUl.appendChild(elLi);
							}
							foundClass.appendChild(elUl);
							// foundClass.textContent = info[0][0].class;
						}
						break;

					case 500:
						errorVisible(info[0].error);
						break;
				}
			} else {
				errorVisible("błędny dzień");
			}
		} else {
			errorVisible("pola nie mogą być puste");
		}
	}
};
inputs.forEach((input) => {
	input.addEventListener("keypress", (event) => {
		if (event.key === "Enter") {
			getClass();
		}
	}); //enter in input validation
});

bnt.addEventListener("click", () => {
	getClass(); //click bnt
});

let toogle = document.getElementById("toggle");
let tooglesIntputs = document.querySelectorAll(".inputs");

let allPToogle = document.querySelectorAll(".option p");

toogle.addEventListener("click", async () => {
	//change option searching
	foundClass.innerHTML = "";

	result.style.display = "none";
	//all animation
	if (toogle.checked) {
		tooglesIntputs[0].classList.add("animation-out");
		tooglesIntputs[1].classList.remove("animation-in");

		allPToogle[1].classList.remove("active");
		allPToogle[0].classList.add("active");

		setTimeout(() => {
			tooglesIntputs[0].classList.add("d-none");
			tooglesIntputs[0].classList.remove("animation-out");
			tooglesIntputs[1].classList.remove("d-none");
			tooglesIntputs[1].classList.add("animation-in");
		}, 400);
	} else {
		tooglesIntputs[1].classList.add("animation-out");
		tooglesIntputs[0].classList.remove("animation-in");

		allPToogle[0].classList.remove("active");
		allPToogle[1].classList.add("active");

		setTimeout(() => {
			tooglesIntputs[1].classList.add("d-none");
			tooglesIntputs[1].classList.remove("animation-out");
			tooglesIntputs[0].classList.remove("d-none");
			tooglesIntputs[0].classList.add("animation-in");
		}, 400);
	}
});
