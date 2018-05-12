# Mobile Web Specialist Certification Course

## Before starting reviews

In files ``js/main.js`` and ``js/restaurant_info.js`` I have't left my Google API keys, so you have to [generate yours using e.g. these instructions](https://developers.google.com/maps/documentation/javascript/get-api-key) and put it in both files, where there is ``YOUR_GOOGLE_MAPS_API_KEY``.

## Starting API server

In order to use application, you need also to start API server by cloning repository [mws-restaurant-stage-3](https://github.com/sebastianczech/mws-restaurant-stage-3) and use commands:

```
npm install
npm install sails -g
node server
```

## Check if API server is working

You can check if API server is working by using following commands:

### Getting restaurant

```
curl "http://localhost:1337/restaurants"
curl "http://localhost:1337/restaurants/<restaurant_id>"
curl "http://localhost:1337/restaurants/?is_favorite=true"
```

### Getting review

```
curl "http://localhost:1337/reviews"
curl "http://localhost:1337/reviews/<review_id>"
curl "http://localhost:1337/reviews/?restaurant_id=<restaurant_id>"
```

### Create review

```
curl -H "Content-Type: application/json" -X POST -d '{"restaurant_id": "1", "name": "Sebastian", "rating": "5", "comments": "The best restaurant ever..." }' "http://localhost:1337/reviews/"
```

### Update review

```
curl -H "Content-Type: application/json" -X PUT -d '{ "name": "Sebastian", "rating": "1", "comments": "Rather not the best restaurant ever..." }' "http://localhost:1337/reviews/31"
```

### Delete review

```
curl -H "Content-Type: application/json" -X DELETE "http://localhost:1337/reviews/31"
```

### Mark restaurant as favorite or unfavorite

```
curl -H "Content-Type: application/json" -X PUT "http://localhost:1337/restaurants/1/?is_favorite=true"
curl -H "Content-Type: application/json" -X PUT "http://localhost:1337/restaurants/1/?is_favorite=false"
```

## Starting application locally

After cloning repository from GitHub, you can start the application using e.g. command started from directory, which contains sources:

```
python -m SimpleHTTPServer 8000
```

## Check if application is working

You can start using application by opening in browser URL:

```
http://localhost:8000/
```

## Application features

Restaurant reviews is simple web application made during course in Udacity: __Mobile Web Specialist Program__. Application is delivering such features like:
   * filtering selected restaurants,
   * showing restaurants on map,
   * displaying reviews about restaurants.

## Project specification

* [Restaurant Reviews: Stage 1](https://review.udacity.com/#!/rubrics/1090/view)
* [Restaurant Reviews: Stage 2](https://review.udacity.com/#!/rubrics/1131/view)
* [Restaurant Reviews: Stage 3](https://review.udacity.com/#!/rubrics/1132/view)   

## License

Project is licensed under [MIT License](LICENSE.txt).
