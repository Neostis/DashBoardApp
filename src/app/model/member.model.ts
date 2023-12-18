export interface MemberModel {
    name: string,
    role: string
    email: string
    projects: [{
      projectID: string;
      type: string;
    }]
  }
  
