let restaurants,neighborhoods,cuisines;var map,markers=[];function loadGoogleMap(){var e=document.createElement("script");e.type="text/javascript",e.src="https://maps.googleapis.com/maps/api/js?v=3&key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places&callback=initMap",e.defer=!0,e.async=!0,console.log("Adding Google Map JavaScript file: "+e),document.getElementsByTagName("head")[0].appendChild(e)}document.addEventListener("DOMContentLoaded",e=>{updateRestaurants(),fetchNeighborhoods(),fetchCuisines(),startIntersectionObserver(),loadGoogleMap()}),startIntersectionObserver=(()=>{console.log("Starting intersection observer")}),fetchNeighborhoods=(()=>{DBHelper.fetchNeighborhoods((e,t)=>{e?console.error(e):(self.neighborhoods=t,fillNeighborhoodsHTML())})}),fillNeighborhoodsHTML=((e=self.neighborhoods)=>{const t=document.getElementById("neighborhoods-select");e.forEach(e=>{const n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})}),fetchCuisines=(()=>{DBHelper.fetchCuisines((e,t)=>{e?console.error(e):(self.cuisines=t,fillCuisinesHTML())})}),fillCuisinesHTML=((e=self.cuisines)=>{const t=document.getElementById("cuisines-select");e.forEach(e=>{const n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})}),window.initMap=(()=>{self.map=new google.maps.Map(document.getElementById("map"),{zoom:12,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1});const e=document.getElementById("cuisines-select"),t=document.getElementById("neighborhoods-select"),n=e.selectedIndex,s=t.selectedIndex,a=e[n].value,r=t[s].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(a,r,(e,t)=>{e?console.error(e):addMarkersToMap(t)})}),updateRestaurants=(()=>{const e=document.getElementById("cuisines-select"),t=document.getElementById("neighborhoods-select"),n=e.selectedIndex,s=t.selectedIndex,a=e[n].value,r=t[s].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(a,r,(e,t)=>{e?console.error(e):(resetRestaurants(t),fillRestaurantsHTML())})}),resetRestaurants=(e=>{self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",self.markers.forEach(e=>e.setMap(null)),self.markers=[],self.restaurants=e}),fillRestaurantsHTML=((e=self.restaurants)=>{const t=document.getElementById("restaurants-list");e.forEach(e=>{t.append(createRestaurantHTML(e))}),self.map&&addMarkersToMap(e)}),createRestaurantHTML=(e=>{const t=document.createElement("div");t&&(t.className+=(t.className?" col-large":"col-large")+" restaurant-card");const n=document.createElement("img");n.className="restaurant-img",n.src=DBHelper.thumbnailImageUrlForRestaurant(e),n.alt="Restaurant "+e.name+" (thumbnail)",t.append(n);const s=document.createElement("h2");s.innerHTML=e.name,t.append(s);const a=document.createElement("p");a.innerHTML=e.neighborhood,t.append(a);const r=document.createElement("p");r.innerHTML=e.address,t.append(r);const o=document.createElement("a");return o.innerHTML="View Details",o.href=DBHelper.urlForRestaurant(e),t.append(o),t}),addMarkersToMap=(e=>{e.forEach(e=>{const t=DBHelper.mapMarkerForRestaurant(e,self.map);google.maps.event.addListener(t,"click",()=>{window.location.href=t.url}),self.markers.push(t)})});