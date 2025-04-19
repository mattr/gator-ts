import fs from "fs";
import os from "os";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function readConfig() {
  const rawConfig = fs.readFileSync(getConfigFilePath());
  return validateConfig(rawConfig);
}

export function setUser(name: string) {
  const config = readConfig();
  config.currentUserName = name;
  writeConfig(config);
}

function getConfigFilePath() {
  return `${os.homedir()}/.gatorconfig.json`;
}

function writeConfig(cfg: Config) {
  fs.writeFileSync(
    getConfigFilePath(),
    JSON.stringify({ current_user_name: cfg.currentUserName, db_url: cfg.dbUrl }, null, 2)
  );
}

function validateConfig(rawConfig: any): Config {
  const config = JSON.parse(rawConfig);
  return { currentUserName: config.current_user_name, dbUrl: config.db_url };
}
