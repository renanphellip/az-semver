FROM node:lts

ARG AZ_SEMVER_HOME=/opt/az-semver

RUN apt-get update && apt-get upgrade -y

WORKDIR ${AZ_SEMVER_HOME}

COPY . .

RUN npm install --verbose
RUN npm run build --verbose
RUN chmod +x ${AZ_SEMVER_HOME}/bin/az-semver
RUN ln -s ${AZ_SEMVER_HOME}/bin/az-semver /usr/local/bin/az-semver

ENTRYPOINT [ "az-semver" ]