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
let url = "http://127.0.0.1:3000/";

let getClass = async () => {
	result.style.display = "none";
	let moreData = document.querySelector("#moreData").checked;

	foundClass.href = "http://www.zstrzeszow.pl/plan/";

	let searchClass = searchClassInput[0].value;

	let searchDay = parseInt(searchDayInput[0].value);

	if (searchClass != "") {
		let rex = /\b[0-4]\b/gm;
		vaildDay = rex.test(searchDay) ? true : false;

		if (vaildDay) {
			let info = "";
			//my server https://api.kacpep.dev/
			info = await fetch(`${url}/class?searchClass=${searchClass}&searchDay=${searchDay}`).then(async (res) => {
				return [await res.json(), await res.status];
			});
			result.style.display = "flex";

			switch (info[1]) {
				case 200:
					if (info[0].hasOwnProperty("error")) {
						errorVisible(info[0].error);
					} else {
						resultVisible();
						if (!moreData) {
							killClass.classList.remove("more");

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
						} else {
							foundClass.innerHTML = "";
							h4.textContent = "W tej sali lekcje mają:";
							result.style.flexDirection = "column";
							foundClass.style.marginTop = "20px";
							let elUl = document.createElement("ul"); //craete element

							for (let c in info[0]) {
								killClass.classList.add("more");
								let elLi = document.createElement("li");
								elLi.textContent = info[0][c].numberLesson + ".";

								let className = document.createElement("p");
								className.textContent = "Klasa: ";
								let classNameA = document.createElement("a");
								classNameA.href = "http://www.zstrzeszow.pl/plan/";
								classNameA.target = "_blank";

								classNameA.textContent = info[0][c].error;
								classNameA.href = foundClass.href + info[0][c].link;
								classNameA.textContent = info[0][c].class;
								className.appendChild(classNameA);
								elLi.appendChild(className);

								let teacher = document.createElement("p");
								teacher.textContent = "Nauczyciel: ";
								let teacherA = document.createElement("a");
								teacherA.href = "http://www.zstrzeszow.pl/plan/";
								teacherA.target = "_blank";

								teacherA.textContent = info[0][c].error;
								teacherA.href = foundClass.href + info[0][c].teacherLink;
								teacherA.textContent = info[0][c].teacher;
								teacher.appendChild(teacherA);
								elLi.appendChild(teacher);

								let lessonName = document.createElement("p");
								let lessonNameSpan = document.createElement("span");
								lessonNameSpan.classList.add("subtext");
								lessonNameSpan.textContent = info[0][c].nameLesson;
								lessonName.textContent = "Lekcja: ";

								lessonName.appendChild(lessonNameSpan);
								elLi.appendChild(lessonName);
								elUl.appendChild(elLi);
							}
							foundClass.appendChild(elUl);
						}
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

searchDayInput[0].addEventListener("change", () => {
	getClass();
});

let toogle = document.getElementById("toggle");
let tooglesIntputs = document.querySelectorAll(".inputs");

let allPToogle = document.querySelectorAll(".option p");

// toogle.addEventListener("click", async () => {
// 	//change option searching
// 	foundClass.innerHTML = "";

// 	result.style.display = "none";
// 	//all animation
// 	if (toogle.checked) {
// 		tooglesIntputs[0].classList.add("animation-out");
// 		tooglesIntputs[1].classList.remove("animation-in");

// 		allPToogle[1].classList.remove("active");
// 		allPToogle[0].classList.add("active");

// 		setTimeout(() => {
// 			tooglesIntputs[0].classList.add("d-none");
// 			tooglesIntputs[0].classList.remove("animation-out");
// 			tooglesIntputs[1].classList.remove("d-none");
// 			tooglesIntputs[1].classList.add("animation-in");
// 		}, 400);
// 	} else {
// 		tooglesIntputs[1].classList.add("animation-out");
// 		tooglesIntputs[0].classList.remove("animation-in");

// 		allPToogle[0].classList.remove("active");
// 		allPToogle[1].classList.add("active");

// 		setTimeout(() => {
// 			tooglesIntputs[1].classList.add("d-none");
// 			tooglesIntputs[1].classList.remove("animation-out");
// 			tooglesIntputs[0].classList.remove("d-none");
// 			tooglesIntputs[0].classList.add("animation-in");
// 		}, 400);
// 	}
// });

// let popup = document.querySelector(".popup--new-version");

// window.addEventListener("load", () => {
// 	if (document.cookie != "1") popup.style.display = "flex";
// });

// popup.addEventListener("click", (e) => {
// 	if (e.target.tagName != "P") {
// 		popup.style.opacity = "0";

// 		setTimeout(() => {
// 			popup.style.display = "none";
// 			document.cookie = "1";
// 		}, 600);
// 	}
// });
