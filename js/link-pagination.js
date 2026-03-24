// pagination.js
let currentPage = 1;
const itemsPerPage = 13;
let filteredItems = [...items];

function displayList(itemsToShow, page) {
    const list = document.getElementById('list');
    list.innerHTML = '';
    
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = itemsToShow.slice(start, end);
    
    if (paginatedItems.length === 0) {
        list.innerHTML = '<li class="no-results">No matching found</li>';
    } else {
        paginatedItems.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.link;
            if (item.target) {
                a.target = item.target;
            }
            // Add rel="noopener noreferrer" for security when using target="_blank"
            if (item.target === "_blank") {
                a.rel = "noopener noreferrer";
            }
            a.innerHTML = `<span class="star">★</span> ${item.name}`;
            li.appendChild(a);
            list.appendChild(li);
        });
    }
    
    setupPagination(itemsToShow, page);
}

function setupPagination(itemsToShow, page) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    const pageCount = Math.ceil(itemsToShow.length / itemsPerPage);
    
    if (pageCount <= 1) return;
    
    // Previous button
    if (page > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Prev';
        prevBtn.addEventListener('click', () => {
            currentPage = page - 1;
            displayList(filteredItems, currentPage);
        });
        pagination.appendChild(prevBtn);
    }
    
    // Page numbers
    for (let i = 1; i <= pageCount; i++) {
        if (i === 1 || i === pageCount || (i >= page - 1 && i <= page + 1)) {
            const btn = document.createElement('button');
            btn.textContent = i;
            if (i === page) {
                btn.classList.add('active');
            }
            btn.addEventListener('click', () => {
                currentPage = i;
                displayList(filteredItems, currentPage);
            });
            pagination.appendChild(btn);
        } else if (i === page - 2 || i === page + 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            pagination.appendChild(ellipsis);
        }
    }
    
    // Next button
    if (page < pageCount) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.addEventListener('click', () => {
            currentPage = page + 1;
            displayList(filteredItems, currentPage);
        });
        pagination.appendChild(nextBtn);
    }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initial display
    displayList(filteredItems, currentPage);
    
    // Add search functionality if search input exists
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filteredItems = items.filter(item => 
                item.name.toLowerCase().includes(searchTerm)
            );
            currentPage = 1;
            displayList(filteredItems, currentPage);
        });
    }
});