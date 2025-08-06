import { create } from 'zustand';

interface MediaState {
  structure: Record<string, any>;
  setStructure: (structure: Record<string, any>) => void;
  deleteResource: (publicId: string) => void;
  deleteFolder: (path: string) => void;
  addFolder: (path: string, folder: any) => void;
  addResource: (publicId: string, resource: any) => void;
  renameResource: (from: string, to: string) => void;
}

const addFolderToState = (structure: Record<string, any>, path: string, folder: any): Record<string, any> => {
  const newStructure = JSON.parse(JSON.stringify(structure));
  const pathParts = path.split('/');
  const folderName = pathParts.pop();
  let current = newStructure;

  for (const part of pathParts) {
    let found = false;
    for (const key in current) {
      if (current[key].__meta && current[key].__meta.name === part) {
        current = current[key];
        found = true;
        break;
      }
    }
    if (!found) {
      console.error("Could not find path to add folder");
       // Return original structure if path is not found
       return structure;
    }
  }

  if (folderName) {
    current[folderName] = folder;
  }

  return newStructure;
};



const renameResourceInState = (
  currentLevel: Record<string, any>,
  from: string,
  to: string
): Record<string, any> => {
  const newStructure = JSON.parse(JSON.stringify(currentLevel));

  const traverse = (node: any) => {
    if (node.__meta && node.__meta.path === from) {
      node.__meta.name = to.split('/').pop() || to;
      node.__meta.path = to;
      return;
    }

    if (node.files) {
      const fileIndex = node.files.findIndex((f: any) => f.public_id === from);
      if (fileIndex !== -1) {
        node.files[fileIndex].display_name = to;
        node.files[fileIndex].public_id = `${to}`;
        return;
      }
    }

    for (const key in node) {
      if (key !== 'files' && typeof node[key] === 'object' && node[key] !== null) {
        traverse(node[key]);
      }
    }
  };

  traverse(newStructure);
  return newStructure;
};

export const useMediaStore = create<MediaState>((set) => ({
  structure: {},
  setStructure: (structure) => set({ structure }),
  deleteResource: (publicId) =>
    set((state) => ({
      structure: deleteResourceFromState(state.structure, publicId),
    })),
  deleteFolder: (path) =>
    set((state) => ({
      structure: deleteFolderFromState(state.structure, path),
    })),
  addFolder: (path, folder) =>
    set((state) => ({
      structure: addFolderToState(state.structure, path, folder),
    })),
  addResource: (publicId, resource) =>
    set((state) => ({
      structure: addResourceToState(state.structure, publicId, resource),
    })),
  renameResource: (from, to) =>
    set((state) => ({
      structure: renameResourceInState(state.structure, from, to),
    })),
}));

const deleteResourceFromState = (currentLevel: Record<string, any>, publicId: string): Record<string, any> => {
  let hasChanged = false;
  const newLevel: Record<string, any> = {};

  for (const key in currentLevel) {
    const node = currentLevel[key];

    if (node && typeof node === 'object' && !Array.isArray(node)) {
      // It's a folder-like object, recurse
      const updatedNode = deleteResourceFromState(node, publicId);
      if (updatedNode !== node) {
        hasChanged = true;
      }
      newLevel[key] = updatedNode;
    } else {
      newLevel[key] = node;
    }
  }

  // Check and filter the 'files' array if it exists
  if (currentLevel.files && Array.isArray(currentLevel.files)) {
    const newFiles = currentLevel.files.filter((file: any) => file.public_id !== publicId);
    if (newFiles.length !== currentLevel.files.length) {
      hasChanged = true;
      newLevel.files = newFiles;
    } else {
      newLevel.files = currentLevel.files;
    }
  }

  // If nothing changed in this level, return the original object to maintain reference equality
  return hasChanged ? newLevel : currentLevel;
};

const deleteFolderFromState = (currentLevel: Record<string, any>, path: string): Record<string, any> => {
  const newStructure = { ...currentLevel };
  const pathParts = path.split('/');
  let current: any = newStructure;

  for (let i = 0; i < pathParts.length - 1; i++) {
    current = current[pathParts[i]];
  }

  delete current[pathParts[pathParts.length - 1]];

  return newStructure;
};


const addResourceToState = (currentLevel: Record<string, any>, publicId: string, resource: any): Record<string, any> => {
  const newStructure = { ...currentLevel };
  const pathParts = publicId.split('/');
  let current: any = newStructure;

  for (let i = 0; i < pathParts.length - 1; i++) {
    current = current[pathParts[i]];
  }

  if (!current.files) {
    current.files = [];
  }
  current.files.push(resource);

  return newStructure;
};