import { JsonValue } from "@prisma/client/runtime/library";
import type { Channel, UserResponse, ChannelData } from "stream-chat";

export interface ConnectedAccount {
  id: string;
  user_id: string;
  oauth_id: string;
  provider: "google" | "github";
  provider_data: JsonValue;
  created_at: Date;
}

export interface DBUser extends Record<string, any> {
  id: string;
  username: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  avatar?: string | null;
  email: string;
  role: string;
  connected_accounts: ConnectedAccount[];
  public_metadata: JsonValue;
  created_at: Date;
  updated_at: Date;
}

export interface User extends DBUser {
  update: (
    updates: Partial<{ first_name: string; last_name: string; avatar: string }>
  ) => Promise<any>;
  delete: () => Promise<null>;
  reload: () => Promise<void>;
}

export interface StreamChannel extends Channel {
  data:
    | (ChannelData & {
        created_by?:
          | (UserResponse & {
              name?: string;
              image?: string;
            })
          | null
          | undefined;
      })
    | undefined;
  metadata?: {
    inviteToken: string;
  };
}

export type ProjectType = {
  id: number;
  title: string;
  description?: string;
  image: string;
  link: {
    github?: string;
    live?: string;
  };
  slug: string;
  tools: Array<number>;
  content?: string;
  category: string;
  created_at: Date;
  updated_at: Date;
};

export type RawProjectType = {
  id: number;
  title: string;
  description?: string;
  image: string;
  github?: string;
  live?: string;
  slug: string;
  tools: Array<number>;
  content?: string;
  category: string;
  created_at: Date;
  updated_at: Date;
};

export type ExperienceType = {
  id: number;
  company: string;
  role: string;
  description?: string;
  period: string;
  start: Date;
  end?: Date;
  created_at: Date;
  updated_at: Date;
};

export type EducationType = {
  id: number;
  school: string;
  degree: string;
  field: string;
  description?: string;
  period: string;
  start: Date;
  end?: Date;
  created_at: Date;
  updated_at: Date;
};

export type BlogType = {
  id: number;
  title: string;
  slug: string;
  content: string;
  description: string;
  tags: string[];
  thumbnail?: string;
  created_at: Date;
  updated_at: Date;
};
