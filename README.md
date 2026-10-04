# 3D Chalkboard Portfolio

Vite + Three.js website 

This repo contains the 3D world which hosts the blackboard cv portfolio.
Note that the actual portfolio content is contained within a different repository.

Scene items are sourced from gltf files exported from blender,
alongside some procedurally generated items (the dust).
All lights are added programmatically, with certain making used of baked shadow maps.


## Edits

The main point of concern is setting up the navigation interface with the chalkboard content.
This is done in `src/components/consts.js`: `NAVIGATION` defines the links between named objects in
the 3D world and pages in the blackboard app. For now there are 3 chalks that can be linked up and
the eraser. Adding extra items will require modifying the blender scene and re-baking the shadows.

To allow the connection between the world and the chalkboard insides,
you must specify the correct `BOARD.url`- without this it is not possible to establish the message connection.

In `src/main.js` 

Each section has:

- `label`: name in the navigation
- `x`, `y`: where the section sits on the board
- `w`, `h`: clickable/text plane size
- `title` and `lines`: chalk writing
- `camera.position`: where the camera moves
- `camera.target`: where the camera looks
- `camera.fov`: zoom feel

## Controls

- Click the section buttons.
- Click chalk writing on the board.
- Use keyboard shortcuts: `1` through `5`.
