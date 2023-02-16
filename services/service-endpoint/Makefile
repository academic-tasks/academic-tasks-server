setup:
	(cd ..; make setup)

deps-start:
	(cd ../service-database; make start)
	(cd ../service-auth; make start)

deps-stop:
	(cd ../service-auth; make stop)
	(cd ../service-database; make stop)

up-detached:
	sudo docker-compose up -d;

start:
	make up;
	sudo docker-compose exec endpoint bash -c "npm i && npm run dev"

stop:
	sudo docker-compose stop;

shell:
	make up;
	sudo docker-compose exec -u node endpoint bash;

up:
	make setup;
	make deps-start;
	make up-detached;

down:
	make stop;
	make deps-stop;

logs:
	sudo docker-compose logs -f