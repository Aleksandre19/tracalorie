import Storage from "./Storage";

class CalorieTracker {
  
  // Define Private Properties. //
  #calorieLimit;
  #totalCalories;
  #meals;
  #workouts;

  constructor() {
    // Properties. //
    this.#calorieLimit = Storage.getCalorieLimit();
    this.#totalCalories = Storage.getTotalCalories();
    this.#meals = Storage.getMeals();
    this.#workouts = Storage.getWorkouts();

    // Call Methods. //
    this.#displayCaloriesTotal();
    this.#displayCaloriesLimit();
    this.#displayCaloriesConsumed();
    this.#displayCaloriesBurned();
    this.#displayCaloriesRemaining();
    this.#displayCaloriesProgress();

    //Set Calorie Limit. //
    document.getElementById('limit').value = this.#calorieLimit;
  }
  
  // Public Methods. //

  addMeal(meal) {
    this.#meals.push(meal);
    this.#totalCalories += meal.calories;
    Storage.setTotalCalories(this.#totalCalories);
    Storage.saveMeals(meal);
    this.#displayNewItem(meal);
    this.#render();
  }

  addWorkout(workout) {
    this.#workouts.push(workout);
    this.#totalCalories -= workout.calories;
    Storage.setTotalCalories(this.#totalCalories);
    Storage.saveWorkouts(workout);
    this.#displayNewItem(workout);
    this.#render();
  }

  removeMeal(id) {
    //Check if Meals exists. //
    const index = this.#meals.findIndex(m => m.id === id);
    if (index === -1) return;

    const meal = this.#meals[index];
    this.#totalCalories -= meal.calories;
    Storage.setTotalCalories(this.#totalCalories);
    this.#meals.splice(index, 1);
    Storage.removeMeal(id);
    this.#render();
  }

  removeWorkout(id) {
    // Check if Meals exists. //
    const index = this.#workouts.findIndex(workout => workout.id === id);
    if (index === -1) return;

    const workout = this.#workouts[index];
    this.#totalCalories += workout.calories;
    Storage.setTotalCalories(this.#totalCalories);
    this.#workouts.splice(index, 1);
    Storage.removeWorkout(id);
    this.#render();
  }

  // Reset Settings. //
  reset() {
    this.#totalCalories = 0;
    this.#meals = [];
    this.#workouts = [];
    Storage.clear();
    this.#render();
  }

  setLimit(caloriesLimit) {
    this.#calorieLimit = caloriesLimit;
    Storage.setCalorieLimit(caloriesLimit);
    this.#displayCaloriesLimit();
    this.#render();
  }

  // On webpage load display Meals and Workouts. //
  displayItems() {
    this.#meals.forEach(meal => this.#displayNewItem(meal));
    this.#workouts.forEach(workout => this.#displayNewItem(workout));
  }

  // Private Methods. //

  #displayCaloriesTotal() {
    const totalCaloriesEl = document.getElementById('calories-total');
    totalCaloriesEl.innerHTML = this.#totalCalories;
  }

  #displayCaloriesLimit() {
    const caloriesLimitEl = document.getElementById('calories-limit');
    caloriesLimitEl.innerHTML = this.#calorieLimit;
  }

  #displayCaloriesConsumed() {
    const caloriesConsumedEl = document.getElementById('calories-consumed');
    const consumed = this.#meals.reduce((total, meal) => total + meal.calories, 0);
    caloriesConsumedEl.innerHTML = consumed;
  }

  #displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById('calories-burned');
    const burned = this.#workouts.reduce((total, workout) => total + workout.calories, 0);
    caloriesBurnedEl.innerHTML = burned;
  }

  #displayCaloriesRemaining() {
    const caloriesRemainingEl = document.getElementById('calories-remaining');
    const progressEl = document.getElementById('calorie-progress');

    const remaining = this.#calorieLimit - this.#totalCalories;
    caloriesRemainingEl.innerHTML = remaining;

    // Set a red color for calories remaining and progress bar. //
    if (remaining <= 0) {
      // Remaining Calories. //
      caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light');
      caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger');

      // Progress Bar. //
      progressEl.classList.remove('bg-success');
      progressEl.classList.add('bg-danger');
    } else {
      // Remaining Calories. //
      caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
      caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger');

      // Progress Bar. //
      progressEl.classList.add('bg-success');
      progressEl.classList.remove('bg-danger');
    }
  }

  #displayCaloriesProgress() {
    const caloriesProgressEl = document.getElementById('calorie-progress');
    const percentage = (this.#totalCalories / this.#calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    caloriesProgressEl.style.width = `${width}%`;
  }

  #displayNewItem(item) {
    /*
      This class displayes the added meals and workouts.
    */
    
    // Set item bame and budge color. //
    let itemName = 'meal'
    let budgeColor = 'bg-primary';

    if (item.type === 'workout') {
      itemName = 'workout';
      budgeColor = 'bg-secondary';
    } 

    // Grab items container. //
    const itemContainer = document.getElementById(`${itemName}-items`);

    // Create a item element and set classes and attribute. //
    const itemElm = document.createElement('div');
    itemElm.classList.add('card', 'my-2');
    itemElm.setAttribute('data-id', item.id);

    // Item HTML. //
    itemElm.innerHTML = `
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${item.name}</h4>
          <div
            class="fs-1 ${budgeColor} text-white text-center rounded-2 px-2 px-sm-5"
          >
            ${item.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    `

    // Append item HTML to container. //
    itemContainer.appendChild(itemElm);
  }

  #render() {
    this.#displayCaloriesTotal();
    this.#displayCaloriesConsumed();
    this.#displayCaloriesBurned();
    this.#displayCaloriesRemaining();
    this.#displayCaloriesProgress();
  }
}

export default CalorieTracker;