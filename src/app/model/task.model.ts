export interface TaskModel {
  title: String;
  startDate: Date;
  endDate: Date;
  details: String;
  projectId: String;
  status: String;
  tags: string[];
  members: string[];
}
