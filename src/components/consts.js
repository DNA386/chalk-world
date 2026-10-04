
const WORLD_URL  = "http://127.0.0.1:5173/"
const BOARD = {
    width: 14.8,
    height: 8.9,
    frame: 0.42,
    depth: 0.1,
    pixelRatio: 100,
    url: 'http://localhost:3000'
};

const NAVIGATION = {
    eraser: { desc: "Home", url: "/" },
    chalk1: { desc: "Map", url: "/mindmap" },
    chalk2: { desc: "Papers", url: "/papers" },
    chalk3: { desc: "Experience", url: "/experience" },
}

const SECTION_TEXTURE_WIDTH = 1320;
const BODY_MARGIN_RATIO = 0.22;
const PAPER_TITLE_SIZE = 25;
const PAPER_AUTHOR_SIZE = 20;
const PAPER_ENTRY_GAP = 68;
const CHALK_FONT_STACK = '"Caveat", "Bradley Hand", "Noteworthy", "Chalkboard SE", cursive';

const PAPERS = [
    {
        title: 'Categorifications of Cluster Varieties',
        authors: 'C. Krawchuk',
        url: 'https://doi.org/10.17863/CAM.112695',
    },
    {
        title: 'A gluing operation for dimer quivers',
        authors: 'K. Baur, C. Krawchuk',
        url: 'https://arxiv.org/abs/2402.02784',
    },
    {
        title: 'Techniques for Constructing Cluster Structures on Varieties',
        authors: 'C. Krawchuk',
        url: 'https://ems.press/journals/owr/articles/14298002',
    },
    {
        title: 'Cyclic Complexity of Some Infinite Words and Generalizations',
        authors: 'C. Krawchuk, N. Rampersad',
        url: 'https://doi.org/10.5281/zenodo.10581434',
    },
    {
        title: 'Bounds on Decorated Sweep Covers in Tree Posets',
        authors: 'B. A. Wilson, C. Krawchuk',
        url: 'https://arxiv.org/abs/2604.03165',
    },
];

const SECTIONS = {
    debug:  {
        label: 'Debug',
        x: 0,
        y: 0,
        w: 7.15,
        h: 2.55,
        center: true,
        title: '',
        lines: [''],
        lineLinks: [],
        camera: {
            position: [-20.0, 0, 10],
            target: [0.0, 0, 5.0],
            fov: 40,
        },
    },
    debug2:  {
        label: 'Debug2',
        x: 0,
        y: 0,
        w: 7.15,
        h: 2.55,
        center: true,
        title: '',
        lines: [''],
        lineLinks: [],
        camera: {
            position: [10.0, 0, 20],
            target: [0.0, 0, 5.0],
            fov: 40,
        },
    },
    far:  {
        label: 'far',
        x: 0,
        y: 0,
        w: 7.15,
        h: 2.55,
        center: true,
        title: '',
        lines: [''],
        lineLinks: [],
        camera: {
            position: [10, 5, 30],
            target: [0.0, 0, 5.0],
            fov: 20,
        },
    },

    overview: {
        label: 'Board',
        x: 0,
        y: 0,
        w: 7.15,
        h: 2.55,
        center: true,
        title: 'Colin Krawchuk',
        lines: ['', 'github.com/cgkrawchuk'],
        lineLinks: [
            {
                lineIndex: 1,
                url: 'https://github.com/cgkrawchuk',
                title: 'GitHub profile',
            },
        ],
        camera: {
            position: [0.0, -0.18, 14],
            target: [0.0, -0.08, 0.0],
            fov: 40,
        },
    },

    mathResearch: {
        label: 'Math Research',
        x: -4.95,
        y: 2.35,
        w: 4.6,
        h: 2.45,
        title: 'Math Research',
        lines: [
            'I use representation theory to study combinatorial',
            'and geometric structures, including cluster algebras',
            'and symmetric groups.',
            '',
            'Topics: categorifications, cluster structures',
            'on algebraic varieties, and modular',
            'representation theory of symmetric groups.',
            '',
            'other: Convolution weights on 2-spaces',
            'combinatorics on words',
            'algorithms and complexity'],
        camera: {
            position: [-5.1, 2.42, 5.45],
            target: [-4.95, 2.35, 0.0],
            fov: 36,
        },
    },

    quantum: {
        label: 'Quantum',
        x: 4.05,
        y: 2.15,
        w: 4.85,
        h: 2.65,
        title: 'Quantum',
        lines: [
            'Interested in quantum algorithms where symmetry',
            'and geometry are not just tools, but the point.',
            '',
            'This includes optimisation (VQAs, DQI), variational',
            'trainability (barren plateaus, DLA expressivity),',
            'and QML generalisation via symmetry.',
            '',
            'Projects: Decoded Quantum Interferometry (DQI),',
            'Quantum Topological Data Analysis (QTDA),',
            'Quantum Geometric Deep Learning (QGDL)',
            'talks?',
        ],
        camera: {
            position: [4.82, 2.2, 5.3],
            target: [4.65, 2.15, 0.0],
            fov: 35,
        },
    },

    papers: {
        label: 'Papers',
        x: -4.55,
        y: -2.2,
        w: 4.9,
        h: 2.5,
        title: 'Papers',
        lines: [],
        papers: PAPERS,
        camera: {
            position: [-4.6, -2.2, 5.45],
            target: [-4.55, -2.2, 0.0],
            fov: 36,
        },
    },

    about: {
        label: 'About',
        x: 5.25,
        y: -2.75,
        w: 4.7,
        h: 2.35,
        title: 'About',
        lines: [
            'PhD: Categorifications of Cluster Varieties',
            'University of Cambridge','','Sr. research scientist: Quantinuum'

        ],
        camera: {
            position: [5.75, -2.75, 5.0],
            target: [5.75, -2.75, 0.0],
            fov: 35,
        },
    },
};

export {
    BOARD,
    WORLD_URL,
    NAVIGATION,
    SECTION_TEXTURE_WIDTH,
    BODY_MARGIN_RATIO,
    PAPER_TITLE_SIZE,
    PAPER_AUTHOR_SIZE,
    PAPER_ENTRY_GAP,
    CHALK_FONT_STACK,
    PAPERS,
    SECTIONS,
}
