export interface User {
  id: string;
  email: string;
  name: string;
  credits?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  role: string;
  content: string;
  timestamp: string;
}

export interface Version {
  id: string;
  timestamp: string;
  code: string;
}

export interface Project {
  id: string;
  name: string;
  initial_prompt: string;
  current_code: string;
  created_at: string;
  updated_at: string;
  userId: string;
  user?: User;
  is_published: boolean;
  versionId?: string;
  conversation: Message[];
  versions: Version[];
  current_version_index: string;
}
