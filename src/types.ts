export interface Account {
  id: number;
  email: string;
  host: string;
  port: number;
  secure: boolean;
  folder_name: string;
}

export interface Email {
  id: string;
  uid: number;
  accountId: number;
  folderName: string;
  accountEmail: string;
  subject: string;
  from: string;
  fromName: string;
  date: string;
  seen: boolean;
  snippet: string;
}

export interface EmailDetail extends Email {
  html: string;
  text: string;
}
