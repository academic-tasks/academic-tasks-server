#!/usr/bin/env bash

##
CONFIG_NETWORK=academic-tasks-net
CONFIG_REALM=academic-tasks
##
set -x
##

IMG=$(cd image && sudo docker build . -q)

sudo rm -rf dump

sudo docker run --rm \
    -u root \
	  -v "$(pwd)/dump/data:/data:rw" \
	  -w /opt/keycloak \
	  --network "${CONFIG_NETWORK}" \
	  --env-file .env \
	  --entrypoint /opt/keycloak/bin/kc.sh \
	  -it "${IMG}" export --dir /data --users realm_file # --realm "${CONFIG_REALM}"

sudo docker image rm "${IMG}"