``` Steps to Run ```

1. ` npm install `.
2. if any dependencies not installed then install it manually.
3. after install everything then change database configuration in .env file.
4. now just type ` npm start `
5. once evething ok then you will see 'MongoDB Connected ! ' message in console.
6. app will started on port 1858.


if there is any issue then contact me
mobile : +91 8000641661
email : hmahajan.dmi@gmail.com


 ```CREATE USER```
 * METHOD : POST 
 * http://localhost:1858/signUp
 *
 // Parent schema
 {
    "userNmae": "Harish",
    "salary": 50000,
 }

 // Child Schema
 // Below record is the child of Harish's record
 {
    "userNmae": "rashmi",
    "parentId" : "here pass harish's objectId",
    "salary": 50000,
 }


```GET ALL USER```
* METHOD : GET
* http://localhost:1858/user

``` GET Group Salary (When you select first option)```
 http://localhost:1858/getGroupSalaryByParentId?parentId=5fe2ef9c4ceda927fce202f9
 

 ``` GET Percentage from parent salary (When you select second option)```
 http://localhost:1858/getGroupSalaryByParentIdPercentageWise?parentId=5fe2ef9c4ceda927fce202f9
