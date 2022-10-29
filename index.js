const axios = require("axios").default;
var himalaya = require("himalaya");

const getAllTime = (allTime, planAllClass, i, td, tr, th) => {
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
const getDay = (planAllClass, i, td, tr, th) => {
	return planAllClass[i].plane[1].children[tr].children[0].content;
};
let getNumberLesson = (planAllClass, i, td, tr, th) => {
	if (
		planAllClass[i].plane[td].children[tr].children[th].type == "text" &&
		/\d/.test(planAllClass[i].plane[td].children[tr].children[th].content)
	) {
		// getAllTime(allTime, planAllClass, i, td, tr, th);

		if (!isNaN(planAllClass[i].plane[td].children[tr].children[th].content)) {
			return planAllClass[i].plane[td].children[tr].children[th].content;
		}
	}
};
let getClass = (planAllClass, i, td, tr, th) => {
	let a = 0;
	for (span in planAllClass[i].plane[td].children[tr].children) {
		// console.log(planAllClass[i].plane[td].children[tr].children[span]);
		if (
			planAllClass[i].plane[td].children[tr].children[span].type == "element"
		) {
			// console.log(planAllClass[i].plane[td].children[tr].children[span]);
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

		// console.log(
		// 	"class: " +
		// 		planAllClass[i].plane[td].children[tr].children[th].children[0].content
		// );
	} else {
		if (
			planAllClass[i].plane[td].children[tr].children[th].content == "&nbsp;"
		) {
			return "free";
		} else {
			return 0;
		}
	}
};
axios
	.get("http://www.zstrzeszow.pl/plan/lista.html")
	.then(async (response) => {
		html = response.data;

		var json = himalaya.parse(html);
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
			// console.log(ArryaClass[i].children[0].children[0].content);
			allLinks.push(ArryaClass[i].children[0].attributes[0].value);
		}
		// console.log(allLinks);
		let allClass = [];

		for (let i in allLinks) {
			allClass.push(
				await axios
					.get("http://www.zstrzeszow.pl/plan/" + allLinks[i])
					.then(function (response) {
						html = response.data;

						var json = himalaya.parse(html);

						return json[0]
							.children[2].children[3].children[1].children[1].children[0].children[1].children;
					})
					.catch(function (error) {
						// handle error
						console.log("error");
					})
			);
		}
		let planAllClass = [];
		for (let i = 0; i < allClass.length; i++) {
			let planClass = [];

			for (let x = 0; x < allClass[i].length; x++) {
				// console.log(x);
				planClass.push(allClass[i][x]);

				if (allClass[i][x].type == "element") {
				}
			}

			planAllClass.push({
				class: ArryaClass[i].children[0].children[0].content,
				plane: planClass,
			});
		}
		let planRooms = [];

		for (let i in planAllClass) {
			for (let td = 0; planAllClass[i].plane.length > td; td++) {
				if (planAllClass[i].plane[td].type == "element") {
					// let day = 0;

					for (let tr in planAllClass[i].plane[td].children) {
						if (planAllClass[i].plane[td].children[tr].type == "element") {
							// console.log(planAllClass[i].plane[td].children[tr]);
							for (let th in planAllClass[i].plane[td].children[tr].children) {
								let nowLesson = getNumberLesson(planAllClass, i, td, 1, 0);

								if (getClass(planAllClass, i, td, tr, th) != 0) {
									let nowClass = getClass(planAllClass, i, td, tr, th);

									day = getDay(planAllClass, i, td, tr, th);
									check = planRooms.filter(
										(item) =>
											item.numberLesson == nowLesson &&
											item.classRoom == nowClass &&
											item.class == planAllClass[i].class &&
											item.day == day
									);
									if (check[0] == undefined) {
										if (day != undefined) {
											planRooms.push({
												numberLesson: nowLesson,
												classRoom: nowClass,
												class: planAllClass[i].class,
												day: day,
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
		console.log(planRooms);

		let searchClass = "73";
		let lesson = 4;
		let searchDay = "Środa";
		for (i in planRooms) {
			if (typeof planRooms[i].classRoom == "object") {
				for (r in planRooms[i].classRoom) {
					if (
						planRooms[i].classRoom[r] == searchClass &&
						planRooms[i].numberLesson == lesson &&
						planRooms[i].day == searchDay
					) {
						console.log(planRooms[i]);
					}
				}
			} else {
				if (
					planRooms[i].classRoom == searchClass &&
					planRooms[i].numberLesson == lesson &&
					planRooms[i].day == searchDay
				) {
					console.log(planRooms[i]);
				}
			}
		}
	})
	.catch(function (error) {
		// handle error
		console.log(error);
	});
