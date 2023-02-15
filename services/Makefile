setup:
	find . -maxdepth 2 -type f -name \*.example -exec sh -c "cp -n -v {} \$$(dirname {})/\$$(basename {} .example)" \;

	sudo docker network create academic-tasks-net 2>/dev/null; exit 0;
