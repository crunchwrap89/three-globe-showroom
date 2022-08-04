import type {
  BufferGeometry,
  Material,
  Texture,
  Mesh,
  Object3D,
  Scene,
} from "three";

export function wipeScene(scene: Scene) {
  for (let i = scene.children.length - 1; i >= 0; i--) {
    const obj = scene.children[i];
    if (obj.type == "Group") {
      scene.remove(obj);
    }
  }
}

export function disposeAllObjects(objects: Object3D[]) {
  objects.forEach((object) => {
    disposeObject(object);
  });
}

export function disposeObject(object: Object3D) {
  if (!object) return;
  const geometries = new Map<string, BufferGeometry>();
  const materials = new Map<string, Material>();
  const textures = new Map<string, Texture>();

  object.traverse((object) => {
    const mesh = object as Mesh;
    if (mesh.isMesh) {
      const geometry = mesh.geometry as BufferGeometry;
      if (geometry) {
        geometries.set(geometry.uuid, geometry);
      }
      const material = mesh.material as any;
      if (material) {
        materials.set(material.uuid, material);
        for (const key in material) {
          const texture = material[key];
          if (texture && texture.isTexture) {
            textures.set(texture.uuid, texture);
          }
        }
      }
    }
  });

  console.log(
    "disposeObject - %s geometries, %s materials, %s textures",
    geometries.size,
    materials.size,
    textures.size
  );

  for (const entry of textures) {
    entry[1].dispose();
  }
  for (const entry of materials) {
    entry[1].dispose();
  }
  for (const entry of geometries) {
    entry[1].dispose();
  }
}
