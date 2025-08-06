import { cache } from "react";
import cloudinary from "@/utils/cloudinary";

type CloudinaryResource = {
    public_id: string;
    asset_id: string;
    secure_url: string;
    format: string;
    display_name: string;
    asset_folder: string;
    [key: string]: any;
  };
  
  function insertIntoNestedObject(
    root: any,
    path: string,
    value: any,
    isFile = false
  ) {
    const parts = path.split("/");
    let current = root;
  
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        if (isFile) {
          if (!current.files) current.files = [];
          current.files.push(value);
        } else {
          if (!current[part]) current[part] = { __meta: value };
        }
      } else {
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    });
  }
  
  export const getCloudinaryStorage = cache(
    async (prefix = "pras/portfolio"): Promise<any> => {
      const nestedStructure: any = {};
      const rootFolderName = prefix.split("/")[0];
  
      nestedStructure[rootFolderName] = {
        __meta: {
          name: rootFolderName,
          path: rootFolderName,
          external_id: "root",
        },
      };
  
      async function getAllFolders(path = rootFolderName) {
        const { folders } = await cloudinary.api.sub_folders(path);
        for (const folder of folders) {
          insertIntoNestedObject(nestedStructure, folder.path, folder, false);
          await getAllFolders(folder.path); // recurse for nested babies
        }
      }
  
      const [resourcesResImages, resourcesResRaw, resourcesResVideo] = await Promise.all([
        cloudinary.api.resources({
          type: "upload",
          resource_type: "image",
          prefix,
          max_results: 500,
        }),
        cloudinary.api.resources({
          type: "upload",
          resource_type: "raw",
          prefix,
          max_results: 500,
        }),
        cloudinary.api.resources({
          type: "upload",
          resource_type: "video",
          prefix,
          max_results: 500,
        }),
      ]);
  
      await getAllFolders(rootFolderName);
  
      for (const resource of resourcesResImages.resources as CloudinaryResource[]) {
        insertIntoNestedObject(
          nestedStructure,
          resource.public_id,
          resource,
          true
        );
      }
  
      for (const resource of resourcesResRaw.resources as CloudinaryResource[]) {
        insertIntoNestedObject(
          nestedStructure,
          resource.public_id,
          resource,
          true
        );
      }
  
      for (const resource of resourcesResVideo.resources as CloudinaryResource[]) {
        insertIntoNestedObject(
          nestedStructure,
          resource.public_id,
          resource,
          true
        );
      }
  
      return nestedStructure;
    }
  );
  