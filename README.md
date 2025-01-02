# product-carousel
This repository created for Insider I Software Tech Hub Project (JS) Product Carousel case study.
## Completed Parts:
### Data Processing: 
- Product data received via JSON_URL.
- Product data was retrieved with fetchProducts function.
- The retrieved data was saved in LocalStorage (PRODUCTS_KEY).
### Creating Carousel HTML Structure:
- Added title (“You Might Also Like”).
- Added left and right scroll buttons.
- Added a container to list the products.
- This structure was placed just below the .product-detail element.
### Dynamically Adding CSS Styles for Carousel:
- Created the necessary CSS styles for the external and internal structure of the carousel.
- Properties such as scroll-behavior, scroll-snap-align were used for a flexible structure.
- Responsive design was made for different screen sizes.
- Coloring was added to the favorite button.
### Display of Products for Carousel has been added.
### Defining Events for User Interactions:
- Added Favorite Button.
- Left and Right Scroll Buttons added.
- Added function to scroll products left and right with mouse (enableDragScroll).
- Product Click function has been added.

### Performance Loading of Images with Lazy Loading: 
- With the enableLazyLoading function, only the images visible on the user's screen are loaded.

### Control of Favorite Add/Remove Operations has been provided.
