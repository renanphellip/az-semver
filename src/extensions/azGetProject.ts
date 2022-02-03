import { GluegunToolbox, print } from 'gluegun';
import { WebApi } from 'azure-devops-node-api';
import { TeamProjectReference } from 'azure-devops-node-api/interfaces/CoreInterfaces';

module.exports = async (toolbox: GluegunToolbox) => {
  toolbox.azGetProject = async (azureApi: WebApi, projectName: string): Promise<TeamProjectReference|undefined> => {
    try {
      const azApi = azureApi;
      const coreApi = await azApi.getCoreApi();
      const projects = await coreApi.getProjects();
      const project = projects.find(project => project.name === projectName);
      return project;
    } catch(error) {
      print.error(error.message);
      process.exit(1);
    }

  }
}
