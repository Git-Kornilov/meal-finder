"use strict";

const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const resultHeading = document.getElementById("result-heading");
const mealsEl = document.getElementById("meals");
const single_mealEl = document.getElementById("single-meal");

const searchURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const searchByIdURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const searchRandomURL = "https://www.themealdb.com/api/json/v1/1/random.php";

// Search meal and fetch from API
const searchMeal = function (e) {
  e.preventDefault();

  //   Clear single meal
  single_mealEl.innerHTML = "";

  //   Get the search term
  const term = search.value;

  //   Check for empty
  if (term.trim()) {
    fetch(`${searchURL}${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        resultHeading.innerHTML = `<h2>Search results for "${term}":</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
			<div class="meal">
			<img src="${
        meal.strMealThumb ? meal.strMealThumb : "/img/no_image.jpg"
      }" alt="${meal.strMeal}" />
			<div class="meal-info" data-mealID="${meal.idMeal}"><h3>${
                meal.strMeal
              }</h3></div>			
			</div>
		  `
            )
            .join("");
        }
      });

    //   Clear search
    search.value = "";
  } else {
    alert("Please enter a search term");
  }
};

// Add meal to DOM
const addMealToDOM = function (meal) {
  const ingredients = [];

  // Here is a tricky info from API with ingredients
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${
        meal.strMealThumb ? meal.strMealThumb : "/img/no_image.jpg"
      }" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
      </div>
      <div class="main">
      <p>${meal.strInstructions}</p>
      <h2>Ingredients</h2>
      <ul>
        ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}      
      </ul>
      </div>  
    </div>
  `;
};

// Fetch meal by ID
const getMealByID = function (mealID) {
  fetch(`${searchByIdURL}${mealID}`).then((res) =>
    res.json().then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    })
  );
};

// Random meal
const randomMeal = function () {
  // Clear meals and heading
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`${searchRandomURL}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
};

// addEventListener
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", randomMeal);

mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.composedPath().find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealID");
    getMealByID(mealID);
  }
});
