const axios = require("axios").default;
var himalaya = require("himalaya");
const express = require("express");
const cors = require("cors");
const { parse } = require("node-html-parser");

let app = express();
app.use(cors());
app.use(express.json());

var planRooms = "";
//this query:
//http://127.0.0.1:3000/search?searchClass=18&searchDay=1&lesson=1
app.listen(3000, async () => {
	//start server and get all class lesson
	planRooms = await arrayTableAllClassRooms;
	console.log(`start`);
});

app.use("/", async (req, res) => {
	//create api /
	if (planRooms != "") {
		let data = req.query;
		//all data query
		if (
			"searchClass" in data &&
			"lesson" in data &&
			"searchDay" in data &&
			Object.keys(data).length == 3
		) {
			//check query is correct
			let searchClass = data.searchClass;
			//repere class because query url not accepts #
			if (searchClass == "PR1") {
				searchClass = "#" + searchClass;
			}

			let lesson = data.lesson;
			weekday = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];
			//week day
			if (data.searchDay > 4) {
				//validation day number
				return res.send("wrong day!");
			}
			console.log(searchClass);
			console.log(lesson);
			console.log(data.searchDay);
			for (i in planRooms) {
				//search all
				// console.log(planRooms[i]);

				//cheking 2 classes in one lesson
				if (
					planRooms[i].classRoom == 13 &&
					planRooms[i].numberLesson == 9 &&
					planRooms[i].day == 1
				) {
					return res.status(200).json(planRooms[i]);
				}
			}
			res.status(200).json({ error: "nobody has lesson in classRoom" });
		} else {
			res.status(500).json({ error: "bad query!!" });
		}
	} else {
		res.status(500).json({ error: "SERVER STARTING.." });
	}
});

let arrayTableAllClassRooms = axios
	.get("http://www.zstrzeszow.pl/plan/lista.html") //get all class

	.then(async (response) => {
		html = response.data;
		let plan = parse(html);
		let linkA = plan.querySelector("ul").querySelectorAll("a");

		let ArryaClass = [];

		linkA.forEach((item) => {
			ArryaClass.push(item);
		});

		let allLinks = [];
		let classNames = [];

		linkA.forEach((item) => {
			allLinks.push(item.getAttribute("href"));
		});
		linkA.forEach((item) => {
			classNames.push(item.childNodes[0]._rawText);
		});

		console.log();

		let allClass = [];

		for (let i in allLinks) {
			await axios
				.get("http://www.zstrzeszow.pl/plan/" + allLinks[i]) //get all table class
				.then((response) => {
					html = response.data;
					let tableClass = parse(html);
					let table = tableClass.querySelector(".tabela");
					let tr = table.querySelectorAll("tr");

					let lessons = tableClass.querySelectorAll(".l");
					let numberLesson = tableClass.querySelectorAll(".nr");

					// for (let l in lessons) {
					// 	console.log(lessons[l].toString());
					// }
					for (let t in tr) {
						let nr = tr[t].querySelectorAll(".nr").toString().slice(15, -5);
						let lessons = tr[t].querySelectorAll(".l");
						for (let l in lessons) {
							console.log("up: " + l);
							lessonName = lessons[l].querySelectorAll(".p");
							classNumber = lessons[l].querySelectorAll(".s");
							teacher = lessons[l].querySelectorAll(".n");

							for (let twoL in lessonName) {
								lessonsInOneDay = lessonName[twoL].childNodes[0]._rawText;
								classNumberInOneDay = classNumber[twoL].childNodes[0]._rawText;
								teacherInOneDay = teacher[twoL].childNodes[0]._rawText;
								console.log("down: " + l);

								allClass.push({
									numberLesson: nr,
									classRoom: classNumberInOneDay,
									class: classNames[i],
									day: l,
									link: allLinks[i],
									teacher: teacherInOneDay,
								});

								// console.log(
								// 	`${lessonsInOneDay} | ${classNumberInOneDay} | ${teacherInOneDay} | ${nr} | ${classNames[i]} | ${weekday[l]}`
								// );
							}
						}
					}
					// for (let n in numberLesson) {
					// 	// console.log(numberLesson[n].childNodes[0]._rawText);

					// 	var lessonName;
					// 	var classNumber;
					// 	var teacher;
					// 	// lessonName =
					// 	// 	lessons[0].querySelectorAll(".p")[0].childNodes[0]._rawText;
					// 	// for (let l in lessons) {
					// 	// 	lessonName = lessons[l].querySelectorAll(".p").toString();
					// 	// 	classNumber = lessons[l].querySelectorAll(".s").toString();
					// 	// 	teacher = lessons[l].querySelectorAll(".n").toString();
					// 	// 	let flag = true;
					// 	// 	if (lessonName.includes(",")) {
					// 	// 		flag = false;
					// 	// 		let lessonsInOneDay = lessonName.split(",");
					// 	// 		let classNumberInOneDay = classNumber.split(",");
					// 	// 		let teacherInOneDay = teacher.split(",");
					// 	// 		for (let oneL in lessonsInOneDay) {
					// 	// 			console.log(
					// 	// 				`${lessonsInOneDay[oneL]} | ${classNumberInOneDay[oneL]} | ${teacherInOneDay[oneL]} | ${classNames[i]}`
					// 	// 			);
					// 	// 		}
					// 	// 	}
					// 	// 	if (flag) {
					// 	// 		console.log(`${lessonName} | ${classNumber} | ${teacher}`);
					// 	// 	}
					// 	// }

					// 	for (let l in lessons) {
					// 		lessonName = lessons[l].querySelectorAll(".p");
					// 		classNumber = lessons[l].querySelectorAll(".s");
					// 		teacher = lessons[l].querySelectorAll(".n");
					// 		// console.log(teacher);
					// 		for (let twoL in lessonName) {
					// 			lessonsInOneDay = lessonName[twoL].childNodes[0]._rawText;
					// 			classNumberInOneDay =
					// 				classNumber[twoL].childNodes[0]._rawText;
					// 			teacherInOneDay = teacher[twoL].childNodes[0]._rawText;
					// 			console.log(
					// 				`${lessonsInOneDay} | ${classNumberInOneDay} | ${teacherInOneDay} | ${classNames[i]} | ${numberLesson[n].childNodes[0]._rawText} | `
					// 			);
					// 		}
					// 	}
					// }
				})
				.catch((error) => {
					// handle error
					console.log("error");
					console.log(error);
				});
		}

		//geting all class
		return allClass;
	})
	.catch(function (error) {
		// handle error
		console.log(error);
	});
