**Folder Structure**

```s
└── src
    ├── config
    │   ├── development.js
    │   ├── key.js
    │   └── production.js
    ├── index.js
    ├── models
    │   ├── Hotline.js
    │   ├── Shelter.js
    │   └── User.js
    └── routes
        ├── auth.js
        ├── hotlinesRoutes.js
        ├── sheltersRoutes.js
        ├── sosContactRoutes.js
        └── verifyToken.js
    ├── package-lock.json
    ├── package.json
    ├── .gitignore
    ├── .Procfile
    ├── .eslintrc
    ├── README.md
```

**To run locally**

1. Install dependencies:

```s
npm install
```

2. Start environment

```s
npm start
```

Runs the app in the development mode.
Open http://localhost:3001 to view it in the browser.

3. Before merging to master, check errors and prettier rules

```s
npm lint
```

**To test with device in development modemode**

1. You need to connect to MongoAtlas by providing the MONGOURI

**Heroku for development**

1. Check that app is running

```s
heroku local
```

2. To check builds

```s
heroku builds
```

3. To cancel builds

```s
heroku build:cancel
```

**The api uses Heroku for deployment**

- Base URL: https://pool-api-mobile.herokuapp.com/
- Not protected endpoints: /shelters, /hotlines
