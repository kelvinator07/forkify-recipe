import axios from 'axios';
import * as config from './../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    
    // https://api.spoonacular.com/recipes/search
    // API Key: 451a31d781f94333aa0b0c353df14fb9

    async getResults(query) {
        try {
            const result = await axios(`${config.food2fork_proxy}${config.base_url_food2fork}search?&q=${this.query}`);
            //spoonocular
            //this.recipes = result.data.results;
            
            // food2fork
            this.recipes = result.data.recipes;
            //console.log(this.recipes);
        } catch (error) {
            alert(error);
        }
        
    }
}
