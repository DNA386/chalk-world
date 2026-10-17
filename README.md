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
Due to the way deployment works (via github pages), this is done via `.env` files. 
For local development, create `.env.local` which will override the global `.env` file.
The local env config should not be pushed.
```
# .env.local
VITE_WORLD_URL=http://127.0.0.1:5173/
VITE_BOARD_URL=http://localhost:3000/world
VITE_BOARD_MESSAGE_URL=http://localhost:3000
```

Viewing angles are constructed from the `BASE_SECTIONS` object. Note that viewing of the chalkboard content
sections is computed automatically and appended dynamically.
Initially, only the zoomed out main view is included. Each key should contain the following info:
- `label` name (I don't think this shows up anywhere for the user any more though)
- `camera.position`: where the camera moves
- `camera.target`: where the camera looks
- `camera.fov`: zoom feel
- `shortcut`: a single character shortcut key to navigate to this section

## Controls

- Click the navigable items.
- Click chalk writing on the board.
- Use keyboard shortcuts: as specified in `BASE_SECTIONS`, and numbers for the sections.
- If more than 8 sections are defined there will likely be a problem as the shortcut key will overflow.
