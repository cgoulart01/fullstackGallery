import { v4 as uuidv4 } from 'uuid';

export class Image {
  _id: string;
  title: string;
  description: string;
  url: string;

  constructor(title: string, description, url: string) {
    this._id = uuidv4();
    this.title = title;
    this.description = description;
    this.url = url;
  }
}
