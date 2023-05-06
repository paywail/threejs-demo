import { ResourceType, TResource, ESourceName } from "./Types/index";
export const sources: TResource[] = [
  {
    name: ESourceName.EARTHMAP,
    type: ResourceType.TEXTURE,
    path: [
      "assets/earth.jpg"
    ]
  },
  {
    name: ESourceName.STONEMAP,
    type: ResourceType.TEXTURE,
    path: [
      "assets/stone.png"
    ]
  },
  {
    name: ESourceName.STARMAP,
    type: ResourceType.TEXTURE,
    path: [
      "assets/star_surface.jpg"
    ]
  },
  {
    name: ESourceName.FontTypeRegular,
    type: ResourceType.FONTTYPE,
    path: [
      "assets/Roboto_Regular.json",
    ]
  },
  {
    name: ESourceName.ALLSKILLSMAP,
    type: ResourceType.TEXTURE,
    path: [
      "assets/allSkills.png",
    ]
  },

]
