
export const WORLD_URL  = "http://127.0.0.1:5173/"
export const BOARD = {
    width: 14.8,
    height: 8.9,
    frame: 0.42,
    depth: 0.1,
    pixelRatio: 100,
    url: 'http://localhost:3000'
};

export const NAVIGATION = {
    eraser: { desc: "Home", url: "/" },
    chalk1: { desc: "Map", url: "/mindmap" },
    chalk2: { desc: "Papers", url: "/papers" },
    chalk3: { desc: "Experience", url: "/experience" },
}


export const INITIAL_SECTION = 'overview'
export const BASE_SECTIONS = {
    debug:  {
        label: 'Debug',
        camera: {
            position: [-20.0, 0, 10],
            target: [0.0, 0, 5.0],
            fov: 40,
        },
        shortcut: "d"
    },
    debug2:  {
        label: 'Debug2',
        camera: {
            position: [10.0, 0, 20],
            target: [0.0, 0, 5.0],
            fov: 40,
        },
        shortcut: "e"
    },
    far:  {
        label: 'far',
        camera: {
            position: [10, 5, 30],
            target: [0.0, 0, 5.0],
            fov: 20,
        },
        shortcut: "f"
    },

    overview: {
        label: 'Board',
        camera: {
            position: [0.0, -0.18, 14],
            target: [0.0, -0.08, 0.0],
            fov: 40,
        },
        shortcut: " "
    },
};
