# Tasks and Reminders Application #

Application which help the user to manage tasks and reminders. This repo belongs to the BackEnd of the Application

## Concept ##
- Categorize tasks and reminders 
- Add a new Task / Reminder
- Update status (finished / ongoing)
- Delete permanently a task / reminder


## Technical Details ##

### Technical Stack ###
* Data storage: MongoDB
* FrontEnd: React JS, [please check this repo](https://github.com/hftamayo/reacttodo) 
* BackEnd: NodeJS
* Render Framework: Express
* Architecture: To be defined 
* Rate Limiting: express-rate-limit (for enterprise project please check "rate-limiter-flexible")
* Testing: on Oldstable branch you can find unit and integration testing routines using Mocha and Chai, one key 
  element was to use the dependency injection pattern on the controller and routes modules. After the migration to
  Typescript the test framework is Jest, please refer to the branch jestunstable. If in a near future I decide to 
  try playwright a branch will be created for this purpose.

### Available Functions ###
* Add a new task
* Display tasks
* Update status
* Delete a Task


## Branches ##
* OldStable : deprecated versions of the project
* Stable: current or latest official version
* Unstable: sourcecode that is in progress of testing
* Experimental: sourcecode in progress


## Proof of Concept ##
[Todo]


## Bugs ##
Please refer to the Issues section in this repository

## References ##
* Testing [Test a Restful API with Mocha and Chai](https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai)


## Log releases ##
### 0.0.1 Version ###
- Released on: Feb 6th 2024
- CommonJS modules
- Unit and integration testing written in Chai + Mocha
- Commit ID: [f98ec2b](https://github.com/hftamayo/nodetodo/commit/f98ec2b594dfc93271d52d34ffca0ced4fcf1d59)

### 0.0.2 Version ###
- Released on:
- ES Modules
- Full Typescript support
- Commit ID:

### 0.1.2 Version ###
- Released on:
- Unit and Integration testing written in Jest
