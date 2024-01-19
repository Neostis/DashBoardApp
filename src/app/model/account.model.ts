export interface AccountModel {
  createDate: Date;
  updateDate: Date;
  name: String;
  role: String;
  email: String;
  phone: String;
  username: String;
  password: String;
  projects: Project[] | [];
}

interface Project {
  projectId: String;
  type: String;
}
