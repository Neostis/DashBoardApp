export interface TimelineModel {
  label: String;
  taskId: String;
  projectId: String;
  connections: Object[];
  dateStart: Date;
  dateEnd: Date;
  type: String;
}
