import * as model from './model.js';
import { MODAL_CLOSE_SECS } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // polyfill everything else
import 'regenerator-runtime/runtime'; // polyfill async/await
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

// this comes from parcel
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    //take the hash of entire url
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0. Update results view to mark selected search result
    resultsView.update(model.getSearchResultPage());

    // 1. UPDATING BOOKMARKS VIEW
    bookmarksView.update(model.state.bookmarks);

    // 2. LOADING RECIPE
    await model.loadRecipe(id); //return a promise

    // 3. RENDERING RECIPE
    recipeView.render(model.state.recipe);
  } catch (err) {
    alert(err);
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    console.log(resultsView);

    // 1. Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load Search Results
    await model.loadSearchResults(query);

    //3. Render Results
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultPage(1));

    // 4. Render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1. Render New Results
  resultsView.render(model.getSearchResultPage(goToPage));

  // 2. Render NEW pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update recipe servings (in state)
  model.updateServings(newServings);

  //Update Recipe View
  // recipeView.render(model.state.recipe);
  //update : only update text and attributes in the DOM
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1.  Add / Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update recipe view
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message 
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back(); // go back to the last page 

    // Close the form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECS * 1000);

  } catch (err) {
    // catch the rejected promise in uploadRecipe (model.js)
    console.error('blop', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerCLick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
