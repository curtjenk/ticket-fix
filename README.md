# Coffee

## Recipe App
Team: Curtis, Josh, Jeremy, and Kochan

### Synopsis


### Components
The app is broken into several components: the navbar, which contains all the navigation and log-in features; the home view, which presents the highest rated recipes starting with the highest rated; the recipe view, which returns recipes based on user search parameters; the user profile/inventory page, which contains the stored user inventory and favorite types of food.

#### NavBar
The NavBar is a critical component of the app.  It contains the log-in information as well as all the navigation function for the app.  It is fully responsive and contains custom art from Josh!!

#### Home View
The home view shows the highest rated recipes that are pulled from the Yummly API.  These are recipes are sorted and displayed in descending order.  We placed a star rating over the regular number rating.

#### Recipe View
The recipe view shows recipes related to either a user search in the search bar or based on inventory items and favorite foods that have been selected on the inventory page.  Recipes based on inventory items are displayed on the right side of the recipe page.

#### Inventory View
The inventory view shows a user profile at the top and the user's inventory at the bottom.  The user has the ability to add items to inventory and favorite cuisines to the tables.  The items are pushed and stored into local storage and are used to initiate search recommendations.

#### Recommendation Engine
The application uses the identified/tagged inventory items plus the user's favorite cuisines to come up with a list of recommended recipes.

####Frameworks and APIs
* Javascript
* JQuery
* Angular
* Bootstrap


####Screen Shots
![Alt text](screenshots/Complete.jpg?raw=true)
