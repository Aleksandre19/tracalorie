import '@fortawesome/fontawesome-free/js/all';
import { Modal, Collapse } from 'bootstrap';
import CalorieTracker from './Tracker';
import Item from './Items';

import './css/bootstrap.css';
import './css/style.css';

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
    const bsCollapse = new Collapse(collapseItem, {
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
    const modal = Modal.getInstance(modalEl);
    modal.hide();
  }

}

const app = new App();