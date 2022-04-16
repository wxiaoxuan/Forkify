class SearchView {
    #parentEl = document.querySelector('.search');

    getQuery() {
        const query = this.#parentEl.querySelector('.search__field').value;
        this.#clearInput();
        return query;
    }

    #clearInput() {
        this.#parentEl.querySelector('.search__field').value = '';
    }
 
    addHandlerSearch(handler) {
        this.#parentEl.addEventListener('submit', function(e){
            e.preventDefault(); //prevent default action else page is gg to reload
            handler(); //control of searchResults function
        })
    }
}

export default new SearchView();