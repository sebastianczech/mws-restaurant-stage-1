let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });

  /**
   * Modals
   */
  var modal = document.getElementById('modalAddReview');
  var btn = document.getElementById("buttonAddReview");
  var span = document.getElementsByClassName("modal-close")[0];

  btn.onclick = function() {
      modal.style.display = "block";
  }
  span.onclick = function() {
      modal.style.display = "none";
  }
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }
}

/**
 * Favorite
 */

 var buttonToggleFavourite = document.getElementById("buttonToggleFavourite");
 buttonToggleFavourite.onclick = function() {
    buttonToggleFavourite.classList.toggle("favorite");
    buttonToggleFavourite.classList.toggle("unfavorite");

    var text = buttonToggleFavourite.firstChild;
    text.data = text.data == "Favorite" ? "Unfavorite" : "Favorite";
    console.log("Changing button text to " + buttonToggleFavourite.text);

    const restaurant_id = getParameterByName('id');
    var url = 'http://localhost:1337/restaurants/' + restaurant_id + '/?is_favorite=' + (text.data == "Favorite");
    console.log("Mark restaurant as favorite or unfavorite by sending PUT request: " + url);
    fetch(url, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .then(res => {
      res.json()
    })
    .catch(error => {
      console.error('Error:', error);
      console.log('Using special indexDB database for caching request, which were not serverd');

      const indexedDBName = 'mws-restaurant-offline-v1';
      const storeName = 'mws-restaurant-favorite-v1';
      const request = indexedDB.open(indexedDBName, 1 );
      request.onerror = function(event) {
        console.error("indexedDB error");
      };
      request.onupgradeneeded = function(event) {
          var db = event.target.result;
          var store = db.createObjectStore(storeName, {keyPath: "id"});
      };
      request.onsuccess = function(event) {
        var db = event.target.result;
        var tx = db.transaction(storeName, "readwrite");
        var store = tx.objectStore(storeName);

        var offline = {};
        offline.url = "'" + url + "''";
        offline.id = new Date().getTime();

        console.log("Add url " + url + " to offline cache in indexDB with id " + offline.id);

        var tx = db.transaction(storeName, "readwrite");
        var store = tx.objectStore(storeName);
        store.put(offline);
      };
    })
    .then(response => {
      console.log('Success:', response)
    });

    console.log("Caching favorite for restaurant with id " + restaurant_id);

    var db;
    const indexedDBName = 'mws-restaurant-db-v1';
    const storeName = 'mws-restaurant-store-v1';
    const request = indexedDB.open(indexedDBName, 1 );
    request.onerror = function(event) {
      console.error("indexedDB error");
    };
    request.onsuccess = function(event) {
      db = event.target.result;
      var tx = db.transaction(storeName, "readwrite");
      var store = tx.objectStore(storeName);

      console.log("Getting object store with read write access to indexDB");

      store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor) {
          console.log("Trying to find id " + restaurant_id + " and getting cursor for object store for id " + cursor.value.id +  ": " + cursor.value);
          if(cursor.value.id == restaurant_id) {
            console.log("Finding object for restaurant id " + restaurant_id);
            var updateData = cursor.value;
            updateData.is_favorite = (text.data == "Favorite")
            var request = cursor.update(updateData);
            request.onsuccess = function() {
              console.log("Updating in indexDB review for restaurant with id " + restaurant_id);
            };
          };
          cursor.continue();
        }
      };
    };
 }

/**
 * Action for button "add review" in modal
 */
function addReview() {
  var name = document.getElementById('name').value;
  var rating = document.getElementById('rating').value;
  var comments = document.getElementById('comments').value;

  const restaurant_id = getParameterByName('id');

  console.log("Adding review with name \"" + name + "\" rating " + rating + " and comments \"" + comments + "\" for restaurant with id " + restaurant_id);

  var url = 'http://localhost:1337/reviews/';
  var data = {restaurant_id: restaurant_id, name: name, rating: rating, comments: comments};

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  .then(res => {
    res.json()
  })
  .catch(error => {
    console.error('Error:', error);
    console.log('Using special indexDB database for caching request, which were not serverd');
  })
  .then(response => {
    console.log('Success:', response)
  });

  console.log("Caching review with name \"" + name + "\" rating " + rating + " and comments \"" + comments + "\" for restaurant with id " + restaurant_id);

  var db;
  const indexedDBName = 'mws-restaurant-db-v1';
  const storeName = 'mws-restaurant-store-v1';
  const request = indexedDB.open(indexedDBName, 1 );
  request.onerror = function(event) {
    console.error("indexedDB error");
  };
  request.onsuccess = function(event) {
    db = event.target.result;
    var tx = db.transaction(storeName, "readwrite");
    var store = tx.objectStore(storeName);

    console.log("Getting object store with read write access to indexDB");

    store.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor) {
        console.log("Trying to find id " + restaurant_id + " and getting cursor for object store for id " + cursor.value.id +  ": " + cursor.value);
        if(cursor.value.id == restaurant_id) {
          console.log("Finding object for restaurant id " + restaurant_id);
          var updateData = cursor.value;
          data.createdAt = new Date();
          data.updatedAt = new Date();
          updateData.reviews.push(data);
          var request = cursor.update(updateData);
          request.onsuccess = function() {
            const ul = document.getElementById('reviews-list');
            ul.appendChild(createReviewHTML(data));
            console.log("Updating in indexDB review for restaurant with id " + restaurant_id);
          };
        };
        cursor.continue();
      }
    };
  };

  console.log("Closing modal and displaying page");
  document.getElementById('modalAddReview').style.display = "none";
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = "Restaurant " + restaurant.name;

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  var text = buttonToggleFavourite.firstChild;
  if (restaurant.is_favorite) {
    buttonToggleFavourite.classList.add("favorite");
    console.log("Setting favorite for restaurant");
    text.data = "Favorite";
  } else {
    console.log("Setting unfavorite for restaurant");
    buttonToggleFavourite.classList.add("unfavorite");
    text.data = "Unfavorite";
  }

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = (new Date(review.updatedAt)).toLocaleDateString("en-US");
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
