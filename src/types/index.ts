import { type User } from "@clerk/nextjs/server";
import type { Channel, UserResponse, ChannelData } from "stream-chat";

export interface MyUser extends User {
  publicMetadata: {
    chatToken?: string;
    role?: "admin" | "user";
  };
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
  category: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ExperienceType = {
  id: number;
  company: string;
  role: string;
  description?: string;
  period: string;
  start: Date;
  end?: Date;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
};

export type BlogType = {
  id: number;
  title: string;
  slug: string;
  content: string;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};
