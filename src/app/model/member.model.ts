import { ObjectId } from "mongodb";

export interface MemberModel {
    projectID: string,
    name: string,
    role: string
    email: string
    type: string
  }
  