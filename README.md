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
- Jest
- Heroku

## Application Architecture Diagram

![Architecture diagram](app_architecture.png)

The components implements the following functionalities:

- React Native: User registration, login, browse educational resources and add/delete bookmarks, search hotlines and shelters on map, show/create/edit/remove emergency contacts.
- Express/node.js server: Abstracts access to database for clients with RESTful API using Mongoose library: user management (login, register, delete), emergency contact management (read,add, edit, remove), bookmark management (add, remove, read), fetching resources, shelters, hotlines.
- MongoDB database: stores the user related data (login credentials, emergency contacts, bookmarks, T&C acceptance history), geospatial data for shelters, resources, hotlines, and T&C.

## Data Model

Why NoSQL ?

###

The main reasons for choosing MongoDB in POOL project are as below:

- Flexibility → Since the Pool project is in the development phase, it does not have fixed data models. Therefore, the database system may need to accommodate frequent design changes and new features.
- Prioritizing scalability over consistency→ The project needs to store dynamic structured data at large scale
- Performing Geolocation Operations → Map is one of the main features of the app which needs frequent and fast geospatial querying.
- Storing large volumes of data without relations → Some of the collections such as shelters, hotlines and resources do not have relations.

![DB Model](db_model.png)

Basic users can perform CRUD operations on contacts and bookmarks. Authorized user with editor or admin role can perform CRUD operations on articles, videos, and podcasts.

Contacts document is embedded in the users collection for optimal querying. Since a user can have maximum 2 emergency contacts (one-to-few relationship), the document size would not exceed the limit.

Each article, video, podcast has one or few violence type tags. The number of violence types are limited, thus another collection is not needed.

## API

We use Swagger to document our APIs.
http://pool-api-mobile.herokuapp.com/api-docs/

## Setup

**To run locally**

1. Clone this repo by running the following command:

```s
git clone https://github.com/no-domestic-violence/backend.git
cd backend
```

2. Install dependencies:

```s
yarn install
```

3. Create .env file and add following information:

```s

  mongoURI = mongodb atlas uri
  JWTSecret = JWTSecret uri
  SENTRY = team sentry link
```

4. Start environment

```s
yarn dev
```

5. Open http://localhost:3001/api to view it in the browser.

6. Before merging to master

- check lint and prettier rules

```s
yarn lint
```

- run tests

```s
yarn test
```

**Caching**

1. Install Redis

- On Mac:

```s
brew install redis
```

2. Launch Redis before you run the server

```s
brew services start redis
```

3. Stop Redis

```s
brew services stop redis
```

**Testing**

We use Jest and supertest (HTTP assertions library)

- Run tests

```s
yarn test
```

- Naming convention for mocks : mock\*\*\*\*, for example:

```s
mockUser
```

**The api uses Heroku for production**

- Production URL: https://pool-api-mobile.herokuapp.com/
- Not protected endpoints: /shelters, /hotlines

**Metrics**

Metrics are running on http://localhost:3001/metrics

To run the prometheus and grafana dashboards:

```s
docker-compose up
```

Prometheus running on:

```s
http://localhost:9090
```

Grafana running on:

```s
http://localhost:3000
```

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
