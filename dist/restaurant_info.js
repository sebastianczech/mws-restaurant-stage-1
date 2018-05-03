let restaurant;var map;function createModalForAddingReviewForRestaurant(){var e=document.getElementById("modalAddReview"),t=document.getElementById("buttonAddReview"),n=document.getElementsByClassName("modal-close")[0];t.onclick=function(){e.style.display="block"},n.onclick=function(){e.style.display="none"},window.onclick=function(t){t.target==e&&(e.style.display="none")}}window.initMap=(()=>{fetchRestaurantFromURL((e,t)=>{e?console.error(e):(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:t.latlng,scrollwheel:!1}),fillBreadcrumb(),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map))})}),createModalForAddingReviewForRestaurant();var buttonToggleFavourite=document.getElementById("buttonToggleFavourite");function cacheFavoriteRequestInIndexedDbDatabase(e){console.log("Using special indexDB database for caching request, which were not serverd");const t="mws-restaurant-favorite-v1",n=indexedDB.open("mws-restaurant-offline-v1",1);n.onerror=function(e){console.error("indexedDB error")},n.onupgradeneeded=function(e){var n=e.target.result;n.createObjectStore(t,{keyPath:"id"}),n.createObjectStore("mws-restaurant-review-v1",{keyPath:"id"})},n.onsuccess=function(n){var r=n.target.result,o=(r.transaction(t,"readwrite").objectStore(t),{});o.url=e,o.id=(new Date).getTime(),console.log("Add url "+e+" to offline cache in indexDB with id "+o.id),r.transaction(t,"readwrite").objectStore(t).put(o)}}function updateRestaurantStoreFavoriteAttribute(e,t){console.log("Caching favorite for restaurant with id "+e);const n=indexedDB.open("mws-restaurant-db-v1",1);n.onerror=function(e){console.error("indexedDB error")},n.onsuccess=function(n){var r=n.target.result.transaction("mws-restaurant-store-v1","readwrite").objectStore("mws-restaurant-store-v1");console.log("Getting object store with read write access to indexDB"),r.openCursor().onsuccess=function(n){var r=n.target.result;if(r){if(console.log("Trying to find id "+e+" and getting cursor for object store for id "+r.value.id+": "+r.value),r.value.id==e){console.log("Finding object for restaurant id "+e);var o=r.value;o.is_favorite="Favorite"==t.data,r.update(o).onsuccess=function(){console.log("Updating in indexDB review for restaurant with id "+e)}}r.continue()}}}}function addReview(){var e=document.getElementById("name").value,t=document.getElementById("rating").value,n=document.getElementById("comments").value;const r=getParameterByName("id");console.log('Adding review with name "'+e+'" rating '+t+' and comments "'+n+'" for restaurant with id '+r);var o="http://localhost:1337/reviews/",a={restaurant_id:r,name:e,rating:t,comments:n};fetch(o,{method:"POST",body:JSON.stringify(a),headers:new Headers({"Content-Type":"application/json"})}).then(e=>{e.json()}).catch(e=>{console.error("Error:",e),cacheAddReviewRequestInIndexedDbDatabase(o,a,r)}).then(e=>{console.log("Success:",e)}),updateRestaurantStoreReviewAttribute(a,e,t,n,r),console.log("Closing modal and displaying page"),document.getElementById("modalAddReview").style.display="none"}function cacheAddReviewRequestInIndexedDbDatabase(e,t,n){console.log("Using special indexDB database for caching request, which were not serverd");const r="mws-restaurant-review-v1",o=indexedDB.open("mws-restaurant-offline-v1",1);o.onerror=function(e){console.error("indexedDB error")},o.onupgradeneeded=function(e){var t=e.target.result;t.createObjectStore(r,{keyPath:"id"}),t.createObjectStore("mws-restaurant-favorite-v1",{keyPath:"id"})},o.onsuccess=function(e){var o=e.target.result,a=(o.transaction(r,"readwrite").objectStore(r),{});a.restaurant_id=t.restaurant_id,a.name=t.name,a.rating=t.rating,a.comments=t.comments,a.id=(new Date).getTime(),console.log('Add review with name "'+name+'" rating '+rating+' and comments "'+comments+'" for restaurant with id '+n+" to offline cache in indexDB with id "+a.id),o.transaction(r,"readwrite").objectStore(r).put(a)}}function updateRestaurantStoreReviewAttribute(e,t,n,r,o){console.log('Caching review with name "'+t+'" rating '+n+' and comments "'+r+'" for restaurant with id '+o);const a=indexedDB.open("mws-restaurant-db-v1",1);a.onerror=function(e){console.error("indexedDB error")},a.onsuccess=function(t){var n=t.target.result.transaction("mws-restaurant-store-v1","readwrite").objectStore("mws-restaurant-store-v1");console.log("Getting object store with read write access to indexDB"),n.openCursor().onsuccess=function(t){var n=t.target.result;if(n){if(console.log("Trying to find id "+o+" and getting cursor for object store for id "+n.value.id+": "+n.value),n.value.id==o){console.log("Finding object for restaurant id "+o);var r=n.value;e.createdAt=new Date,e.updatedAt=new Date,r.reviews.push(e),n.update(r).onsuccess=function(){document.getElementById("reviews-list").appendChild(createReviewHTML(e)),console.log("Updating in indexDB review for restaurant with id "+o)}}n.continue()}}}}function sendDataFromIndexedDbOfflineStoresToServerWhenConnectivityReestablished(){var e;console.log("Sent data from indexedDB offline stores to the server when connectivity is re-established");const t=indexedDB.open("mws-restaurant-offline-v1",1);t.onerror=function(e){console.error("indexedDB error")},t.onupgradeneeded=function(e){var t=e.target.result;t.createObjectStore("mws-restaurant-favorite-v1",{keyPath:"id"}),t.createObjectStore("mws-restaurant-review-v1",{keyPath:"id"})},t.onsuccess=function(t){var n=(e=t.target.result).transaction("mws-restaurant-review-v1","readwrite"),r=n.objectStore("mws-restaurant-review-v1");console.log("Get offline object from store for reviews with read write access to indexedDB"),r.openCursor().onsuccess=function(t){var n=t.target.result;if(n){console.log("Get offline object for reviews with id "+n.value.id+": "+n.value.name+", "+n.value.rating+", "+n.value.comments+", "+n.value.restaurant_id);var r={restaurant_id:n.value.restaurant_id,name:n.value.name,rating:n.value.rating,comments:n.value.comments};fetch("http://localhost:1337/reviews/",{method:"POST",body:JSON.stringify(r),headers:new Headers({"Content-Type":"application/json"})}).then(e=>{e.json()}).then(t=>{console.log("Remove offline object for reviews with id "+ +n.value.id),e.transaction("mws-restaurant-review-v1","readwrite").objectStore("mws-restaurant-review-v1").delete(n.value.id).onsuccess=function(e){console.log("Removed offline object for reviews with id "+ +n.value.id)}}).catch(e=>{console.log("Cannot remove offline object for reviews with id "+ +n.value.id)}),n.continue()}},r=(n=e.transaction("mws-restaurant-favorite-v1","readwrite")).objectStore("mws-restaurant-favorite-v1"),console.log("Get offline object from store for favorite with read write access to indexedDB"),r.openCursor().onsuccess=function(t){var n=t.target.result;n&&(console.log("Get offline object for favorite with id "+n.value.id+": "+n.value.url),fetch(n.value.url,{method:"PUT",headers:new Headers({"Content-Type":"application/json"})}).then(e=>{e.json()}).then(t=>{console.log("Remove offline object for favorite with id "+ +n.value.id),e.transaction("mws-restaurant-favorite-v1","readwrite").objectStore("mws-restaurant-favorite-v1").delete(n.value.id).onsuccess=function(e){console.log("Removed offline object for favorite with id "+ +n.value.id)}}).catch(e=>{console.log("Cannot remove offline object for favorite with id "+ +n.value.id)}),n.continue())}}}buttonToggleFavourite.onclick=function(){buttonToggleFavourite.classList.toggle("favorite"),buttonToggleFavourite.classList.toggle("unfavorite");var e=buttonToggleFavourite.firstChild;e.data="Favorite"==e.data?"Unfavorite":"Favorite",console.log("Changing button text to "+buttonToggleFavourite.text);const t=getParameterByName("id");var n="http://localhost:1337/restaurants/"+t+"/?is_favorite="+("Favorite"==e.data);console.log("Mark restaurant as favorite or unfavorite by sending PUT request: "+n),fetch(n,{method:"PUT",headers:new Headers({"Content-Type":"application/json"})}).then(e=>{e.json()}).catch(e=>{console.error("Error:",e),cacheFavoriteRequestInIndexedDbDatabase(n)}).then(e=>{console.log("Success:",e)}),updateRestaurantStoreFavoriteAttribute(t,e)},sendDataFromIndexedDbOfflineStoresToServerWhenConnectivityReestablished(),fetchRestaurantFromURL=(e=>{if(self.restaurant)return void e(null,self.restaurant);const t=getParameterByName("id");t?DBHelper.fetchRestaurantById(t,(t,n)=>{self.restaurant=n,n?(fillRestaurantHTML(),e(null,n)):console.error(t)}):(error="No restaurant id in URL",e(error,null))}),fillRestaurantHTML=((e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;const t=document.getElementById("restaurant-img");t.className="restaurant-img",t.src=DBHelper.imageUrlForRestaurant(e),t.alt="Restaurant "+e.name,document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type;var n=buttonToggleFavourite.firstChild;e.is_favorite?(buttonToggleFavourite.classList.add("favorite"),console.log("Setting favorite for restaurant"),n.data="Favorite"):(console.log("Setting unfavorite for restaurant"),buttonToggleFavourite.classList.add("unfavorite"),n.data="Unfavorite"),e.operating_hours&&fillRestaurantHoursHTML(),fillReviewsHTML()}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const r=document.createElement("tr"),o=document.createElement("td");o.innerHTML=n,r.appendChild(o);const a=document.createElement("td");a.innerHTML=e[n],r.appendChild(a),t.appendChild(r)}}),fillReviewsHTML=((e=self.restaurant.reviews)=>{const t=document.getElementById("reviews-container"),n=document.createElement("h3");if(n.innerHTML="Reviews",t.appendChild(n),!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const r=document.getElementById("reviews-list");e.forEach(e=>{r.appendChild(createReviewHTML(e))}),t.appendChild(r)}),createReviewHTML=(e=>{const t=document.createElement("li"),n=document.createElement("p");n.innerHTML=e.name,t.appendChild(n);const r=document.createElement("p");r.innerHTML=new Date(e.updatedAt).toLocaleDateString("en-US"),t.appendChild(r);const o=document.createElement("p");o.innerHTML=`Rating: ${e.rating}`,t.appendChild(o);const a=document.createElement("p");return a.innerHTML=e.comments,t.appendChild(a),t}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),n=document.createElement("li");n.innerHTML=e.name,t.appendChild(n)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null});