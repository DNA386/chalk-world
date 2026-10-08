import * as THREE from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import Camera from "./camera";
import Environment from "./environment";
import SectionNav, { SectionNavConf } from "./sectionNav";
import { BOARD, NAVIGATION } from "./consts"

type NavDetail = {
    pointTarget: {x: number; y: number};
    color: string;
    name: string;
}


export default class BlackboardContent {
    environment: Environment;
    containerEl: HTMLElement;
    iframe: HTMLIFrameElement;
    glBoard: THREE.Object3D;
    cssBoard: THREE.Object3D;
    boardSize: THREE.Vector2;
    camera: Camera;
    mouseClickInProgress: boolean;
    sectionNav: SectionNav;

    constructor(environment: Environment) {
        this.environment = environment;

        // Add a spare pixel for anti-aliasing
        this.boardSize = new THREE.Vector2(BOARD.width * BOARD.pixelRatio + 2, BOARD.height * BOARD.pixelRatio + 2);
        this.camera = this.environment.camera;
        this.mouseClickInProgress = false;

        // Section handling
        this.sectionNav = new SectionNav(this.environment);
        this.createIframe();
    }

    createIframe() {
        // Create container
        const container = document.createElement('div');
        container.style.width = this.boardSize.width + 'px';
        container.style.height = this.boardSize.height + 'px';
        container.style.opacity = '1';
        container.style.background = '#0C140B';

        // Create iframe
        this.iframe = document.createElement('iframe');

        // Bubble mouse move events to the main application, so we can affect the camera
        this.iframe.onload = () => {
            if (this.iframe.contentWindow) {
                // Receive events from inside the iframe
                window.addEventListener('message', (event) => {
                    // console.log("recieved a message", event.origin, event.origin === BOARD.url, event.data?.type)
                    if (event.origin !== BOARD.url) return;

                    if (event.data.type === 'nav-setup-request') {
                        this.configureNavigation()
                        return;
                    }

                    if (event.data.type === 'section-nav-setup') {
                        this.configureSections(event.data.sections)
                        return;
                    }

                    if (event.data.type === 'section-clicked') {
                        this.sectionNav.handleSectionClicked(event.data)
                    }

                    var evt = new CustomEvent(event.data.type, {
                        bubbles: true,
                        cancelable: false,
                    });

                    // @ts-ignore
                    evt.inBlackboard = true;
                    if (event.data.type === 'pointermove') {
                        var clRect = this.iframe.getBoundingClientRect();
                        const { top, left, width, height } = clRect;
                        const widthRatio = width / this.boardSize.width;
                        const heightRatio = height / this.boardSize.height;

                        // @ts-ignore
                        evt.clientX = Math.round(
                            event.data.clientX * widthRatio + left
                        );
                        //@ts-ignore
                        evt.clientY = Math.round(
                            event.data.clientY * heightRatio + top
                        );
                    } else if (event.data.type === 'keydown') {
                        // @ts-ignore
                        evt.key = event.data.key;
                    } else if (event.data.type === 'keyup') {
                        // @ts-ignore
                        evt.key = event.data.key;
                        this.sectionNav.resolveKeyboardNav(event.data)
                    }

                    this.iframe.dispatchEvent(evt);
                });
            }
        };

        // Set iframe attributes
        this.iframe.src = BOARD.initialUrl;
        this.iframe.style.width = this.boardSize.width + 'px';
        this.iframe.style.height = this.boardSize.height + 'px';
        this.iframe.style.padding = '0px';
        this.iframe.style.boxSizing = 'border-box';
        this.iframe.style.opacity = '1';
        this.iframe.id = 'blackboard';
        this.iframe.style.border = '0';
        this.iframe.title = 'Blackboard CV';

        // Add iframe to container
        container.appendChild(this.iframe);
        this.containerEl = container;

        // Create CSS plane
        this.cssBoard = new CSS3DObject(this.containerEl);

        // Add to CSS scene
        this.environment.cssScene.add(this.cssBoard);
    }

    alignCssPlane() {
        if (!this.glBoard) {
            // Try to locate the blackboard surface in gl scene
            this.glBoard = this.environment.scene.getObjectByName('blackboard');
        }

        // copy monitor position and rotation
        this.cssBoard.position.copy(this.glBoard.position);
        this.cssBoard.rotation.copy(this.glBoard.rotation);
    }

    messageBoard(message) {
        this.iframe.contentWindow.postMessage(
          message,
          BOARD.url
        )
    }

    configureNavigation() {
        // Figure out where the relevant entities are relative to the board
        const navDetails: NavDetail[] = Object.entries(NAVIGATION).map(([key, value], i) => {
            const item = this.environment.scene.getObjectByName(key)
            // Project the item's position onto the closest part of the blackboard
            const pointTarget = {
                x: BOARD.pixelRatio * (BOARD.width / 2 + THREE.MathUtils.clamp(item.position.x, -BOARD.width / 2, BOARD.width / 2)),
                y: BOARD.pixelRatio * (BOARD.height / 2 + THREE.MathUtils.clamp(item.position.y, -BOARD.height / 2, BOARD.height / 2)),
                // y: BOARD.pixelRatio * THREE.MathUtils.clamp(1 + item.position.x / (BOARD.height / 2), 0, 1),
            }
            return {
                pointTarget,
                name: value.desc,
                color: `#` + item.material.color.getHexString(),
            }
        })
        // console.log(JSON.stringify(navDetails))
        this.messageBoard({type: "setup-nav", navigation: navDetails})
    }

    configureSections(sections) {
        // Query what the board subsections are
        // Expect the given section positions to be in board pixels relative to the bottom left
        const sectionDetails: SectionNavConf[] = sections.map((section) => {
            const targetPos = [
                section.pointTarget.x / BOARD.pixelRatio - BOARD.width/2,
                section.pointTarget.y / BOARD.pixelRatio - BOARD.height/2,
            ]
            return {
                label: section.name,
                camera: {
                    position: [...targetPos, 10],
                    target: [...targetPos, 0],
                    fov: 30,
                },
                shortcut: `${section.index}`,
            }
        })
        this.sectionNav.initSubsections(sectionDetails)
    }
}
