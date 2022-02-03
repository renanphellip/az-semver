import { GluegunToolbox } from 'gluegun';
import { iDetermineSemVer } from '../interfaces/commandsInterfaces';
import { GitPullRequest } from 'azure-devops-node-api/interfaces/GitInterfaces';

module.exports = {
  description: 'Retrieve a new semantic version of pull request description to return updated version.',
  name: 'determineSemVer',
  alias: ['dsv'],
  run: async (toolbox: GluegunToolbox) => {
    const { print, parameters, readHelpFile, azGetApi, azGetPullRequest } = toolbox;
    const { h, help, azOrgUrl, azAccessToken, projectName, pullRequestId, semVer } = parameters.options as iDetermineSemVer;

    // Help
    if (h || help) readHelpFile(toolbox.commandName);
    
    // Parâmetros
    let error = 0;
    
    if (typeof azOrgUrl !== 'string') {
      print.error('--azOrgUrl is missing.');
      error = 1;
    }
    
    if (typeof azAccessToken !== 'string') {
      print.error('--azAccessToken is missing.');
      error = 1;
    }
    
    if (typeof projectName !== 'string') {
      print.error('--projectName is missing.');
      error = 1;
    }
    
    if (typeof pullRequestId !== 'number') {
      print.error('--pullRequestId is missing.');
      error = 1;
    }
    
    if (typeof semVer !== 'string') {
      print.error('--semVer is missing.');
      error = 1;
    }

    const semVerRegex = /^([0-9]+\.){2}[0-9]+$/i;
    if (semVer && (!semVer.match(semVerRegex))) {
      print.error(`--semVer not matches with semantic version pattern.`);
      error = 1;
    }
    
    if (error == 1) {
      print.info(`Type "devopscli ${toolbox.commandName} -h" for help.`);
      process.exit(1);
    }
    
    // Funcionalidade
    try {

      print.highlight(`Determining semantic version...`);
      const azApi = await azGetApi(azOrgUrl, azAccessToken);
      const pullRequest: GitPullRequest|undefined = await azGetPullRequest(azApi, projectName, pullRequestId);
      if (pullRequest) {
        
        const majorMdRegex = /\[(x|X)\]\ Major/i;
        const minorMdRegex = /\[(x|X)\]\ Minor/i;
        const patchMdRegex = /\[(x|X)\]\ Patch/i;

        let count = 0;
        let majorUpdated = false;
        let minorUpdated = false;
        let patchUpdated = false;

        if (pullRequest.description.match(majorMdRegex)) {
          majorUpdated = true;
          count++;
        }

        if (pullRequest.description.match(minorMdRegex)) {
          minorUpdated = true;
          count++;
        }

        if (pullRequest.description.match(patchMdRegex)) {
          patchUpdated = true;
          count++;
        }
        
        if (!majorUpdated && !minorUpdated && !patchUpdated) {
          print.error(`Major, minor or patch versions was not updated, aborting...`);
          process.exit(1);
        }
        
        if (count > 1) {
          print.error(`More than one version was selected, aborting...`);
          process.exit(1);
        }

        const semVerArray = semVer.split('.', 3);
        const major = Number(semVerArray[0]);
        const minor = Number(semVerArray[1]);
        const patch = Number(semVerArray[2]);

        let newMajor: number
        let newMinor: number
        let newPatch: number

        if (majorUpdated) {
          newMajor = major + 1
          newMinor = 0
          newPatch = 0
        }
        
        if (minorUpdated) {
          newMajor = major
          newMinor = minor + 1
          newPatch = 0
        }
        
        if (patchUpdated) {
          newMajor = major
          newMinor = minor
          newPatch = patch + 1
        }
        
        print.success(`Updated SemVer: ${newMajor}.${newMinor}.${newPatch}`);

      } else {
        print.error(`Pull Request ID "${pullRequestId}" was not found.`);
        process.exit(1);
      }
      
    } catch (error) {
      print.error(error);
      process.exit(1);
    }
  }
}
