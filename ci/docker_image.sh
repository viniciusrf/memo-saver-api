#!/bin/bash
set -e
set -x

: ${DOCKERFILE:=devops/Dockerfile}
: ${DOCKERIMAGE?set IMAGE variable}
: ${DOCKERUSER?set USER variable}
: ${DOCKERTOKEN?set TOKEN variable}

docker build -f "${DOCKERFILE}" -t "${DOCKERIMAGE}" .
echo "${DOCKERTOKEN}" | docker login -u "${DOCKERUSER}" --password-stdin
docker push "${DOCKERIMAGE}"
docker rmi -f "${DOCKERIMAGE}" 2> /dev/null || exit 0