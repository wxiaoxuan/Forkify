import View from './View.js';
import icons from '../../img/icons.svg';

// CHILD CLASS OF VIEW 
class PaginationView extends View{
    _parentElement = document.querySelector('.pagination');

    // Make the buttons work
    addHandlerCLick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');
            // console.log(btn);
            if (!btn) return;

            const goToPage = +btn.dataset.goto;
            // console.log(goToPage);

            handler(goToPage);
        })
    }

    // Display the pages buttons 
    _generateMarkup() {
        const currentPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        // console.log(numPages);
        // Pg 1, and there are other pages 
        if (currentPage === 1 && numPages > 1) {
            return `
                <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
                    <span>${currentPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        }
        
        // Last page
        if(currentPage === numPages && numPages > 1) {
            return `
                <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>${currentPage - 1}</span>
                </button>
            `;
        }

        // Other page 
        if(currentPage < numPages) {
            return `
                <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>${currentPage - 1}</span>
                </button>
            
                <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
                <span>${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `;
        }

        // Pg 1, and there are NO other pages 
        return ``;
    }
}

export default new PaginationView();