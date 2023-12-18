export interface MemberModel {
  name: string;
  role: string;
  email: string;
  projects: [
    {
      projectId: string;
      type: string;
    }
  ];
}
