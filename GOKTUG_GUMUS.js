(() => {
    const JSON_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
    const FAVORITES_KEY = "favorite_products";
    const PRODUCTS_KEY = "products";
    let products = [];
    let favorites = [];
    
    const init = async () => {
        if (!document.querySelector(".product-detail")) {
            console.error("Only works on product detail page!");
            return;
        }

        favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

        // Clean invalid favorites
        cleanFavorites();

        // Load products from localStorage or fetch them from JSON_URL
        products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || await fetchProducts();

        if (!products || products.length === 0) {
            $(".product-detail").after("<p>Products couldn't load. Please try again later.</p>");
            return;
        }

        // Save products to localStorage
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

        buildHTML(); 
        buildCSS(); 
        renderCarousel(products);
        setEvents();
        enableLazyLoading();
    };

    const fetchProducts = async () => { // Fetch product informations from JSON_URL
        try {
            const response = await fetch(JSON_URL);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    };
    // Build HTML part
    const buildHTML = () => {
        const html = `
            <div class="carousel-container">
                <h2>You Might Also Like</h2>
                <div class="carousel-wrapper">
                    <button class="carousel-btn left">&#8592;</button>
                    <div class="carousel-items"></div>
                    <button class="carousel-btn right">&#8594;</button>
                </div>
            </div>
        `;
        $(".product-detail").after(html);
    };

    const buildCSS = () => {
        const css = `
            .carousel-container {   /* Caroulse Container Part */
                margin-top: 30px;
                padding: 20px;
                background-color: #ffffff; 
                border: 1px solid #e5e5e5; 
                border-radius: 5px;
            }
            .carousel-container h2 { /* Carousel Header Part */
                color: #0046be; 
                font-family: Arial, sans-serif;
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 15px;
                text-align: left; 
            }
            .carousel-wrapper { /* Carousel Wrapper Part */
                display: flex;
                align-items: center;
                position: relative;
            }
            .carousel-items { /* Carousel Item Sequence Part */
                display: flex;
                overflow-x: auto; 
                width: 100%;
                scroll-behavior: smooth;
                scroll-snap-type: x mandatory;
            }
            .carousel-items::-webkit-scrollbar { /* Carousel Scrollbar Hidden */
                display: none;
            } 
            .carousel-items .item { /* Carousel Item Display Part */
                flex: 0 0 calc(100% / 6.75);
                margin: 5px;
                text-align: center;
                border: 1px solid #e5e5e5; 
                border-radius: 5px;
                position: relative;
                scroll-snap-align: start;
                background-color: #f9f9f9; 
            }
            .carousel-items .item img { /* Carousel Item Image Part */
                width: 100%;
                height: auto;
                border-radius: 5px;
                cursor: pointer;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .carousel-items .item .favorite { /* Carousel Item Favorite Image Part */
                position: absolute;
                top: 10px;
                right: 10px;
                background: #ffffff; 
                border: 1px solid #e5e5e5; 
                border-radius: 0%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 25px; 
                cursor: pointer;
                color: #b0b0b0; 
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); 
            }
            .carousel-items .item .favorite.active { /* Favorite Image Active Part */
                color: #0046be; 
            }
            .carousel-items .item .price { /* Carousel Item Price Part */
                color: #0046be; 
                font-weight: bold;
                font-size: 14px;
            }
            .carousel-items .item .product-name { /* Carousel Item Product Name Part */
                color: black; 
                font-size: 14px; 
                font-weight: bold; 
                text-decoration: none; 
                cursor: pointer; 
                transition: text-decoration 0.3s ease; 
            }
            .carousel-btn { /* Carousel Left/Right Button Part */
                position: absolute;
                top: 40%;
                transform: translateY(-50%);
                background: #0071ce; 
                color: #ffffff; 
                border: none;
                padding: 10px 15px;
                cursor: pointer;
                z-index: 1;
                border-radius: 5px;
            }
            .carousel-btn:hover { /* Carousel Left/Right Button Hover Part */
                background: #0046be; 
                transition: background-color 0.3s ease;
            }
            .carousel-btn.left {
                left: 0;
            }
            .carousel-btn.right {
                right: 0;
            }
            @media (max-width: 1024px) { /* Responsive Scale Part for 1024px */
                .carousel-items .item {
                    flex: 0 0 calc(100% / 4.5);
                }
            }
            @media (max-width: 768px) { /* Responsive Scale Part for 768px */
                .carousel-items .item {
                    flex: 0 0 calc(100% / 2.5);
                }
            }
            @media (max-width: 480px) { /* Responsive Scale Part for 480px */
                .carousel-items .item {
                    flex: 0 0 calc(100% / 1.5);
                }
            }
        `;
        $("<style>").html(css).appendTo("head");
    };

    const cleanFavorites = () => { // Remove invalid item id from local storage when init
        favorites = favorites.filter(fav => fav.id && fav.name && fav.url); // Keep only valid favorite objects
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); 
    };

    const renderCarousel = (products) => {
        const itemsContainer = $(".carousel-items");
        itemsContainer.empty(); // Clear existing items

        products.forEach(product => {
            const isFavorite = favorites.some(fav => fav.id === product.id); // Check if the product is in favorites
            const item = `
                <div class="item" data-id="${product.id}">
                    <img data-src="${product.img}" alt="${product.name}">
                    <a href="${product.url}" target="_blank" class="product-name">${product.name}</a>
                    <p class="price">${product.price} TRY</p>
                    <span class="favorite ${isFavorite ? 'active' : ''}">&#9829;</span>
                </div>
            `;

            itemsContainer.append(item);
        });
    };
    const enableDragScroll = () => { // Scroll Dragging function
        const carousel = document.querySelector(".carousel-items");
        let isDragging = false;
        let startX;
        let scrollLeft;
    
        // Prevent default drag
        carousel.querySelectorAll("img").forEach((img) => {
            img.addEventListener("dragstart", (e) => e.preventDefault());
        });
        // Mouse down part for dragging
        carousel.addEventListener("mousedown", (e) => {
            isDragging = true;
            carousel.classList.add("dragging");
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });
        
        // Mouse leave from dragging area part
        carousel.addEventListener("mouseleave", () => {
            isDragging = false;
            carousel.classList.remove("dragging");
        });
        
        // Mouse up after click
        carousel.addEventListener("mouseup", () => {
            isDragging = false;
            carousel.classList.remove("dragging");
        });
    
        // Mouse movement
        carousel.addEventListener("mousemove", (e) => {
            if (!isDragging) return; // Only works on dragging
            e.preventDefault(); // Prevent default browser
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 5; // Drag speed part
            carousel.scrollLeft = scrollLeft - walk;
        });
    };
    

    const setEvents = () => { // Event listeners
        $(document).on("click", ".carousel-btn.left", function () { // Left scroll button
            const container = $(".carousel-items"); 
            const itemWidth = container.find(".item").outerWidth(true);
            container.animate({ scrollLeft: `-=${itemWidth}` }, 300);
        });

        $(document).on("click", ".carousel-btn.right", function () { // Right scroll button
            const container = $(".carousel-items");
            const itemWidth = container.find(".item").outerWidth(true);
            container.animate({ scrollLeft: `+=${itemWidth}` }, 300);
        });

        $(document).on("click", ".favorite", function (e) { // Favorite button
            e.stopPropagation();
            const itemId = $(this).closest(".item").data("id");
            $(this).toggleClass("active");
            toggleFavorite(itemId);
        });

        $(document).on("click", ".item", function (e) { // Item click part for Item URL opening
            if (!$(e.target).hasClass("favorite")) {
                const itemId = $(this).data("id");
                const product = products.find(product => product.id === itemId);
                if (product) window.open(product.url, "_blank");
            }
        });
        enableDragScroll(); // Scroll Part with dragging
    };

    const toggleFavorite = (id) => {
        const product = products.find(p => p.id === id); // Get the full product object
        if (!product) return; // If the product doesn't exist, do nothing

        const index = favorites.findIndex(fav => fav.id === id);

        if (index > -1) {
            // Remove from favorites
            favorites.splice(index, 1);
        }
        else {
            // Add to favorites
            favorites.push(product);
        }

        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    };

    const enableLazyLoading = () => { // Optimization part about rendering images
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('.item img').forEach(img => {
            observer.observe(img);
        });
    };

    init();
})();
