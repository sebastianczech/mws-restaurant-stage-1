# Mobile Web Specialist Certification Course

## Before starting reviews

In files ``index.html`` and ``restaurant.html`` I have't left my Google API keys, so you have to [generate yours using e.g. these instructions](https://developers.google.com/maps/documentation/javascript/get-api-key) and put it in both files, where there is ``YOUR_GOOGLE_MAPS_API_KEY``.

## Starting API server

In order to use application, you need also to start API server by cloning repository [mws-restaurant-stage-2](https://github.com/sebastianczech/mws-restaurant-stage-2) and use commands:

```
npm install
npm install sails -g
node server
```

## Check if API server is working

You can check if API server is working by using following commands:

```
curl "http://localhost:1337/restaurants"
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

## License

Project is licensed under [MIT License](LICENSE.txt).
