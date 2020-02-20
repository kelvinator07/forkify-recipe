import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => elements.searchInput.value = '';

export const clearResults = () =>  { 
    elements.searchResultsList.innerHTML = '',
    elements.searchResultsPages.innerHTML = '' 
};

export const highlightSelected = id => {
    const resultsArray = Array.from(document.querySelectorAll('.results__link'));
    resultsArray.forEach(element => element.classList.remove('results__link--active'));

    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};


/*
// 'Pasta with tomato and spinach'
acc: 0 / acc + element.length = 5 / newTitle = ['Pasta']
acc: 5 / acc + element.length = 9 / newTitle = ['Pasta', 'with']
acc: 9 / acc + element.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
acc: 15 / acc + element.length = 18 / newTitle = ['Pasta', 'with', 'tomato', 'and']
acc: 18 / acc + element.length = 24 / newTitle = ['Pasta', 'with', 'tomato', 'and', 'spinach']
*/
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        let words = title.split(' ').reduce((acc, element) => {
            if (acc + element.length <= limit) {
                newTitle.push(element);
            }
            return acc + element.length;
        }, 0);

        // return the result
        return `${newTitle.join(' ')} ...`;
    }

    return title;
};


const renderRecipe = recipe => {
    const markup = `
            <li>
                <a class="results__link results__link--active" href="#${recipe.recipe_id}">
                    <figure class="results__fig">
                        <img src="${recipe.image_url}" alt="Test">
                    </figure>
                    <div class="results__data">
                        <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                        <p class="results__author">${recipe.publisher}</p>
                    </div>
                </a>
            </li>
    `;

    elements.searchResultsList.insertAdjacentHTML('beforeend', markup);
}

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numberOfResults, resultsPerPage) => {
    const pages = Math.ceil(numberOfResults / resultsPerPage);

    let button;
    if (page === 1 && pages > 1) {
        // Only button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Both buttons
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}`;
    } else if (page === pages && pages > 1) {
        // Only button to go to next page
        button = createButton(page, 'prev');
    }

    elements.searchResultsPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, recipePerPage = 10) => {
    const start = (page - 1) * recipePerPage;
    const end = page * recipePerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination buttons

    renderButtons(page, recipes.length, recipePerPage);
};
