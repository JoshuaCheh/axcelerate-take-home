# Axcelerate Take Home
## _Home Automation Hub_

## Installation

Install the dependencies and devDependencies and start the server. Note, this is an expressJS server.

```sh
npm i
npm run dev
```

By default the API should be running on port 6060 and hence the API route will be: http://localhost:6060

## How to test 

Use either [Postman](https://www.postman.com/downloads/) or [Insomnia](https://insomnia.rest/download) to make API calls.
When making API calls, check the terminal running the server that will log:
- list of devices and their status change
- actions made by the user
- devices that have had their status reverted

## API routes
These are the API routes available:

#### **GET** /devices
#####  Description: 
To get a list of all devices

##### Possible Errors:
| Error Code | Description |
| ----------- | ----------- | 
| 500 | Server was unable to return the list of devices | 

##### Example:
GET http://localhost:6060/devices


#### **POST** /devices
##### Description: 
To add a device

##### JSON Request fields:

| Field | Description | Variable Type |Mandatory |
| ----------- | ----------- | ----------- | ----------- |
| deviceName | Name of the device you want to add | string | yes

##### Possible Errors:
| Error Code | Description |
| ----------- | ----------- | 
| 500 | Server was unable to process the request | 
| 400 | deviceName is missing from the json request body | 
| 409 | deviceName given is used by another device in the system | 

##### Example:
POST http://localhost:6060/devices
```json
{
  "deviceName": "TV"
}
```


#### **PUT** /devices
##### Description: 
To update a device or multiple devices to a particular status

#####  JSON Request fields:
| Field | Description | Variable Type |Mandatory |
| ----------- | ----------- | ----------- | ----------- |
| deviceIds | Device Ids of the devices you want to turn on or off | string[] | yes
| status | Status of device, (on = true, off = false) (open = true, close = false) | boolean | yes

##### Possible Errors:
| Error Code | Description |
| ----------- | ----------- | 
| 500 | Server was unable to process the request | 
| 404 | One of the devices requested doesn't exist | 
| 400 | Request body either is missing a field or the value assigned to field is invalid  | 

##### Example:
PUT http://localhost:6060/devices
```json
{
  "deviceIds": ["1","2"],
  "status": true
}
```


#### **POST** /actions/undo
##### Description: 
To undo the previous user action made

##### Possible Errors:
| Error Code | Description |
| ----------- | ----------- | 
| 500 | Server was unable to process the request | 
| 400 | The user hasn't made any changes so far, hence there are not actions to undo | 


##### Example:
POST http://localhost:6060/actions/undo
