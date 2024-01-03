
/*
  Hello Friend, this is our configuration file shared by the serverless.ts file.
 */

export default class Configuration {
  static resourcePrefix: string = "hello"; // Fine to keep, fine to change
  static certificateID: string = "<ACM Certificate ID>";
  static domain: string = "<Route 53 Base Domain>"; // Do not include www
}
