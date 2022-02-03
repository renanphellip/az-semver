import { GluegunToolbox } from "gluegun";
import { WebApi, getPersonalAccessTokenHandler } from "azure-devops-node-api";

module.exports = async (toolbox: GluegunToolbox) => {
  toolbox.azGetApi = async (azOrgUrl: string, azAccessToken: string): Promise<WebApi> => {
    return new WebApi(azOrgUrl, getPersonalAccessTokenHandler(azAccessToken), { ignoreSslError: true });
  }
}
