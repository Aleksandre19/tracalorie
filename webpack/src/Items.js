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

export default Item;