import { GluegunToolbox, print } from "gluegun";
import { readFileSync } from "fs";

module.exports = async (toolbox: GluegunToolbox) => {
  toolbox.readHelpFile = async (commandName: string): Promise<void> => {
    try {
      const helpFile: string = readFileSync(`${__dirname}/../../docs/help/${commandName}.txt`, "utf8");
      print.info(helpFile);
      process.exit(0);
    } catch (error) {
      print.error(error);
      process.exit(1);
    }
  }
}
