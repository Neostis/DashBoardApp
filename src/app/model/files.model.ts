import { Double, Int32, ObjectId } from "mongodb";

export interface FilesModel {
    _id: ObjectId;
    length: Int32
    chunkSize: Int32
    uploadDate: Date
    filename: string;
    contentType: string;
    metadata:{
      title: string
      type: string
      lastModified: number
      projectId: ObjectId
    }
  }
  