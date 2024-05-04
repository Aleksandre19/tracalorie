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

export default Storage;