# Fullstack Challenge MOSANO
This challenge arises from a proposal of Mosano, a company specialized in software development. 
This project consists in the development of an API and a client with the purpose to simulate a functional prototype. 
The main objective is to ensure that communication occurs smoothly and with an user-friendly interaction. The developed graphical interface allows the registration of users through their full name, country and birthday. After entering and submitting these parameters, the data is sent to the API and documents are created in a database.

## Implementation
The API is developed in Node.js together with GraphQL. All queries and mutations responsible for operating the database documents are implemented according to the actions in the front-end. An authentication method is added to this application to grant that only properly registered users can access the system. Only after the correct insertion of the credentials will the user be allowed to insert new records, edit and delete existing ones.

* [ReactJS](https://reactjs.org/)
* [NodeJS](https://nodejs.org/en/)
* [Express.js](https://expressjs.com/)
* [GraphQL](https://graphql.org/)
* [MongoDB](https://www.mongodb.com/)

### Installation 

1. Clone Repo `https://github.com/AMak77/MosanoChallenge/`
2. `cd MosanoChallenge` - Project directory
3. `npm install` - Install dependencies of back-end
4. `npm start` - Start back-end application
5. `cd frontend` - Client directory
6. `npm install` - Install dependencies of front-end
7. `npm start` - Start front-end application

### Result
* The user must be registered to access the system. However, the data entered can still be consulted.
![SignUp](https://user-images.githubusercontent.com/46027838/100035632-93371f00-2df6-11eb-91e9-2bd27baa750b.png)
![Without token](https://user-images.githubusercontent.com/46027838/100036120-80711a00-2df7-11eb-89f2-35bd92080ed0.png)

* After the correct insertion of credentials, the user is given permissions to create, edit and delete records.
![entries](https://user-images.githubusercontent.com/46027838/100036233-bca47a80-2df7-11eb-8ca4-ce031268fc81.png)

* When a new registration is inserted, a welcome message is displayed.
![newentrie](https://user-images.githubusercontent.com/46027838/100036317-e78ece80-2df7-11eb-8f5e-8156742a4340.png)

* After selecting an already inserted record the corresponding message is printed.
![messageonclick](https://user-images.githubusercontent.com/46027838/100036416-13aa4f80-2df8-11eb-9491-98f1fd2c41fc.png)

* For editing a record, the corresponding modal is displayed.
![editmodal](https://user-images.githubusercontent.com/46027838/100036494-3b99b300-2df8-11eb-9edf-c1442f50ecc8.png)