import { GluegunToolbox, print } from 'gluegun';
import { WebApi } from 'azure-devops-node-api';
import { TeamProjectReference } from 'azure-devops-node-api/interfaces/CoreInterfaces';
import { GitPullRequest } from 'azure-devops-node-api/interfaces/GitInterfaces';

module.exports = async (toolbox: GluegunToolbox) => {
  toolbox.azGetPullRequest = async (azureApi: WebApi, projectName: string, pullRequestId: number): Promise<GitPullRequest|undefined> => {
    const { azGetProject } = toolbox;

    try {
      const azApi = azureApi;
      const project: TeamProjectReference|undefined = await azGetProject(azApi, projectName);
      
      if (!project) {

        print.error(`Project "${projectName}" was not found.`);
        process.exit(1);

      } else {
        
        const gitApi = await azApi.getGitApi();
        const pullRequest = await gitApi.getPullRequestById(pullRequestId, projectName);
        return pullRequest;

      }

    } catch (error) {
      print.error(error.message);
      process.exit(1);
    }
  }
}
