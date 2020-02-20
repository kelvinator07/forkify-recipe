import axios from 'axios';
import * as config from './../config';
import { elements } from '../views/base';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    
    async getRecipe(id) {
        try {
            const result = await axios(`${config.food2fork_proxy}${config.base_url_food2fork}get?rId=${this.id}`);
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
            
        } catch (error) {
            alert(error);
        }
        
    }

    calculateTime() {
        const numofIngredients = this.ingredients.length;
        const periods = Math.ceil(numofIngredients / 3);
        this.time = periods * 5;
    }

    calculateServings() {
        this.servings = 5;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(element => {
            // uniform units
            //console.log(element);
            let ingredient = element.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //parse ingredients into count unit and ingredient
            const arrayIngredients = ingredient.split(' ');
            const unitIndex = arrayIngredients.findIndex(el => {
                units.includes(el);
            });

            let objectIngredient;
            if (unitIndex > -1) {
                // Units found
                const arrayCount = arrayIngredients.slice(0, unitIndex); // Ex. 4 1/2 cups, arrayCount = [4, 1/2];
                let count;
                if (arrayCount.length === 1) {
                    count = eval(arrayIngredients[0].replace('-', '+'));
                } else {
                    count = eval(arrayIngredients.slice(0, unitIndex).join('+'));
                }

                objectIngredient = {
                    count,
                    unit: arrayIngredients[unitIndex],
                    ingredient: arrayIngredients.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrayIngredients[0], 10)) {
                // No Unit but 1st element is a number
                objectIngredient = {
                    count: parseInt(arrayIngredients[0], 10),
                    unit: '',
                    ingredient: arrayIngredients.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // No Unit
                objectIngredient = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objectIngredient;

        });
        this.ingredients = newIngredients
    }

    updateServings(type) {
        // servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ingredient => {
            ingredient.count *= (newServings / this.servings);
        });

        this.servings = newServings;

    }
}
