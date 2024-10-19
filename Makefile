postgres:
	docker run --name exchangecar-pg -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres

createdb: 	
	docker exec -it exchangecar-pg createdb --username=root --owner=root exchangecar

seed:
	npm run seed

server:
	npm run start:dev

.PHONY: posgres createdb server