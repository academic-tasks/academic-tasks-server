up:
	sudo docker compose up -d

shell:
	make up;
	sudo docker compose exec server bash

down:
	sudo docker compose stop

logs:
	sudo docker compose logs -f