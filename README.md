[![Depfu](https://badges.depfu.com/badges/9916734af8c74c90ee3959bbdc0fae77/overview.svg)](https://depfu.com/github/no-domestic-violence/backend?project_id=17563)
[![Depfu](https://badges.depfu.com/badges/9916734af8c74c90ee3959bbdc0fae77/count.svg)](https://depfu.com/github/no-domestic-violence/backend?project_id=17563)

## Table of contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Application architecture diagram](#application-architecture-diagram)
- [Data Model](#--data-model)
- [Folder structure](#folder-structure)
- [Setup](#setup)
- [Authors of the project](#authors-of-the-project)


## Project Description
POOL project is a mobile application that aims to help the survivors of domestic violence. The main features of the app are: resources in forms of curated articles, videos & podcasts about intimate partner violence, finding shelters and hotlines. Signed up users can have additional access to emergency contact features. 

## Tech Stack

- Node.js
- Express
- Mongoose
- Mongo DB
- Json Web Token
- Bcryptjs
- Heroku

## Application architecture diagram

![Architecture diagram](app_architecture.png)

## Data Model
Why NoSQL ?
###
The main reasons for choosing MongoDB in POOL project are as below:
- Flexibility → Since the Pool project is in the development phase, it does not have fixed data models. Therefore, the database system may need to accommodate frequent design changes and new features.
- Prioritizing scalability over consistency→ The project needs to store dynamic structured data at large scale
- Performing Geolocation Operations → Map is one of the main features of the app which needs frequent and fast geospatial querying.
- Storing large volumes of data without relations → Some of the collections such as shelters, hotlines and resources do not have relations.

##

Users can perform CRUD operations on contacts and bookmarks. Other data such as articles, videos and podcasts are read only.
##
Contacts document is embedded in the users collection for optimal querying. Since a user can have maximum 2 emergency contacts (one-to-few relationship), the document size would not exceed the limit.
##
A user can add as many bookmarks as they want (one-to-many relationship). As a lot of data is updated frequently in the bookmarks collection, referencing was chosen for better performance.
##
Each article, video, podcast has one or few violence type tags. The number of violence types are limited, thus another collection is not needed.


## Folder Structure

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
## Setup 

**To run locally**

1. Clone this repo by running the following command:

```s
git clone https://github.com/no-domestic-violence/backend.git
cd backend
```

2. Install dependencies:

```s
npm install
```

3. Create development.js file inside of config folder and add the following environment variables: 

```s
module.exports = {
  mongoURI: 'your mongodb atlas uri',
  JWTSecret: 'your JWTSecret uri',
};
```

4. Start environment

```s
npm start
```
5. Open http://localhost:3001 to view it in the browser.

6. Before merging to master, check errors and prettier rules

```s
npm lint
```

**The api uses Heroku for production**

- Production URL: https://pool-api-mobile.herokuapp.com/
- Not protected endpoints: /shelters, /hotlines

**To use Heroku for development**

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
---
## Authors of the project:

- Soyoon Choi  
- Irina Baeva
- Behnaz Derakhshani 
