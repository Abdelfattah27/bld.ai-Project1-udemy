let courses;
const HTMLcourses = document.querySelector(".courses");
const newFetch = async () => {
  let response = await fetch("http://localhost:3000/courses");
  let json = await response.json();
  courses = json;
  return json;
};
function getData(create) {
  newFetch().then((x) => create(x));
}
function compareStrings(str, stri) {
  str = str.toLowerCase();
  stri = stri.toLowerCase();
  for (let i = 0; i <= stri.length - str.length; i++) {
    const sub = stri.slice(i, i + str.length);
    if (sub === str) {
      return true;
    }
  }
  return false;
}
getData(createAllCourses);
function changeContent() {
  HTMLcourses.innerHTML = "";
  for (let i = 0; i < courses.length; i++) {
    let title = courses[i]["course-title"];
    if (compareStrings(this.value, title)) {
      createCourse(courses[i]);
    }
  }
}
function createAllCourses(courses) {
  for (let i = 0; i < courses.length; i++) {
    createCourse(courses[i]);
  }
}
// newFetch()
// newFetch.then((x) => clo(x));
// clo(ww);

const createCourse = async function (course) {
  const courseContainer = document.createElement("div");
  courseContainer.classList.add("course");

  const image = document.createElement("img");
  image.classList.add("course-img");
  image.src = course["image"];
  image.alt = course["alt"];

  courseContainer.appendChild(image);

  courseTitle = document.createElement("h4");
  courseTitle.classList.add("course-title");
  courseTitle.innerText = course["course-title"];

  courseContainer.appendChild(courseTitle);

  courseAuthor = document.createElement("h6");
  courseAuthor.classList.add("course-author");
  courseAuthor.innerText = course["course-author"];

  courseContainer.appendChild(courseAuthor);

  const courseRate = document.createElement("p");
  courseRate.classList.add("course-rate");

  const rate = Number(course["course-rate"]);

  rateSpan = document.createElement("span");
  rateSpan.classList.add("rate");
  rateSpan.innerText = rate;
  courseRate.appendChild(rateSpan);
  console.log(courseRate);

  courseRate.innerHTML += " ";
  for (let i = 0; i < rate; i++) {
    courseRate.innerHTML += "⭐";
  }
  courseRate.innerHTML += " ";
  watchSpan = document.createElement("span");
  watchSpan.classList.add("watch");
  watchSpan.innerText = `(${course["watches"]})`;

  courseRate.appendChild(watchSpan);

  courseContainer.appendChild(courseRate);

  const coursePrice = document.createElement("p");
  coursePrice.classList.add("course-price");
  coursePrice.innerText = `E£${course["course-price"]}   `;

  const oldPrice = document.createElement("span");
  oldPrice.classList.add("alter");
  oldPrice.innerText = `E£${course["course-old-price"]}`;

  coursePrice.appendChild(oldPrice);

  courseContainer.appendChild(coursePrice);

  bestSeller = document.createElement("dev");
  bestSeller.innerText = "BestSeller";
  bestSeller.classList.add("BestSeller");
  if (Number(course["bestSeller"]) === 0) {
    bestSeller.classList.add("NoBestSeller");
  }

  courseContainer.appendChild(bestSeller);

  HTMLcourses.appendChild(courseContainer);
};

document.querySelector(".form-inp").addEventListener("keyup", changeContent);
document.querySelector(".form-btn").addEventListener("click", changeContent);
