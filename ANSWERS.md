## Questions

1. :question: What do we do in the `Server` and `UserController` constructors
to set up our connection to the development database?
2. :question: How do we retrieve a user by ID in the `UserController.getUser(String)` method?
3. :question: How do we retrieve all the users with a given age 
in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that
method?
4. :question: What are these `Document` objects that we use in the `UserController`? 
Why and how are we using them?
5. :question: What does `UserControllerSpec.clearAndPopulateDb` do?
6. :question: What's being tested in `UserControllerSpec.getUsersWhoAre37()`?
How is that being tested?
7. :question: Follow the process for adding a new user. What role do `UserController` and 
`UserRequestHandler` play in the process?

## Leah Judd and Mitchell Drummer's Answers

1. In the server calls the Mongo Database by calling mongoClient.getDatabase("dev") 
to get the data. Then the server hands the userDatabase data to the userController.

2. So it looks like the database gets collected by users, then collects just the ids
from the database, and then stores them in jsonUsers as a Document to be iterated through.
It iterates through jsonUsers until it finds an ID that is equal to the ID you gave it, and then
returns that user.

3.First getUsers check that queryParamas contain "age", then it adds every case in the document of users that has the 
target age to the document meant to be returned.

4. From the documentation on Document, a Document is a linear collection of characters.
Document seem easier to iterate through and might be a good stepping stone between a data collection and a json object.
 
5. First it drops (clears) the database. Then it adds 3  documents to a document array list and the one object to as new
BasicDBObject. Then the tree documents are added to the MongoCollection of documents using insertMany(), and the one 
BasicDBObject is turned into a Json object and then parsed into a document so it can be inserted into the document 
collection using insertOne().

6. It tests the users who are 37 are properly filtered. It tests this by 

7.