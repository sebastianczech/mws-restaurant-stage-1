let restaurant;var map;window.initMap=(()=>{fetchRestaurantFromURL((e,t)=>{e?console.error(e):(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:t.latlng,scrollwheel:!1}),fillBreadcrumb(),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map))});var e=document.getElementById("modalAddReview"),t=document.getElementById("buttonAddReview"),n=document.getElementsByClassName("modal-close")[0];t.onclick=function(){e.style.display="block"},n.onclick=function(){e.style.display="none"},window.onclick=function(t){t.target==e&&(e.style.display="none")},sendDataFromIndexedDbOfflineStoresToServerWhenConnectivityReestablished()});var buttonToggleFavourite=document.getElementById("buttonToggleFavourite");function addReview(){var e=document.getElementById("name").value,t=document.getElementById("rating").value,n=document.getElementById("comments").value;const r=getParameterByName("id");console.log('Adding review with name "'+e+'" rating '+t+' and comments "'+n+'" for restaurant with id '+r);var o={restaurant_id:r,name:e,rating:t,comments:n};fetch("http://localhost:1337/reviews/",{method:"POST",body:JSON.stringify(o),headers:new Headers({"Content-Type":"application/json"})}).then(e=>{e.json()}).catch(a=>{console.error("Error:",a),console.log("Using special indexDB database for caching request, which were not serverd");const i="mws-restaurant-review-v1",s=indexedDB.open("mws-restaurant-offline-v1",1);s.onerror=function(e){console.error("indexedDB error")},s.onupgradeneeded=function(e){var t=e.target.result;t.createObjectStore(i,{keyPath:"id"}),t.createObjectStore("mws-restaurant-favorite-v1",{keyPath:"id"})},s.onsuccess=function(a){var s=a.target.result,c=(s.transaction(i,"readwrite").objectStore(i),{});c.restaurant_id=o.restaurant_id,c.name=o.name,c.rating=o.rating,c.comments=o.comments,c.id=(new Date).getTime(),console.log('Add review with name "'+e+'" rating '+t+' and comments "'+n+'" for restaurant with id '+r+" to offline cache in indexDB with id "+c.id),s.transaction(i,"readwrite").objectStore(i).put(c)}}).then(e=>{console.log("Success:",e)}),console.log('Caching review with name "'+e+'" rating '+t+' and comments "'+n+'" for restaurant with id '+r);const a=indexedDB.open("mws-restaurant-db-v1",1);a.onerror=function(e){console.error("indexedDB error")},a.onsuccess=function(e){var t=e.target.result.transaction("mws-restaurant-store-v1","readwrite").objectStore("mws-restaurant-store-v1");console.log("Getting object store with read write access to indexDB"),t.openCursor().onsuccess=function(e){var t=e.target.result;if(t){if(console.log("Trying to find id "+r+" and getting cursor for object store for id "+t.value.id+": "+t.value),t.value.id==r){console.log("Finding object for restaurant id "+r);var n=t.value;o.createdAt=new Date,o.updatedAt=new Date,n.reviews.push(o),t.update(n).onsuccess=function(){document.getElementById("reviews-list").appendChild(createReviewHTML(o)),console.log("Updating in indexDB review for restaurant with id "+r)}}t.continue()}}},console.log("Closing modal and displaying page"),document.getElementById("modalAddReview").style.display="none"}function sendDataFromIndexedDbOfflineStoresToServerWhenConnectivityReestablished(){var e;console.log("Sent data from indexedDB offline stores to the server when connectivity is re-established");const t=indexedDB.open("mws-restaurant-offline-v1",1);t.onerror=function(e){console.error("indexedDB error")},t.onupgradeneeded=function(e){var t=e.target.result;t.createObjectStore("mws-restaurant-favorite-v1",{keyPath:"id"}),t.createObjectStore("mws-restaurant-review-v1",{keyPath:"id"})},t.onsuccess=function(t){var n=(e=t.target.result).transaction("mws-restaurant-review-v1","readwrite"),r=n.objectStore("mws-restaurant-review-v1");console.log("Get offline object from store for reviews with read write access to indexedDB"),r.openCursor().onsuccess=function(e){var t=e.target.result;t&&(console.log("Get offline object for reviews with id "+t.value.id+": "+t.value.name+", "+t.value.rating+", "+t.value.comments+", "+t.value.restaurant_id),t.continue())},r=(n=e.transaction("mws-restaurant-favorite-v1","readwrite")).objectStore("mws-restaurant-favorite-v1"),console.log("Get offline object from store for favorite with read write access to indexedDB"),r.openCursor().onsuccess=function(e){var t=e.target.result;t&&(console.log("Get offline object for favorite with id "+t.value.id+": "+t.value.url),t.continue())}}}buttonToggleFavourite.onclick=function(){buttonToggleFavourite.classList.toggle("favorite"),buttonToggleFavourite.classList.toggle("unfavorite");var e=buttonToggleFavourite.firstChild;e.data="Favorite"==e.data?"Unfavorite":"Favorite",console.log("Changing button text to "+buttonToggleFavourite.text);const t=getParameterByName("id");var n="http://localhost:1337/restaurants/"+t+"/?is_favorite="+("Favorite"==e.data);console.log("Mark restaurant as favorite or unfavorite by sending PUT request: "+n),fetch(n,{method:"PUT",headers:new Headers({"Content-Type":"application/json"})}).then(e=>{e.json()}).catch(e=>{console.error("Error:",e),console.log("Using special indexDB database for caching request, which were not serverd");const t="mws-restaurant-favorite-v1",r=indexedDB.open("mws-restaurant-offline-v1",1);r.onerror=function(e){console.error("indexedDB error")},r.onupgradeneeded=function(e){var n=e.target.result;n.createObjectStore(t,{keyPath:"id"}),n.createObjectStore("mws-restaurant-review-v1",{keyPath:"id"})},r.onsuccess=function(e){var r=e.target.result,o=(r.transaction(t,"readwrite").objectStore(t),{});o.url="'"+n+"''",o.id=(new Date).getTime(),console.log("Add url "+n+" to offline cache in indexDB with id "+o.id),r.transaction(t,"readwrite").objectStore(t).put(o)}}).then(e=>{console.log("Success:",e)}),console.log("Caching favorite for restaurant with id "+t);const r=indexedDB.open("mws-restaurant-db-v1",1);r.onerror=function(e){console.error("indexedDB error")},r.onsuccess=function(n){var r=n.target.result.transaction("mws-restaurant-store-v1","readwrite").objectStore("mws-restaurant-store-v1");console.log("Getting object store with read write access to indexDB"),r.openCursor().onsuccess=function(n){var r=n.target.result;if(r){if(console.log("Trying to find id "+t+" and getting cursor for object store for id "+r.value.id+": "+r.value),r.value.id==t){console.log("Finding object for restaurant id "+t);var o=r.value;o.is_favorite="Favorite"==e.data,r.update(o).onsuccess=function(){console.log("Updating in indexDB review for restaurant with id "+t)}}r.continue()}}}},fetchRestaurantFromURL=(e=>{if(self.restaurant)return void e(null,self.restaurant);const t=getParameterByName("id");t?DBHelper.fetchRestaurantById(t,(t,n)=>{self.restaurant=n,n?(fillRestaurantHTML(),e(null,n)):console.error(t)}):(error="No restaurant id in URL",e(error,null))}),fillRestaurantHTML=((e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;const t=document.getElementById("restaurant-img");t.className="restaurant-img",t.src=DBHelper.imageUrlForRestaurant(e),t.alt="Restaurant "+e.name,document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type;var n=buttonToggleFavourite.firstChild;e.is_favorite?(buttonToggleFavourite.classList.add("favorite"),console.log("Setting favorite for restaurant"),n.data="Favorite"):(console.log("Setting unfavorite for restaurant"),buttonToggleFavourite.classList.add("unfavorite"),n.data="Unfavorite"),e.operating_hours&&fillRestaurantHoursHTML(),fillReviewsHTML()}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const r=document.createElement("tr"),o=document.createElement("td");o.innerHTML=n,r.appendChild(o);const a=document.createElement("td");a.innerHTML=e[n],r.appendChild(a),t.appendChild(r)}}),fillReviewsHTML=((e=self.restaurant.reviews)=>{const t=document.getElementById("reviews-container"),n=document.createElement("h3");if(n.innerHTML="Reviews",t.appendChild(n),!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const r=document.getElementById("reviews-list");e.forEach(e=>{r.appendChild(createReviewHTML(e))}),t.appendChild(r)}),createReviewHTML=(e=>{const t=document.createElement("li"),n=document.createElement("p");n.innerHTML=e.name,t.appendChild(n);const r=document.createElement("p");r.innerHTML=new Date(e.updatedAt).toLocaleDateString("en-US"),t.appendChild(r);const o=document.createElement("p");o.innerHTML=`Rating: ${e.rating}`,t.appendChild(o);const a=document.createElement("p");return a.innerHTML=e.comments,t.appendChild(a),t}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),n=document.createElement("li");n.innerHTML=e.name,t.appendChild(n)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null});