let courses,
  header,
  description,
  activeTab = "python"; // to store the courses data for future uses
const HTMLcourses = document.querySelector(".courses-Wrapper");
const noCourses = document.getElementsByClassName("noCourses");
const swiperNextButton = document.querySelector(".swiper-button-next");
const swiperPrevButton = document.querySelector(".swiper-button-prev");
// get elements from the server
const newFetch = async () => {
  let response = undefined;
  response = await fetch(`http://localhost:3000/${activeTab ?? "python"}`);
  let json = await response?.json();
  courses = json["courses"];
  header = json["header"];
  description = json["description"];
  return json;
};
// use data fetched and pass them to specified function
function getCourses(create) {
  newFetch().then((x) => {
    create(x["courses"]);
    document.querySelector(".tab-heading").innerText = x["header"];
    document.querySelector(".description").innerText = x["description"];
    document.querySelector(".explore").innerText = `Explore ${activeTab}`;
  });
}
// compare the string the user entered with course title
function isSubString(subStr, str) {
  str = str.toLowerCase().trim();
  subStr = subStr.toLowerCase().trim();
  if (!subStr) return true;

  for (let i = 0; i <= str.length - subStr.length; i++) {
    const subOfOriginString = str.slice(i, i + subStr.length);
    if (subOfOriginString === subStr) {
      return true;
    }
  }
  return false;
}
// handling search failed
function failedTOLoadCourses(search) {
  let failedMessage = `
        <div class="noCourses">
          <h1 class="sorry">
            Sorry, we couldn't find any results ${
              search !== "" ? 'for  " ' + search + ' " ' : ""
            }
          </h1>
          <h3 class="optionHeading">
            Try adjusting your search. Here are some ideas:
          </h3>
          <ul class="ul">
            <li class="searchOption">
              Make sure all words are spelled correctly
            </li>
            <li class="searchOption">Try different search terms</li>
            <li class="searchOption">Try more general search terms</li>
          </ul>
        </div>
  `;
  HTMLcourses.innerHTML = failedMessage;
}
// submit button
function searchForCourses(event, self = "") {
  event?.preventDefault(); // to prevent reload the page
  HTMLcourses.innerHTML = ""; // delete all courses
  for (const course of courses) {
    if (isSubString(self?.value ?? "", course.title)) {
      createCourse(course);
    }
  }
  if (HTMLcourses.innerHTML.trim() === "") {
    failedTOLoadCourses(self.value ?? "");
  }
}

function createAllCourses(courses) {
  HTMLcourses.innerHTML = "";
  courses.forEach((course) => {
    createCourse(course);
  });
  if (HTMLcourses.innerHTML.trim() === "") {
    failedTOLoadCourses();
  }
}
// build course
const createCourse = async function (course) {
  const courseContainer = document.createElement("div");
  courseContainer.classList.add("course", "swiper-slide");

  const image = document.createElement("img");
  image.classList.add("course-img");
  image.src = course["image"];
  image.alt = course["alt"];

  courseContainer.appendChild(image);

  courseTitle = document.createElement("h4");
  courseTitle.classList.add("course-title");
  let title = course["title"];
  if (title.length > 55) {
    title = title.slice(0, 47);
    title += "...";
  }
  courseTitle.innerText = title;

  courseContainer.appendChild(courseTitle);

  courseAuthor = document.createElement("h6");
  courseAuthor.classList.add("course-author");
  const authors = course["instructors"];
  let instructorsNames = "";
  for (const { name } of authors) {
    instructorsNames += name + " , ";
  }
  courseAuthor.innerText = instructorsNames.slice(
    0,
    instructorsNames.lastIndexOf(" ,")
  );

  courseContainer.appendChild(courseAuthor);

  const courseRate = document.createElement("p");
  courseRate.classList.add("course-rate");

  const rate = Math.round(Number(course["rating"]) * 100) / 100;

  rateSpan = document.createElement("span");
  rateSpan.classList.add("rate");
  rateSpan.innerText = rate;
  courseRate.appendChild(rateSpan);
  // console.log(courseRate);

  courseRate.innerHTML += " ";
  for (let i = 0; i < rate; i++) {
    courseRate.innerHTML += "⭐";
  }
  courseRate.innerHTML += " ";
  watchSpan = document.createElement("span");
  watchSpan.classList.add("watch");
  watchSpan.innerText = `(${rate * 250})`;

  courseRate.appendChild(watchSpan);

  courseContainer.appendChild(courseRate);

  const coursePrice = document.createElement("p");
  coursePrice.classList.add("course-price");
  coursePrice.innerText = `E£${course["price"]}   `;

  const oldPrice = document.createElement("span");
  oldPrice.classList.add("alter");
  oldPrice.innerText = `E£${Math.round(course["price"] + rate * 7500) / 100}`;

  coursePrice.appendChild(oldPrice);

  courseContainer.appendChild(coursePrice);

  bestSeller = document.createElement("dev");
  bestSeller.innerText = "BestSeller";
  bestSeller.classList.add("BestSeller");
  if (rate <= 4.4) {
    bestSeller.classList.add("NoBestSeller");
  }

  courseContainer.appendChild(bestSeller);

  HTMLcourses.appendChild(courseContainer);
};
function noResult() {}
document.querySelector(".form-inp").addEventListener("keyup", function (event) {
  const self = this;
  searchForCourses(event, self);
});
document.querySelector(".form-btn").addEventListener("click", function (event) {
  const self = this.parentNode.querySelector(".form-inp");
  searchForCourses(event, self);
});
function disableSwiper() {
  if (swiperNextButton.ariaDisabled === "true") {
    swiperNextButton.classList.add("swiper-button-hidden");
    // swiperNextButton.style.display = "none";
  } else {
    swiperNextButton.classList.remove("swiper-button-hidden");
  }
  if (swiperPrevButton.ariaDisabled === "true") {
    swiperPrevButton.classList.add("swiper-button-hidden");
  } else {
    swiperPrevButton.classList.remove("swiper-button-hidden");
  }
}
// swiperNextButton.addEventListener("click", disableSwiper);
// swiperPrevButton.addEventListener("click", disableSwiper);
//entry point
getCourses(createAllCourses);
let tabs = [...document.querySelectorAll(".tab")].forEach((ele) => {
  ele.addEventListener("click", function (event) {
    const self = this;
    changeTabs(event, self);
  });
});

function changeTabs(event, self) {
  event.preventDefault();
  // console.log(self.children[0]);
  console.log(self.parentNode);
  self.children[0].classList.add("active-tab");
  self.parentNode.querySelector(`#${activeTab}`).classList.remove("active-tab");
  activeTab = self.children[0].id;
  console.log(self.children[0].id);
  getCourses(createAllCourses);
}

const swiper = new Swiper(".courses", {
  slidesPerView: 5,
  spaceBetween: 25,
  slidesPerGroup: 3,
  watchOverflow: true,
  loop: false,
  centerSlide: "false",
  fade: "false",
  grabCursor: "false",
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
      slidesPerGroup: 1,
    },
    650: {
      slidesPerView: 2,
      slidesPerGroup: 1,
    },
    800: {
      slidesPerView: 3,
      slidesPerGroup: 2,
    },
    950: {
      slidesPerView: 4,
      slidesPerGroup: 3,
    },

    1350: {
      slidesPerView: 5,
      slidesPerGroup: 4,
    },
  },
});
