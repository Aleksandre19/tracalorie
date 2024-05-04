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


class Item {
  /* 
    Meal and Workout class.
  */
  constructor(type, name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.type = type;
    this.name = name;
    this.calories = calories;
  }
}


class Storage {

  // Handle Calories Limit. //
  static getCalorieLimit(defaultLimit = 2000) {
    return localStorage.getItem('calorieLimit') === null
      ? defaultLimit
      : +localStorage.getItem('calorieLimit');
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem('calorieLimit', calorieLimit);
  }

  // Handle Total Calories. //
  static getTotalCalories(defaultCalories = 0) {
    return localStorage.getItem('totalCalories') === null
      ? defaultCalories
      : +localStorage.getItem('totalCalories');
  }

  static setTotalCalories(totalCalories) {
    localStorage.setItem('totalCalories', totalCalories);
  }

  // Handle Meals. //
  static getMeals() {
    const mealsInStorage = localStorage.getItem('meals');

    return  mealsInStorage === null
      ? [] : JSON.parse(mealsInStorage);  
  }

  static saveMeals(meal) {
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static removeMeal(id) {
    const meals = Storage.getMeals();
    const remainingMeals = meals.filter((meal) => meal.id != id);
    localStorage.setItem('meals', JSON.stringify(remainingMeals));
  }


  // Handle Workout. //
  static getWorkouts() {
    const workputsInStorage = localStorage.getItem('workouts');

    return  workputsInStorage === null
      ? [] : JSON.parse(workputsInStorage);  
  }

  static saveWorkouts(workout) {
    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkouts();
    const remainingWorkout = workouts.filter((workout) => workout.id != id);
    localStorage.setItem('workouts', JSON.stringify(remainingWorkout));
  }
  
  // Clear Storage. //
  static clear() { 
      localStorage.removeItem('totalCalories');
      localStorage.removeItem('meals');
      localStorage.removeItem('workouts');
  }

}


class App {
  // Define Private Propertise. //
  #trucker;

  constructor() {
    // Initialize Trucker. //
    this.#trucker = new CalorieTracker();

    // Load Events. //
    this.#loadEventListeners();
    
    // Display Meals. //
    this.#trucker.displayItems();
  }
  
  #loadEventListeners() {
    document
      .getElementById('meal-form')
      .addEventListener('submit', this.#newItem.bind(this, 'meal'));
    
    // Add workout item event. //
    document
      .getElementById('workout-form')
      .addEventListener('submit', this.#newItem.bind(this, 'workout'));
    
    // Remove item. //
    document
      .getElementById('meal-items')
      .addEventListener('click', this.#removeItem.bind(this, 'meal'));
    
    document
      .getElementById('workout-items')
       .addEventListener('click', this.#removeItem.bind(this, 'workout'));
    
    // Filter items. //
    document
      .getElementById('filter-meals')
      .addEventListener('keyup', this.#filterItems.bind(this, 'meal'));
    
    document
      .getElementById('filter-workouts')
      .addEventListener('keyup', this.#filterItems.bind(this, 'workout'));
  
    // Reset. //
    document
      .getElementById('reset')
      .addEventListener('click', this.#reset.bind(this)); 
    
    // Set Calorie Limit. //
    document
      .getElementById('limit-form')
      .addEventListener('submit', this.#setLimit.bind(this));
  }

  #newItem(type, e) {
    e.preventDefault();

    // Grab Values. //
    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    // Validate Inputs. // 
    if (name.value === '' || calories.value === '') {
      alert('Please fill in all fields.');
      return;
    }

    // Create and Add Meals/Workouts. //
    if (type === 'meal') {
      const meal = new Item('meal', name.value, +calories.value);
      this.#trucker.addMeal(meal);    
    } else {
      const workout = new Item('workout', name.value, +calories.value);
      this.#trucker.addWorkout(workout); 
    }

    // Clear Inputs. //
    name.value = '';
    calories.value = '';

    // Collapse Form. //
    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(collapseItem, {
      toggle: true
    });
  }

  #removeItem(type, e) {
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {

      // Confirm action. //
      if (!confirm('Are you sure ?')) return;
      
      // Grab Item Container ID. //
      const id = e.target.closest('.card').getAttribute('data-id');

      type === 'meal'
        ? this.#trucker.removeMeal(id)
        : this.#trucker.removeWorkout(id);

      e.target.closest('.card').remove();
    }      
  }

  // Search Meal/Workout in the List. //
  #filterItems(type, e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll(`#${type}-items .card`).forEach(item => {
      const name = item.firstElementChild.firstElementChild.textContent;

      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Reset Settings. //
  #reset() {
    if (confirm('Are you sure that you want to reset settings?')) {   
      this.#trucker.reset();
      document.getElementById('meal-items').innerHTML = '';
      document.getElementById('workout-items').innerHTML = '';
      document.getElementById('filter-meals').value = '';
      document.getElementById('filter-workouts').value = '';
    }
  }

  #setLimit(e) {
    e.preventDefault();
    const limit = document.getElementById('limit');

    if (limit.value === '') {
      alert('Please set a value.');
      return;
    }

    this.#trucker.setLimit(+limit.value);
    limit.value = '';

    // Close Modal. //
    const modalEl = document.getElementById('limit-modal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }

}

const app = new App();