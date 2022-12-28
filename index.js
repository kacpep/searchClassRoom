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

			for (i in planRooms) {
				//search all
				// console.log(planRooms[i]);

				//cheking 2 classes in one lesson
				if (
					planRooms[i].classRoom == searchClass &&
					planRooms[i].numberLesson == lesson &&
					planRooms[i].day == data.searchDay
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
		let schedule = parse(html);
		let linkA = schedule.querySelector("ul").querySelectorAll("a");

		let ArryaClass = [];

		linkA.forEach((item) => {
			ArryaClass.push(item);
		});

		let allLinks = [];

		linkA.forEach((item) => {
			allLinks.push(item.getAttribute("href"));
		});

		let classNames = [];

		linkA.forEach((item) => {
			classNames.push(item.childNodes[0]._rawText);
		});

		console.log();

		let allClassSchedule = [];

		for (let i in allLinks) {
			await axios
				.get("http://www.zstrzeszow.pl/plan/" + allLinks[i]) //get all table class
				.then((response) => {
					html = response.data;
					let tableClass = parse(html);
					let table = tableClass.querySelector(".tabela");
					let tr = table.querySelectorAll("tr");

					for (let t in tr) {
						let nr = tr[t].querySelectorAll(".nr").toString().slice(15, -5); 
						let lessons = tr[t].querySelectorAll("td");
						for (let l in lessons) {
							lessonNameAll = lessons[l].querySelectorAll(".p");
							classNumberAll = lessons[l].querySelectorAll(".s");
							teacherAll = lessons[l].querySelectorAll(".n");

							for (let twoL in lessonName) {
								let lesson = lessonNameAll[twoL].childNodes[0]._rawText;
								try {
									classNumber = classNumberAll[twoL].childNodes[0]._rawText;
									teacher = teacherAll[twoL].childNodes[0]._rawText;

									allClassSchedule.push({
										nameLesson: lesson,
										numberLesson: nr,
										classRoom: classNumber,
										class: classNames[i],
										day: (l - 2).toString(),
										link: allLinks[i],
										teacher: teacher,
										teacherLink: "plany/" + teacher[twoL].getAttribute("href"),
									});

									// console.log(
									// 	`${lesson} | ${classNumber} | ${teacher} | ${nr} | ${classNames[i]} | ${l-2}`
									// );
								} catch {
									allClassSchedule.push({
										nameLesson: lesson,
										numberLesson: nr,
										classRoom: lesson,
										class: classNames[i],
										day: (l - 2).toString(),
										link: allLinks[i],
										teacher: undefined,
										teacherLink: undefined,
									});

									// console.log(
									// 	`${lesson} | undefined | undefined | ${nr} | ${classNames[i]} | ${l}`
									// );
								}
							}
						}
					}
				})
				.catch((error) => {
					// handle error
					console.log("error");
					console.log(error);
				});
		}
		//geting all class
		return allClassSchedule;
	})
	.catch(function (error) {
		// handle error
		console.log(error);
	});