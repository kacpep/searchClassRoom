const axios = require("axios").default;
var himalaya = require("himalaya");
const express = require("express");
const cors = require("cors");
// const https = require("https"); 

let app = express();
app.use(cors());
app.use(express.json());
// const httpsAgent = new https.Agent({
// 	rejectUnauthorized: false,
// });
// axios.defaults.httpsAgent = httpsAgent;
//if website is https (paln school)

var planRooms = "";
//this query:
//http://127.0.0.1:3000/nameClass?searchClass=18&searchDay=1&lesson=1
app.listen(3000, async () => {
	//start server and get all class lesson
	planRooms = await arrayTableAllClassRooms;
	console.log(`start`);
});

app.use("/nameClass", async (req, res) => {
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
				return res.status(200).json({ error: "Zły dzień!" });
			}
			let searchDay = weekday[data.searchDay];

			for (i in planRooms) {
				//search all
				if (typeof planRooms[i].classRoom == "object") {
					//cheking 2 classes in one lesson
					for (r in planRooms[i].classRoom) {
						if (
							planRooms[i].classRoom[r] == searchClass &&
							planRooms[i].numberLesson == lesson &&
							planRooms[i].day == searchDay
						) {
							return res.status(200).json(planRooms[i]);
						}
					}
				} else {
					if (
						planRooms[i].classRoom == searchClass &&
						planRooms[i].numberLesson == lesson &&
						planRooms[i].day == searchDay
					) {
						return res.status(200).json(planRooms[i]);
					}
				}
			}
			res.status(200).json({ error: "Nikt nie ma lekcji w tej sali!" });
		} else {
			res.status(500).json({ error: "bad query!!" });
		}
	} else {
		res.status(500).json({ error: "SERVER STARTING.." });
	}
});
//this query:
//http://127.0.0.1:3000/class?searchClass=77&searchDay=1
app.use("/class", async (req, res) => {
	//create api /
	if (planRooms != "") {
		let data = req.query;
		//all data query
		if (
			"searchClass" in data &&
			"searchDay" in data &&
			Object.keys(data).length == 2
		) {
			//check query is correct
			let searchClass = data.searchClass;
			//repere class because query url not accepts #
			if (searchClass == "PR1") {
				searchClass = "#" + searchClass;
			}

			weekday = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];
			//week day
			if (data.searchDay > 4) {
				//validation day number
				return res.status(200).json({ error: "Zły dzień!" });
			}

			let searchDay = weekday[data.searchDay];
			let dayLesson = [];
			for (i in planRooms) {
				//search all
				if (typeof planRooms[i].classRoom == "object") {
					//cheking 2 classes in one lesson
					for (r in planRooms[i].classRoom) {
						if (
							planRooms[i].classRoom[r] == searchClass &&
							planRooms[i].day == searchDay
						) {
							let test = dayLesson.filter(
								(item) => JSON.stringify(item) === JSON.stringify(planRooms[i])
							); //fix bugs to adding 2x
							if (test.length == 0) {
								dayLesson.push(planRooms[i]);
							}
						}
					}
				} else {
					if (
						planRooms[i].classRoom == searchClass &&
						planRooms[i].day == searchDay
					) {
						dayLesson.push(planRooms[i]);
					}
				}
			}
			if (dayLesson.length == 0) {
				//no lesson in day
				res.status(200).json({ error: "Brak lekcji!" });
			} else {
				res
					.status(200)
					.json(dayLesson.sort((a, b) => a.numberLesson - b.numberLesson)); //sort by number lesson
			}
		} else {
			res.status(500).json({ error: "bad query!!" });
		}
	} else {
		res.status(500).json({ error: "SERVER STARTING.." });
	}
});

