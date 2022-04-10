## Clean Architecture
![YsN6twE3-4Q4OYpgxoModmx29I8zthQ3f0OR](https://user-images.githubusercontent.com/81958029/162618211-c36c00bd-5fda-4d5d-b12b-a5cb69ef9cf4.jpg)

## Database
```shell
// Auth Service Database
docker run --name auth-db -e POSTGRES_PASSWORD=root -e POSTGRES_USER=root -e POSTGRES_DB=users -d -p 5432:5432 postgres
```
