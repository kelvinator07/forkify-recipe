import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Liked recipes
 */

 // Initial state of the app
const state = {};

/*
* SEARCH CONTROLLER
*/

const controlSearch = async () => {
    // get query from the view
    const query = searchView.getInput();
    //const query = 'pizza';

    if (query) {
        // new search object and add to state
        state.search = new Search(query);

        // prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        try {
        // search for recipes
        await state.search.getResults();
        
        // render results on UI
        clearLoader(); 
        searchView.renderResults(state.search.recipes);

        } catch(error) {
            clearLoader(); 
            alert(error);
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResultsPages.addEventListener('click', element => {
    const button = element.target.closest('.btn-inline');
    if (button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.recipes, goToPage);
    }
    
});


/*
*  RECIPE CONTROLLER
*/

const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');
    
    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // select highlight Selected
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        // testing
        //window.r = state.recipe;

        try {
            // Get recipe data
            await state.recipe.getRecipe();
            //console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calculateTime();
            state.recipe.calculateServings();

            // Render recipe
            //console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        
        } catch(error) {
            alert(error);
        }
        
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/*
*  LIST CONTROLLER
*/

const controlList = () => {
    // Creat a new list if there is none yet
    if (!state.list) state.list = new List();

    //Add each ingredient to the list
    state.recipe.ingredients.forEach(element => {
        const item = state.list.addItem(element.count, element.unit, element.ingredient);
        listView.renderItem(item);
    })
};



/*
*  LIKE CONTROLLER
*/

const controlLike = () => {
    // Creat a new list if there is none yet
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // user has not liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img,
        );
        // Toggle the like button
        likesView.toggleLikeButton(true);

        // Add like to UI list
        likesView.renderLike(newLike);

    // User HAS liked current recipe
    } else {

        // Remove like to the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeButton(false);

        // Remove like to UI list
        likesView.deleteLike(currentID);

    }

    likesView.toggleLikeMenu(state.likes.getNumberofLikes());

};

// restore like recipes when page loads
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readFromLocalStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumberofLikes());

    // render existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
})


// handle delete and update list item events
elements.shopping.addEventListener('click', event => {
    const id = event.target.closest('.shopping__item').dataset.itemid;

    //handle delete
    if (event.target.matches('.shopping__delete, .shopping__delete *')) {

        // delete from state
        state.list.deleteItem(id);

        // delete from UI
        listView.deleteItem(id);

    } else if (event.target.matches('.shopping__count-value')) {
        console.log(' item ' , state.list.items);
        const val = parseFloat(event.target.value, 10);
        state.list.updateCount(id, val);
    } 
});



// handling recipe button clicks
elements.recipe.addEventListener('click', event => {
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease servings
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
            
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        // Increase servings
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});