const getAllTime = (allTime, planAllClass, i, td, tr, th) => {
	//not useing function but is
	if (
		!allTime.includes(
			planAllClass[i].plane[td].children[tr].children[th].content
		) &&
		!planAllClass[i].plane[td].children[tr].children[th].content
			.split("")
			.includes("/") &&
		isNaN(planAllClass[i].plane[td].children[tr].children[th].content)
	) {
		allTime.push(planAllClass[i].plane[td].children[tr].children[th].content);
	}
};
const getDay = (planAllClass, i, tr) => {
	// get day
	return planAllClass[i].plane[1].children[tr].children[0].content;
};
let getNumberLesson = (planAllClass, i, td, tr, th) => {
	//get number lesson
	if (
		planAllClass[i].plane[td].children[tr].children[th].type == "text" &&
		/\d/.test(planAllClass[i].plane[td].children[tr].children[th].content) //regexp is number
	) {
		// getAllTime(allTime, planAllClass, i, td, tr, th);

		if (!isNaN(planAllClass[i].plane[td].children[tr].children[th].content)) {
			return planAllClass[i].plane[td].children[tr].children[th].content;
		}
	}
};
let getClass = (planAllClass, i, td, tr, th) => {
	let a = 0; //cheking 2 classes in one lesson
	for (span in planAllClass[i].plane[td].children[tr].children) {
		if (
			planAllClass[i].plane[td].children[tr].children[span].type == "element"
		) {
			a++;
		}
	}

	if (
		planAllClass[i].plane[td].children[tr].children[th].tagName == "span" &&
		planAllClass[i].plane[td].children[tr].children[th].type == "element" &&
		((planAllClass[i].plane[td].children[tr].children[th].attributes[0].key ==
			"class" &&
			planAllClass[i].plane[td].children[tr].children[th].attributes[0].value ==
				"s") ||
			planAllClass[i].plane[td].children[tr].children[th].attributes[0].key ==
				"style")
	) {
		if (
			planAllClass[i].plane[td].children[tr].children[th].attributes[0].key ==
			"style"
		) {
			if (a > 1) {
				// console.log(planAllClass[i].plane[td].children[tr].children);
				if (planAllClass[i].plane[td].children[tr].children.length > 3) {
					return [
						planAllClass[i].plane[td].children[tr].children[2].children[0]
							.content,
						planAllClass[i].plane[td].children[tr].children[5].children[4]
							.children[0].content,
					];
				} else {
					return [
						planAllClass[i].plane[td].children[tr].children[0].children[4]
							.children[0].content,
						planAllClass[i].plane[td].children[tr].children[2].children[4]
							.children[0].content,
					];
				}
			} else {
				return planAllClass[i].plane[td].children[tr].children[th].children[4]
					.children[0].content;
			}
		} else {
			return planAllClass[i].plane[td].children[tr].children[th].children[0]
				.content;
		}
	} else {
		return 0;
	}
};
let arrayTableAllClassRooms = axios
	.get("http://sp5.resman.pl/plan/lista.html") //get all class

	.then(async (response) => {
		html = response.data;

		var json = himalaya.parse(html); //preser html to object
		// console.log(json[0].children[2].children[3].children[1].children[0]);
		let ArryaClass = [];

		for (let i in json[0].children[2].children[3].children) {
			try {
				if (
					json[0].children[2].children[3].children[i].children[0].tagName == "a"
				) {
					ArryaClass.push(json[0].children[2].children[3].children[i]);
				}
			} catch {}
		}
		let allLinks = [];
		for (let i in ArryaClass) {
			allLinks.push(ArryaClass[i].children[0].attributes[0].value); //geting all links for class
		}
		let allClass = [];

		for (let i in allLinks) {
			allClass.push(
				await axios
					.get("https://sp5.resman.pl/plan/" + allLinks[i]) //get all table class
					.then((response) => {
						html = response.data;

						var json = himalaya.parse(html); //preser html to object

						return json[0].children[2].children[3].children[1].children[1]
							.children[0].children[1].children;
					})
					.catch((error) => {
						// handle error
						console.log("error");
					})
			);
		}
		let planAllClass = []; //create object
		for (let i = 0; i < allClass.length; i++) {
			let planClass = [];

			for (let x = 0; x < allClass[i].length; x++) {
				planClass.push(allClass[i][x]);

				if (allClass[i][x].type == "element") {
				}
			}

			planAllClass.push({
				class: ArryaClass[i].children[0].children[0].content,
				plane: planClass,
			});
		}

		let planRooms = []; //geting all class
		for (let i in planAllClass) {
			for (let td = 0; planAllClass[i].plane.length > td; td++) {
				if (planAllClass[i].plane[td].type == "element") {
					for (let tr in planAllClass[i].plane[td].children) {
						if (planAllClass[i].plane[td].children[tr].type == "element") {
							for (let th in planAllClass[i].plane[td].children[tr].children) {
								let nowLesson = getNumberLesson(planAllClass, i, td, 1, 0); //fn get number lesson

								if (getClass(planAllClass, i, td, tr, th) != 0) {
									//is not stakes class
									let nowClass = getClass(planAllClass, i, td, tr, th);

									day = getDay(planAllClass, i, tr);
									check = planRooms.filter(
										(item) =>
											item.numberLesson == nowLesson &&
											item.classRoom == nowClass &&
											item.class == planAllClass[i].class &&
											item.day == day
									);
									//repair for 2 class in one lesson
									if (check[0] == undefined) {
										if (day != undefined) {
											//pushing data to object
											planRooms.push({
												numberLesson: nowLesson,
												classRoom: nowClass,
												class: planAllClass[i].class,
												day: day,
												link: allLinks[i],
											});
										}
									}
								}
							}
						}
					}
				}
			}
		}
		return planRooms;
	})
	.catch(function (error) {
		// handle error
		console.log(error);
	});
